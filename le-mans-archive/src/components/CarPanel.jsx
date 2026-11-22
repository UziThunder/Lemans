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
      {/* LAYER 1: giant background name.
          Outline text + a solid copy on top. Only OPACITY animates (no per-frame colour repaint). */}
      <h2
        className="js-big-name pointer-events-none absolute inset-x-0 top-[15vh] select-none whitespace-nowrap text-center font-display leading-none text-[clamp(3.5rem,10vw,11rem)]"
        style={{
          opacity: 0,
          color: 'transparent',
          WebkitTextStroke: `2px ${hexToRgba(accent, 0.75)}`,
        }}
      >
        <span
          aria-hidden
          className="js-name-fill pointer-events-none absolute inset-0"
          style={{ opacity: 0, color: hexToRgba(accent, 0.55), WebkitTextStroke: '0' }}
        >
          {year} // {name}
        </span>
        {year} // {name}
      </h2>

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