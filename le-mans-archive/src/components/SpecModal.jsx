import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { X } from 'lucide-react'
import CarImageSlot from './CarImageSlot'

export default function SpecModal({ car, open, onClose }) {
  const root = useRef(null)

  useEffect(() => {
    if (!open) return
    const ctx = gsap.context(() => {
      gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.35 })
      gsap.fromTo('.spec-in', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out', delay: 0.1 })
      gsap.fromTo('.spec-car', { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.15 })
    }, root)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      ctx.revert()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, car.id, onClose])

  if (!open) return null

  const stats = [['POWER', car.hp, 'HP'], ['TOP SPEED', car.topSpeed, 'KM/H'], ['WEIGHT', car.weight, 'KG']]

  return (
    <div ref={root} onClick={onClose} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0b0e] p-6 md:p-10"
        style={{ boxShadow: `0 0 80px ${car.accent}33` }}
      >
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full border border-white/15 p-2 hover:bg-white/10">
          <X size={16} />
        </button>

        <div className="spec-in font-mono text-[10px] tracking-[0.3em]" style={{ color: car.accent }}>
          {car.year} // #{car.number} // {car.livery.toUpperCase()}
        </div>
        <h3 className="spec-in font-display text-5xl md:text-7xl" style={{ color: car.accent }}>{car.fullName.toUpperCase()}</h3>

        {/* IMAGE SLOT: see CarImageSlot.jsx for where the <img> goes */}
        <CarImageSlot car={car} className="spec-car mx-auto my-6 h-48 w-full md:h-64" />

        <div className="spec-in grid grid-cols-3 gap-3">
          {stats.map(([l, v, u]) => (
            <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="font-mono text-[9px] tracking-[0.25em] text-white/50">{l}</div>
              <div className="font-display text-4xl md:text-5xl" style={{ color: car.accent }}>
                {v.toLocaleString('en-US')} <span className="font-mono text-xs text-white/50">{u}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="spec-in mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] text-white/50">ENGINE</div>
            <div className="mt-1 text-lg">{car.engine}</div>
            <div className="mt-5 font-mono text-[10px] tracking-[0.25em] text-white/50">DRIVERS</div>
            <div className="mt-1 text-lg">{car.drivers.join(' · ')}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] text-white/50">HISTORIC HIGHLIGHT</div>
            <p className="mt-1 leading-relaxed text-white/75">{car.highlight}</p>
          </div>
        </div>
      </div>
    </div>
  )
}