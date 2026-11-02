import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <BrandMark />
        <p>Libertad 1556 · General Paz<br />Córdoba Capital</p>
        <p>Lunes a lunes<br />16:00 — 22:00</p>
        <div className="footer-links">
          <a href="https://www.instagram.com/clubofflimits/" target="_blank" rel="noreferrer">Instagram ↗</a>
          <Link href="/admin/">Panel demo ↗</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>DEMO LOCAL · DATOS FICTICIOS</span>
        <span>ROMPER ES PARTE DEL PLAN</span>
      </div>
    </footer>
  );
}
