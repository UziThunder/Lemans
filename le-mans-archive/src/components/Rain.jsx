const DROPS = Array.from({ length: 70 }, (_, i) => ({
  left: (i * 37) % 100,
  duration: 0.5 + ((i * 13) % 10) / 25,
  delay: -((i * 29) % 10) / 10,
  height: 40 + ((i * 7) % 50),
}))

// Fades in for the cars that won in the wet. Hidden (not just transparent) otherwise,
// so the 70 animated drops cost nothing when it's dry.
export default function Rain({ on }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      style={{
        opacity: on ? 0.75 : 0,
        visibility: on ? 'visible' : 'hidden',
        transition: `opacity 1s, visibility 0s linear ${on ? '0s' : '1s'}`,
      }}
    >
      {DROPS.map((drop, i) => (
        <span
          key={i}
          className="absolute block w-px"
          style={{
            left: `${drop.left}%`,
            top: 0,
            height: drop.height,
            background: 'linear-gradient(transparent, rgba(180,200,255,0.55))',
            animation: `rainfall ${drop.duration}s linear ${drop.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}