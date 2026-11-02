"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { formatCurrency, loadDatabase, type Reservation } from "@/lib/demo-store";

export default function MyReservationPage() {
  const [code, setCode] = useState("");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search).get("codigo");
    if (!incoming) return;
    const timer = window.setTimeout(() => {
      const normalized = incoming.trim().toUpperCase();
      setCode(normalized);
      setReservation(loadDatabase().reservations.find((item) => item.code.toUpperCase() === normalized) ?? null);
      setSearched(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function find(value = code) {
    const normalized = value.trim().toUpperCase();
    setCode(normalized);
    setReservation(loadDatabase().reservations.find((item) => item.code.toUpperCase() === normalized) ?? null);
    setSearched(true);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    find();
  }

  return <main id="contenido" className="subpage lookup-page"><header><p className="eyebrow"><span>CONSULTA LOCAL</span><i /></p><h1>ENCONTRÁ<br /><em>TU TURNO.</em></h1><p>Ingresá el código de reserva. Para probar la demo podés usar <button onClick={() => find("COL-X7K2")}>COL-X7K2</button>.</p></header><form onSubmit={submit}><label><span>Código de reserva</span><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="COL-XXXX" /></label><button className="button button--primary" type="submit">Buscar reserva <span>↗</span></button></form>{searched && !reservation && <div className="lookup-empty"><strong>NO ENCONTRAMOS ESE CÓDIGO.</strong><p>Revisá que esté escrito correctamente o creá una nueva reserva demo.</p><Link href="/reservar/">Reservar turno →</Link></div>}{reservation && <article className="reservation-card"><div className="reservation-card-head"><div><small>CÓDIGO DE ACCESO</small><strong>{reservation.code}</strong></div><span className={`status-pill status-pill--${reservation.status}`}>{reservation.status === "confirmed" ? "Confirmada" : reservation.status === "pending" ? "Pendiente" : reservation.status}</span></div><div className="reservation-main"><div><span>Fecha y hora</span><strong>{new Date(`${reservation.date}T12:00:00`).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}<br />{reservation.time} hs</strong></div><div><span>Experiencia</span><strong>Pack {reservation.packName}<br />{reservation.people} personas</strong></div></div><div className="reservation-money"><div><span>Total</span><strong>{formatCurrency(reservation.total)}</strong></div><div><span>Seña</span><strong>{formatCurrency(reservation.deposit)}</strong></div><div><span>Saldo</span><strong>{formatCurrency(reservation.balance)}</strong></div></div><p>Presentate 10 minutos antes en Libertad 1556. El equipo de protección está incluido.</p></article>}</main>;
}
