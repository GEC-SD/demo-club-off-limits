import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function ExperiencePage() {
  return <main id="contenido" className="subpage editorial-page"><header className="editorial-hero"><div><p className="eyebrow"><span>ANTES DEL PRIMER GOLPE</span><i /></p><h1>CAOS,<br /><em>BAJO CONTROL.</em></h1></div><p>Una experiencia física de 45 a 75 minutos, diseñada para entrar en clima, liberar energía y romper objetos con equipamiento adecuado.</p></header><section className="editorial-steps">{[
    ["01", "Llegá con tiempo", "Te recibimos 10 minutos antes para confirmar el pack, conocer al grupo y repasar las reglas."],
    ["02", "Equipate", "Casco, antiparras, guantes y mameluco. Nada empieza hasta que todo está correctamente colocado."],
    ["03", "Subí la energía", "Gritos, dardos y boxeo preparan el cuerpo. Algunos packs suman pintura y guerra de almohadas."],
    ["04", "Rompé", "El equipo prepara los objetos de tu pack. Vos elegís la herramienta y hacés el resto."],
    ["05", "Llevate el recuerdo", "Según el pack, la sesión puede incluir fotos y un video vertical de la experiencia."],
  ].map(([number, title, text], index) => <ScrollReveal key={number} delay={index * 50}><span>{number}</span><h2>{title}</h2><p>{text}</p></ScrollReveal>)}</section><section className="rules-section"><ScrollReveal><p className="section-code">[ REGLAS DE LA CASA ]</p><h2>PARA ROMPER BIEN,<br />HAY QUE ROMPER SEGURO.</h2></ScrollReveal><div className="rules-grid"><article><strong>+10</strong><p>Edad mínima orientativa. Menores siempre con autorización y adulto responsable.</p></article><article><strong>0</strong><p>Alcohol antes de la actividad. La seguridad no se negocia.</p></article><article><strong>100%</strong><p>Uso obligatorio del equipo de protección durante la destrucción.</p></article><article><strong>1</strong><p>Instructor a cargo de explicar la dinámica y acompañar al grupo.</p></article></div></section><section className="page-cta"><p>¿LISTO PARA HACER RUIDO?</p><h2>EL MAZO<br />TE ESPERA.</h2><Link className="button button--primary" href="/reservar/">Reservar turno <span>↗</span></Link></section></main>;
}
