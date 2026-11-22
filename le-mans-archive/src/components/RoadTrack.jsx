import { useEffect, useRef } from 'react'
import { progress, subscribe } from '../lib/progress'

const CHEQUER = 'repeating-conic-gradient(#f5f5f5 0 25%, #111 0 50%) 0 0 / 20px 20px'
const KERB = 120 // px, pattern period
const DASH = 220
const EDGE = 80
const POSTS = Array.from({ length: 11 }, (_, i) => i)

/*
  The road is NOT inside the moving track any more. It is a fixed, screen-wide strip; on every
  scroll update only three small pattern layers and a few markers get a translateX (GPU-only).
  Km post i is centred on screen when scroll progress = i / 10, so "0 KM" opens and "5,000 KM" closes the run.
*/
export default function RoadTrack({ total, totalKm }) {
  const kerbRef = useRef(null)
  const dashRef = useRef(null)
  const edgeRef = useRef(null)
  const itemRefs = useRef([]) // 0..10 km posts, 11 start line, 12 finish line

  useEffect(() => {
    const worlds = [
      ...POSTS.map((i) => (w) => w * 0.5 + (i / 10) * (total - 1) * w),
      (w) => w * 0.12, // start line
      (w) => w * 0.5 + (total - 1) * w + w * 0.38, // finish line
    ]

    const update = (p) => {
      const w = window.innerWidth
      const x = p * (total - 1) * w
      if (kerbRef.current) kerbRef.current.style.transform = `translate3d(${-(x % KERB)}px,0,0)`
      if (dashRef.current) dashRef.current.style.transform = `translate3d(${-(x % DASH)}px,0,0)`
      if (edgeRef.current) edgeRef.current.style.transform = `translate3d(${-(x % EDGE)}px,0,0)`
      worlds.forEach((world, i) => {
        const el = itemRefs.current[i]
        if (el) el.style.transform = `translate3d(${world(w) - x}px,0,0)`
      })
    }

    update(progress.value)
    const off = subscribe(update)
    const onResize = () => update(progress.value)
    window.addEventListener('resize', onResize)
    return () => {
      off()
      window.removeEventListener('resize', onResize)
    }
  }, [total])

  const hidden = 'translate3d(-9999px,0,0)'

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[38vh] w-full">
      {/* Km posts (roadside) */}
      {POSTS.map((i) => (
        <div
          key={i}
          ref={(el) => (itemRefs.current[i] = el)}
          className="absolute bottom-full left-0 flex flex-col items-center"
          style={{ width: 120, marginLeft: -60, transform: hidden }}
        >
          <div className="whitespace-nowrap border border-white/25 bg-black/70 px-2 py-1 font-mono text-[10px] tracking-widest text-white/80">
            {Math.round((i / 10) * totalKm).toLocaleString('en-US')} KM
          </div>
          <div className="h-[6vh] w-[2px] bg-white/25" />
        </div>
      ))}

      {/* Road surface (clipped to the screen) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Asphalt + grain (static) */}
        <div
          className="absolute inset-x-0 bottom-0 top-[10px]"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px), linear-gradient(#1d1d20, #0b0b0d)',
          }}
        />

        {/* Kerb */}
        <div
          ref={kerbRef}
          className="absolute left-0 top-0 h-[10px] will-change-transform"
          style={{
            width: `calc(100vw + ${KERB}px)`,
            background: `repeating-linear-gradient(90deg,#e11d2e 0 ${KERB / 2}px,#f5f5f5 ${KERB / 2}px ${KERB}px)`,
          }}
        />

        {/* Moving dashed centre line */}
        <div
          ref={dashRef}
          className="absolute left-0 top-[46%] h-[6px] will-change-transform"
          style={{
            width: `calc(100vw + ${DASH}px)`,
            background: `repeating-linear-gradient(90deg,#f4f4f5 0 90px,transparent 90px ${DASH}px)`,
          }}
        />

        {/* Fainter edge line */}
        <div
          ref={edgeRef}
          className="absolute left-0 top-[22%] h-[2px] opacity-40 will-change-transform"
          style={{
            width: `calc(100vw + ${EDGE}px)`,
            background: `repeating-linear-gradient(90deg,#f4f4f5 0 40px,transparent 40px ${EDGE}px)`,
          }}
        />

        {/* START line (just behind the first car) */}
        <div
          ref={(el) => (itemRefs.current[11] = el)}
          className="absolute bottom-0 left-0 top-[10px] w-[40px] opacity-90"
          style={{ background: CHEQUER, transform: hidden }}
        />
        {/* FINISH line (just ahead of the last car) */}
        <div
          ref={(el) => (itemRefs.current[12] = el)}
          className="absolute bottom-0 left-0 top-[10px] w-[40px] opacity-90"
          style={{ background: CHEQUER, transform: hidden }}
        />
      </div>
    </div>
  )
}