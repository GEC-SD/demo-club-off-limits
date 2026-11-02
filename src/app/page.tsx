import Image from "next/image";
import Link from "next/link";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollReveal } from "@/components/ScrollReveal";
import { formatCurrency, seedDatabase } from "@/lib/demo-store";

const circuit = [
  { number: "01", title: "Gritá", text: "Una sala preparada para sacar lo que venís guardando." },
  { number: "02", title: "Entrá en calor", text: "Dardos y box para subir pulsaciones antes del primer golpe." },
  { number: "03", title: "Dejá tu marca", text: "Pintura, aerosol y una pared que no pide permiso." },
  { number: "04", title: "Rompé todo", text: "Vidrio, electrónica y el mazo en tus manos. Siempre con protección." },
];

export default function Home() {
  return (
    <main id="contenido">
      <ScrollProgress />
      <section className="hero">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span>RAGE ROOM · CÓRDOBA</span><i /></p>
          <h1>
            <span>VENÍ A</span>
            <strong>ROMPER</strong>
            <span className="outline-word">TODO.</span>
          </h1>
          <p className="hero-lede">Un lugar donde las reglas se rompen y la adrenalina manda. ¿Te animás a cruzar la línea?</p>
          <div className="hero-actions">
            <Link className="button button--primary" href="/reservar/">Elegir mi turno <span>↗</span></Link>
            <a className="text-link" href="#experiencia">Ver cómo funciona ↓</a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Ilustración de la experiencia Club Off Limits">
          <div className="impact-ring impact-ring--one" />
          <div className="impact-ring impact-ring--two" />
          <div className="logo-stage">
            <Image src="/club-off-limits-logo.jpg" width={960} height={960} alt="Club Off Limits, sin reglas sólo destrucción" priority />
          </div>
          <div className="sticker sticker--top">SEGURIDAD<br />SIN LÍMITES</div>
          <div className="sticker sticker--bottom">LIBERTAD 1556</div>
          <div className="shard shard--one" /><div className="shard shard--two" /><div className="shard shard--three" />
        </div>
        <div className="hero-index"><b>01</b><span>/</span><small>ENTRÁ<br />ROMPÉ<br />SOLTÁ</small></div>
      </section>

      <div className="hazard-marquee" aria-label="Sin reglas, sólo destrucción">
        <div>ROMPÉ TODO · CERO CULPA · ADRENALINA · SIN REGLAS · ROMPÉ TODO · CERO CULPA · ADRENALINA · SIN REGLAS ·</div>
      </div>

      <section className="manifesto section-pad">
        <ScrollReveal className="manifesto-grid">
          <p className="section-code">[ MANIFIESTO / 001 ]</p>
          <h2>NO VENÍS A MIRAR.<br /><em>VENÍS A HACER RUIDO.</em></h2>
          <p>Esto no es un museo ni una sala de escape. Es una experiencia física, liberadora y segura donde cada golpe forma parte del ritual.</p>
        </ScrollReveal>
        <div className="manifesto-stats">
          <ScrollReveal delay={40}><strong>45–75</strong><span>minutos de experiencia</span></ScrollReveal>
          <ScrollReveal delay={90}><strong>+10</strong><span>años, con adulto responsable</span></ScrollReveal>
          <ScrollReveal delay={140}><strong>100%</strong><span>equipo de protección incluido</span></ScrollReveal>
        </div>
      </section>

      <section id="experiencia" className="circuit section-pad">
        <div className="section-heading">
          <ScrollReveal><p className="eyebrow"><span>EL CIRCUITO</span><i /></p><h2>SUBE EL CAOS.<br />BAJA EL ESTRÉS.</h2></ScrollReveal>
          <ScrollReveal delay={80}><p>Cuatro estaciones. Un recorrido pensado para entrar de a poco y terminar sin guardarte nada.</p></ScrollReveal>
        </div>
        <div className="circuit-grid">
          {circuit.map((item, index) => (
            <ScrollReveal key={item.number} delay={index * 55} className="circuit-card">
              <span>{item.number}</span>
              <div className={`circuit-icon circuit-icon--${index + 1}`} aria-hidden="true"><i /></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section id="packs" className="packs section-pad">
        <div className="section-heading section-heading--dark">
          <ScrollReveal><p className="eyebrow"><span>ELEGÍ TU NIVEL</span><i /></p><h2>¿CUÁNTO CAOS<br />PODÉS MANEJAR?</h2></ScrollReveal>
          <ScrollReveal delay={80}><p>Precios de demostración. El panel permite cambiarlos sin tocar código.</p></ScrollReveal>
        </div>
        <div className="pack-grid">
          {seedDatabase.packs.map((pack, index) => (
            <ScrollReveal key={pack.id} delay={index * 70} className={`pack-card pack-card--${pack.tone}`}>
              {pack.featured && <span className="pack-badge">MÁS ELEGIDO</span>}
              <div className="pack-number">0{index + 1}</div>
              <p>{pack.eyebrow}</p>
              <h3>{pack.name}</h3>
              <div className="pack-price"><strong>{formatCurrency(pack.price)}</strong><small>hasta {pack.capacity} personas</small></div>
              <ul>{pack.items.map((item) => <li key={item}>{item}</li>)}</ul>
              <Link className="button button--dark" href={`/reservar/?pack=${pack.id}`}>Elegir {pack.name} <span>↗</span></Link>
            </ScrollReveal>
          ))}
        </div>
        <p className="demo-note">* Valores ilustrativos para la demo. Seña simulada del 30%. El saldo se abona al asistir.</p>
      </section>

      <section className="split-feature">
        <div className="split-image">
          <div className="blue-room"><span>⚒</span></div>
          <p>PRIMER RAGE ROOM DE CÓRDOBA</p>
        </div>
        <div className="split-copy section-pad">
          <ScrollReveal>
            <p className="section-code">[ CON CONTROL / SIN CULPA ]</p>
            <h2>DESTRUCCIÓN<br /><em>RESPONSABLE.</em></h2>
            <p>Casco, guantes, antiparras y mameluco. Una charla de seguridad antes de entrar y acompañamiento del equipo durante todo el recorrido.</p>
            <ul className="safety-list">
              <li><span>01</span> Equipo completo incluido</li>
              <li><span>02</span> Objetos preparados para la actividad</li>
              <li><span>03</span> Residuos derivados a reciclaje</li>
            </ul>
            <Link className="text-link text-link--yellow" href="/experiencia/">Conocer la experiencia ↗</Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="groups-cta section-pad">
        <ScrollReveal>
          <p className="eyebrow"><span>GRUPOS & EMPRESAS</span><i /></p>
          <h2>EL AFTER OFFICE<br />QUE NADIE OLVIDA.</h2>
          <p>Cumpleaños, despedidas, equipos y celebraciones a medida. Ustedes traen el grupo. Nosotros preparamos el caos.</p>
          <div><Link className="button button--primary" href="/grupos/">Armar experiencia grupal <span>↗</span></Link></div>
        </ScrollReveal>
        <div className="groups-stamp" aria-hidden="true"><span>OFF LIMITS</span><b>GROUP<br />THERAPY*</b><small>*No es terapia. Es diversión.</small></div>
      </section>

      <section className="final-cta">
        <ScrollReveal>
          <p>TE ESTÁ ESPERANDO.</p>
          <h2>CRUZÁ<br />LA LÍNEA.</h2>
          <Link className="button button--light" href="/reservar/">Reservar ahora <span>↗</span></Link>
        </ScrollReveal>
      </section>
    </main>
  );
}
