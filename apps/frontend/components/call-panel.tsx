"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Call = { id: string; callerId: string; calleeId: string; status: "RINGING" | "ACTIVE"; video: boolean; caller: { id: string; name: string; email: string }; callee: { id: string; name: string; email: string } };
type Signal = { id: string; type: "offer" | "answer" | "ice" | "hangup"; payload: RTCSessionDescriptionInit | RTCIceCandidateInit };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const attempts = !init?.method || init.method === "GET" ? 2 : 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const response = await fetch(url, { ...init, headers: { "content-type": "application/json" }, cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (response.ok) return data;
    if (response.status >= 500 && attempt + 1 < attempts) {
      await new Promise(resolve => window.setTimeout(resolve, 350));
      continue;
    }
    const detail = typeof data.detail === "string" ? data.detail : "";
    throw new Error(response.status >= 500 || detail === "Internal server error" ? "Сервис звонков временно недоступен. Повторите попытку." : detail || "Ошибка звонка");
  }
  throw new Error("Сервис звонков временно недоступен. Повторите попытку.");
}

export function CallPanel({ userId, onStatus }: { userId: string; onStatus: (value: string) => void }) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [active, setActive] = useState<Call | null>(null);
  const peer = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const seenSignals = useRef(new Set<string>());
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);

  const loadCalls = useCallback(async () => {
    try { const data = await request<Call[]>("/api/platform/calls"); setCalls(data); setActive(current => current ? data.find(call => call.id === current.id) || current : null); } catch (error) { onStatus((error as Error).message); }
  }, [onStatus]);

  useEffect(() => {
    const initial = window.setTimeout(loadCalls, 0);
    const timer = window.setInterval(loadCalls, 2000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [loadCalls]);

  async function sendSignal(callId: string, type: string, payload: unknown) {
    await request(`/api/platform/calls/${callId}/signals`, { method: "POST", body: JSON.stringify({ type, payload }) });
  }

  async function openPeer(call: Call) {
    if (peer.current) return peer.current;
    const iceServers: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];
    const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;
    if (turnUrl) iceServers.push({ urls: turnUrl, username: process.env.NEXT_PUBLIC_TURN_USERNAME, credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL });
    const connection = new RTCPeerConnection({ iceServers });
    connection.onicecandidate = event => { if (event.candidate) sendSignal(call.id, "ice", event.candidate.toJSON()).catch(() => onStatus("Не удалось передать сетевой маршрут")); };
    connection.ontrack = event => { if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0]; };
    connection.onconnectionstatechange = () => { if (connection.connectionState === "failed") onStatus("Соединение не установлено. Для этой сети нужен TURN."); };
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: call.video });
    localStream.current = stream; stream.getTracks().forEach(track => connection.addTrack(track, stream));
    if (localVideo.current) localVideo.current.srcObject = stream;
    peer.current = connection;
    return connection;
  }

  async function closeCall(notify = true, call = active) {
    if (!call) return;
    if (notify) await sendSignal(call.id, "hangup", {}).catch(() => undefined);
    await request(`/api/platform/calls/${call.id}`, { method: "PATCH", body: JSON.stringify({ action: "end" }) }).catch(() => undefined);
    peer.current?.close(); peer.current = null; localStream.current?.getTracks().forEach(track => track.stop()); localStream.current = null; seenSignals.current.clear(); setActive(null); await loadCalls();
  }

  const processSignals = useCallback(async () => {
    if (!active) return;
    try {
      const signals = await request<Signal[]>(`/api/platform/calls/${active.id}/signals`);
      for (const signal of signals) {
        if (seenSignals.current.has(signal.id)) continue;
        seenSignals.current.add(signal.id);
        const connection = await openPeer(active);
        if (signal.type === "offer") { await connection.setRemoteDescription(signal.payload as RTCSessionDescriptionInit); const answer = await connection.createAnswer(); await connection.setLocalDescription(answer); await sendSignal(active.id, "answer", answer); }
        if (signal.type === "answer" && !connection.remoteDescription) await connection.setRemoteDescription(signal.payload as RTCSessionDescriptionInit);
        if (signal.type === "ice") { try { await connection.addIceCandidate(signal.payload as RTCIceCandidateInit); } catch {} }
        if (signal.type === "hangup") await closeCall(false);
      }
    } catch (error) { onStatus((error as Error).message); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const initial = window.setTimeout(processSignals, 0);
    const timer = window.setInterval(processSignals, 1000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [active, processSignals]);

  async function startCall(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    try {
      const call = await request<Call>("/api/platform/calls", { method: "POST", body: JSON.stringify({ calleeEmail: form.get("email"), video: form.get("video") === "on" }) });
      setActive(call); seenSignals.current.clear(); const connection = await openPeer(call); const offer = await connection.createOffer(); await connection.setLocalDescription(offer); await sendSignal(call.id, "offer", offer); onStatus("Вызов отправлен"); await loadCalls();
    } catch (error) { onStatus((error as Error).message); }
  }

  async function accept(call: Call) {
    try { await request(`/api/platform/calls/${call.id}`, { method: "PATCH", body: JSON.stringify({ action: "accept" }) }); setActive({ ...call, status: "ACTIVE" }); seenSignals.current.clear(); await openPeer(call); onStatus("Звонок принят"); } catch (error) { onStatus((error as Error).message); }
  }

  const incoming = calls.find(call => call.calleeId === userId && call.status === "RINGING");
  return <div className="call-panel"><form className="workspace-card" onSubmit={startCall}><h3>Новый звонок</h3><input name="email" type="email" placeholder="Email собеседника" required/><label className="check"><input name="video" type="checkbox"/> Видео</label><button className="button">Позвонить</button><small>{process.env.NEXT_PUBLIC_TURN_URL ? "TURN подключён" : "Используется STUN. Для гарантированной связи в мобильных сетях подключите TURN."}</small></form>{incoming && !active ? <article className="workspace-card incoming-call"><h3>Входящий {incoming.video ? "видеозвонок" : "звонок"}</h3><p>{incoming.caller.name}</p><button className="button" onClick={() => accept(incoming)}>Ответить</button><button onClick={() => request(`/api/platform/calls/${incoming.id}`, { method: "PATCH", body: JSON.stringify({ action: "decline" }) }).then(loadCalls)}>Отклонить</button></article> : null}{active ? <article className="workspace-card active-call"><h3>{active.callerId === userId ? active.callee.name : active.caller.name}</h3><div className="call-video"><video ref={remoteVideo} autoPlay playsInline/><video ref={localVideo} autoPlay playsInline muted/></div><button className="danger-button" onClick={() => closeCall()}>Завершить</button></article> : null}</div>;
}
