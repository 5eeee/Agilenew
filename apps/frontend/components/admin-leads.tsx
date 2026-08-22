"use client";

import { FormEvent, useMemo, useState } from "react";

type LeadStatus = "new" | "in_progress" | "completed" | "cancelled";
type Lead = { id: string; created_at: string; name: string; email: string; phone?: string; company?: string; message: string; source?: string; status?: LeadStatus };
type EmailStatus = { configured: boolean; status: "ready" | "not_configured"; host?: string; port?: number; secure?: boolean; from?: string; to?: string };
type OrderStatus = "NEW" | "DISCOVERY" | "PLANNING" | "DESIGN" | "DEVELOPMENT" | "QA" | "LAUNCH" | "SUPPORT" | "COMPLETED" | "CANCELLED";
type PaymentStatus = "PENDING" | "PAID" | "REFUNDED";
type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";
type ServiceOrder = {
  id: string;
  name: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total: number;
  currency: string;
  created_at: string;
  project_slug: string | null;
  public_title: string | null;
  public_summary: string | null;
  published_at: string | null;
  customer: { name: string; email: string };
  items: { id: string; title: string; price: number }[];
  stage_approvals: { stage: OrderStatus; executor_approved_at: string | null; client_approved_at: string | null }[];
  review: { rating: number; text: string; public_text: string | null; client_role: string | null; status: ReviewStatus; created_at: string } | null;
};
type OrderUpdate = {
  name?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  projectSlug?: string | null;
  publicTitle?: string | null;
  publicSummary?: string | null;
  published?: boolean;
  reviewStatus?: ReviewStatus;
  reviewPublicText?: string | null;
  reviewClientRole?: string | null;
};

const statusLabels: Record<LeadStatus, string> = { new: "Новая", in_progress: "В работе", completed: "Завершена", cancelled: "Отменена" };
const orderStatusLabels: Record<OrderStatus, string> = { NEW: "Новый", DISCOVERY: "Погружение", PLANNING: "Планирование", DESIGN: "Дизайн", DEVELOPMENT: "Разработка", QA: "Проверка", LAUNCH: "Запуск", SUPPORT: "Поддержка", COMPLETED: "Завершён", CANCELLED: "Отменён" };
const paymentStatusLabels: Record<PaymentStatus, string> = { PENDING: "Ожидается оплата", PAID: "Оплачено", REFUNDED: "Возврат" };
const reviewStatusLabels: Record<ReviewStatus, string> = { PENDING: "На модерации", APPROVED: "Одобрен", REJECTED: "На доработку" };
const publicProjects = ["revolution-print", "13auto", "dianafarm", "boostmarine", "royal-horse", "beef-flame", "profist", "prokub"] as const;

export function AdminLeads() {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);

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
      const [leadResponse, emailResponse, orderResponse] = await Promise.all([
        fetch("/api/leads?limit=100", { headers, cache: "no-store" }),
        fetch("/api/leads/email/status", { headers, cache: "no-store" }),
        fetch("/api/orders?admin=1", { headers, cache: "no-store" }),
      ]);
      if (!leadResponse.ok) { setAuthenticated(false); setStatus("Доступ запрещён. Проверьте AGILE_LEADS_READ_TOKEN."); return; }
      setLeads(await leadResponse.json());
      setEmailStatus(emailResponse.ok ? await emailResponse.json() : null);
      setOrders(orderResponse.ok ? await orderResponse.json() : []);
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

  async function updateOrder(id: string, changes: OrderUpdate) {
    setStatus("Сохраняем проект…");
    try {
      const response = await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify(changes) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.detail || "Не удалось обновить проект");
      const refreshed = await fetch("/api/orders?admin=1", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      if (refreshed.ok) setOrders(await refreshed.json());
      setStatus("Изменения проекта сохранены.");
    } catch {
      setStatus("Не удалось обновить проект. Проверьте этап, публикацию и уникальность проекта.");
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
        <section className="admin-orders">
          <header><div><span>Проекты и публикации</span><strong>{orders.length}</strong></div><p>Управляйте оплатой, этапами, публикацией кейса и отзывом клиента из одного места.</p></header>
          <div className="admin-order-grid">
            {orders.map((order) => <article key={order.id}>
              <div className="admin-order-customer"><span>{order.customer.name}</span><a href={`mailto:${order.customer.email}`}>{order.customer.email}</a><time>{new Date(order.created_at).toLocaleDateString("ru-RU")}</time></div>
              <label><span>Название проекта</span><input defaultValue={order.name} onBlur={(event) => { const name = event.currentTarget.value.trim(); if (name && name !== order.name) updateOrder(order.id, { name }); }} /></label>
              <div className="admin-order-controls"><label><span>Оплата</span><select value={order.payment_status} onChange={(event) => updateOrder(order.id, { paymentStatus: event.target.value as PaymentStatus })}>{(Object.keys(paymentStatusLabels) as PaymentStatus[]).map((key) => <option key={key} value={key}>{paymentStatusLabels[key]}</option>)}</select></label>
              <label><span>Этап</span><select value={order.status} onChange={(event) => updateOrder(order.id, { status: event.target.value as OrderStatus })}>{(Object.keys(orderStatusLabels) as OrderStatus[]).map((key) => <option key={key} value={key}>{orderStatusLabels[key]}</option>)}</select></label>
              </div>
              {order.payment_status === "PAID" && order.status !== "COMPLETED" && order.status !== "CANCELLED" ? <button className="admin-submit-stage" type="button" onClick={() => updateOrder(order.id, { status: order.status })}>Передать текущий этап клиенту <span>→</span></button> : null}
              <ol className="admin-stage-track">{(Object.keys(orderStatusLabels) as OrderStatus[]).filter((stage) => stage !== "CANCELLED").map((stage) => { const approval = order.stage_approvals.find((item) => item.stage === stage); return <li className={stage === order.status ? "active" : approval?.client_approved_at ? "done" : ""} key={stage}><i /><span>{orderStatusLabels[stage]}</span><small>{approval?.client_approved_at ? "принят" : approval?.executor_approved_at ? "ждёт клиента" : ""}</small></li>; })}</ol>
              <ul>{order.items.map((item) => <li key={item.id}><span>{item.title}</span><strong>{item.price.toLocaleString("ru-RU")} ₽</strong></li>)}</ul>
              <details className="admin-publication" open={Boolean(order.project_slug || order.review)}>
                <summary><span>Публикация в «Наших работах»</span><strong>{order.published_at ? "Опубликован" : "Черновик"}</strong></summary>
                <div>
                  <label><span>Связанный кейс</span><select value={order.project_slug ?? ""} onChange={(event) => updateOrder(order.id, { projectSlug: event.target.value || null })}><option value="">Не выбран</option>{publicProjects.map((slug) => <option key={slug} value={slug}>{slug}</option>)}</select></label>
                  <label><span>Публичное название</span><input defaultValue={order.public_title ?? ""} placeholder={order.name} onBlur={(event) => updateOrder(order.id, { publicTitle: event.currentTarget.value.trim() || null })} /></label>
                  <label><span>Описание кейса</span><textarea defaultValue={order.public_summary ?? ""} maxLength={3000} placeholder="Кратко опишите суть и бизнес-результат проекта" onBlur={(event) => updateOrder(order.id, { publicSummary: event.currentTarget.value.trim() || null })} /></label>
                  <label className="admin-publish-toggle"><input type="checkbox" checked={Boolean(order.published_at)} onChange={(event) => updateOrder(order.id, { published: event.target.checked })} /><span>Показывать кейс и одобренный отзыв на сайте</span></label>
                </div>
              </details>
              {order.review ? <details className="admin-review-moderation" open>
                <summary><span>Отзыв клиента · {order.review.rating}/5</span><strong>{reviewStatusLabels[order.review.status]}</strong></summary>
                <blockquote>{order.review.text}</blockquote>
                <label><span>Подпись клиента</span><input defaultValue={order.review.client_role ?? ""} placeholder="Должность / компания" onBlur={(event) => updateOrder(order.id, { reviewClientRole: event.currentTarget.value.trim() || null })} /></label>
                <label><span>Текст для публикации</span><textarea defaultValue={order.review.public_text ?? order.review.text} maxLength={3000} onBlur={(event) => updateOrder(order.id, { reviewPublicText: event.currentTarget.value.trim() || null })} /></label>
                <label><span>Модерация</span><select value={order.review.status} onChange={(event) => updateOrder(order.id, { reviewStatus: event.target.value as ReviewStatus })}>{(Object.keys(reviewStatusLabels) as ReviewStatus[]).map((key) => <option key={key} value={key}>{reviewStatusLabels[key]}</option>)}</select></label>
              </details> : <p className="admin-review-empty">Отзыв появится здесь после завершения проекта и отправки клиентом.</p>}
              <footer><strong>{order.total.toLocaleString("ru-RU")} ₽</strong><small>№ {order.id}</small></footer>
            </article>)}
            {!orders.length ? <p className="admin-empty">Заказов из каталога пока нет.</p> : null}
          </div>
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
