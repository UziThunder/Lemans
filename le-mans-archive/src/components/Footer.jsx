const INSTAGRAM_URL = 'https://www.instagram.com/uzithunder/'

// Inline SVG, so it doesn't depend on which icons your lucide-react version ships
function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

export default function Footer() {
  return (
    <>
      {/* Always-visible corner button (sits behind the car timeline bar while you are inside the showcase) */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-[45] flex items-center gap-2 rounded-full border border-white/25 bg-black/80 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-white shadow-lg transition hover:bg-white/15"
      >
        <InstagramIcon size={14} />
        CONTACT DEV
      </a>

      <footer className="relative overflow-hidden border-t border-white/10 px-6 pb-12 pt-20 md:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(43,91,255,0.18),transparent_70%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 text-center">
          <div className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-none tracking-wide">
            LE MANS <span className="text-white/30">//</span> ARCHIVE
          </div>

          <p className="font-mono text-xs tracking-[0.3em] text-white/70 md:text-sm">
            MADE BY <span className="text-white">USMAN AHMED IDRISI</span>
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-3 font-mono text-xs tracking-[0.25em] text-white transition hover:bg-blue-500"
          >
            <InstagramIcon />
            CONTACT DEV
          </a>

          <div className="font-mono text-[10px] tracking-[0.25em] text-white/35">@UZITHUNDER ON INSTAGRAM</div>
        </div>
      </footer>
    </>
  )
}