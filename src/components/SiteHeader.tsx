"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <BrandMark compact />
      <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="main-navigation">
        <span /> <span />
        <em>{open ? "Cerrar" : "Menú"}</em>
      </button>
      <nav id="main-navigation" className={open ? "nav-open" : ""} aria-label="Navegación principal">
        <Link href="/#experiencia" onClick={close}>La experiencia</Link>
        <Link href="/#packs" onClick={close}>Packs</Link>
        <Link href="/grupos/" onClick={close}>Grupos</Link>
        <Link href="/mi-reserva/" onClick={close}>Mi reserva</Link>
        <Link className="button button--primary button--small" href="/reservar/" onClick={close}>Reservar turno</Link>
      </nav>
    </header>
  );
}
