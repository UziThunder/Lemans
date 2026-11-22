import { progress } from '../lib/progress'

export default function MiniMap({ cars, active, onSelect }) {
  const n = cars.length
  const accent = cars[active].accent

  return (
    // --progress is set on this element only (see App.jsx), not on the whole page.
    <nav
      ref={(el) => {
        progress.el = el
      }}
      aria-label="Car timeline"
      className="fixed inset-x-0 bottom-0 z-50 h-16 border-t border-white/10 bg-black/80"
    >
      <div className="relative mx-10 h-full md:mx-16">
        {/* rail */}
        <div className="absolute left-0 right-0 top-[22px] h-px bg-white/15" />
        {/* progress fill */}
        <div
          className="absolute left-0 top-[22px] h-px w-full origin-left"
          style={{ transform: 'scaleX(var(--progress, 0))', background: accent, boxShadow: `0 0 10px ${accent}` }}
        />
        {/* thumb */}
        <div
          className="absolute top-[18px] h-[9px] w-[9px] rotate-45"
          style={{ left: 'calc(var(--progress, 0) * 100%)', marginLeft: -4.5, background: accent }}
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
              <span
                className={`mt-2 font-mono text-[10px] tracking-widest transition-colors duration-300 md:text-[11px] ${i % 2 && !isActive ? 'hidden md:block' : ''}`}
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}
              >
                {car.year}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}