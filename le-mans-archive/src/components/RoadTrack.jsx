const CHEQUER = 'repeating-conic-gradient(#f5f5f5 0 25%, #111 0 50%) 0 0 / 20px 20px'

// Lives INSIDE the translating track, so asphalt, dashes and km posts scroll 1:1 with the panels.
// Post i is centred on screen when scroll progress = i / 10, so "0 KM" opens and "5,000 KM" closes the run.
export default function RoadTrack({ total, totalKm }) {
  const posts = Array.from({ length: 11 }, (_, i) => i)

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[38vh]" style={{ width: `${total * 100}vw` }}>
      {/* Km posts */}
      {posts.map((i) => (
        <div
          key={i}
          className="absolute bottom-full flex flex-col items-center"
          style={{ left: `calc(50vw + ${(i / 10) * (total - 1) * 100}vw)`, width: 120, marginLeft: -60 }}
        >
          <div className="whitespace-nowrap border border-white/25 bg-black/70 px-2 py-1 font-mono text-[10px] tracking-widest text-white/80">
            {Math.round((i / 10) * totalKm).toLocaleString('en-US')} KM
          </div>
          <div className="h-[6vh] w-[2px] bg-white/25" />
        </div>
      ))}

      {/* Kerb */}
      <div
        className="absolute inset-x-0 top-0 h-[10px]"
        style={{ background: 'repeating-linear-gradient(90deg,#e11d2e 0 60px,#f5f5f5 60px 120px)' }}
      />

      {/* Asphalt + grain */}
      <div
        className="absolute inset-x-0 bottom-0 top-[10px]"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px), linear-gradient(#1d1d20, #0b0b0d)',
        }}
      />

      {/* Moving dashed centre line */}
      <div
        className="absolute inset-x-0 top-[46%] h-[6px]"
        style={{ background: 'repeating-linear-gradient(90deg,#f4f4f5 0 90px,transparent 90px 220px)' }}
      />
      {/* Fainter edge line */}
      <div
        className="absolute inset-x-0 top-[22%] h-[2px] opacity-40"
        style={{ background: 'repeating-linear-gradient(90deg,#f4f4f5 0 40px,transparent 40px 80px)' }}
      />

      {/* START line (just behind the first car) */}
      <div className="absolute bottom-0 top-[10px] w-[40px] opacity-90" style={{ left: '12vw', background: CHEQUER }} />
      {/* FINISH line (just ahead of the last car) */}
      <div
        className="absolute bottom-0 top-[10px] w-[40px] opacity-90"
        style={{ left: `calc(50vw + ${(total - 1) * 100}vw + 38vw)`, background: CHEQUER }}
      />
    </div>
  )
}