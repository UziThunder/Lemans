import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ChevronsDown, Flag, Gauge } from 'lucide-react'

export default function HUD({ active, total, kmRef, speedRef }) {
  const numRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(numRef.current, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
  }, [active])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 py-5 md:px-10">
      <div>
        <div className="flex items-center gap-3">
          <Flag size={16} style={{ color: 'var(--accent)' }} />
          <span className="font-mono text-xs font-bold tracking-[0.35em] md:text-sm">LE MANS // ARCHIVE</span>
        </div>
        <div className="mt-2 flex items-center gap-4 font-mono text-[10px] tracking-widest text-white/50">
          <span className="flex items-center gap-1.5">
            <Gauge size={12} />
            <span ref={kmRef}>0</span> KM
          </span>
          <span className="flex items-baseline gap-1.5 text-white/60">
            <span ref={speedRef} className="min-w-[3ch] text-right text-sm font-bold" style={{ color: 'var(--accent)' }}>
              0
            </span>
            KM/H
          </span>
        </div>
      </div>

      <div className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-white/40 md:flex">
        <ChevronsDown size={14} className="animate-bounce" />
        SCROLL OR USE ← →
      </div>

      <div className="text-right">
        <div className="font-mono text-[10px] tracking-[0.3em] text-white/50">SECTOR / CAR</div>
        <div className="mt-1 flex items-baseline justify-end gap-2 font-display text-4xl leading-none">
          <span ref={numRef} style={{ color: 'var(--accent)' }}>
            {pad(active + 1)}
          </span>
          <span className="text-white/40">/ {pad(total)}</span>
        </div>
      </div>
    </header>
  )
}