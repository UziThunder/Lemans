import { memo } from 'react'
import { hexToRgba } from '../data/leMansCars'
import { getTune } from '../data/carTuning'
import CarVisual from './CarVisual'
import TelemetryDock from './TelemetryDock'

// `near` = this car is the active one or within 2 slots of it. Far cars skip the image
// entirely, which keeps 20 panels light.
function CarPanel({ car, near }) {
  const { accent, name, year } = car
  const { scale, sink } = getTune(car.id)

  return (
    <section className="car-panel relative z-10 h-screen w-screen shrink-0" aria-label={`${year} ${car.fullName}`}>
      {/* LAYER 1: giant background name */}
      <h2
        className="js-big-name pointer-events-none absolute inset-x-0 top-[15vh] select-none whitespace-nowrap text-center font-display leading-none text-[clamp(3.5rem,10vw,11rem)] will-change-transform"
        style={{
          opacity: 0,
          color: 'transparent',
          WebkitTextStroke: `2px ${hexToRgba(accent, 0.75)}`,
        }}
      >
        {year} // {name}
      </h2>
      {/* F1 crossover tag (from f1History.hasF1Link) */}
      {car.f1History?.hasF1Link && (
        <div className="absolute right-6 top-[calc(15vh+clamp(3.5rem,10vw,11rem)+1rem)] z-20 rounded-md border border-blue-400/50 bg-blue-500/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.25em] text-blue-200 md:right-12">
          F1 CROSSOVER
        </div>
      )}
      {/* LAYER 2: car */}
      <div
        className="js-car absolute inset-x-0 mx-auto"
        style={{
          width: `calc(min(62vw, 880px) * ${scale})`,
          bottom: `calc(33vh - ${sink}px)`,
        }}
      >
        <div className="js-drive relative">
          <div
            className="js-shadow pointer-events-none absolute -bottom-2 inset-x-[4%] h-8"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, transparent 70%)' }}
          />
          {near ? <CarVisual car={car} /> : <div className="w-full" style={{ aspectRatio: '800 / 260' }} />}
        </div>
      </div>

      {/* LAYER 3: bottom telemetry dock */}
      <TelemetryDock car={car} />
    </section>
  )
}

export default memo(CarPanel) 