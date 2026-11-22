import { useState } from 'react'
import { leMansCars } from '../data/leMansCars'
import CarImageSlot from './CarImageSlot'
import EmptyState from './EmptyState'
const ROWS = [
  { k: 'hp', label: 'POWER', unit: 'HP', max: 1000, best: 'high' },
  { k: 'topSpeed', label: 'TOP SPEED', unit: 'KM/H', max: 400, best: 'high' },
  { k: 'weight', label: 'WEIGHT', unit: 'KG', max: 1500, best: 'low' },
]

function Side({ car }) {
  return (
    <div className="min-w-0 text-center">
      <div className="font-mono text-[10px] tracking-widest" style={{ color: car.accent }}>{car.year} // #{car.number}</div>
      <div className="font-display text-3xl md:text-5xl" style={{ color: car.accent }}>{car.fullName.toUpperCase()}</div>
      {/* IMAGE SLOT: see CarImageSlot.jsx */}
      <CarImageSlot car={car} className="mx-auto mt-3 h-28 w-full md:h-40" />
      <div className="mt-2 font-mono text-[10px] text-white/60">{car.engine}</div>
      <div className="font-mono text-[10px] text-white/40">{car.drivers.join(' · ')}</div>
    </div>
  )
}

function Bar({ car, v, max, win, right }) {
  return (
    <div className={`flex items-center gap-3 ${right ? '' : 'flex-row-reverse'}`}>
      <span className={`w-16 font-display text-3xl ${win ? '' : 'text-white/50'}`} style={win ? { color: car.accent } : undefined}>{v}</span>
      <div className={`h-2 flex-1 overflow-hidden rounded-full bg-white/10 ${right ? '' : 'rotate-180'}`}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (v / max) * 100)}%`, background: car.accent, opacity: win ? 1 : 0.45 }} />
      </div>
    </div>
  )
}

export default function Compare() {
  // Indexes into leMansCars. Start with Mazda 787B (id 6) vs Porsche 919 (id 10).
  const [sel, setSel] = useState(() => [
    leMansCars.findIndex((c) => c.id === 6),
    leMansCars.findIndex((c) => c.id === 10),
  ])
  const [slot, setSlot] = useState(0)
  const [A, B] = [leMansCars[sel[0]], leMansCars[sel[1]]]

  const pick = (i) => {
    setSel((s) => (slot === 0 ? [i, s[1]] : [s[0], i]))
    setSlot((s) => 1 - s)
  }

  return (
    <section id="compare" className="mx-auto w-full max-w-6xl px-6 py-28">
      <div className="font-mono text-[10px] tracking-[0.3em] text-amber-400">05 // HEAD TO HEAD</div>
      <h2 className="mt-2 font-display text-6xl md:text-8xl">COMPARE LEGENDS</h2>

      <div className="mt-8 flex items-center gap-2 font-mono text-[10px] tracking-widest text-white/50">
        PICKING:
        {['A', 'B'].map((l, i) => (
          <button key={l} onClick={() => setSlot(i)} className={`rounded px-3 py-1 ${slot === i ? 'bg-blue-600 text-white' : 'bg-white/10'}`}>CAR {l}</button>
        ))}
      </div>
      <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-3">
        {leMansCars.map((c, i) => {
          const on = sel.includes(i)
          return (
            <button key={c.id} onClick={() => pick(i)} className="w-40 shrink-0 snap-start rounded-xl border p-2 text-left transition hover:bg-white/10"
              style={{ borderColor: on ? c.accent : 'rgba(255,255,255,0.1)', background: on ? `${c.accent}18` : 'rgba(255,255,255,0.03)' }}>
              <CarImageSlot car={c} compact className="h-16 w-full" />
              <div className="mt-1 font-mono text-[9px] text-white/50">{c.year}</div>
              <div className="truncate font-display text-lg">{c.name}</div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <Side car={A} />
          <div className="font-display text-4xl text-white/30">VS</div>
          <Side car={B} />
        </div>

        <div className="mt-8 space-y-5">
          {ROWS.map((r) => {
            const a = A[r.k], b = B[r.k]
            const aWin = a === b ? null : r.best === 'high' ? a > b : a < b
            return (
              <div key={r.k}>
                <div className="mb-2 text-center font-mono text-[10px] tracking-[0.3em] text-white/50">
                  {r.label} ({r.unit}){r.best === 'low' ? ' · LOWER IS BETTER' : ''}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Bar car={A} v={a} max={r.max} win={aWin === true} right={false} />
                  <Bar car={B} v={b} max={r.max} win={aWin === false} right />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm text-white/70 md:grid-cols-2">
          <p>{A.highlight}</p>
          <p>{B.highlight}</p>
        </div>
      </div>
    </section>
  )
}