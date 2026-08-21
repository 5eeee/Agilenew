"use client";

import Link from "next/link";
import NextImage from "next/image";
import { FormEvent, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { AccountCopy } from "@/lib/account-copy";

export type AccountUser = { id: string; name: string; email: string; phone: string | null; avatarData: string | null };
export type AccountOrder = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  total: number;
  currency: string;
  status: string;
  payment_status: "PENDING" | "PAID" | "REFUNDED";
  items: { id: string; serviceId: string; title: string; price: number }[];
  stage_approvals: { stage: string; executor_approved_at: string | null; client_approved_at: string | null }[];
  review: { rating: number; text: string; created_at: string } | null;
};
export type AccountService = { id: string; title: string };

const ORDER_STAGES = ["NEW", "DISCOVERY", "PLANNING", "DESIGN", "DEVELOPMENT", "QA", "LAUNCH", "SUPPORT", "COMPLETED"] as const;

function dateLocale(locale: Locale) {
  return locale === "ru" ? "ru-RU" : locale === "pl" ? "pl-PL" : locale === "bg" ? "bg-BG" : locale === "ka" ? "ka-GE" : locale === "hy" ? "hy-AM" : "en-US";
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AB";
}

async function compressAvatar(file: File) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("UNSUPPORTED_IMAGE");
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new window.Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = source;
  });
  const size = Math.min(512, Math.max(image.naturalWidth, image.naturalHeight));
  const scale = Math.min(1, size / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("CANVAS_UNAVAILABLE");
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.84);
}

function ReviewEditor({ order, copy, onSaved }: { order: AccountOrder; copy: AccountCopy; onSaved: (review: AccountOrder["review"]) => void }) {
  const [rating, setRating] = useState(order.review?.rating ?? 5);
  const [text, setText] = useState(order.review?.text ?? "");
  const [status, setStatus] = useState(order.review ? copy.reviewSaved : copy.reviewText);
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    const response = await fetch(`/api/orders/${order.id}/review`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rating, text }),
    }).catch(() => null);
    setSending(false);
    if (!response?.ok) {
      setStatus(copy.reviewError);
      return;
    }
    const review = await response.json();
    onSaved(review);
    setStatus(copy.reviewSaved);
  }

  return <form className="account-review" onSubmit={submit}>
    <div><strong>{copy.reviewTitle}</strong><p>{status}</p></div>
    <div className="account-rating" aria-label={copy.reviewTitle}>{[1, 2, 3, 4, 5].map((value) => <button type="button" className={value <= rating ? "active" : ""} aria-pressed={value === rating} onClick={() => setRating(value)} key={value}>★</button>)}</div>
    <textarea value={text} onChange={(event) => setText(event.target.value)} minLength={10} maxLength={2000} required placeholder={copy.reviewPlaceholder} />
    <button className="account-primary-button" type="submit" disabled={sending}>{copy.sendReview}<span>↗</span></button>
  </form>;
}

function OrderCard({ order, services, locale, copy, onOrderChange }: { order: AccountOrder; services: AccountService[]; locale: Locale; copy: AccountCopy; onOrderChange: (order: AccountOrder) => void }) {
  const [status, setStatus] = useState("");
  const [approving, setApproving] = useState(false);
  const activeIndex = ORDER_STAGES.indexOf((order.status === "CANCELLED" ? "NEW" : order.status) as typeof ORDER_STAGES[number]);
  const approvals = new Map(order.stage_approvals.map((approval) => [approval.stage, approval]));
  const currentApproval = approvals.get(order.status);
  const paid = order.payment_status === "PAID";
  const completed = order.status === "COMPLETED";
  const cancelled = order.status === "CANCELLED";
  const money = new Intl.NumberFormat(dateLocale(locale), { style: "currency", currency: order.currency, maximumFractionDigits: 0 }).format(order.total);
  const serviceTitles = new Map(services.map((service) => [service.id, service.title]));
  const localizedItems = order.items.map((item) => ({ ...item, title: serviceTitles.get(item.serviceId) || item.title }));
  const displayName = locale === "ru" ? order.name : localizedItems.length === 1 ? localizedItems[0].title : `${localizedItems[0]?.title || order.name} + ${localizedItems.length - 1}`;

  async function approve() {
    setApproving(true);
    setStatus("");
    const response = await fetch(`/api/orders/${order.id}/approve`, { method: "POST" }).catch(() => null);
    setApproving(false);
    if (!response?.ok) {
      setStatus(copy.approvalError);
      return;
    }
    const result = await response.json();
    onOrderChange({
      ...order,
      stage_approvals: order.stage_approvals.map((approval) => approval.stage === result.stage ? { ...approval, client_approved_at: result.client_approved_at } : approval),
    });
  }

  const stateLabel = paid ? copy.stages[order.status as keyof typeof copy.stages] || copy.stages.NEW : order.payment_status === "REFUNDED" ? copy.paymentRefunded : copy.paymentPending;
  return <article className={`client-order-card ${cancelled ? "is-cancelled" : ""}`}>
    <header><div><span>{stateLabel}</span><time>{new Date(order.created_at).toLocaleDateString(dateLocale(locale))}</time></div><strong>{money}</strong></header>
    <h3>{displayName}</h3>
    <div className="client-order-scope"><span>{copy.scope}</span><div>{localizedItems.map((item) => <i key={item.id}>{item.title}</i>)}</div></div>
    {paid && !cancelled ? <ol className="client-order-progress">{ORDER_STAGES.map((stage, index) => {
      const approval = approvals.get(stage);
      return <li className={index < activeIndex ? "done" : index === activeIndex ? "active" : ""} data-client-approved={Boolean(approval?.client_approved_at)} key={stage}><i /><span>{copy.stages[stage]}</span></li>;
    })}</ol> : <div className="client-payment-note">{stateLabel}</div>}
    {paid && !completed && !cancelled ? <div className="client-approval-panel">
      <div><span className={currentApproval?.executor_approved_at ? "confirmed" : ""}>{currentApproval?.executor_approved_at ? "✓" : "○"} {currentApproval?.executor_approved_at ? copy.teamConfirmed : copy.waitingTeam}</span><span className={currentApproval?.client_approved_at ? "confirmed" : ""}>{currentApproval?.client_approved_at ? "✓" : "○"} {currentApproval?.client_approved_at ? copy.clientConfirmed : copy.approveStage}</span></div>
      <button type="button" disabled={!currentApproval?.executor_approved_at || Boolean(currentApproval?.client_approved_at) || approving} onClick={approve}>{currentApproval?.client_approved_at ? copy.approvedStage : copy.approveStage}<span>→</span></button>
      {status ? <p role="status">{status}</p> : null}
    </div> : null}
    {completed ? <ReviewEditor order={order} copy={copy} onSaved={(review) => onOrderChange({ ...order, review })} /> : null}
    <small>{copy.orderNumber} № {order.id}</small>
  </article>;
}

export function AccountDashboard({ user, orders, services, draftIds, locale, copy, onUserChange, onOrdersChange, onDraftsChange, onLogout, onRequestRecovery }: {
  user: AccountUser;
  orders: AccountOrder[];
  services: AccountService[];
  draftIds: string[];
  locale: Locale;
  copy: AccountCopy;
  onUserChange: (user: AccountUser) => void;
  onOrdersChange: (orders: AccountOrder[]) => void;
  onDraftsChange: (ids: string[]) => void;
  onLogout: () => void;
  onRequestRecovery: () => Promise<void>;
}) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [avatarData, setAvatarData] = useState(user.avatarData);
  const [profileStatus, setProfileStatus] = useState("");
  const [securityStatus, setSecurityStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const activeOrders = useMemo(() => orders.filter((order) => order.status !== "COMPLETED" && order.status !== "CANCELLED"), [orders]);
  const completedOrders = useMemo(() => orders.filter((order) => order.status === "COMPLETED"), [orders]);
  const awaitingApproval = useMemo(() => activeOrders.filter((order) => {
    const approval = order.stage_approvals.find((item) => item.stage === order.status);
    return Boolean(approval?.executor_approved_at && !approval.client_approved_at);
  }).length, [activeOrders]);
  const drafts = services.filter((service) => draftIds.includes(service.id));

  function replaceOrder(next: AccountOrder) {
    onOrdersChange(orders.map((order) => order.id === next.id ? next : order));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setProfileStatus("");
    const response = await fetch("/api/auth/profile", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, phone: phone || null, avatarData }) }).catch(() => null);
    setSaving(false);
    if (!response?.ok) { setProfileStatus(copy.profileError); return; }
    const next = await response.json();
    onUserChange(next);
    setProfileStatus(copy.profileSaved);
  }

  async function selectAvatar(file?: File) {
    if (!file) return;
    try { setAvatarData(await compressAvatar(file)); setProfileStatus(""); } catch { setProfileStatus(copy.profileError); }
  }

  function removeDraft(id: string) {
    const next = draftIds.filter((item) => item !== id);
    window.localStorage.setItem("agile-service-cart-v1", JSON.stringify(next));
    window.dispatchEvent(new Event("agile-cart-change"));
    onDraftsChange(next);
  }

  async function requestRecovery() {
    await onRequestRecovery();
    setSecurityStatus(copy.recoveryQueued);
  }

  return <section className="account-dashboard client-account-dashboard">
    <header className="client-account-hero"><div className="client-account-person"><div className="client-avatar">{avatarData ? <NextImage src={avatarData} width={84} height={84} unoptimized alt="" /> : <span>{initials(user.name)}</span>}</div><div><span>{copy.clientSpace}</span><h1>{user.name}</h1><a href={`mailto:${user.email}`}>{user.email}</a></div></div><div className="client-account-actions"><Link href={`/${locale}/cart`}>{copy.cart}<span>↗</span></Link><button type="button" onClick={onLogout}>{copy.logout}</button></div></header>
    <section className="client-account-summary" aria-label={copy.overview}><article><span>01</span><strong>{activeOrders.length}</strong><p>{copy.active}</p></article><article><span>02</span><strong>{awaitingApproval}</strong><p>{copy.approval}</p></article><article><span>03</span><strong>{completedOrders.length}</strong><p>{copy.completed}</p></article><article><span>04</span><strong>{drafts.length}</strong><p>{copy.savedCount}</p></article></section>
    <div className="client-account-layout"><main className="client-projects"><section><header className="client-section-head"><span>01</span><h2>{copy.activeProjects}</h2></header>{activeOrders.length ? <div className="client-orders-list">{activeOrders.map((order) => <OrderCard key={order.id} order={order} services={services} locale={locale} copy={copy} onOrderChange={replaceOrder} />)}</div> : <div className="client-empty-projects"><strong>{copy.emptyTitle}</strong><p>{copy.emptyText}</p><Link href={`/${locale}/services`}>{copy.choose}<span>↗</span></Link></div>}</section><section><header className="client-section-head"><span>02</span><h2>{copy.completedProjects}</h2></header>{completedOrders.length ? <div className="client-orders-list">{completedOrders.map((order) => <OrderCard key={order.id} order={order} services={services} locale={locale} copy={copy} onOrderChange={replaceOrder} />)}</div> : <p className="client-no-completed">{copy.noCompleted}</p>}</section></main>
      <aside className="client-account-sidebar"><form className="client-profile-card" onSubmit={saveProfile}><header><span>01</span><div><h2>{copy.profile}</h2><p>{copy.profileText}</p></div></header><div className="client-profile-photo"><div className="client-avatar large">{avatarData ? <NextImage src={avatarData} width={84} height={84} unoptimized alt="" /> : <span>{initials(user.name)}</span>}</div><label><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => selectAvatar(event.target.files?.[0])} /><strong>{copy.changePhoto}</strong><small>{copy.photoHint}</small></label></div><label><span>{copy.name}</span><input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={120} required /></label><label><span>{copy.email}</span><input value={user.email} readOnly /></label><label><span>{copy.phone}</span><input value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" maxLength={40} /></label><button className="account-primary-button" type="submit" disabled={saving}>{copy.saveProfile}<span>↗</span></button><p role="status">{profileStatus}</p></form>
        <section className="client-drafts-card"><header><span>02</span><div><h2>{copy.drafts}</h2><p>{copy.draftsText}</p></div></header>{drafts.length ? <ul>{drafts.map((service) => <li key={service.id}><Link href={`/${locale}/services/${service.id}`}>{service.title}</Link><button type="button" onClick={() => removeDraft(service.id)}>{copy.remove}</button></li>)}</ul> : <strong className="client-empty-label">{copy.noDrafts}</strong>}<Link className="account-secondary-button" href={`/${locale}/cart`}>{copy.openCart}<span>↗</span></Link></section>
        <section className="client-promo-card"><span>03</span><h2>{copy.promos}</h2><strong>{copy.promosEmpty}</strong><p>{copy.promosText}</p></section>
        <section className="client-security-card"><span>04</span><h2>{copy.security}</h2><p>{copy.securityText}</p><button className="account-secondary-button" type="button" onClick={requestRecovery}>{copy.sendRecovery}<span>↗</span></button><small role="status">{securityStatus}</small></section>
      </aside></div>
  </section>;
}
