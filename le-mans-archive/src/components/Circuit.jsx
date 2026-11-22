import { useState } from 'react'

// Speeds/gears are rounded approximations for a modern prototype. x/y are on the 700x340 schematic (not to scale).
const CORNERS = [
  { n: 'Dunlop Chicane & Bridge', tag: 'SECTOR 1', kmh: 120, gear: 3, g: 3.0, x: 150, y: 150, text: 'The fast run under the Dunlop Bridge funnels into a tight chicane, the first big braking test after the pit straight.' },
  { n: 'Tertre Rouge', tag: 'SECTOR 1', kmh: 230, gear: 5, g: 2.5, x: 205, y: 70, text: 'A long right-hander that feeds onto the Mulsanne Straight. Exit speed here decides the whole straight.' },
  { n: 'Les Hunaudières (Mulsanne)', tag: 'SECTOR 2', kmh: 340, gear: 6, g: 0.5, x: 400, y: 62, text: 'Nearly 6 km of flat-out running, split by two chicanes since 1990. Where top-speed records were set.' },
  { n: 'Mulsanne Corner', tag: 'SECTOR 2', kmh: 75, gear: 2, g: 4.0, x: 590, y: 78, text: 'The end of the straight: huge braking from over 300 km/h down to a slow right-hander.' },
  { n: 'Indianapolis & Arnage', tag: 'SECTOR 3', kmh: 70, gear: 2, g: 3.5, x: 600, y: 230, text: 'Two slow corners that stress brakes and traction, with Arnage among the slowest points on the lap.' },
  { n: 'Porsche Curves', tag: 'SECTOR 3', kmh: 250, gear: 6, g: 4.5, x: 400, y: 290, text: 'A sweeping, wall-lined sequence of fast corners where downforce and driver commitment matter most.' },
  { n: 'Ford Chicanes', tag: 'SECTOR 3', kmh: 110, gear: 3, g: 3.0, x: 215, y: 285, text: 'The last chicanes before the pit straight, a final braking zone that often decides late-race battles.' },
]
const PATH = 'M 130 190 L 175 90 Q 190 62 230 62 L 560 62 Q 610 62 620 110 L 610 240 Q 600 285 560 292 L 260 296 Q 150 300 130 240 Z'

export default function Circuit() {
  const [i, setI] = useState(5)
  const c = CORNERS[i]

  return (
    <section id="circuit" className="mx-auto w-full max-w-7xl px-6 py-28 md:px-16">
      <div className="font-mono text-[10px] tracking-[0.3em] text-amber-400">03 // TRACK TELEMETRY & SECTOR ANALYSIS</div>
      <h2 className="mt-2 font-display text-6xl md:text-8xl">CIRCUIT DE LA SARTHE</h2>
      <p className="mt-2 font-mono text-[11px] tracking-widest text-white/50">13.626 KM // SELECT A CORNER TO INSPECT APEX SPEED, GEAR AND HISTORY</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {CORNERS.map((k, idx) => (
            <button key={k.n} onClick={() => setI(idx)}
              className={`flex min-w-[240px] items-center justify-between rounded-xl border px-4 py-3 text-left transition lg:min-w-0 ${idx === i ? 'border-blue-500 bg-blue-500/15' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'}`}>
              <div>
                <div className="font-mono text-[9px] tracking-widest text-amber-400">{k.tag}</div>
                <div className="font-display text-xl tracking-wide">{k.n}</div>
              </div>
              <span className="rounded border border-white/15 bg-black/50 px-2 py-1 font-mono text-[11px]">{k.kmh} KM/H</span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-6">
          <svg viewBox="0 0 700 340" className="w-full rounded-xl bg-black/50">
            <path d={PATH} fill="none" stroke="rgba(43,91,255,0.25)" strokeWidth="18" strokeLinejoin="round" />
            <path d={PATH} fill="none" stroke="#2b5bff" strokeWidth="6" strokeLinejoin="round" />
            <path d={PATH} fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.5" strokeDasharray="10 10" strokeLinejoin="round">
              <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1.2s" repeatCount="indefinite" />
            </path>
            <rect x="124" y="196" width="12" height="3" fill="#ff2a3a" />
            <text x="142" y="212" fontSize="9" fill="#ffffff99" fontFamily="monospace">START / FINISH</text>
            {CORNERS.map((k, idx) => (
              <g key={k.n} onClick={() => setI(idx)} className="cursor-pointer">
                {idx === i && (
                  <circle cx={k.x} cy={k.y} r="12" fill="none" stroke="#ffb020" strokeWidth="2">
                    <animate attributeName="r" values="9;18;9" dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0;1" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={k.x} cy={k.y} r="7" fill={idx === i ? '#ffb020' : '#fff'} stroke="#060607" strokeWidth="2" />
              </g>
            ))}
          </svg>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <span className="rounded bg-amber-400 px-2 py-0.5 font-mono text-[10px] font-bold text-black">{c.tag}</span>
              <h3 className="mt-2 font-display text-4xl">{c.n}</h3>
              <p className="mt-2 max-w-xl text-sm text-white/70">{c.text}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[['APEX SPEED', `${c.kmh}`, '#ffb020'], ['APEX GEAR', `${c.gear}`, '#5b8cff'], ['PEAK LOAD', `${c.g} G`, '#ff4d5a']].map(([l, v, col]) => (
                <div key={l} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <div className="font-mono text-[8px] tracking-widest text-white/50">{l}</div>
                  <div className="font-display text-3xl" style={{ color: col }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}