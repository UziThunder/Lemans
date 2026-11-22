// Back glow sits BEHIND the track; FrontFX (speed streaks, grain, vignette) sits ABOVE it.
const STREAKS = Array.from({ length: 16 }, (_, i) => ({
  top: 10 + ((i * 47) % 52),
  w: 14 + ((i * 7) % 20),
  dur: 0.55 + ((i * 13) % 10) / 20,
  delay: -((i * 37) % 10) / 10,
  a: 0.25 + ((i * 11) % 6) / 12,
}))

export function AmbientGlow() {
  // single static gradient tinted by the current car's accent (no mask, no extra opacity layer)
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background:
          'radial-gradient(60% 55% at 50% 58%, color-mix(in srgb, var(--accent) 17%, transparent), transparent 70%)',
      }}
    />
  )
}

export function FrontFX({ fxRef }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* opacity + visibility are driven by scroll speed from App.jsx */}
      <div ref={fxRef} className="absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>
        {STREAKS.map((s, i) => (
          <span
            key={i}
            className="streak-line absolute block h-px"
            style={{
              top: `${s.top}%`,
              left: '100%',
              width: `${s.w}vw`,
              opacity: s.a,
              background: 'linear-gradient(270deg, rgba(255,255,255,0.55), transparent)',
              animation: `streak ${s.dur}s linear ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="grain" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)' }}
      />
    </div>
  )
}