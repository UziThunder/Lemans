import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { carImages } from '../data/carImages'
import { leMansCars } from '../data/leMansCars'
import { trimImage } from '../lib/trimImage'

// Race-start intro: 5 red lights, then "lights out". Also preloads every bundled car image.
export default function StartLights({ onGo }) {
  const rootRef = useRef(null)
  const lightsRef = useRef([])
  const goRef = useRef(null)
  const loadRef = useRef(null)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let cancelled = false
    const srcs = Object.values(carImages)
    let loaded = 0
    const loads = Promise.all(
      srcs.map((s) =>
        trimImage(s)
          .catch(() => null)
          .then(() => {
            loaded += 1
            if (!cancelled) setPct(Math.round((loaded / srcs.length) * 100))
          })
      )
    )

    const lights = lightsRef.current
    const lightsOn = new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve })
      lights.forEach((el, i) =>
        tl.to(el, { backgroundColor: '#ff1f2d', boxShadow: '0 0 26px 6px rgba(255,31,45,0.65)', duration: 0.1 }, 0.4 + i * 0.5)
      )
      tl.to({}, { duration: 0.6 })
    })

    ;(async () => {
      await Promise.all([lightsOn, loads])
      if (cancelled) return
      gsap
        .timeline()
        .to(lights, { backgroundColor: '#17171a', boxShadow: '0 0 0 0 rgba(0,0,0,0)', duration: 0.06 })
        .to(loadRef.current, { opacity: 0, duration: 0.1 }, 0)
        .fromTo(goRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' }, 0)
        .call(onGo, null, 0.15)
        .to(rootRef.current, { opacity: 0, duration: 0.8, delay: 0.2, ease: 'power2.inOut' })
        .set(rootRef.current, { display: 'none' })
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060607]">
      <div className="font-mono text-xs font-bold tracking-[0.5em] text-white/80 md:text-sm">LE MANS // ARCHIVE</div>
      <div className="mt-2 font-mono text-[10px] tracking-[0.35em] text-white/35">{leMansCars.length} LEGENDS · 5,000 KM</div>

      <div className="mt-12 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:gap-5 md:p-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            ref={(el) => (lightsRef.current[i] = el)}
            className="h-9 w-9 rounded-full border border-white/10 bg-[#17171a] md:h-14 md:w-14"
          />
        ))}
      </div>

      <div className="relative mt-10 h-10 w-full">
        <div ref={loadRef} className="absolute inset-0 grid place-items-center font-mono text-[10px] tracking-[0.3em] text-white/50">
          LOADING GRID {pct}%
        </div>
        <div
          ref={goRef}
          className="absolute inset-0 grid place-items-center font-display text-4xl tracking-[0.3em] text-white"
          style={{ opacity: 0 }}
        >
          LIGHTS OUT
        </div>
      </div>
    </div>
  )
}