import { useRef, useState } from 'react'
import { progress } from '../lib/progress'

const RED = '#ff2a3a'

export default function MiniMap({ cars, active, onSelect, onScrub, onScrubEnd }) {
  const railRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const n = cars.length
  const accent = cars[active].accent

  const fractionFrom = (e) => {
    const r = railRef.current.getBoundingClientRect()
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  }

  const onDown = (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    progress.dragging = true
    setDragging(true)
  }

  const onMove = (e) => {
    if (!progress.dragging) return
    const f = fractionFrom(e)
    progress.el?.style.setProperty('--progress', f) // move the thumb instantly
    onScrub(f) // move the track live
  }

  const onUp = (e) => {
    if (!progress.dragging) return
    progress.dragging = false
    setDragging(false)
    onScrubEnd(Math.round(fractionFrom(e) * (n - 1))) // glide to the nearest car
  }

  return (
    // --progress is set on this element only (see App.jsx), not on the whole page.
    <nav
      ref={(el) => {
        progress.el = el
      }}
      aria-label="Car timeline"
      className="fixed inset-x-0 bottom-0 z-50 h-16 border-t border-white/10 bg-black/80"
    >
      <div ref={railRef} className="relative mx-10 h-full md:mx-16">
        {/* rail */}
        <div className="absolute left-0 right-0 top-[21px] h-[3px] rounded-full bg-white/15" />
        {/* red progress fill */}
        <div
          className="absolute left-0 top-[21px] h-[3px] w-full origin-left rounded-full"
          style={{ transform: 'scaleX(var(--progress, 0))', background: RED, boxShadow: `0 0 10px ${RED}` }}
        />

        {cars.map((car, i) => {
          const isActive = i === active
          return (
            <button
              key={car.id}
              onClick={() => onSelect(i)}
              aria-label={`Go to ${car.year} ${car.fullName}`}
              className="group pointer-events-auto absolute top-0 flex h-full -translate-x-1/2 cursor-pointer flex-col items-center bg-transparent"
              style={{ left: `${(i / (n - 1)) * 100}%` }}
            >
              <span
                className="mt-[18px] block h-[9px] w-[9px] rounded-full border transition-all duration-300 group-hover:scale-150"
                style={{
                  borderColor: isActive ? accent : 'rgba(255,255,255,0.35)',
                  background: isActive ? accent : '#060607',
                  transform: isActive ? 'scale(1.5)' : undefined,
                }}
              />
              {/* with 20 cars, hide every second label on phones (the active one always shows) */}
              <span
                className={`mt-2 font-mono text-[10px] tracking-widest transition-colors duration-300 md:text-[11px]${i % 4 && !isActive ? 'hidden md:block' : ''}`}
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}
              >
                {car.year}
              </span>
            </button>
          )
        })}

        {/* RED SLIDER HANDLE: drag it left/right to drive through the cars */}
        <div
          role="slider"
          aria-label="Scrub through cars"
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={active}
          tabIndex={-1}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="absolute z-10 touch-none rounded-full border-2 border-white"
          style={{
            top: 12,
            width: 22,
            height: 22,
            marginLeft: -11,
            left: 'calc(var(--progress, 0) * 100%)',
            background: RED,
            boxShadow: `0 0 ${dragging ? 18 : 10}px ${RED}`,
            cursor: dragging ? 'grabbing' : 'grab',
            transform: dragging ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
        />
      </div>
    </nav>
  )
}