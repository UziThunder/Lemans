import { f1CarTags } from './f1Crossover'
import { extraCars } from './leMansCarsExtra'

/** "#RRGGBB" -> "rgba(r,g,b,a)" (lets GSAP tween transparent -> colour cleanly) */
export const hexToRgba = (hex, a = 1) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

// The original 10 cars. Their images are bundled via src/data/carImages.js.
// Per-car size/direction tuning lives in src/data/carTuning.js.
const baseCars = [
  {
    id: 1, year: 1969, number: 6,
    name: 'FORD GT40 MK I', fullName: 'Ford GT40 Mk I',
    livery: 'Gulf Blue / Orange',
    accent: '#5fb4e8', accent2: '#ff7a1a',
    drivers: ['Jacky Ickx', 'Jackie Oliver'],
    engine: '4.9L Ford V8',
    hp: 425, topSpeed: 320, weight: 1020,
    highlight: 'Won by just 120 metres, the closest finish in Le Mans history, in the same chassis that won in 1968.',
    image: '/cars/ford-gt40.png',
  },
  {
    id: 2, year: 1970, number: 23,
    name: 'PORSCHE 917K', fullName: 'Porsche 917K',
    livery: 'Salzburg Red / White',
    accent: '#e3262e', accent2: '#f4f4f5',
    drivers: ['Hans Herrmann', 'Richard Attwood'],
    engine: '4.5L Air-Cooled Flat-12',
    hp: 580, topSpeed: 362, weight: 800,
    highlight: 'Delivered Porsche its first-ever overall Le Mans victory in a rain-soaked, attrition-heavy race.',
    image: '/cars/porsche-917k.png',
  },
  {
    id: 3, year: 1982, number: 1,
    name: 'PORSCHE 956', fullName: 'Porsche 956',
    livery: 'Rothmans',
    accent: '#2d6bff', accent2: '#f4c20d',
    drivers: ['Jacky Ickx', 'Derek Bell'],
    engine: '2.65L Twin-Turbo Flat-6',
    hp: 620, topSpeed: 360, weight: 820,
    highlight: 'The Group C ground-effect pioneer, built around an aluminium monocoque, that won at Le Mans on debut and dominated for years.',
    image: '/cars/porsche-956.png',
  },
  {
    id: 4, year: 1988, number: 2,
    name: 'JAGUAR XJR-9LM', fullName: 'Jaguar XJR-9LM',
    livery: 'Silk Cut Purple / White',
    accent: '#9b30ff', accent2: '#f4f4f5',
    drivers: ['Jan Lammers', 'Johnny Dumfries', 'Andy Wallace'],
    engine: '7.0L V12',
    hp: 750, topSpeed: 391, weight: 900,
    highlight: 'Ended Porsche\u2019s run of seven straight wins and gave Jaguar its first Le Mans victory since 1957.',
    image: '/cars/jaguar-xjr9.png',
  },
  {
    id: 5, year: 1989, number: 63,
    name: 'SAUBER C9', fullName: 'Sauber-Mercedes C9',
    livery: 'Silver Arrow',
    accent: '#c9d1d9', accent2: '#00a3a3',
    drivers: ['Jochen Mass', 'Manuel Reuter', 'Stanley Dickens'],
    engine: '5.0L Twin-Turbo V8',
    hp: 720, topSpeed: 360, weight: 905,
    highlight: 'Mercedes-Benz returned to Le Mans and won for the first time since 1952, reviving the Silver Arrows.',
    image: '/cars/sauber-c9.png',
  },
  {
    id: 6, year: 1991, number: 55,
    name: 'MAZDA 787B', fullName: 'Mazda 787B',
    livery: 'Renown Orange / Green',
    accent: '#ff6a13', accent2: '#00a651',
    drivers: ['Volker Weidler', 'Johnny Herbert', 'Bertrand Gachot'],
    engine: '2.6L R26B 4-Rotor',
    hp: 700, topSpeed: 330, weight: 830,
    highlight: 'The first Japanese manufacturer to win Le Mans, and the only rotary-engined winner in history.',
    image: '/cars/mazda-787b.png',
  },
  {
    id: 7, year: 1995, number: 59,
    name: 'McLAREN F1 GTR', fullName: 'McLaren F1 GTR',
    livery: 'Ueno Clinic Grey',
    accent: '#a8b0b8', accent2: '#e0b040',
    drivers: ['Yannick Dalmas', 'J.J. Lehto', 'Masanori Sekiya'],
    engine: '6.1L BMW V12',
    hp: 600, topSpeed: 320, weight: 1020,
    highlight: 'A road-car-derived GT took overall victory on the model\u2019s Le Mans debut, in torrential rain.',
    image: '/cars/mclaren-f1-gtr.png',
  },
  {
    id: 8, year: 1999, number: 15,
    name: 'BMW V12 LMR', fullName: 'BMW V12 LMR',
    livery: 'Open-Top Prototype',
    accent: '#1c69d4', accent2: '#e22718',
    drivers: ['Pierluigi Martini', 'Joachim Winkelhock', 'Yannick Dalmas'],
    engine: '6.0L V12',
    hp: 580, topSpeed: 340, weight: 900,
    highlight: 'BMW\u2019s open-top prototype won outright in 1999, a result that paved the way for the marque\u2019s later Le Mans programmes.',
    image: '/cars/bmw-v12-lmr.png',
  },
  {
    id: 9, year: 2011, number: 2,
    name: 'AUDI R18 TDI', fullName: 'Audi R18 TDI',
    livery: 'Ultra-Lightweight Carbon Diesel',
    accent: '#ff2a3a', accent2: '#c0c6cc',
    drivers: ['Marcel Fässler', 'André Lotterer', 'Benoît Tréluyer'],
    engine: '3.7L Twin-Turbo V6 TDI',
    hp: 550, topSpeed: 330, weight: 900,
    highlight: 'Held off two factory Peugeots by just 13.8 seconds in one of the closest modern finishes at Le Mans.',
    image: '/cars/audi-r18.png',
  },
  {
    id: 10, year: 2016, number: 2,
    name: 'PORSCHE 919', fullName: 'Porsche 919 Hybrid',
    livery: 'Porsche Works',
    accent: '#e4002b', accent2: '#e9eef3',
    drivers: ['Romain Dumas', 'Neel Jani', 'Marc Lieb'],
    engine: '2.0L Turbo V4 + Hybrid ERS',
    hp: 900, topSpeed: 340, weight: 875,
    highlight: 'Inherited a last-lap victory when the leading Toyota stopped on the final lap, giving Porsche its 18th overall win.',
    image: '/cars/porsche-919.png',
  },
]

// Chronological order = drive order along the track
// Chronological order = drive order along the track.
// Each car gets f1History.hasF1Link from f1CarTags, merged with any existing f1History.
export const leMansCars = [...baseCars, ...extraCars]
  .map((c) => ({
    ...c,
    f1History: { ...(c.f1History ?? {}), hasF1Link: Boolean(f1CarTags[c.id]) },
  }))
  .sort((a, b) => a.year - b.year || a.id - b.id)