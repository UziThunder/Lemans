import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const LINKS = [['hero', 'HOME'], ['eras', 'ERAS'], ['showcase', 'LEGENDS'], ['circuit', 'CIRCUIT'], ['fame', 'HALL OF FAME'], ['compare', 'COMPARE'], ['f1-crossover', 'F1']]
const INSTAGRAM_URL = 'https://www.instagram.com/uzithunder/'

// Sticky nav with active-section highlight. Hidden while the showcase HUD is on screen.
// On phones the links live in a dropdown opened by the menu button.
export default function Nav({ visible, onJump }) {
  const [cur, setCur] = useState('hero')
  const [open, setOpen] = useState(false)

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

  useEffect(() => {
    if (!visible) setOpen(false)
  }, [visible])

  const go = (id) => {
    setOpen(false)
    onJump(id)
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl transition-transform duration-500"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-10">
        <button onClick={() => go('hero')} className="font-mono text-[10px] font-bold tracking-[0.25em] md:text-xs md:tracking-[0.35em]">
          LE MANS // ARCHIVE
        </button>

        <nav className="hidden gap-1 md:flex">
          {LINKS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`rounded-lg px-3 py-2 font-mono text-[10px] tracking-[0.2em] transition lg:px-4 lg:tracking-[0.25em] ${cur === id ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </nav>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-mono text-[10px] tracking-[0.25em] transition hover:bg-white/15 md:block"
        >
          CONTACT DEV
        </a>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/20 bg-white/5 md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* mobile dropdown */}
      {open && (
        <div className="border-t border-white/10 bg-black/90 px-4 pb-4 pt-3 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {LINKS.map(([id, label]) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`rounded-lg border px-3 py-3 text-left font-mono text-[11px] tracking-[0.2em] ${
                  cur === id ? 'border-blue-400/60 bg-blue-600 text-white' : 'border-white/10 bg-white/5 text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-lg border border-white/20 bg-white/5 px-3 py-3 text-center font-mono text-[11px] tracking-[0.2em]"
          >
            CONTACT DEV
          </a>
        </div>
      )}
    </header>
  )
}