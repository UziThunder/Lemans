// Stylised 404 / empty state. Pass a `variant` to change the copy.
// Image slot: public/assets/states/<name>.png, served at /assets/states/<name>.png
// Example: /assets/states/wrong-turn.png, alt text: "Race car stuck in a gravel trap at Mulsanne"

const VARIANTS = {
  notFound: {
    code: '404',
    title: 'Wrong turn at Mulsanne.',
    body: 'That page has gone off the circuit. Head back to the grid and pick another legend.',
    cta: 'BACK TO THE GRID',
    image: '/assets/states/wrong-turn.png',
    imageAlt: 'Race car stuck in a gravel trap at Mulsanne, illustrated in flat dark style',
  },
  noCar: {
    code: '???',
    title: 'Car not found in the archive.',
    body: 'This chassis either never raced at Le Mans or hasn\u2019t been catalogued yet.',
    cta: 'VIEW ALL LEGENDS',
    image: '/assets/states/no-car.png',
    imageAlt: 'Empty pit box with a closed garage door and a single spare wheel',
  },
  noResults: {
    code: '0',
    title: 'No drivers on this grid.',
    body: 'Nobody matches that filter. Try clearing it, or look for a different year.',
    cta: 'CLEAR FILTERS',
    image: '/assets/states/no-results.png',
    imageAlt: 'Empty grid slots on a starting grid with a single red flag',
  },
}

export default function NotFound({ variant = 'notFound', onAction }) {
  const v = VARIANTS[variant] ?? VARIANTS.notFound
  const hasImage = Boolean(v.image) // flip to false if you want the text-only version

  return (
    <section
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-24 text-center"
    >
      <div className="font-display text-[clamp(6rem,22vw,14rem)] leading-none text-white/10">{v.code}</div>

      {/* IMAGE SLOT: put the stylised graphic at public/assets/states/ */}
      {hasImage && (
        <figure className="m-0 h-40 w-full max-w-md md:h-56">
          <img
            src={v.image}
            alt={v.imageAlt}
            loading="lazy"
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.parentElement.dataset.missing = 'true'
            }}
            className="h-full w-full object-contain"
          />
          <figcaption className="sr-only">{v.imageAlt}</figcaption>
        </figure>
      )}

      <h2 className="font-display text-5xl md:text-6xl">{v.title}</h2>
      <p className="max-w-md text-white/60">{v.body}</p>

      {onAction && (
        <button
          onClick={onAction}
          className="mt-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-mono text-xs tracking-widest transition hover:bg-white/15"
        >
          {v.cta}
        </button>
      )}
    </section>
  )
}