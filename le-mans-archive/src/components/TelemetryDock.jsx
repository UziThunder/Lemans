import { Cog, Gauge, Scale, Trophy, Users, Zap } from 'lucide-react'

function Stat({ icon: Icon, label, unit, value, ratio, accent }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-white/50 md:text-[10px]">
        <Icon size={12} style={{ color: accent }} />
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="js-stat font-display text-3xl leading-none md:text-5xl" data-target={value}>
          0
        </span>
        <span className="font-mono text-[9px] tracking-widest text-white/50 md:text-[10px]">{unit}</span>
      </div>
      <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="js-bar h-full origin-left rounded-full"
          data-ratio={Math.min(1, ratio)}
          style={{ background: accent, transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  )
}

export default function TelemetryDock({ car }) {
  const { accent } = car

  return (
    // No backdrop-blur here: blurring a moving background every frame was a big source of lag.
    <div
      className="js-dock absolute inset-x-4 bottom-[76px] z-30 mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/90 shadow-2xl will-change-transform md:inset-x-8"
      style={{ opacity: 0 }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="grid gap-4 p-4 md:grid-cols-[1.1fr_1.7fr_1.2fr] md:gap-8 md:p-6">
        {/* Lineup + engine */}
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl leading-none md:text-5xl" style={{ color: accent }}>
              #{car.number}
            </span>
            <span className="truncate font-mono text-[10px] tracking-[0.2em] text-white/60">{car.livery}</span>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-white/80 md:text-sm">
            <Users size={14} className="mt-0.5 shrink-0" style={{ color: accent }} />
            <span>{car.drivers.join(' · ')}</span>
          </div>
          <div className="mt-2 flex items-start gap-2 font-mono text-[11px] text-white/80 md:text-xs">
            <Cog size={14} className="mt-0.5 shrink-0" style={{ color: accent }} />
            <span>{car.engine}</span>
          </div>
        </div>

        {/* Animated stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          <Stat icon={Zap} label="POWER" unit="HP" value={car.hp} ratio={car.hp / 1000} accent={accent} />
          <Stat icon={Gauge} label="TOP SPEED" unit="KM/H" value={car.topSpeed} ratio={car.topSpeed / 400} accent={accent} />
          <Stat icon={Scale} label="WEIGHT" unit="KG" value={car.weight} ratio={car.weight / 1500} accent={accent} />
        </div>

        {/* Highlight */}
        <div className="hidden items-start gap-2 border-l border-white/10 pl-6 text-sm leading-relaxed text-white/75 md:flex">
          <Trophy size={16} className="mt-0.5 shrink-0" style={{ color: accent }} />
          <p>{car.highlight}</p>
        </div>
      </div>
    </div>
  )
}