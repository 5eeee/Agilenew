"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { chatSalt, decryptText, encryptText, randomBase64 } from "@/lib/client-crypto";
import { CallPanel } from "@/components/call-panel";

type Tab = "vault" | "companies" | "chats" | "calls";
type Company = { id: string; name: string; type: string; members: { role: string; user: { id: string; name: string; email: string } }[] };
type VaultItem = { id: string; kind: string; titleCiphertext: string; titleIv: string; payloadCiphertext: string; payloadIv: string };
type VaultProject = { id: string; companyId?: string | null; nameCiphertext: string; nameIv: string; kdfSalt: string; items: VaultItem[] };
type Channel = { id: string; name: string; type: string; participants: { user: { id: string; name: string; email: string } }[] };
type Message = { id: string; ciphertext: string; iv: string; createdAt: string; sender: { id: string; name: string } };

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const attempts = !init?.method || init.method === "GET" ? 2 : 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const response = await fetch(url, { ...init, headers: { "content-type": "application/json", ...init?.headers }, cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (response.ok) return data;
    if (response.status >= 500 && attempt + 1 < attempts) {
      await new Promise(resolve => window.setTimeout(resolve, 350));
      continue;
    }
    const detail = typeof data.detail === "string" ? data.detail : "";
    throw new Error(response.status >= 500 || detail === "Internal server error" ? "Сервис временно недоступен. Повторите через несколько секунд." : detail || "Не удалось выполнить запрос");
  }
  throw new Error("Сервис временно недоступен. Повторите через несколько секунд.");
}

export function ProductWorkspace({ userId }: { userId: string }) {
  const [tab, setTab] = useState<Tab>("vault");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<VaultProject[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [masterPhrase, setMasterPhrase] = useState("");
  const [chatPhrase, setChatPhrase] = useState("");
  const [status, setStatus] = useState("");

  const reload = useCallback(async () => {
    const [companyData, projectData, channelData] = await Promise.all([
      jsonFetch<Company[]>("/api/platform/companies"),
      jsonFetch<VaultProject[]>("/api/platform/vault/projects"),
      jsonFetch<Channel[]>("/api/platform/chats"),
    ]);
    setCompanies(companyData); setProjects(projectData); setChannels(channelData);
    setSelectedChannel(current => current || channelData[0]?.id || "");
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => reload().catch(error => setStatus(error.message)), 0);
    return () => window.clearTimeout(initial);
  }, [reload]);

  const loadMessages = useCallback(async () => {
    if (!selectedChannel) return;
    try { setMessages((await jsonFetch<Message[]>(`/api/platform/chats/${selectedChannel}/messages`)).reverse()); } catch (error) { setStatus((error as Error).message); }
  }, [selectedChannel]);
  useEffect(() => {
    const initial = window.setTimeout(loadMessages, 0);
    const timer = window.setInterval(loadMessages, 3000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [loadMessages]);

  async function createCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    try { await jsonFetch("/api/platform/companies", { method: "POST", body: JSON.stringify({ name: form.get("name"), type: form.get("type") }) }); event.currentTarget.reset(); await reload(); setStatus("Компания и общий чат созданы"); } catch (error) { setStatus((error as Error).message); }
  }

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const companyId = String(form.get("companyId"));
    try { await jsonFetch(`/api/platform/companies/${companyId}/members`, { method: "POST", body: JSON.stringify({ email: form.get("email"), role: form.get("role") }) }); event.currentTarget.reset(); await reload(); setStatus("Сотрудник добавлен"); } catch (error) { setStatus((error as Error).message); }
  }

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (masterPhrase.length < 12) return setStatus("Мастер‑фраза должна быть не короче 12 символов");
    const form = new FormData(event.currentTarget); const salt = randomBase64(); const name = await encryptText(String(form.get("name")), masterPhrase, salt);
    try { await jsonFetch("/api/platform/vault/projects", { method: "POST", body: JSON.stringify({ nameCiphertext: name.ciphertext, nameIv: name.iv, kdfSalt: salt, companyId: form.get("companyId") || null }) }); event.currentTarget.reset(); await reload(); setStatus("Зашифрованный проект создан"); } catch (error) { setStatus((error as Error).message); }
  }

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!masterPhrase) return setStatus("Сначала введите мастер‑фразу");
    const form = new FormData(event.currentTarget); const project = projects.find(item => item.id === form.get("projectId")); if (!project) return;
    const title = await encryptText(String(form.get("title")), masterPhrase, project.kdfSalt);
    const payload = await encryptText(JSON.stringify({ login: form.get("login"), password: form.get("password"), url: form.get("url"), notes: form.get("notes") }), masterPhrase, project.kdfSalt);
    try { await jsonFetch(`/api/platform/vault/projects/${project.id}/items`, { method: "POST", body: JSON.stringify({ kind: form.get("kind"), titleCiphertext: title.ciphertext, titleIv: title.iv, payloadCiphertext: payload.ciphertext, payloadIv: payload.iv }) }); event.currentTarget.reset(); await reload(); setStatus("Доступ зашифрован и сохранён"); } catch (error) { setStatus((error as Error).message); }
  }

  async function createChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    try { await jsonFetch("/api/platform/chats", { method: "POST", body: JSON.stringify({ name: form.get("name"), participantEmails: String(form.get("emails")).split(",").map(value => value.trim()).filter(Boolean) }) }); event.currentTarget.reset(); await reload(); setStatus("Чат создан"); } catch (error) { setStatus((error as Error).message); }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selectedChannel || chatPhrase.length < 12) return setStatus("Выберите чат и введите общую кодовую фразу (12+ символов)");
    const form = new FormData(event.currentTarget); const encrypted = await encryptText(String(form.get("message")), chatPhrase, await chatSalt(selectedChannel));
    try { await jsonFetch(`/api/platform/chats/${selectedChannel}/messages`, { method: "POST", body: JSON.stringify({ ...encrypted, version: 1 }) }); event.currentTarget.reset(); await loadMessages(); } catch (error) { setStatus((error as Error).message); }
  }

  return <section className="product-workspace">
    <nav className="workspace-tabs" aria-label="Разделы продукта">
      {([['vault','Доступы'],['companies','Компания'],['chats','Чаты'],['calls','Звонки']] as [Tab,string][]).map(([id, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>)}
    </nav>
    <p className="workspace-status" role="status">{status}</p>
    {tab === "vault" && <VaultView projects={projects} companies={companies} masterPhrase={masterPhrase} setMasterPhrase={setMasterPhrase} createProject={createProject} createItem={createItem} setStatus={setStatus} />}
    {tab === "companies" && <CompaniesView companies={companies} createCompany={createCompany} addMember={addMember} />}
    {tab === "chats" && <ChatsView userId={userId} channels={channels} selected={selectedChannel} setSelected={setSelectedChannel} messages={messages} chatPhrase={chatPhrase} setChatPhrase={setChatPhrase} createChat={createChat} sendMessage={sendMessage} />}
    {tab === "calls" && <CallPanel userId={userId} onStatus={setStatus} />}
  </section>;
}

function CompaniesView({ companies, createCompany, addMember }: { companies: Company[]; createCompany: (event: FormEvent<HTMLFormElement>) => void; addMember: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="workspace-grid"><form className="workspace-card" onSubmit={createCompany}><h3>Создать компанию</h3><input name="name" placeholder="Название" required minLength={2}/><select name="type"><option value="LLC">ООО</option><option value="JSC">АО</option><option value="SOLE_PROPRIETOR">ИП</option><option value="SELF_EMPLOYED">Самозанятый</option><option value="STARTUP">Стартап</option><option value="INDIVIDUAL">Частное лицо</option></select><button className="button">Создать</button></form><form className="workspace-card" onSubmit={addMember}><h3>Добавить сотрудника</h3><select name="companyId" required>{companies.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}</select><input name="email" type="email" placeholder="Email сотрудника" required/><select name="role"><option value="EMPLOYEE">Сотрудник</option><option value="ADMIN">Администратор</option></select><button className="button">Добавить</button></form>{companies.map(company => <article className="workspace-card" key={company.id}><h3>{company.name}</h3><small>{company.type}</small><ul>{company.members.map(member => <li key={member.user.id}>{member.user.name} · {member.role}</li>)}</ul></article>)}</div>;
}

function VaultView({ projects, companies, masterPhrase, setMasterPhrase, createProject, createItem, setStatus }: { projects: VaultProject[]; companies: Company[]; masterPhrase: string; setMasterPhrase: (value: string) => void; createProject: (event: FormEvent<HTMLFormElement>) => void; createItem: (event: FormEvent<HTMLFormElement>) => void; setStatus: (value: string) => void }) {
  return <><div className="vault-unlock"><label><span>Мастер‑фраза (не отправляется на сервер)</span><input type="password" value={masterPhrase} onChange={event => setMasterPhrase(event.target.value)} autoComplete="off" placeholder="Минимум 12 символов"/></label></div><div className="workspace-grid"><form className="workspace-card" onSubmit={createProject}><h3>Новый проект доступов</h3><input name="name" placeholder="Например: Интернет-магазин" required/><select name="companyId"><option value="">Личный проект</option>{companies.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}</select><button className="button">Создать зашифрованно</button></form><form className="workspace-card" onSubmit={createItem}><h3>Добавить доступ</h3><select name="projectId" required>{projects.map(project => <option key={project.id} value={project.id}>{project.id.slice(0,8)}</option>)}</select><select name="kind"><option value="WEBSITE">Сайт</option><option value="EMAIL">Почта</option><option value="API">API</option><option value="SERVER">Сервер</option><option value="DATABASE">База данных</option><option value="OTHER">Другое</option></select><input name="title" placeholder="Название" required/><input name="login" placeholder="Логин"/><input name="password" type="password" placeholder="Пароль / токен" autoComplete="new-password"/><input name="url" placeholder="URL / хост"/><textarea name="notes" placeholder="Примечание"/><button className="button">Зашифровать и сохранить</button></form>{projects.map(project => <VaultProjectCard key={project.id} project={project} passphrase={masterPhrase} setStatus={setStatus}/>)}</div></>;
}

function VaultProjectCard({ project, passphrase, setStatus }: { project: VaultProject; passphrase: string; setStatus: (value: string) => void }) {
  const [name, setName] = useState("Зашифрованный проект"); const [items, setItems] = useState<{ id: string; kind: string; title: string; data: Record<string,string> }[]>([]);
  useEffect(() => {
    let cancelled = false;
    const decrypt = async () => {
      if (!passphrase) {
        if (!cancelled) { setName("Зашифрованный проект"); setItems([]); }
        return;
      }
      try {
        const [projectName, decrypted] = await Promise.all([
          decryptText(project.nameCiphertext, project.nameIv, passphrase, project.kdfSalt),
          Promise.all(project.items.map(async item => ({
            id: item.id,
            kind: item.kind,
            title: await decryptText(item.titleCiphertext, item.titleIv, passphrase, project.kdfSalt),
            data: JSON.parse(await decryptText(item.payloadCiphertext, item.payloadIv, passphrase, project.kdfSalt)),
          }))),
        ]);
        if (!cancelled) { setName(projectName); setItems(decrypted); }
      } catch {
        if (!cancelled) { setName("Не удалось расшифровать"); setItems([]); }
      }
    };
    const initial = window.setTimeout(decrypt, 0);
    return () => { cancelled = true; window.clearTimeout(initial); };
  }, [passphrase, project]);
  async function copy(value: string) { await navigator.clipboard.writeText(value); setStatus("Скопировано. Буфер будет очищен через 30 секунд"); setTimeout(async () => { try { if ((await navigator.clipboard.readText()) === value) await navigator.clipboard.writeText(""); } catch {} }, 30000); }
  return <article className="workspace-card vault-project"><h3>{name}</h3>{items.length ? items.map(item => <div className="vault-item" key={item.id}><strong>{item.title}</strong><small>{item.kind}</small>{Object.entries(item.data).filter(([,value]) => value).map(([key,value]) => <div key={key}><span>{key}</span><code>{key === "password" ? "••••••••" : value}</code><button type="button" onClick={() => copy(value)}>Копировать</button></div>)}</div>) : <p>Нет расшифрованных записей</p>}</article>;
}

function ChatsView({ userId, channels, selected, setSelected, messages, chatPhrase, setChatPhrase, createChat, sendMessage }: { userId: string; channels: Channel[]; selected: string; setSelected: (value: string) => void; messages: Message[]; chatPhrase: string; setChatPhrase: (value: string) => void; createChat: (event: FormEvent<HTMLFormElement>) => void; sendMessage: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="chat-layout"><aside className="workspace-card"><form onSubmit={createChat}><h3>Новый чат</h3><input name="name" placeholder="Название" required/><input name="emails" placeholder="email1, email2" required/><button className="button">Создать</button></form>{channels.map(channel => <button className={selected === channel.id ? "chat-selected" : ""} key={channel.id} onClick={() => setSelected(channel.id)}>{channel.name}<small>{channel.type}</small></button>)}</aside><section className="workspace-card chat-main"><label><span>Общая кодовая фраза чата</span><input type="password" value={chatPhrase} onChange={event => setChatPhrase(event.target.value)} autoComplete="off"/></label><div className="message-list">{messages.map(message => <DecryptedMessage key={message.id} message={message} channelId={selected} phrase={chatPhrase} own={message.sender.id === userId}/>)}</div><form onSubmit={sendMessage} className="message-form"><input name="message" placeholder="Сообщение" required/><button className="button">Отправить</button></form><small>Сообщения шифруются в браузере. Передайте кодовую фразу участникам безопасным каналом.</small></section></div>;
}

function DecryptedMessage({ message, channelId, phrase, own }: { message: Message; channelId: string; phrase: string; own: boolean }) {
  const [text, setText] = useState("Сообщение недоступно на этом устройстве");
  useEffect(() => { if (!phrase) return; chatSalt(channelId).then(salt => decryptText(message.ciphertext, message.iv, phrase, salt)).then(setText).catch(() => setText("Сообщение недоступно на этом устройстве")); }, [message, channelId, phrase]);
  return <article className={own ? "message own" : "message"}><strong>{message.sender.name}</strong><p>{text}</p><time>{new Date(message.createdAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</time></article>;
}
