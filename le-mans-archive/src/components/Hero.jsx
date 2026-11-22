import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowRight } from 'lucide-react'
import { leMansCars } from '../data/leMansCars'
import { carImages } from '../data/carImages'
import { getTune } from '../data/carTuning'
import { trimImage } from '../lib/trimImage'

// [label, number | text, decimals, unit, sub, colour]
const STATS = [
  ['CIRCUIT LENGTH', 13.626, 3, 'KM', '38 TURNS // CLOCKWISE', '#5b8cff'],
  ['TOP SPEED RECORD', 407, 0, 'KM/H', 'WM P88 PEUGEOT // 1988', '#ff4d5a'],
  ['DISTANCE RECORD', 5410.7, 1, 'KM', '397 LAPS // AUDI R15+ // 2010', '#ffb020'],
  ['RACE LAP RECORD', '3:17.297', 0, '', 'TOYOTA TS050 HYBRID // 2019', '#2fd39a'],
]

const fmt = (v, d) => Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const WORDS = leMansCars.map((c) => `${c.year} ${c.fullName.toUpperCase()}`)

// Only cars that have an image AND face right (so no mirrored logos) take part in the hero stage.
// New cars join automatically once their PNG is in src/assets/cars/.
const HERO_CARS = leMansCars.filter((c) => carImages[c.id] && getTune(c.id).facing === 'right')

/* ---------- tachometer geometry (viewBox 0 0 400 400, 240 degree sweep from 150deg to 390deg) ---------- */
const polar = (a, r) => [200 + r * Math.cos((a * Math.PI) / 180), 200 + r * Math.sin((a * Math.PI) / 180)]
const arc = (a0, a1, r) => {
  const [x0, y0] = polar(a0, r)
  const [x1, y1] = polar(a1, r)
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`
}
const TICKS = Array.from({ length: 41 }, (_, i) => {
  const a = 150 + i * 6
  const major = i % 5 === 0
  const [x1, y1] = polar(a, 170)
  const [x2, y2] = polar(a, major ? 150 : 158)
  const [lx, ly] = polar(a, 130)
  return { i, major, x1, y1, x2, y2, lx, ly, red: i >= 33 }
})
const STREAKS = Array.from({ length: 8 }, (_, i) => ({
  top: 12 + ((i * 41) % 70),
  w: 30 + ((i * 13) % 40),
  dur: 0.9 + ((i * 7) % 6) / 10,
  delay: -((i * 29) % 10) / 10,
}))

export default function Hero({ ready, onJump }) {
  const root = useRef(null)
  const stageRef = useRef(null)
  const carRef = useRef(null)
  const labelRef = useRef(null)
  const needleRef = useRef(null)
  const readRef = useRef(null)
  const needleTween = useRef(null)
  const inViewRef = useRef(true)
  const [inView, setInView] = useState(true)
  const [idx, setIdx] = useState(0)
  const [srcs, setSrcs] = useState({}) // car id -> trimmed image url

  const car = HERO_CARS[idx % Math.max(1, HERO_CARS.length)]
  const acc = car ? car.accent : '#5fb4e8'

  /* ---------- trimmed images (already cached by the start-lights preloader) ---------- */
  useEffect(() => {
    let alive = true
    HERO_CARS.forEach((c) => {
      trimImage(carImages[c.id])
        .then((url) => alive && setSrcs((s) => ({ ...s, [c.id]: url })))
        .catch(() => {})
    })
    return () => {
      alive = false
    }
  }, [])

  /* ---------- only animate while the hero is on screen ---------- */
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e.isIntersecting
        setInView(e.isIntersecting)
      },
      { threshold: 0.05 }
    )
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  /* ---------- intro: text rises in, numbers count up, marquee slides up ---------- */
  useEffect(() => {
    if (!ready) return undefined
    const ctx = gsap.context(() => {
      gsap.from('.hero-in', { y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out' })

      gsap.utils.toArray('.js-count').forEach((el, i) => {
        const to = Number(el.dataset.to)
        const dec = Number(el.dataset.dec)
        const o = { v: 0 }
        gsap.to(o, {
          v: to, duration: 2.4, delay: 0.6 + i * 0.15, ease: 'power3.out',
          onUpdate: () => { el.textContent = fmt(o.v, dec) },
        })
      })

      gsap.from('.js-marquee', { yPercent: 100, opacity: 0, duration: 1, delay: 0.9, ease: 'power3.out' })
    }, root)
    return () => ctx.revert()
  }, [ready])

  /* ---------- tachometer needle sweeps up and down with a live km/h readout ---------- */
  useEffect(() => {
    if (!ready) return undefined
    const needle = needleRef.current
    const read = readRef.current
    const p = { a: 150 }
    let last = -1
    const tw = gsap.to(p, {
      a: 150 + 190,
      duration: 2.4,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.25,
      onUpdate() {
        needle.setAttribute('transform', `rotate(${p.a} 200 200)`)
        const v = Math.round(((p.a - 150) / 240) * 340)
        if (v !== last) {
          last = v
          read.textContent = String(v).padStart(3, '0')
        }
      },
    })
    tw.paused(!inViewRef.current)
    needleTween.current = tw
    return () => tw.kill()
  }, [ready])

  useEffect(() => {
    needleTween.current?.paused(!inView)
  }, [inView])

  /* ---------- car drives in, holds, drives out, next car (layout effect = no one-frame flash on swap) ---------- */
  useLayoutEffect(() => {
    if (!ready || !inView || !HERO_CARS.length) return undefined
    const el = carRef.current
    const label = labelRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const tl = gsap.timeline()
    tl.fromTo(el, { xPercent: -55, skewX: -10, opacity: 0 }, { xPercent: 0, skewX: 0, opacity: 1, duration: 1.5, ease: 'power3.out' })
    tl.fromTo(label, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.5)

    let timer
    if (!reduce) {
      timer = setTimeout(() => {
        gsap.to(label, { opacity: 0, duration: 0.4 })
        gsap.to(el, {
          xPercent: 55, skewX: 6, opacity: 0, duration: 0.9, ease: 'power2.in',
          onComplete: () => setIdx((i) => (i + 1) % HERO_CARS.length),
        })
      }, 5000) // how long each car stays on the stage (ms)
    }

    return () => {
      clearTimeout(timer)
      tl.kill()
      gsap.killTweensOf([el, label])
    }
  }, [ready, inView, idx])

  /* ---------- mouse: 3D tilt of the stage + parallax on the background glows ---------- */
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return undefined
    const stage = stageRef.current
    gsap.set(stage, { transformPerspective: 1100 })
    const rx = gsap.quickTo(stage, 'rotationX', { duration: 0.9, ease: 'power3' })
    const ry = gsap.quickTo(stage, 'rotationY', { duration: 0.9, ease: 'power3' })
    const blobs = gsap.utils.toArray('.js-blob', root.current).map((b) => ({
      qx: gsap.quickTo(b, 'x', { duration: 1.2, ease: 'power3' }),
      qy: gsap.quickTo(b, 'y', { duration: 1.2, ease: 'power3' }),
      d: Number(b.dataset.depth),
    }))

    const onMove = (e) => {
      if (!inViewRef.current) return
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      ry(nx * 16)
      rx(-ny * 10)
      blobs.forEach((b) => {
        b.qx(nx * b.d)
        b.qy(ny * b.d)
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section id="hero" ref={root} className="relative flex min-h-screen items-center overflow-hidden px-6 pb-28 pt-24 md:px-16">
      {/* floating background blobs (outer = mouse parallax, inner = CSS float) */}
      <div className="js-blob pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem]" data-depth="60">
        <div className="float-slow h-full w-full rounded-full bg-[radial-gradient(circle,rgba(43,91,255,0.28),transparent_70%)]" />
      </div>
      <div className="js-blob pointer-events-none absolute -right-32 bottom-10 h-[30rem] w-[30rem]" data-depth="-80">
        <div className="float-slow h-full w-full rounded-full bg-[radial-gradient(circle,rgba(255,176,32,0.16),transparent_70%)]" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          {/* ---------- LEFT: headline ---------- */}
          <div>
            <div className="hero-in inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 font-mono text-[10px] tracking-[0.25em] text-blue-200">
              <span className="mr-2 animate-pulse text-red-500">●</span> AUTOMOBILE CLUB DE L'OUEST // HERITAGE ARCHIVE
            </div>
            <h1 className="hero-in mt-6 font-display text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.9]">
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

          {/* ---------- RIGHT: 3D car stage ---------- */}
          <div className="hero-in mx-auto w-full max-w-[640px]">
            <div ref={stageRef} className="relative aspect-[5/4] w-full" style={{ transformStyle: 'preserve-3d' }}>
              {/* back glow (tinted by the current car) */}
              <div
                className="pointer-events-none absolute inset-[6%] rounded-full"
                style={{ background: `radial-gradient(closest-side, ${acc}44, transparent 75%)`, transform: 'translateZ(-60px)' }}
              />

              {/* dial + rotating ring (deeper layer) */}
              <div className="pointer-events-none absolute inset-0" style={{ transform: 'translateZ(-30px)' }}>
                <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <path d={arc(150, 390, 170)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                  <path d={arc(150 + 33 * 6, 390, 170)} fill="none" stroke="#ff2a3a" strokeOpacity="0.8" strokeWidth="3" />
                  {TICKS.map((t) => (
                    <line
                      key={t.i}
                      x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                      stroke={t.red ? '#ff2a3a' : 'rgba(255,255,255,0.45)'}
                      strokeWidth={t.major ? 2.5 : 1.2}
                    />
                  ))}
                  {TICKS.filter((t) => t.major).map((t) => (
                    <text key={t.i} x={t.lx} y={t.ly} textAnchor="middle" dominantBaseline="central" fontSize="13" fontFamily="'JetBrains Mono', monospace" fill="rgba(255,255,255,0.5)">
                      {t.i / 5}
                    </text>
                  ))}
                  {/* needle: only the outer segment, so it sweeps around the car without crossing it */}
                  <g ref={needleRef} transform="rotate(150 200 200)">
                    <line x1="300" y1="200" x2="354" y2="200" stroke={acc} strokeWidth="4" strokeLinecap="round" />
                    <line x1="300" y1="200" x2="354" y2="200" stroke={acc} strokeWidth="10" strokeLinecap="round" opacity="0.25" />
                  </g>
                  {/* live readout in the gap at the bottom of the dial */}
                  <text ref={readRef} x="200" y="336" textAnchor="middle" fontSize="44" fontFamily="'Bebas Neue', Impact, sans-serif" fill="#fff">000</text>
                  <text x="200" y="358" textAnchor="middle" fontSize="11" letterSpacing="4" fontFamily="'JetBrains Mono', monospace" fill="rgba(255,255,255,0.45)">KM/H</text>
                </svg>

                <div className="hero-spin absolute inset-[1%]">
                  <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
                    <circle cx="200" cy="200" r="196" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="2 10" />
                    <circle cx="200" cy="200" r="196" fill="none" stroke={acc} strokeWidth="3" strokeLinecap="round" strokeDasharray="70 1162" />
                  </svg>
                </div>
              </div>

              {/* speed streaks */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
                {STREAKS.map((s, i) => (
                  <span
                    key={i}
                    className="streak-line absolute block h-px"
                    style={{
                      top: `${s.top}%`,
                      left: '100%',
                      width: `${s.w}%`,
                      background: 'linear-gradient(270deg, rgba(255,255,255,0.5), transparent)',
                      animation: `streak ${s.dur}s linear ${s.delay}s infinite`,
                    }}
                  />
                ))}
              </div>

              {/* the car (front layer) */}
              <div className="pointer-events-none absolute inset-x-[5%] top-[33%]" style={{ transform: 'translateZ(70px)' }}>
                <div ref={carRef} style={{ opacity: 0 }}>
                  {car && srcs[car.id] && (
                    <img src={srcs[car.id]} alt={car.fullName} draggable={false} decoding="async" className="block h-auto w-full select-none" />
                  )}
                  <div
                    className="absolute -bottom-2 inset-x-[4%] h-7"
                    style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, transparent 70%)' }}
                  />
                </div>
              </div>

              {/* floor line under the car */}
              <div
                className="pointer-events-none absolute inset-x-[4%] top-[73%] h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${acc}, transparent)`, transform: 'translateZ(20px)' }}
              />
            </div>

            {/* caption + picker */}
            <div className="mt-4 text-center">
              <div ref={labelRef} style={{ opacity: 0 }}>
                {car && (
                  <>
                    <div className="font-display text-3xl tracking-wide md:text-4xl" style={{ color: acc }}>
                      {car.year} // {car.name}
                    </div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.25em] text-white/50">{car.engine}</div>
                  </>
                )}
              </div>
              <div className="mt-3 flex justify-center gap-2">
                {HERO_CARS.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setIdx(i)}
                    aria-label={`Show ${c.year} ${c.fullName}`}
                    className="h-[6px] rounded-full transition-all duration-300"
                    style={{ width: i === idx % HERO_CARS.length ? 26 : 8, background: i === idx % HERO_CARS.length ? acc : 'rgba(255,255,255,0.25)' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- record book ---------- */}
        <div className="hero-in mt-12">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.25em] text-white/50">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> LIVE TELEMETRY // RECORD BOOK
            </span>
            <span>FIRST RACE: MAY 1923 · MOST WINS: PORSCHE (19)</span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
        </div>
      </div>

      {/* scrolling car-name marquee */}
      <div className="js-marquee absolute inset-x-0 bottom-0 overflow-hidden border-y border-white/10 bg-black/50 py-3">
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