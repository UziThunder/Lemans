import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { progress } from '../lib/progress'

// Sky across a full 24h race: afternoon -> sunset -> night -> dawn -> morning
const SKY = ['#2c4a78', '#7a3b2a', '#10131f', '#04050b', '#04050b', '#2b2440', '#8a5a3c', '#34506f']
const START_HOUR = 16 // race start

export function SkyBackdrop() {
  const ref = useRef(null)

  useEffect(() => {
    let last = 0
    let lastColor = ''
    let lastClock = ''
    const tick = () => {
      const now = performance.now()
      if (now - last < 100) return // ~10 updates per second is plenty for a slow sky
      last = now
      const p = progress.value

      // flat colour only; the fade-to-black gradient on top is static
      const c = gsap.utils.interpolate(SKY, p)
      if (ref.current && c !== lastColor) {
        lastColor = c
        ref.current.style.backgroundColor = c
      }

      const el = document.getElementById('race-clock')
      if (el) {
        const m = Math.floor(((START_HOUR + p * 24) % 24) * 60)
        const text = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
        if (text !== lastClock) {
          lastClock = text
          el.textContent = text
        }
      }
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0" style={{ backgroundColor: SKY[0] }}>
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #060607 68%)' }}
      />
    </div>
  )
}

export function RaceClock() {
  return (
    <div className="pointer-events-none fixed left-1/2 top-16 z-50 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-white/60">
      RACE CLOCK{' '}
      <span id="race-clock" className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
        16:00
      </span>
    </div>
  )
}