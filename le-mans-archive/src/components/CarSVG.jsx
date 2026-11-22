// Detailed right-facing wireframe race car. Wheels use .js-wheel so GSAP can spin them.
export default function CarSVG({ car }) {
  const { accent, accent2, number, fullName } = car
  const WHEEL_Y = 194
  const wheelXs = [190, 610]

  return (
    <svg
      viewBox="0 0 800 260"
      className="absolute inset-0 h-full w-full overflow-visible"
      role="img"
      aria-label={`${fullName} wireframe`}
      style={{ filter: `drop-shadow(0 0 28px ${accent}55)` }}
    >
      {/* construction lines */}
      <g stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="4 6" fill="none">
        <line x1="10" y1="232" x2="790" y2="232" />
        <line x1="10" y1={WHEEL_Y} x2="790" y2={WHEEL_Y} />
        {wheelXs.map((x) => (
          <line key={x} x1={x} y1="70" x2={x} y2="244" />
        ))}
      </g>

      {/* rear wing (behind body) */}
      <g fill="rgba(10,10,12,0.9)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M 22 94 L 124 90 L 124 100 L 22 104 Z" />
        <path d="M 22 86 L 30 86 L 30 112 L 22 112 Z" fill={accent} stroke="none" />
        <line x1="94" y1="150" x2="88" y2="102" />
        <line x1="70" y1="152" x2="64" y2="104" />
      </g>

      {/* body */}
      <path
        d="M 62 206 L 74 152 L 250 134 Q 298 98 362 90 L 432 88 Q 482 92 520 120 L 640 142 Q 716 152 742 176 L 744 204 L 700 214 L 150 214 Z"
        fill="rgba(10,10,12,0.92)"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* livery stripes */}
      <path d="M 96 184 L 738 190 L 738 197 L 96 191 Z" fill={accent} opacity="0.9" />
      <path d="M 96 196 L 738 202 L 738 205 L 96 199 Z" fill={accent2} opacity="0.95" />

      {/* canopy glass */}
      <path
        d="M 368 102 Q 400 96 432 98 Q 468 102 492 124 L 372 126 Q 366 112 368 102 Z"
        fill={`${accent}22`}
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1.5"
      />

      {/* panel lines, intake, vents */}
      <g fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2">
        <path d="M 250 146 L 520 152 Q 545 154 565 162" />
        <path d="M 255 138 L 330 128 L 330 146 L 255 150 Z" />
        <path d="M 100 166 L 240 158" />
        <path d="M 560 146 L 640 150" />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={268 + i * 14} y1={139 - i * 2.5} x2={268 + i * 14} y2={148 - i * 0.5} />
        ))}
      </g>

      {/* number roundel */}
      <circle cx="320" cy="164" r="22" fill="#f4f4f5" />
      <text x="320" y="173" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0a0a0c" fontFamily="'Bebas Neue', Impact, sans-serif">
        {number}
      </text>

      {/* lights + splitter */}
      <path d="M 700 172 L 738 178 L 738 186 L 700 184 Z" fill={accent2} />
      <path d="M 52 176 L 66 174 L 68 188 L 54 190 Z" fill="#ff2a3a" />
      <path d="M 700 214 L 764 212 L 768 219 L 700 221 Z" fill="rgba(10,10,12,0.9)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />

      {/* suspension arms */}
      <g stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
        <line x1="190" y1={WHEEL_Y} x2="248" y2="170" />
        <line x1="190" y1={WHEEL_Y} x2="132" y2="172" />
        <line x1="610" y1={WHEEL_Y} x2="560" y2="168" />
        <line x1="610" y1={WHEEL_Y} x2="662" y2="172" />
      </g>

      {/* wheel arches */}
      <g fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
        {wheelXs.map((x) => (
          <path key={x} d={`M ${x - 54} ${WHEEL_Y} A 54 54 0 0 1 ${x + 54} ${WHEEL_Y}`} />
        ))}
      </g>

      {/* wheels */}
      {wheelXs.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={WHEEL_Y} r="38" fill="#0b0b0d" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" />
          <circle cx={cx} cy={WHEEL_Y} r="19" fill="none" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 4" />
          <g className="js-wheel">
            <circle cx={cx} cy={WHEEL_Y} r="28" fill="none" stroke={accent} strokeWidth="2" />
            {[0, 72, 144, 216, 288].map((a) => (
              <line
                key={a}
                x1={cx}
                y1={WHEEL_Y}
                x2={cx + 25 * Math.cos((a * Math.PI) / 180)}
                y2={WHEEL_Y + 25 * Math.sin((a * Math.PI) / 180)}
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
            <circle cx={cx} cy={WHEEL_Y} r="6" fill={accent} />
          </g>
        </g>
      ))}
    </svg>
  )
}