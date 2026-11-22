import { useState } from 'react'
import { carImages } from '../data/carImages'

// Flip to true once the new files exist in public/assets/cars/
const SHOW_NEW_IMAGES = false

export default function CarImageSlot({ car, className = '', compact = false }) {
  const [broken, setBroken] = useState(false)
  const bundled = carImages[car.id] // original 10 cars (src/assets/cars)
  const src = bundled ?? (SHOW_NEW_IMAGES && !broken ? car.image : null)
  const alt = car.imageAlt ?? car.fullName

  // ============================================================
  // THE <img> GOES HERE (the first branch below).
  // New cars: public/assets/cars/<year>-<slug>.jpg, path is car.image
  // Alt text comes from car.imageAlt.
  // ============================================================
  return (
    <figure className={`relative m-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          draggable={false}
          onError={() => setBroken(true)}
          className="h-full w-full object-contain"
          style={{ filter: `drop-shadow(0 0 24px ${car.accent}66)` }}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="grid h-full w-full place-items-center rounded-xl border border-dashed p-2 text-center"
          style={{ borderColor: `${car.accent}66`, background: `${car.accent}0d` }}
        >
          {!compact && (
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] text-white/40">IMAGE SLOT</div>
              <div className="mt-1 break-all font-mono text-[10px] text-white/60">{car.image}</div>
              <div className="mx-auto mt-1 max-w-xs text-[11px] text-white/40">{alt}</div>
            </div>
          )}
        </div>
      )}
    </figure>
  )
}