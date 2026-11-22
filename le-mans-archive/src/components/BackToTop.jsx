import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

// Appears after scrolling down. Lifts above the car timeline bar while the showcase is on screen.
export default function BackToTop({ onClick, lifted }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={onClick}
      aria-label="Back to top"
      className="fixed left-4 z-[55] flex items-center gap-2 rounded-full border border-white/25 bg-black/80 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-white shadow-lg transition-all duration-300 hover:bg-white/15 md:left-8"
      style={{
        bottom: lifted ? 80 : 16,
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <ArrowUp size={14} />
      TOP
    </button>
  )
}