import { useEffect, useState } from 'react'
import CarSVG from './CarSVG'
import { carImages } from '../data/carImages'
import { getTune } from '../data/carTuning'
import { trimImage } from '../lib/trimImage'

export default function CarVisual({ car }) {
  const tune = getTune(car.id)
  const [src, setSrc] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    const bundled = carImages[car.id]

    if (!bundled) {
      console.warn(`[CarVisual] No image found for car ${car.id} (${car.fullName}). Check the filename in carImages.js and src/assets/cars/.`)
      setFailed(true)
      return undefined
    }

    trimImage(bundled)
      .then((url) => {
        if (alive) setSrc(url)
      })
      .catch((err) => {
        console.error(`[CarVisual] Failed to load image for car ${car.id} (${car.fullName}):`, bundled, err)
        if (alive) setFailed(true)
      })

    return () => {
      alive = false
    }
  }, [car.id])

  if (failed) {
    return (
      <div className="relative w-full" style={{ aspectRatio: '800 / 260' }}>
        <CarSVG car={car} />
      </div>
    )
  }

  if (!src) return <div className="relative w-full" style={{ aspectRatio: '800 / 260' }} />

  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[4%] bottom-[8%] top-[18%]"
        style={{ background: `radial-gradient(ellipse at center, ${car.accent}33, transparent 70%)` }}
      />
      <img
        src={src}
        alt={car.fullName}
        draggable={false}
        decoding="async"
        className="relative block h-auto w-full select-none"
        style={{ transform: tune.flip ? 'scaleX(-1)' : undefined }}
      />
    </div>
  )
} 