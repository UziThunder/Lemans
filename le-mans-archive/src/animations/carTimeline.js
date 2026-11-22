import gsap from 'gsap'
import { getTune } from '../data/carTuning'

/*
  Timeline unit u (scrubbed via containerAnimation), 1 unit = 100vw of horizontal travel:
    u = 0  panel's left edge at the right of the screen
    u = 1  panel centred
    u = 2  panel fully gone left

  Per car:
    E0..E1  car drives in            (0.10 -> 0.60)
    HOLD    E1..X0                   (0.60 -> 1.10)  car + name + dock pinned at centre
    X0..X1  car + name RECEDE back   (1.10 -> 1.45)  shrink, dim, fade

  PERFORMANCE: only transform + opacity are animated. No filters, no colour tweens.
*/
const E0 = 0.1, E1 = 0.6
const X0 = 1.1, X1 = 1.45
const N_IN = [0.05, 0.6], N_OUT = [1.1, 1.45]
const D_IN = [0.5, 0.74], D_OUT = [1.1, 1.3]
const COUNT = [0.5, 0.74]
const BACK = 0.7
const FILL_END = 0.1 // opacity of the solid name fill once the car has gone to the back

const vw = () => window.innerWidth / 100
const seg = (u, a, b) => gsap.utils.clamp(0, 1, (u - a) / (b - a))
const easeIn = gsap.parseEase('power3.out')
const easeBack = gsap.parseEase('power2.inOut')
const easeName = gsap.parseEase('power2.out')

const getTargets = (panel) => ({
  name: panel.querySelector('.js-big-name'),
  fill: panel.querySelector('.js-name-fill'),
  car: panel.querySelector('.js-car'),
  drive: panel.querySelector('.js-drive'),
  shadow: panel.querySelector('.js-shadow'),
  wheels: panel.querySelectorAll('.js-wheel'),
  dock: panel.querySelector('.js-dock'),
  stats: panel.querySelectorAll('.js-stat'),
  bars: panel.querySelectorAll('.js-bar'),
})

/* Horizontal placement in SCREEN space (panel travel subtracted so layers hold still). */
function place(t, u, dir) {
  const k = vw()
  const off = (1 - u) * 100

  let s = 0
  if (u < E1) s = -dir * 70 * (1 - easeIn(seg(u, E0, E1)))
  else if (u > X0) s = dir * 8 * easeBack(seg(u, X0, X1))
  gsap.set(t.car, { x: (s - off) * k })

  let n = 0
  if (u < N_IN[1]) n = 26 * (1 - easeName(seg(u, N_IN[0], N_IN[1])))
  else if (u > N_OUT[0]) n = -8 * easeBack(seg(u, N_OUT[0], N_OUT[1]))
  gsap.set(t.name, { x: (n - off) * k })

  gsap.set(t.dock, { x: -off * k })
}

function addCount(tl, t, at, dur) {
  t.stats.forEach((el) => {
    const obj = { v: 0 }
    tl.fromTo(
      obj,
      { v: 0 },
      {
        v: Number(el.dataset.target),
        ease: 'power1.out',
        duration: dur,
        onUpdate: () => {
          el.textContent = Math.round(obj.v).toLocaleString('en-US')
        },
      },
      at
    )
  })
  tl.fromTo(t.bars, { scaleX: 0 }, { scaleX: (i, el) => Number(el.dataset.ratio), ease: 'power2.out', duration: dur }, at)
}

export function buildCarTimeline(panel, scrollTween, car, index, total) {
  const t = getTargets(panel)
  const dir = getTune(car.id).facing === 'right' ? 1 : -1
  const isFirst = index === 0
  const isLast = index === total - 1
  const base = isFirst ? 1 : 0
  const end = isLast ? 1 : 2

  gsap.set([t.car, t.drive], { transformOrigin: '50% 100%' })
  gsap.set(t.name, { transformOrigin: '50% 60%' })
  if (t.wheels.length) gsap.set(t.wheels, { transformOrigin: '50% 50%' })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: panel,
      containerAnimation: scrollTween,
      scrub: true,
      start: isFirst ? 'left left' : 'left right',
      end: isLast ? 'left left' : 'right left',
    },
  })

  const add = (target, from, to, [a, b], ease = 'none', exit = false) =>
    tl.fromTo(target, from, { ...to, ease, duration: b - a, ...(exit ? { immediateRender: false } : {}) }, a - base)

  // ---------- ENTER ----------
  if (!isFirst) {
    add(t.name, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1 }, N_IN, 'power2.out')
    add(t.fill, { opacity: 0 }, { opacity: 1 }, N_IN, 'power2.out') // outline -> solid
    add(t.car, { opacity: 0 }, { opacity: 1 }, [E0, E0 + 0.14])
    add(t.car, { skewX: -8 * dir }, { skewX: 0 }, [E0, E1], 'power2.inOut')
    add(t.shadow, { scaleX: 1.6 }, { scaleX: 1 }, [E0, E1], 'power2.out')
    add(t.dock, { y: 100, opacity: 0 }, { y: 0, opacity: 1 }, D_IN, 'power3.out')
    addCount(tl, t, COUNT[0] - base, COUNT[1] - COUNT[0])
  }

  // ---------- EXIT (car AND name go to the back together) ----------
  if (!isLast) {
    add(t.name, { opacity: 1, scale: 1 }, { opacity: 0, scale: BACK }, N_OUT, 'power2.in', true)
    add(t.fill, { opacity: 1 }, { opacity: FILL_END }, N_OUT, 'none', true)
    add(t.car, { scale: 1, y: 0 }, { scale: BACK, y: -30 }, [X0, X1], 'power2.in', true)
    add(t.car, { skewX: 0 }, { skewX: 4 * dir }, [X0, X1], 'power2.in', true)
    add(t.car, { opacity: 1 }, { opacity: 0 }, [X0 + 0.05, X1], 'none', true)
    add(t.shadow, { scaleX: 1 }, { scaleX: 0.6 }, [X0, X1], 'power2.in', true)
    add(t.dock, { y: 0, opacity: 1 }, { y: 60, opacity: 0 }, D_OUT, 'power2.in', true)
  }

  // SVG fallback only: wheels spin while the car is on screen
  if (t.wheels.length) {
    const a = isFirst ? 1 : E0
    const b = Math.min(X1, end)
    tl.fromTo(t.wheels, { rotation: 0 }, { rotation: 2600 * dir, ease: 'none', duration: b - a }, a - base)
  }

  // One linear proxy tween drives x for car / name / dock
  const p = { u: base }
  tl.fromTo(p, { u: base }, { u: end, ease: 'none', duration: end - base, onUpdate: () => place(t, p.u, dir) }, 0)
  place(t, base, dir)

  // ---------- First car: timed intro ----------
  let intro = null
  if (isFirst) {
    const k = vw()
    intro = gsap.timeline({ paused: true })
    intro.fromTo(
      t.name,
      { x: 26 * k, scale: 0.7, opacity: 0 },
      { x: 0, scale: 1, opacity: 1, duration: 1.9, ease: 'power2.out' },
      0.15
    )
    intro.fromTo(t.fill, { opacity: 0 }, { opacity: 1, duration: 1.9, ease: 'power2.out' }, 0.15)
    intro.fromTo(
      t.drive,
      { x: -dir * 70 * k, opacity: 0 },
      { x: 0, opacity: 1, duration: 2.3, ease: 'power3.out' },
      0
    )
    intro.fromTo(t.drive, { skewX: -8 * dir }, { skewX: 0, duration: 1.6, ease: 'power2.inOut' }, 0.8)
    intro.fromTo(t.shadow, { scaleX: 1.6 }, { scaleX: 1, duration: 2, ease: 'power2.out' }, 0)
    intro.fromTo(t.dock, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 1.6)
    addCount(intro, t, 1.65, 1.6)
  }

  return { tl, intro }
}