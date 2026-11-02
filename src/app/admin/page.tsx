"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  formatCurrency,
  loadDatabase,
  resetDatabase,
  saveDatabase,
  type DemoDatabase,
  type PaymentStatus,
  type ReservationStatus,
} from "@/lib/demo-store";

type Tab = "dashboard" | "reservations" | "packs" | "settings";

export default function AdminPage() {
  const [database, setDatabase] = useState<DemoDatabase | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDatabase(loadDatabase());
      setAuthorized(window.sessionStorage.getItem("clubofflimits:admin") === "ok");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function persist(next: DemoDatabase, message = "Cambios guardados") {
    saveDatabase(next);
    setDatabase(next);
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function login() {
    if (pin === "1556") {
      window.sessionStorage.setItem("clubofflimits:admin", "ok");
      setAuthorized(true);
      setPinError(false);
    } else setPinError(true);
  }

  const filtered = useMemo(() => {
    if (!database) return [];
    const normalized = query.toLowerCase();
    return database.reservations.filter((item) => `${item.customerName} ${item.code} ${item.packName}`.toLowerCase().includes(normalized));
  }, [database, query]);

  if (!database) return <main className="admin-loading">Cargando panel…</main>;

  if (!authorized) {
    return <main id="contenido" className="admin-login"><div className="admin-login-card"><span className="admin-badge">ACCESO DEMO</span><h1>ZONA<br />RESTRINGIDA.</h1><p>Ingresá el PIN de demostración para administrar turnos, packs y pagos.</p><label><span>PIN</span><input autoFocus inputMode="numeric" value={pin} onChange={(event) => setPin(event.target.value)} onKeyDown={(event) => event.key === "Enter" && login()} placeholder="••••" /></label>{pinError && <p className="form-error">PIN incorrecto. Pista: la altura de la calle.</p>}<button className="button button--primary button--wide" onClick={login}>Entrar al panel <span>↗</span></button><small>PIN demo: 1556 · Sin autenticación real</small></div></main>;
  }

  const today = new Date().toISOString().slice(0, 10);
  const activeReservations = database.reservations.filter((item) => item.status !== "cancelled");
  const collected = activeReservations.reduce((sum, item) => sum + (item.paymentStatus === "paid" ? item.total : item.paymentStatus === "deposit_paid" ? item.deposit : 0), 0);
  const balance = activeReservations.reduce((sum, item) => sum + (item.paymentStatus === "paid" ? 0 : item.balance), 0);

  function updateReservation(id: string, field: "status" | "paymentStatus", value: ReservationStatus | PaymentStatus) {
    if (!database) return;
    persist({ ...database, reservations: database.reservations.map((item) => item.id === id ? { ...item, [field]: value, ...(field === "paymentStatus" && value === "paid" ? { balance: 0 } : {}) } : item) });
  }

  function updatePack(packId: string, field: "price" | "depositPercent", value: number) {
    if (!database) return;
    persist({ ...database, packs: database.packs.map((pack) => pack.id === packId ? { ...pack, [field]: value } : pack) });
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(database, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `club-off-limits-demo-${today}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Copia exportada");
  }

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as DemoDatabase;
      if (parsed.version !== 1 || !Array.isArray(parsed.packs) || !Array.isArray(parsed.reservations)) throw new Error("invalid");
      persist(parsed, "Copia importada");
    } catch {
      setNotice("El archivo no es válido");
    }
    event.target.value = "";
  }

  return (
    <main id="contenido" className="admin-shell">
      {notice && <div className="admin-toast">✓ {notice}</div>}
      <aside className="admin-sidebar">
        <div className="admin-wordmark"><span>COL</span><strong>CONTROL<br />ROOM</strong></div>
        <nav aria-label="Panel administrativo">
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}><span>01</span>Resumen</button>
          <button className={tab === "reservations" ? "active" : ""} onClick={() => setTab("reservations")}><span>02</span>Reservas</button>
          <button className={tab === "packs" ? "active" : ""} onClick={() => setTab("packs")}><span>03</span>Packs</button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}><span>04</span>Ajustes</button>
        </nav>
        <div className="admin-side-foot"><i /> MODO LOCAL <small>v0.1 · demo</small></div>
      </aside>

      <section className="admin-content">
        <header className="admin-header"><div><small>PANEL DE CONTROL / {tab.toUpperCase()}</small><h1>{tab === "dashboard" ? "Todo bajo control." : tab === "reservations" ? "Agenda de destrucción." : tab === "packs" ? "Niveles de caos." : "Configuración local."}</h1></div><div className="admin-date"><span>{new Date().toLocaleDateString("es-AR", { weekday: "long" })}</span><strong>{new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}</strong></div></header>

        {tab === "dashboard" && <>
          <div className="metric-grid">
            <article><span>Turnos activos</span><strong>{activeReservations.length.toString().padStart(2, "0")}</strong><small>+ demo local</small></article>
            <article><span>Ingresado</span><strong>{formatCurrency(collected)}</strong><small>señas + totales</small></article>
            <article className="metric-alert"><span>Saldo pendiente</span><strong>{formatCurrency(balance)}</strong><small>para cobrar en el local</small></article>
            <article><span>Hoy</span><strong>{activeReservations.filter((item) => item.date === today).length.toString().padStart(2, "0")}</strong><small>sesiones programadas</small></article>
          </div>
          <div className="admin-grid-two">
            <section className="admin-panel"><div className="panel-title"><div><small>PRÓXIMAS SESIONES</small><h2>Agenda rápida</h2></div><button onClick={() => setTab("reservations")}>Ver todas ↗</button></div><ReservationTable reservations={database.reservations.slice(0, 4)} onStatus={updateReservation} onPayment={updateReservation} compact /></section>
            <section className="admin-panel payment-panel"><div className="panel-title"><div><small>ESTADO DE CAJA</small><h2>Señas y saldos</h2></div></div><div className="payment-visual"><div style={{ "--paid": `${Math.min(100, collected / Math.max(collected + balance, 1) * 100)}%` } as React.CSSProperties}><span>{Math.round(collected / Math.max(collected + balance, 1) * 100)}%</span></div><p><i className="paid-dot" />Cobrado <strong>{formatCurrency(collected)}</strong></p><p><i />Pendiente <strong>{formatCurrency(balance)}</strong></p></div></section>
          </div>
        </>}

        {tab === "reservations" && <section className="admin-panel reservations-panel"><div className="panel-title"><div><small>{database.reservations.length} REGISTROS</small><h2>Reservas</h2></div><label className="admin-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, código o pack" /></label></div><ReservationTable reservations={filtered} onStatus={updateReservation} onPayment={updateReservation} /></section>}

        {tab === "packs" && <section className="admin-panel"><div className="panel-title"><div><small>EDITABLE EN TIEMPO REAL</small><h2>Packs y precios</h2></div></div><div className="admin-pack-grid">{database.packs.map((pack) => <article key={pack.id}><span className={`pack-tone pack-tone--${pack.tone}`} /> <small>{pack.eyebrow}</small><h3>{pack.name}</h3><label><span>Precio</span><input type="number" value={pack.price} onChange={(event) => updatePack(pack.id, "price", Number(event.target.value))} /></label><label><span>Seña %</span><input type="number" min="0" max="100" value={pack.depositPercent} onChange={(event) => updatePack(pack.id, "depositPercent", Number(event.target.value))} /></label><ul>{pack.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>}

        {tab === "settings" && <div className="admin-grid-two settings-grid"><section className="admin-panel"><div className="panel-title"><div><small>OPERACIÓN</small><h2>Horarios</h2></div></div><div className="settings-form"><label><span>Apertura</span><input type="time" value={database.settings.openTime} onChange={(event) => persist({ ...database, settings: { ...database.settings, openTime: event.target.value } })} /></label><label><span>Cierre</span><input type="time" value={database.settings.closeTime} onChange={(event) => persist({ ...database, settings: { ...database.settings, closeTime: event.target.value } })} /></label><label><span>Duración base</span><input type="number" value={database.settings.slotMinutes} onChange={(event) => persist({ ...database, settings: { ...database.settings, slotMinutes: Number(event.target.value) } })} /></label><label><span>Buffer de limpieza</span><input type="number" value={database.settings.bufferMinutes} onChange={(event) => persist({ ...database, settings: { ...database.settings, bufferMinutes: Number(event.target.value) } })} /></label></div></section><section className="admin-panel"><div className="panel-title"><div><small>PORTABILIDAD</small><h2>Datos de la demo</h2></div></div><p className="admin-copy">Exportá la configuración y las reservas para llevar la demo a otro navegador. Ningún dato sale de esta computadora.</p><div className="data-actions"><button className="button button--dark" onClick={exportData}>Exportar JSON</button><button className="button button--outline" onClick={() => importRef.current?.click()}>Importar copia</button><input ref={importRef} hidden type="file" accept="application/json" onChange={importData} /><button className="danger-link" onClick={() => { resetDatabase(); setDatabase(loadDatabase()); setNotice("Demo restaurada"); }}>Restaurar datos iniciales</button></div></section></div>}
      </section>
    </main>
  );
}

function ReservationTable({ reservations, onStatus, onPayment, compact = false }: { reservations: DemoDatabase["reservations"]; onStatus: (id: string, field: "status", value: ReservationStatus) => void; onPayment: (id: string, field: "paymentStatus", value: PaymentStatus) => void; compact?: boolean }) {
  return <div className="table-wrap"><table className="reservation-table"><thead><tr><th>Turno</th><th>Cliente</th><th>Pack</th><th>Pago</th><th>Estado</th>{!compact && <th>Importe</th>}</tr></thead><tbody>{reservations.map((item) => <tr key={item.id}><td><strong>{item.time}</strong><small>{new Date(`${item.date}T12:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</small></td><td><strong>{item.customerName}</strong><small>{item.code}</small></td><td>{item.packName}<small>{item.people} pers.</small></td><td><select value={item.paymentStatus} onChange={(event) => onPayment(item.id, "paymentStatus", event.target.value as PaymentStatus)}><option value="unpaid">Sin seña</option><option value="deposit_paid">Seña paga</option><option value="paid">Total pago</option><option value="refunded">Reintegrado</option></select></td><td><select value={item.status} onChange={(event) => onStatus(item.id, "status", event.target.value as ReservationStatus)}><option value="pending">Pendiente</option><option value="confirmed">Confirmado</option><option value="completed">Completado</option><option value="cancelled">Cancelado</option><option value="no_show">No asistió</option></select></td>{!compact && <td><strong>{formatCurrency(item.total)}</strong><small>saldo {formatCurrency(item.balance)}</small></td>}</tr>)}{reservations.length === 0 && <tr><td colSpan={6} className="empty-cell">No hay reservas que coincidan.</td></tr>}</tbody></table></div>;
}
