import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MAKERS = [
  ['PORSCHE', 'GERMANY', '917K · 956 · 962C · 919 HYBRID', 19, '1970 – 2017', '#2b5bff'],
  ['AUDI', 'GERMANY', 'R8 · R10 TDI · R18 TDI · R18 E-TRON', 13, '2000 – 2014', '#c0c6cc'],
  ['FERRARI', 'ITALY', '250 TR · 250 LM · 499P', 12, '1949 – 2025', '#ff3b47'],
  ['JAGUAR', 'UNITED KINGDOM', 'C-TYPE · D-TYPE · XJR-9 · XJR-12', 7, '1951 – 1990', '#2fd39a'],
  ['BENTLEY', 'UNITED KINGDOM', '3 LITRE · SPEED SIX · SPEED 8', 6, '1924 – 2003', '#ffb020'],
  ['TOYOTA', 'JAPAN', 'TS050 HYBRID · GR010 HYBRID', 5, '2018 – 2022', '#ff5a3c'],
]
const DRIVERS = [
  ['TOM KRISTENSEN', 'DENMARK', 'AUDI · BENTLEY · TWR', 9, '1997 – 2013', '#2b5bff'],
  ['JACKY ICKX', 'BELGIUM', 'FORD · PORSCHE · GULF', 6, '1969 – 1982', '#5fb4e8'],
  ['DEREK BELL', 'UNITED KINGDOM', 'PORSCHE', 5, '1975 – 1987', '#ff3b47'],
  ['FRANK BIELA', 'GERMANY', 'AUDI', 5, '1991 – 2007', '#c0c6cc'],
  ['EMANUELE PIRRO', 'ITALY', 'AUDI', 5, '2000 – 2007', '#ffb020'],
  ['YANNICK DALMAS', 'FRANCE', 'PEUGEOT · PORSCHE · BMW', 4, '1992 – 1999', '#2fd39a'],
]

export default function HallOfFame() {
  const [tab, setTab] = useState('maker')
  const root = useRef(null)
  const rows = tab === 'maker' ? MAKERS : DRIVERS
  const max = rows[0][3]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.fame-row', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' } })
      gsap.fromTo('.fame-bar', { scaleX: 0 }, { scaleX: 1, stagger: 0.08, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' } })
    }, root)
    return () => ctx.revert()
  }, [tab])

  return (
    <section id="fame" ref={root} className="mx-auto w-full max-w-5xl px-6 py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.3em] text-amber-400">04 // OVERALL VICTORIES</div>
          <h2 className="mt-2 font-display text-6xl md:text-8xl">HALL OF FAME</h2>
        </div>
        <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1 font-mono text-[10px] tracking-widest">
          {[['maker', 'CONSTRUCTORS'], ['driver', 'DRIVERS']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-lg px-4 py-2 transition ${tab === k ? 'bg-blue-600' : 'text-white/50'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-3">
        {rows.map(([name, sub, models, wins, span, c], i) => (
          <div key={name} className="fame-row rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-display text-4xl text-white/25">#{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-3xl">{name}</span>
                    <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[9px] tracking-widest text-white/60">{sub}</span>
                  </div>
                  <div className="font-mono text-[10px] tracking-widest text-amber-400">{models}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-4xl leading-none">{wins} <span className="font-mono text-[10px] text-white/50">WINS</span></div>
                <div className="font-mono text-[9px] tracking-widest text-white/40">{span}</div>
              </div>
            </div>
            <div className="mt-4 h-[5px] overflow-hidden rounded-full bg-white/10">
              <div className="fame-bar h-full origin-left rounded-full" style={{ width: `${(wins / max) * 100}%`, background: c }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}