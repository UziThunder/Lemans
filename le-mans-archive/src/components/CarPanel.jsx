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

  // Fit the giant name to the screen: the longer the text, the smaller the font (capped at the old size)
  const label = `${year} // ${name}`
  const fontSize = `min(11rem, 10vw, ${(200 / label.length).toFixed(2)}vw)`

  return (
    <section className="car-panel relative z-10 h-screen w-screen shrink-0" aria-label={`${year} ${car.fullName}`}>
      <h2
        className="js-big-name pointer-events-none absolute inset-x-0 top-[17vh] select-none whitespace-nowrap px-2 text-center font-display leading-none md:top-[15vh]"
        style={{
          fontSize,
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
          {label}
        </span>
        {label}
      </h2>

      {/* LAYER 2: car. On phones it is wider and sits higher so the stats dock never covers it.
          If the dock still touches the car, raise the 360px in --car-b. */}
      <div
        className="js-car absolute inset-x-0 mx-auto [--car-b:max(44vh,360px)] [--car-w:94vw] md:[--car-b:33vh] md:[--car-w:62vw]"
        style={{
          width: `calc(min(var(--car-w), 880px) * ${scale})`,
          bottom: `calc(var(--car-b) - ${sink}px)`,
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

      <TelemetryDock car={car} />
    </section>
  )
}

export default memo(CarPanel)