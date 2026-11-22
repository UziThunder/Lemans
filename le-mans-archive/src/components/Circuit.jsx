import { useEffect, useRef, useState } from 'react'

// Track traced from the 51GT3 layout (viewBox 60 40 480 270). Clockwise, start/finish bottom-left.
const TRACK =
  'M 192 271 L 150 272 L 138 272 Q 127 270 128 260 L 136 252 L 134 245 L 112 236 L 104 226 L 94 218 ' +
  'L 86 205 L 86 192 Q 90 184 100 178 L 238 122 L 244 119 L 380 71 L 386 70 L 415 64 L 505 60 L 515 62 ' +
  'L 492 130 L 462 188 L 445 198 L 441 205 L 446 228 L 400 238 L 380 252 L 345 272 L 335 268 L 325 256 ' +
  'L 312 256 L 300 270 L 290 272 L 280 262 L 266 256 L 250 258 L 218 268 L 206 270 L 192 271'

const BLUE = '#2b5bff'
const AMBER = '#ffb020'
const LAP_SECONDS = 197.297 // 3:17.297, the race lap record

// [number, name, type, approx km/h, sector, x, y, description]
// Speeds are rough, for show. Names/positions follow the usual Le Mans layout.
const CORNERS = [
  [1, 'DUNLOP CURVE', 'RIGHT', 260, 'S1', 141, 277, 'Fast right-hander right after the start/finish straight, climbing toward the Dunlop bridge.'],
  [2, 'DUNLOP CHICANE', 'LEFT', 110, 'S1', 140, 243, 'First braking zone of the lap. Cars slow hard for the left of the chicane.'],
  [3, 'DUNLOP CHICANE EXIT', 'RIGHT', 120, 'S1', 120, 258, 'The right-hand exit. Get the power down early for the run to the Esses.'],
  [4, 'ESSES', 'LEFT', 190, 'S1', 101, 224, 'The first flowing part of the Esses. Rhythm matters more than outright speed.'],
  [5, 'ESSES', 'RIGHT', 175, 'S1', 89, 216, 'Second Esses kink, setting the car up for Tertre Rouge.'],
  [6, 'TERTRE ROUGE', 'RIGHT', 150, 'S1', 79, 192, 'The most important corner on the lap: your exit speed carries down the whole Mulsanne Straight.'],
  [7, 'MULSANNE CHICANE 1', 'CHICANE', 120, 'S2', 239, 108, 'The first chicane on the long straight, breaking up the top-speed run.'],
  [8, 'MULSANNE CHICANE 2', 'CHICANE', 120, 'S2', 382, 56, 'The second chicane on the straight. Another heavy stop from near top speed.'],
  [9, 'MULSANNE CORNER', 'RIGHT', 90, 'S2', 524, 62, 'Slow right-hander at the end of the straight. One of the biggest overtaking spots.'],
  [10, 'INDIANAPOLIS', 'RIGHT', 130, 'S2', 458, 200, 'Quick right-hand kink on the way down to Arnage.'],
  [11, 'ARNAGE', 'RIGHT', 70, 'S2', 432, 208, 'The slowest corner on the circuit, a tight right.'],
  [12, 'ARNAGE EXIT', 'RIGHT', 110, 'S2', 458, 232, 'Accelerating out of Arnage toward the Porsche Curves.'],
  [13, 'PORSCHE CURVES', 'FLAT-OUT', 260, 'S3', 381, 242, 'Entry to the famous fast sequence, taken at big speed.'],
  [14, 'PORSCHE CURVES', 'FLAT-OUT', 250, 'S3', 345, 285, 'Left-right sweep, with commitment the whole way through.'],
  [15, 'PORSCHE CURVES', 'RIGHT', 230, 'S3', 320, 246, 'Mid-sequence, loaded up with downforce.'],
  [16, 'PORSCHE CURVES', 'LEFT', 240, 'S3', 296, 284, 'The tricky middle of the section. Walls are close.'],
  [17, 'PORSCHE CURVES EXIT', 'RIGHT', 220, 'S3', 277, 248, 'Last of the Porsche Curves, leading to the Ford Chicanes.'],
  [18, 'FORD CHICANE', 'RIGHT', 100, 'S3', 232, 271, 'Braking for the first Ford chicane.'],
  [19, 'FORD CHICANE', 'LEFT', 90, 'S3', 218, 282, 'Quick change of direction, riding the kerbs.'],
  [20, 'FORD CHICANE', 'RIGHT', 100, 'S3', 205, 258, 'Second chicane entry, right beside the pit entry.'],
  [21, 'FORD CHICANE EXIT', 'LEFT', 110, 'S3', 188, 285, 'Last corner, then flat out over the line to start another lap.'],
]

const fmtLap = (s) => {
  const m = Math.floor(s / 60)
  const r = s - m * 60
  return `${m}:${r.toFixed(3).padStart(6, '0')}`
}

export default function Circuit() {
  const [sel, setSel] = useState(0)
  const [running, setRunning] = useState(false)
  const pathRef = useRef(null)
  const dotRef = useRef(null)
  const glowRef = useRef(null)
  const clockRef = useRef(null)
  const barRef = useRef(null)
  const lensRef = useRef([])
  const rafRef = useRef(0)
  const lastRef = useRef(-1)

  // Find where each corner sits along the track (nearest point), used by the lap run
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const total = path.getTotalLength()
    const samples = []
    for (let i = 0; i <= 500; i++) {
      const L = (i / 500) * total
      const p = path.getPointAtLength(L)
      samples.push([L, p.x, p.y])
    }
    lensRef.current = CORNERS.map((c) => {
      let best = 0
      let bd = Infinity
      samples.forEach(([L, x, y]) => {
        const d = (x - c[5]) ** 2 + (y - c[6]) ** 2
        if (d < bd) {
          bd = d
          best = L
        }
      })
      return best
    })
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const stop = () => {
    cancelAnimationFrame(rafRef.current)
    setRunning(false)
    if (dotRef.current) dotRef.current.style.visibility = 'hidden'
    if (glowRef.current) glowRef.current.style.visibility = 'hidden'
  }

  const run = () => {
    if (running) return stop()
    const path = pathRef.current
    const total = path.getTotalLength()
    const DURATION = 16000
    const t0 = performance.now()
    lastRef.current = -1
    setRunning(true)
    dotRef.current.style.visibility = 'visible'
    glowRef.current.style.visibility = 'visible'

    const step = (now) => {
      const t = (now - t0) / DURATION
      if (t >= 1) return stop()
      const L = t * total
      const p = path.getPointAtLength(L)
      ;[dotRef.current, glowRef.current].forEach((el) => {
        el.setAttribute('cx', p.x)
        el.setAttribute('cy', p.y)
      })
      if (clockRef.current) clockRef.current.textContent = fmtLap(t * LAP_SECONDS)
      if (barRef.current) barRef.current.style.transform = `scaleX(${t})`
      let idx = 0
      lensRef.current.forEach((cl, i) => {
        if (L >= cl) idx = i
      })
      if (idx !== lastRef.current) {
        lastRef.current = idx
        setSel(idx)
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }

  const c = CORNERS[sel]

  return (
    <section id="circuit" className="relative px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-white/50">CIRCUIT DE LA SARTHE // 13.626 KM</div>
        <h2 className="mt-2 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-none">
          21 CORNERS. <span className="text-white/30">ONE LAP.</span>
        </h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* corner list */}
          <div className="order-2 flex max-h-[280px] flex-col gap-2 overflow-y-auto overflow-x-hidden pr-3 lg:order-1 lg:max-h-[560px]">
            {CORNERS.map((k, i) => (
              <button
                key={k[0]}
                onClick={() => {
                  stop()
                  setSel(i)
                }}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left font-mono text-[11px] tracking-[0.15em] ${
                  sel === i ? 'border-amber-400/70 bg-amber-400/10 text-white' : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                <span className="w-6 font-display text-xl leading-none" style={{ color: sel === i ? AMBER : '#fff' }}>
                  {k[0]}
                </span>
                {k[1]}
              </button>
            ))}
          </div>

          {/* map + telemetry */}
          <div className="order-1 min-w-0 lg:order-2">
            <div className="rounded-3xl border border-white/10 bg-black/40 p-3 md:p-5">
              <svg viewBox="60 40 480 270" className="h-auto w-full" role="img" aria-label="Le Mans circuit map">
                {/* path #0: dim base road */}
                <path d={TRACK} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
                {/* path #1: the track line that draws itself on scroll */}
                <path ref={pathRef} d={TRACK} fill="none" stroke={BLUE} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />

                {/* start / finish line */}
                <rect x="189" y="264" width="4" height="14" fill="#fff" />
                <text x="165" y="302" textAnchor="middle" fontSize="7" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace" fill="rgba(255,255,255,0.55)">
                  START / FINISH
                </text>

                {/* lap-run dot */}
                <circle ref={glowRef} r="10" fill={AMBER} opacity="0.3" style={{ visibility: 'hidden' }} />
                <circle ref={dotRef} r="4.5" fill="#fff" style={{ visibility: 'hidden' }} />

                {/* corners (each is one <g>, animated by scrollFx) */}
                {CORNERS.map((k, i) => (
                  <g
                    key={k[0]}
                    onClick={() => {
                      stop()
                      setSel(i)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={k[5]} cy={k[6]} r="8" fill={sel === i ? AMBER : '#0b0b0e'} stroke={sel === i ? AMBER : 'rgba(255,255,255,0.55)'} strokeWidth="1" />
                    <text
                      x={k[5]}
                      y={k[6]}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="8"
                      fontWeight="700"
                      fontFamily="'JetBrains Mono', monospace"
                      fill={sel === i ? '#000' : '#fff'}
                      style={{ pointerEvents: 'none' }}
                    >
                      {k[0]}
                    </text>
                  </g>
                ))}
              </svg>

              {/* lap run controls */}
              <div className="mt-3 flex flex-wrap items-center gap-4 px-1">
                <button
                  onClick={run}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 font-mono text-[11px] tracking-[0.25em] transition hover:bg-blue-500"
                >
                  {running ? 'STOP' : 'RUN LAP'}
                </button>
                <div className="font-display text-3xl leading-none">
                  <span ref={clockRef}>0:00.000</span>
                </div>
                <div className="h-[3px] min-w-[120px] flex-1 overflow-hidden rounded-full bg-white/10">
                  <div ref={barRef} className="h-full origin-left rounded-full" style={{ background: AMBER, transform: 'scaleX(0)' }} />
                </div>
              </div>
            </div>

            {/* info panel (replayed by scrollFx whenever the selection changes) */}
            <div className="mt-5 rounded-3xl border border-white/10 bg-black/40 p-5 md:p-6">
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] text-white/50">TURN {c[0]} // SECTOR {c[4].slice(1)}</div>
                <h3 className="mt-1 font-display text-4xl leading-none md:text-5xl" style={{ color: AMBER }}>
                  {c[1]}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">{c[7]}</p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ['TYPE', c[2], ''],
                  ['APPROX SPEED', String(c[3]), 'KM/H'],
                  ['SECTOR', c[4], ''],
                ].map(([l, v, u]) => (
                  <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="font-mono text-[9px] tracking-[0.2em] text-white/50">{l}</div>
                    <div className="mt-1 font-display text-2xl leading-none md:text-3xl">
                      {v} <span className="font-mono text-[10px] text-white/50">{u}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}