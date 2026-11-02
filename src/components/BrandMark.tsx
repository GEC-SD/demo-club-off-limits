import Image from "next/image";
import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} href="/" aria-label="Club Off Limits, inicio">
      <Image src="/club-off-limits-logo.jpg" width={74} height={74} alt="Logo de Club Off Limits" priority />
      <span>
        <strong>CLUB OFF LIMITS</strong>
        {!compact && <small>Sin reglas. Sólo destrucción.</small>}
      </span>
    </Link>
  );
}
