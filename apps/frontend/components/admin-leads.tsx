"use client";

import { FormEvent, useMemo, useState } from "react";

type LeadStatus = "new" | "in_progress" | "completed" | "cancelled";
type Lead = { id: string; created_at: string; name: string; email: string; phone?: string; company?: string; message: string; source?: string; status?: LeadStatus };
type EmailStatus = { configured: boolean; status: "ready" | "not_configured"; host?: string; port?: number; secure?: boolean; from?: string; to?: string };

const statusLabels: Record<LeadStatus, string> = { new: "Новая", in_progress: "В работе", completed: "Завершена", cancelled: "Отменена" };

export function AdminLeads() {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);

  const counts = useMemo(() => Object.keys(statusLabels).reduce((result, key) => ({ ...result, [key]: leads.filter((lead) => (lead.status || "new") === key).length }), {} as Record<LeadStatus, number>), [leads]);
  const filteredLeads = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" || (lead.status || "new") === statusFilter;
      const matchesQuery = !normalized || [lead.name, lead.email, lead.phone, lead.company, lead.message].some((value) => value?.toLowerCase().includes(normalized));
      return matchesStatus && matchesQuery;
    });
  }, [leads, query, statusFilter]);

  async function loadLeads(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus("Загружаем заявки…");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [leadResponse, emailResponse] = await Promise.all([
        fetch("/api/leads?limit=100", { headers, cache: "no-store" }),
        fetch("/api/leads/email/status", { headers, cache: "no-store" }),
      ]);
      if (!leadResponse.ok) { setAuthenticated(false); setStatus("Доступ запрещён. Проверьте AGILE_LEADS_READ_TOKEN."); return; }
      setLeads(await leadResponse.json());
      setEmailStatus(emailResponse.ok ? await emailResponse.json() : null);
      setAuthenticated(true);
      setStatus("");
    } catch {
      setStatus("Сервис заявок не отвечает. Проверьте локальный стек.");
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: string, nextStatus: LeadStatus) {
    const previous = leads.find((lead) => lead.id === id)?.status || "new";
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status: nextStatus } : lead));
    try {
      const response = await fetch(`/api/leads/${id}/status`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ status: nextStatus }) });
      if (!response.ok) throw new Error("status update failed");
    } catch {
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status: previous } : lead));
      setStatus("Не удалось изменить статус. Изменение откачено.");
    }
  }

  async function sendTestEmail() {
    if (!window.confirm("Отправить тестовое письмо на адрес AGILE_EMAIL_TO?")) return;
    setStatus("Проверяем SMTP и отправляем письмо…");
    try {
      const response = await fetch("/api/leads/email/test", { method: "POST", headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" } });
      const data = await response.json();
      setStatus(response.ok ? "Тестовое письмо отправлено." : data.detail || "Не удалось отправить письмо.");
    } catch {
      setStatus("Не удалось связаться с почтовым сервисом.");
    }
  }

  return (
    <div className="admin-panel">
      <form onSubmit={loadLeads} className="admin-login">
        <label><span>Токен доступа</span><input type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="current-password" required /></label>
        <button className="button" type="submit" disabled={loading}>{loading ? "Открываем…" : "Открыть админку"}</button>
      </form>
      <p className="admin-status" role="status" aria-live="polite">{status}</p>

      {authenticated ? <>
        <section className="admin-summary" aria-label="Сводка по заявкам">
          {(Object.keys(statusLabels) as LeadStatus[]).map((key) => <button type="button" key={key} className={statusFilter === key ? "active" : ""} onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}><span>{statusLabels[key]}</span><strong>{counts[key]}</strong></button>)}
        </section>
        <section className={`email-health ${emailStatus?.configured ? "ready" : "warning"}`}>
          <div><span>Корпоративная почта</span><strong>{emailStatus?.configured ? "SMTP настроен" : "Требуется app-password"}</strong><small>{emailStatus?.configured ? `${emailStatus.host}:${emailStatus.port} → ${emailStatus.to}` : "Заполните AGILE_SMTP_* в .env"}</small></div>
          <button type="button" onClick={sendTestEmail} disabled={!emailStatus?.configured}>Отправить тест</button>
        </section>
        <div className="admin-toolbar">
          <label><span className="sr-only">Поиск по заявкам</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск: имя, почта, компания…" /></label>
          <select aria-label="Фильтр по статусу" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | LeadStatus)}><option value="all">Все статусы</option>{(Object.keys(statusLabels) as LeadStatus[]).map((key) => <option key={key} value={key}>{statusLabels[key]}</option>)}</select>
        </div>
        <div className="lead-list">
          {filteredLeads.map((lead) => <article key={lead.id} data-status={lead.status || "new"}><header><div><span>{statusLabels[lead.status || "new"]}</span><strong>{lead.name}</strong></div><time dateTime={lead.created_at}>{new Date(lead.created_at).toLocaleString("ru-RU")}</time></header><p>{lead.message}</p><select aria-label={`Статус заявки ${lead.name}`} value={lead.status || "new"} onChange={(event) => changeStatus(lead.id, event.target.value as LeadStatus)}>{(Object.keys(statusLabels) as LeadStatus[]).map((key) => <option key={key} value={key}>{statusLabels[key]}</option>)}</select><footer><a href={`mailto:${lead.email}`}>{lead.email}</a>{lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : <span>Телефон не указан</span>}<span>{lead.company || lead.source || "сайт"}</span><small>№ {lead.id}</small></footer></article>)}
          {!filteredLeads.length ? <div className="admin-empty">По текущим фильтрам заявок нет.</div> : null}
        </div>
      </> : null}
    </div>
  );
}
