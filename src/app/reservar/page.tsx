"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createCode,
  extrasCatalog,
  formatCurrency,
  loadDatabase,
  saveDatabase,
  timeSlots,
  type DemoDatabase,
  type Reservation,
} from "@/lib/demo-store";

type FormState = {
  date: string;
  time: string;
  packId: string;
  people: number;
  extras: string[];
  customerName: string;
  phone: string;
  email: string;
  notes: string;
  accepted: boolean;
};

const initialForm: FormState = {
  date: "",
  time: "",
  packId: "oro",
  people: 2,
  extras: [],
  customerName: "",
  phone: "",
  email: "",
  notes: "",
  accepted: false,
};

export default function BookingPage() {
  const [database, setDatabase] = useState<DemoDatabase | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Reservation | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const db = loadDatabase();
      const requested = new URLSearchParams(window.location.search).get("pack");
      setDatabase(db);
      if (requested && db.packs.some((pack) => pack.id === requested)) {
        setForm((current) => ({ ...current, packId: requested }));
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedPack = database?.packs.find((pack) => pack.id === form.packId);
  const extrasTotal = extrasCatalog.filter((extra) => form.extras.includes(extra.id)).reduce((sum, extra) => sum + extra.price, 0);
  const total = (selectedPack?.price ?? 0) + extrasTotal;
  const deposit = Math.round(total * ((selectedPack?.depositPercent ?? 30) / 100));
  const minDate = new Date().toISOString().slice(0, 10);

  const occupied = useMemo(() => {
    if (!database || !form.date) return new Set<string>();
    return new Set(database.reservations.filter((item) => item.date === form.date && item.status !== "cancelled").map((item) => item.time));
  }, [database, form.date]);

  function next() {
    setError("");
    if (step === 1 && !form.packId) return setError("Elegí un pack para continuar.");
    if (step === 2 && (!form.date || !form.time)) return setError("Elegí una fecha y un horario disponible.");
    if (step === 3 && (!form.customerName.trim() || !form.phone.trim() || !form.email.trim() || !form.accepted)) {
      return setError("Completá tus datos y aceptá las condiciones de la experiencia.");
    }
    setStep((value) => Math.min(4, value + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!database || !selectedPack) return;
    const reservation: Reservation = {
      id: crypto.randomUUID(),
      code: createCode(),
      createdAt: new Date().toISOString(),
      date: form.date,
      time: form.time,
      packId: selectedPack.id,
      packName: selectedPack.name,
      people: form.people,
      extras: extrasCatalog.filter((extra) => form.extras.includes(extra.id)).map((extra) => extra.label),
      customerName: form.customerName,
      phone: form.phone,
      email: form.email,
      notes: form.notes,
      total,
      deposit,
      balance: total - deposit,
      status: "confirmed",
      paymentStatus: "deposit_paid",
    };
    saveDatabase({ ...database, reservations: [reservation, ...database.reservations] });
    setCreated(reservation);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!database || !selectedPack) return <main className="subpage loading-page"><p>Cargando zona de destrucción…</p></main>;

  if (created) {
    return (
      <main id="contenido" className="subpage confirmation-page">
        <div className="confirmation-impact" aria-hidden="true">✓</div>
        <p className="eyebrow"><span>SEÑA SIMULADA</span><i /></p>
        <h1>TURNO<br /><em>CONFIRMADO.</em></h1>
        <p className="confirmation-code">Código <strong>{created.code}</strong></p>
        <div className="ticket">
          <div><span>Fecha</span><strong>{new Date(`${created.date}T12:00:00`).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</strong></div>
          <div><span>Hora</span><strong>{created.time}</strong></div>
          <div><span>Pack</span><strong>{created.packName}</strong></div>
          <div><span>Personas</span><strong>{created.people}</strong></div>
          <div><span>Seña abonada</span><strong>{formatCurrency(created.deposit)}</strong></div>
          <div><span>Saldo al asistir</span><strong>{formatCurrency(created.balance)}</strong></div>
        </div>
        <p className="demo-banner">Esta es una reserva local de demostración. No se cobró dinero ni se envió ninguna notificación.</p>
        <div className="confirmation-actions">
          <Link className="button button--primary" href={`/mi-reserva/?codigo=${created.code}`}>Ver mi reserva <span>↗</span></Link>
          <Link className="text-link" href="/">Volver al inicio</Link>
        </div>
      </main>
    );
  }

  return (
    <main id="contenido" className="subpage booking-page">
      <header className="booking-heading">
        <div><p className="eyebrow"><span>RESERVA DEMO</span><i /></p><h1>PREPARÁ<br /><em>EL CAOS.</em></h1></div>
        <p>Elegí tu nivel, bloqueá un horario y simulá la seña. Todo queda guardado solamente en este navegador.</p>
      </header>

      <div className="booking-shell">
        <ol className="stepper" aria-label="Pasos de la reserva">
          {["Pack", "Turno", "Datos", "Seña"].map((label, index) => (
            <li key={label} className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""}>
              <span>{String(index + 1).padStart(2, "0")}</span>{label}
            </li>
          ))}
        </ol>

        <form onSubmit={submit} className="booking-form">
          {step === 1 && <section className="form-step">
            <div className="form-title"><span>01</span><div><h2>Elegí tu nivel</h2><p>Compará qué incluye cada experiencia antes de reservar.</p></div></div>
            <div className="select-pack-grid">
              {database.packs.map((pack) => (
                <label key={pack.id} className={form.packId === pack.id ? "selected" : ""}>
                  <input type="radio" name="pack" checked={form.packId === pack.id} onChange={() => setForm({ ...form, packId: pack.id, people: Math.min(form.people, pack.capacity) })} />
                  <span className="radio-mark" />
                  <small>{pack.eyebrow}</small>
                  <strong>{pack.name}</strong>
                  <b>{formatCurrency(pack.price)}</b>
                  <em>{pack.duration} min · hasta {pack.capacity} personas</em>
                  <div className="pack-includes">
                    <span>Incluye</span>
                    <ul>
                      {pack.items.map((item) => <li key={item}>
                        <svg className="pack-item-icon" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" />
                          <path d="m18 15 4-4" />
                          <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
                          <path className="pack-item-impact" d="M22 3V1m2 4 2-2m-2 5h3" />
                        </svg>
                        <span>{item}</span>
                      </li>)}
                    </ul>
                  </div>
                </label>
              ))}
            </div>
            <div className="people-control"><span>Personas</span><div><button type="button" onClick={() => setForm({ ...form, people: Math.max(1, form.people - 1) })}>−</button><strong>{form.people}</strong><button type="button" onClick={() => setForm({ ...form, people: Math.min(selectedPack.capacity, form.people + 1) })}>+</button></div></div>
            <h3 className="form-subtitle">Extras opcionales</h3>
            <div className="extras-grid">
              {extrasCatalog.map((extra) => <label key={extra.id} className={form.extras.includes(extra.id) ? "selected" : ""}>
                <input type="checkbox" checked={form.extras.includes(extra.id)} onChange={() => setForm({ ...form, extras: form.extras.includes(extra.id) ? form.extras.filter((id) => id !== extra.id) : [...form.extras, extra.id] })} />
                <span className="extra-toggle" aria-hidden="true">{form.extras.includes(extra.id) ? "✓" : "+"}</span>
                <span className="extra-copy"><b>{extra.label}</b><small>{extra.description}</small></span>
                <strong>+ {formatCurrency(extra.price)}</strong>
              </label>)}
            </div>
          </section>}

          {step === 2 && <section className="form-step">
            <div className="form-title"><span>02</span><div><h2>Elegí el momento</h2><p>Los horarios tomados quedan bloqueados en este navegador.</p></div></div>
            <label className="field"><span>Fecha</span><input type="date" min={minDate} value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value, time: "" })} /></label>
            <div className="time-grid">
              {timeSlots.map((time) => {
                const unavailable = occupied.has(time);
                return <button type="button" disabled={!form.date || unavailable} className={form.time === time ? "selected" : ""} onClick={() => setForm({ ...form, time })} key={time}><strong>{time}</strong><small>{unavailable ? "Ocupado" : "Disponible"}</small></button>;
              })}
            </div>
          </section>}

          {step === 3 && <section className="form-step">
            <div className="form-title"><span>03</span><div><h2>¿Quién viene?</h2><p>Usamos estos datos sólo para identificar la reserva demo.</p></div></div>
            <div className="field-grid">
              <label className="field"><span>Nombre y apellido</span><input value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="Ej. Alex Romero" /></label>
              <label className="field"><span>WhatsApp</span><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="351 000 0000" /></label>
              <label className="field field--wide"><span>Email</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="alex@email.com" /></label>
              <label className="field field--wide"><span>Notas para el equipo</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Cumpleaños, menores, evento especial…" /></label>
            </div>
            <label className="terms-check"><input type="checkbox" checked={form.accepted} onChange={(event) => setForm({ ...form, accepted: event.target.checked })} /><span>Acepto las reglas de seguridad. Si participan menores, asistirán con una persona adulta responsable.</span></label>
          </section>}

          {step === 4 && <section className="form-step payment-step">
            <div className="form-title"><span>04</span><div><h2>Simulá tu seña</h2><p>No se solicitarán datos bancarios ni se realizará un cobro real.</p></div></div>
            <div className="summary-list">
              <div><span>Pack {selectedPack.name}</span><strong>{formatCurrency(selectedPack.price)}</strong></div>
              {extrasCatalog.filter((extra) => form.extras.includes(extra.id)).map((extra) => <div key={extra.id}><span>{extra.label}</span><strong>{formatCurrency(extra.price)}</strong></div>)}
              <div className="summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
              <div className="summary-deposit"><span>Seña para confirmar ({selectedPack.depositPercent}%)</span><strong>{formatCurrency(deposit)}</strong></div>
              <div><span>Saldo al asistir</span><strong>{formatCurrency(total - deposit)}</strong></div>
            </div>
            <button className="button button--primary button--wide" type="submit">Simular seña y confirmar <span>↗</span></button>
          </section>}

          {error && <p className="form-error" role="alert">⚠ {error}</p>}
          {step < 4 && <div className="form-nav"><button className="text-link" type="button" disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))}>← Atrás</button><button className="button button--primary" type="button" onClick={next}>Continuar <span>↗</span></button></div>}
        </form>

        <aside className="booking-summary">
          <p>Tu destrucción</p><h3>{selectedPack.name}</h3>
          <dl><div><dt>Personas</dt><dd>{form.people}</dd></div><div><dt>Duración</dt><dd>{selectedPack.duration} min</dd></div><div><dt>Fecha</dt><dd>{form.date || "A definir"}</dd></div><div><dt>Hora</dt><dd>{form.time || "A definir"}</dd></div></dl>
          <div className="booking-total"><span>Total estimado</span><strong>{formatCurrency(total)}</strong><small>Seña: {formatCurrency(deposit)}</small></div>
          <p className="local-note">▣ Datos guardados en localStorage</p>
        </aside>
      </div>
    </main>
  );
}
