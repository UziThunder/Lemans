import { useState } from 'react'
import { f1Drivers, f1Manufacturers } from '../data/f1Crossover'

function Portrait({ src, alt, name }) {
  const [missing, setMissing] = useState(false)
  if (missing || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-dashed border-white/20 font-mono text-[8px] text-white/40"
      >
        {name.split(' ').map((p) => p[0]).join('')}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      onError={() => setMissing(true)}
      className="h-16 w-16 shrink-0 rounded-lg object-cover grayscale"
    />
  )
}

function Logo({ src, alt, name }) {
  const [missing, setMissing] = useState(false)
  if (missing || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="grid h-12 w-20 shrink-0 place-items-center rounded border border-dashed border-white/20 font-mono text-[8px] text-white/40"
      >
        {name}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      onError={() => setMissing(true)}
      className="h-12 w-20 shrink-0 object-contain"
    />
  )
}

export default function F1Crossover() {
  const [tab, setTab] = useState('drivers')
  const list = tab === 'drivers' ? f1Drivers : f1Manufacturers

  return (
    <section id="f1-crossover" aria-labelledby="f1-title" className="mx-auto w-full max-w-6xl px-6 py-28">
      <div className="font-mono text-[10px] tracking-[0.3em] text-blue-300">06 // F1 CROSSOVER</div>
      <h2 id="f1-title" className="mt-2 font-display text-6xl md:text-8xl">
        BOTH SIDES OF THE TRACK
      </h2>
      <p className="mt-6 max-w-2xl leading-relaxed text-white/60">
        Drivers and manufacturers who competed in Formula 1 and at Le Mans. Some did both in the same era, and some came
        back years later.
      </p>

      <div role="tablist" aria-label="Crossover type" className="mt-8 flex gap-2 font-mono text-[10px] tracking-widest">
        {[
          ['drivers', `DRIVERS (${f1Drivers.length})`],
          ['manufacturers', `MANUFACTURERS (${f1Manufacturers.length})`],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`rounded-lg border px-4 py-2 transition ${
              tab === key ? 'border-blue-400/60 bg-blue-500/20 text-white' : 'border-white/10 text-white/50 hover:bg-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'drivers' ? (
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {list.map((d) => (
            <li key={d.id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Portrait src={d.portrait} alt={d.portraitAlt} name={d.name} />
              <div className="min-w-0">
                <div className="font-display text-2xl leading-none">{d.name}</div>
                <div className="mt-2 font-mono text-[10px] tracking-wide text-white/60">F1: {d.f1}</div>
                <div className="mt-1 font-mono text-[10px] tracking-wide text-white/60">LE MANS: {d.lemans}</div>
                <p className="mt-2 text-xs leading-relaxed text-white/50">{d.note}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {list.map((m) => (
            <li key={m.id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Logo src={m.logo} alt={m.logoAlt} name={m.name} />
              <div className="min-w-0">
                <div className="font-display text-2xl leading-none">{m.name}</div>
                <div className="mt-2 font-mono text-[10px] tracking-wide text-white/60">F1: {m.f1}</div>
                <div className="mt-1 font-mono text-[10px] tracking-wide text-white/60">LE MANS: {m.lemans}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}