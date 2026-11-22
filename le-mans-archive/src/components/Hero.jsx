import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowRight } from 'lucide-react'
import { leMansCars } from '../data/leMansCars'

// [label, number | text, decimals, unit, sub, colour]
const STATS = [
  ['CIRCUIT LENGTH', 13.626, 3, 'KM', '38 TURNS // CLOCKWISE', '#5b8cff'],
  ['TOP SPEED RECORD', 407, 0, 'KM/H', 'WM P88 PEUGEOT // 1988', '#ff4d5a'],
  ['DISTANCE RECORD', 5410.7, 1, 'KM', '397 LAPS // AUDI R15+ // 2010', '#ffb020'],
  ['RACE LAP RECORD', '3:17.297', 0, '', 'TOYOTA TS050 HYBRID // 2019', '#2fd39a'],
]

const fmt = (v, d) => Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const WORDS = leMansCars.map((c) => `${c.year} ${c.fullName.toUpperCase()}`)

export default function Hero({ ready, onJump }) {
  const root = useRef(null)

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-in', { y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out' })

      // numbers count up
      gsap.utils.toArray('.js-count').forEach((el, i) => {
        const to = Number(el.dataset.to)
        const dec = Number(el.dataset.dec)
        const o = { v: 0 }
        gsap.to(o, {
          v: to, duration: 2.4, delay: 0.6 + i * 0.15, ease: 'power3.out',
          onUpdate: () => { el.textContent = fmt(o.v, dec) },
        })
      })

      // marquee strip slides up
      gsap.from('.js-marquee', { yPercent: 100, opacity: 0, duration: 1, delay: 0.9, ease: 'power3.out' })
    }, root)

    // mouse parallax on background blobs
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      gsap.utils.toArray('.js-blob', root.current).forEach((b) => {
        const d = Number(b.dataset.depth)
        gsap.to(b, { x: nx * d, y: ny * d, duration: 1.2, ease: 'power3.out' })
      })
    }
    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      ctx.revert()
    }
  }, [ready])

  return (
    <section id="hero" ref={root} className="relative flex min-h-screen items-center overflow-hidden px-6 pb-40 pt-24 md:px-16">
      {/* floating background blobs (outer = mouse parallax, inner = CSS float) */}
      <div className="js-blob pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem]" data-depth="60">
        <div className="float-slow h-full w-full rounded-full bg-[radial-gradient(circle,rgba(43,91,255,0.28),transparent_70%)]" />
      </div>
      <div className="js-blob pointer-events-none absolute -right-32 bottom-10 h-[30rem] w-[30rem]" data-depth="-80">
        <div className="float-slow h-full w-full rounded-full bg-[radial-gradient(circle,rgba(255,176,32,0.16),transparent_70%)]" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="hero-in inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 font-mono text-[10px] tracking-[0.25em] text-blue-200">
            <span className="mr-2 animate-pulse text-red-500">●</span> AUTOMOBILE CLUB DE L'OUEST // HERITAGE ARCHIVE
          </div>
          <h1 className="hero-in mt-6 font-display text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.9]">
            100+ YEARS OF <span className="bg-gradient-to-r from-blue-500 to-amber-400 bg-clip-text text-transparent">ENDURANCE</span> PERFECTION.
          </h1>
          <p className="hero-in mt-6 max-w-xl text-lg text-white/70">
            Since 1923, the 24 Hours of Le Mans has been motorsport's ultimate proving ground, where aero breakthroughs,
            hybrid powertrains and human resilience collide down the Mulsanne Straight, day and night.
          </p>
          <div className="hero-in mt-8 flex flex-wrap gap-3">
            <button onClick={() => onJump('showcase')} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-mono text-xs tracking-widest shadow-[0_0_30px_rgba(43,91,255,0.4)] transition hover:bg-blue-500">
              EXPLORE {leMansCars.length} LEGENDS <ArrowRight size={14} />
            </button>
            <button onClick={() => onJump('circuit')} className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-mono text-xs tracking-widest transition hover:bg-white/10">
              SARTHE SECTOR MAP
            </button>
          </div>
        </div>

        <div className="hero-in rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:p-7">
          <div className="mb-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-white/50">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> LIVE TELEMETRY // RECORD BOOK
          </div>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(([label, val, dec, unit, sub, c]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/40 p-4 transition-colors hover:border-white/25">
                <div className="font-mono text-[9px] tracking-[0.2em] text-white/50">{label}</div>
                <div className="mt-1 font-display text-4xl leading-none md:text-5xl" style={{ color: c }}>
                  {typeof val === 'number' ? (
                    <span className="js-count" data-to={val} data-dec={dec}>{fmt(val, dec)}</span>
                  ) : (
                    val
                  )}{' '}
                  <span className="font-mono text-xs text-white/60">{unit}</span>
                </div>
                <div className="mt-2 font-mono text-[9px] tracking-wider text-white/40">{sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between font-mono text-[10px] tracking-[0.2em] text-white/50">
            <span>FIRST RACE: MAY 1923</span>
            <span>MOST WINS: PORSCHE (19)</span>
          </div>
        </div>
      </div>

      {/* scrolling car-name marquee */}
      <div className="js-marquee absolute inset-x-0 bottom-0 overflow-hidden border-y border-white/10 bg-black/50 py-3 backdrop-blur">
        <div className="marquee flex w-max gap-10 font-display text-3xl tracking-wider md:text-4xl">
          {[...WORDS, ...WORDS].map((w, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.45)' }}>
              {w}
              <span className="text-amber-400" style={{ WebkitTextStroke: '0' }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}