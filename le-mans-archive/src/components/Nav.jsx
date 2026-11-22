import { useEffect, useState } from 'react'

const LINKS = [['hero', 'HOME'], ['eras', 'ERAS'], ['showcase', 'LEGENDS'], ['circuit', 'CIRCUIT'], ['fame', 'HALL OF FAME'], ['compare', 'COMPARE']]
const INSTAGRAM_URL = 'https://www.instagram.com/uzithunder/'

// Sticky nav with active-section highlight. Hidden while the showcase HUD is on screen.
export default function Nav({ visible, onJump }) {
  const [cur, setCur] = useState('hero')

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setCur(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 border-b border-white/10 bg-black/50 px-5 py-3 backdrop-blur-xl transition-transform duration-500 md:px-10"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
    >
      <button onClick={() => onJump('hero')} className="font-mono text-xs font-bold tracking-[0.35em]">
        LE MANS // ARCHIVE
      </button>

      <nav className="hidden gap-1 md:flex">
        {LINKS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => onJump(id)}
            className={`rounded-lg px-4 py-2 font-mono text-[10px] tracking-[0.25em] transition ${cur === id ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </nav>

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-mono text-[10px] tracking-[0.25em] transition hover:bg-white/15"
      >
        CONTACT DEV
      </a>
    </header>
  )
}