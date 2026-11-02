import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function GroupsPage() {
  return <main id="contenido" className="subpage groups-page"><header className="groups-hero"><p className="eyebrow"><span>GRUPOS & EMPRESAS</span><i /></p><h1>JUNTOS<br /><em>HACEN MÁS RUIDO.</em></h1><p>Cumpleaños, despedidas, after office y equipos que necesitan salir de la rutina. Diseñamos una experiencia a la medida del grupo.</p><Link className="button button--primary" href="/reservar/">Ver disponibilidad <span>↗</span></Link></header><section className="group-options">{[
    ["CUMPLEAÑOS", "Un festejo sin torta intacta ni fotos aburridas.", "Packs grupales · video · objetos especiales"],
    ["EQUIPOS", "Cambien el PowerPoint por un mazo y una impresora.", "After office · cierre de año · team building"],
    ["DESPEDIDAS", "Una última sesión de caos antes del gran día.", "Experiencia privada · música · contenido"],
  ].map(([title, text, meta], index) => <ScrollReveal key={title} delay={index * 70}><span>0{index + 1}</span><h2>{title}</h2><p>{text}</p><small>{meta}</small></ScrollReveal>)}</section><section className="custom-event"><ScrollReveal><p className="section-code">[ EXPERIENCIA A MEDIDA ]</p><h2>USTEDES TRAEN<br />EL GRUPO.</h2><p>El panel demo permite crear packs, cambiar precios, ajustar cupos y registrar señas. En la versión real, las consultas corporativas podrán tener cotización y seguimiento propios.</p><Link className="button button--light" href="/reservar/">Simular una reserva <span>↗</span></Link></ScrollReveal><div className="custom-event-mark">OFF<br />LIMITS</div></section></main>;
}
