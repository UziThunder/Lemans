import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { leMansCars } from '../data/leMansCars'
import { carImages } from '../data/carImages'

gsap.registerPlugin(ScrollTrigger)

const ERAS = [
  {
    start: 1923, years: '1923 – 1939', title: 'THE BENTLEY BOYS', color: '#2fd39a',
    text: 'The first races were run by gentlemen drivers in heavy, road-derived tourers. Bentley dominated the late 1920s with five wins between 1924 and 1930.',
    stat: ['5', 'BENTLEY WINS, 1924 – 1930'], cars: [],
  },
  {
    start: 1949, years: '1949 – 1959', title: 'JAGUAR & FERRARI', color: '#4a9dff',
    text: 'Racing resumed after the war. Ferrari won in 1949, then Jaguar arrived with aerodynamic bodies and, from 1953, disc brakes.',
    stat: ['5', 'JAGUAR WINS IN THE 1950s'], cars: [],
  },
  {
    start: 1960, years: '1960 – 1969', title: 'FORD VS FERRARI', color: '#5fb4e8',
    text: 'Ford spent heavily to end Ferrari\u2019s grip on the race, then won four years in a row with the GT40.',
    stat: ['4', 'FORD WINS, 1966 – 1969'], cars: [1],
  },
  {
    start: 1970, years: '1970 – 1979', title: 'THE BIG PORSCHES', color: '#e3262e',
    text: 'The 917 delivered Porsche its first overall win in 1970. Matra-Simca then took three in a row from 1972 to 1974.',
    stat: ['1970', 'PORSCHE\u2019S FIRST OVERALL WIN'], cars: [2],
  },
  {
    start: 1982, years: '1982 – 1991', title: 'GROUP C', color: '#ffb020',
    text: 'Ground-effect, carbon-and-aluminium prototypes. Porsche\u2019s 956 and 962 ruled, Jaguar broke the run in 1988, Mercedes returned in 1989 and Mazda\u2019s rotary won in 1991.',
    stat: ['7', 'PORSCHE WINS IN A ROW, 1981 – 87'], cars: [3, 4, 5, 6],
  },
  {
    start: 1995, years: '1995 – 1999', title: 'GT MEETS PROTOTYPE', color: '#a8b0b8',
    text: 'A road-car-derived McLaren won on its debut in the rain, and BMW\u2019s open-top V12 prototype took victory in 1999.',
    stat: ['1995', 'McLAREN F1 GTR WINS ON DEBUT'], cars: [7, 8],
  },
  {
    start: 2000, years: '2000 – 2014', title: 'THE DIESEL DECADES', color: '#ff2a3a',
    text: 'Audi won with the petrol R8, then in 2006 became the first to win with a diesel. The R18 TDI carried the streak forward.',
    stat: ['13', 'AUDI WINS, 2000 – 2014'], cars: [9],
  },
  {
    start: 2015, years: '2015 – TODAY', title: 'HYBRID & HYPERCAR', color: '#9b6bff',
    text: 'Porsche\u2019s 919 Hybrid won three times, Toyota took five, and Ferrari returned to the top step in 2023.',
    stat: ['3', 'PORSCHE 919 WINS, 2015 – 2017'], cars: [10],
  },
]

export default function Eras() {
  const root = useRef(null)
  const track = useRef(null)
  const fill = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const dist = () => track.current.scrollWidth - window.innerWidth

      const tween = gsap.to(track.current, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => '+=' + dist() * 1.15,
          onUpdate: (self) => gsap.set(fill.current, { scaleX: self.progress }),
        },
      })

      gsap.utils.toArray('.era-card').forEach((card) => {
        gsap.fromTo(
          card.querySelectorAll('.era-in'),
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 80%', toggleActions: 'play none none reverse' },
          }
        )
        const year = card.querySelector('.era-year')
        if (year) {
          gsap.fromTo(
            year,
            { x: 160 },
            { x: -160, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }
          )
        }
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="eras" ref={root} className="relative h-screen w-screen overflow-hidden bg-[#060607]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(43,91,255,0.10),transparent_70%)]" />

      <div ref={track} className="flex h-full w-max items-center gap-[7vw] pl-[8vw] pr-[14vw] will-change-transform">
        {/* intro panel */}
        <div className="era-card flex w-[80vw] shrink-0 flex-col justify-center md:w-[36vw]">
          <div className="era-in font-mono text-[10px] tracking-[0.3em] text-amber-400">02 // ERAS TIMELINE</div>
          <h2 className="era-in mt-3 font-display text-6xl leading-[0.95] md:text-8xl">100 YEARS,<br />8 ERAS</h2>
          <p className="era-in mt-4 max-w-sm text-white/60">From open-top tourers to hybrid hypercars. Keep scrolling to drive through the decades.</p>
        </div>

        {ERAS.map((e) => {
          const cars = e.cars.map((id) => leMansCars.find((c) => c.id === id))
          return (
            <article key={e.years} className="era-card relative flex w-[86vw] shrink-0 flex-col justify-center md:w-[52vw]">
              <div
                className="era-year pointer-events-none absolute -top-10 left-0 select-none font-display text-[clamp(7rem,20vw,18rem)] leading-none text-transparent"
                style={{ WebkitTextStroke: `2px ${e.color}55` }}
              >
                {e.start}
              </div>
              <div className="relative">
                <div className="era-in font-mono text-[10px] tracking-[0.3em]" style={{ color: e.color }}>{e.years}</div>
                <h3 className="era-in mt-2 font-display text-5xl md:text-7xl">{e.title}</h3>
                <p className="era-in mt-4 max-w-lg text-white/70">{e.text}</p>

                <div className="era-in mt-6 flex items-baseline gap-3">
                  <span className="font-display text-6xl leading-none md:text-7xl" style={{ color: e.color }}>{e.stat[0]}</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/50">{e.stat[1]}</span>
                </div>

                {cars.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {cars.map((c) => (
                      <div key={c.id} className="era-in w-32 md:w-44">
                        <img src={carImages[c.id]} alt={c.fullName} draggable={false} className="h-20 w-full object-contain md:h-28"
                          style={{ filter: `drop-shadow(0 0 20px ${c.accent}66)` }} />
                        <div className="mt-1 font-mono text-[9px] text-white/50">{c.year}</div>
                        <div className="truncate font-display text-lg">{c.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {/* progress rail */}
      <div className="absolute inset-x-6 bottom-8 md:inset-x-16">
        <div className="relative h-px bg-white/15">
          <div ref={fill} className="absolute inset-0 origin-left bg-gradient-to-r from-blue-500 to-amber-400" style={{ transform: 'scaleX(0)' }} />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[9px] tracking-widest text-white/40">
          {ERAS.map((e) => (
            <span key={e.start}>{e.start}</span>
          ))}
        </div>
      </div>
    </section>
  )
}