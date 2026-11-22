import F1Crossover from './components/F1Crossover'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Volume2, VolumeX } from 'lucide-react'

import { leMansCars } from './data/leMansCars'
import { buildCarTimeline } from './animations/carTimeline'
import { initScrollFx } from './animations/scrollFx'
import { progress } from './lib/progress'
import * as engine from './lib/engineAudio'
import HUD from './components/HUD'
import MiniMap from './components/MiniMap'
import RoadTrack from './components/RoadTrack'
import CarPanel from './components/CarPanel'
import StartLights from './components/StartLights'
import Hero from './components/Hero'
import Eras from './components/Eras'
import Circuit from './components/Circuit'
import HallOfFame from './components/HallOfFame'
import Compare from './components/Compare'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import Nav from './components/Nav'
import Rain from './components/Rain'
import SpecModal from './components/SpecModal'
import { SkyBackdrop, RaceClock } from './components/DayNight'
import { AmbientGlow, FrontFX } from './components/Atmosphere'

gsap.registerPlugin(ScrollTrigger)

// Memoised so a car change (App state) doesn't re-render the big sections that never change
const NavM = memo(Nav)
const HeroM = memo(Hero)
const ErasM = memo(Eras)
const CircuitM = memo(Circuit)
const HallOfFameM = memo(HallOfFame)
const CompareM = memo(Compare)
const F1CrossoverM = memo(F1Crossover)
const FooterM = memo(Footer)

const SCROLL_LENGTH = 2.0 // vertical scroll per 100vw of horizontal travel
const TOTAL_KM = 5000
const MAX_KMH = 340
const SNAP = true
const WET_CARS = [2, 7] // 1970 Porsche 917K, 1995 McLaren F1 GTR: both won in the rain
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

export default function App() {
  const total = leMansCars.length
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const kmRef = useRef(null)
  const speedRef = useRef(null)
  const fxRef = useRef(null)
  const lenisRef = useRef(null)
  const stRef = useRef(null)
  const introRef = useRef(null)
  const activeRef = useRef(0)
  const inShowRef = useRef(false)
  const snapUntil = useRef(0)
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const [inShow, setInShow] = useState(false)
  const [specOpen, setSpecOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(false)

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const lenis = new Lenis({ lerp: 0.075, smoothWheel: true })
    lenis.stop()
    lenisRef.current = lenis

    let snapTimer
    let speed = 0
    let shownSpeed = -1
    let fxOn = false

    const onScroll = () => {
      ScrollTrigger.update()
      if (!SNAP) return
      clearTimeout(snapTimer)
      snapTimer = setTimeout(() => {
        const st = stRef.current
        if (!st || progress.dragging || performance.now() < snapUntil.current) return
        const range = st.end - st.start
        const prog = (lenis.scroll - st.start) / range
        if (prog < 0 || prog > 1) return
        const idx = Math.round(prog * (total - 1))
        const target = st.start + (idx / (total - 1)) * range
        if (Math.abs(target - lenis.scroll) < 4) return
        snapUntil.current = performance.now() + 1600
        lenis.scrollTo(target, { duration: 1.4, easing: easeOutQuart })
      }, 320)
    }
    lenis.on('scroll', onScroll)

    const tick = (time) => {
      lenis.raf(time * 1000)
      const target = inShowRef.current ? Math.min(MAX_KMH, Math.abs(lenis.velocity) * 5) : 0
      speed += (target - speed) * 0.08
      if (speed < 0.5) speed = 0

      // only touch the DOM when something actually changed
      const rounded = Math.round(speed)
      if (rounded !== shownSpeed) {
        shownSpeed = rounded
        if (speedRef.current) speedRef.current.textContent = rounded
      }
      const show = speed > 3
      if (fxRef.current) {
        if (show !== fxOn) {
          fxOn = show
          fxRef.current.style.visibility = show ? 'visible' : 'hidden'
        }
        if (show) fxRef.current.style.opacity = String((speed / MAX_KMH) * 0.9)
      }

      engine.update(Math.min(1, speed / MAX_KMH)) // scroll speed = throttle
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.car-panel')

      const scrollTween = gsap.to(trackRef.current, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 0.6, // Lenis already smooths the input, so keep this low
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => '+=' + window.innerWidth * (panels.length - 1) * SCROLL_LENGTH,
          onToggle: (self) => {
            inShowRef.current = self.isActive
            setInShow(self.isActive)
          },
        },
        onUpdate() {
          const p = this.progress()
          // --progress goes ONLY to the mini-map (not the page root). While the red slider is being
          // dragged, the slider sets it itself.
          progress.value = p
          if (!progress.dragging) progress.el?.style.setProperty('--progress', p)
          progress.subs.forEach((fn) => fn(p)) // moves the road
          if (kmRef.current) kmRef.current.textContent = Math.round(p * TOTAL_KM).toLocaleString('en-US')
          const idx = Math.round(p * (panels.length - 1))
          if (idx !== activeRef.current) {
            activeRef.current = idx
            setActive(idx)
          }
        },
      })
      stRef.current = scrollTween.scrollTrigger

      panels.forEach((panel, i) => {
        const { intro } = buildCarTimeline(panel, scrollTween, leMansCars[i], i, panels.length)
        if (i === 0) introRef.current = intro
      })

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => introRef.current?.play(0),
      })
    }, wrapperRef)

    return () => {
      clearTimeout(snapTimer)
      ctx.revert()
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    const fx = initScrollFx()
    return () => fx.revert()
  }, [])

  // Scroll is locked until the start lights go out, and while the spec sheet is open
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (ready && !specOpen) lenis.start()
    else lenis.stop()
  }, [ready, specOpen])

  // Engine sound: follows the current car, only audible inside the showcase
  const car = leMansCars[active]
  useEffect(() => {
    engine.setCar(car.id)
  }, [car.id])
  useEffect(() => {
    engine.setEnabled(soundOn && inShow)
  }, [soundOn, inShow])
  useEffect(() => () => engine.setEnabled(false), [])

  const toggleSound = () => {
    if (!soundOn) engine.unlock() // must run inside the click
    setSoundOn((s) => !s)
  }

  const goTo = useCallback(
    (i) => {
      const st = stRef.current
      const lenis = lenisRef.current
      if (!st || !lenis) return
      const target = st.start + (i / (total - 1)) * (st.end - st.start)
      snapUntil.current = performance.now() + 3200
      lenis.scrollTo(target, { duration: 2.6, easing: easeOutQuart })
    },
    [total]
  )

  // Red slider: follow the pointer instantly while dragging
  const scrubTo = useCallback((fraction) => {
    const st = stRef.current
    const lenis = lenisRef.current
    if (!st || !lenis) return
    snapUntil.current = performance.now() + 1000
    lenis.scrollTo(st.start + fraction * (st.end - st.start), { immediate: true, force: true })
  }, [])

  // Red slider released: glide to the nearest car
  const scrubEnd = useCallback(
    (i) => {
      const st = stRef.current
      const lenis = lenisRef.current
      if (!st || !lenis) return
      const target = st.start + (i / (total - 1)) * (st.end - st.start)
      snapUntil.current = performance.now() + 1800
      lenis.scrollTo(target, { duration: 1.2, easing: easeOutQuart })
    },
    [total]
  )

  const jump = useCallback((id) => {
    snapUntil.current = performance.now() + 2400
    lenisRef.current?.scrollTo('#' + id, { duration: 1.8 })
  }, [])

  const toTop = useCallback(() => {
    snapUntil.current = performance.now() + 3000 // don't let car-snapping fight the glide up
    lenisRef.current?.scrollTo(0, { duration: 2.2, easing: easeOutQuart })
  }, [])

  const closeSpec = useCallback(() => setSpecOpen(false), [])

  useEffect(() => {
    if (!ready) return
    const onKey = (e) => {
      if (!inShowRef.current || specOpen) return
      let next = null
      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) next = activeRef.current + 1
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) next = activeRef.current - 1
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = total - 1
      if (next === null) return
      e.preventDefault()
      goTo(Math.max(0, Math.min(total - 1, next)))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready, specOpen, goTo, total])

  const pill =
    'flex items-center gap-2 rounded-xl border border-white/20 bg-black/70 px-4 py-2 font-mono text-[10px] tracking-[0.25em] transition hover:bg-white/15'

  return (
    // No CSS transition on --accent: animating an inherited custom property restyled the whole page every frame.
    <main style={{ '--accent': car.accent }}>
      <StartLights onGo={() => setReady(true)} />
      <NavM visible={ready && !inShow} onJump={jump} />
      <HeroM ready={ready} onJump={jump} />
      <ErasM />

      <div id="showcase" ref={wrapperRef} className="relative h-screen w-screen overflow-hidden bg-[#060607]">
        <SkyBackdrop />
        <AmbientGlow />
        {/* Road is a fixed strip (not part of the moving track): only tiny layers move */}
        <RoadTrack total={total} totalKm={TOTAL_KM} />
        <div ref={trackRef} className="relative flex h-screen w-screen flex-nowrap will-change-transform">
          {leMansCars.map((c, i) => (
            <CarPanel key={c.id} car={c} near={Math.abs(i - active) <= 2} />
          ))}
        </div>
        <Rain on={WET_CARS.includes(car.id)} />
        <FrontFX fxRef={fxRef} />
      </div>

      <CircuitM />
      <HallOfFameM />
            <F1CrossoverM />
      <CompareM />
      <FooterM />

      <BackToTop onClick={toTop} lifted={inShow} />

      <div style={{ visibility: inShow ? 'visible' : 'hidden', opacity: inShow ? 1 : 0, transition: 'opacity .4s' }}>
        <HUD active={active} total={total} kmRef={kmRef} speedRef={speedRef} />
        <RaceClock />
        <div className="fixed right-5 top-28 z-50 flex flex-col items-end gap-2 md:right-10">
          <button onClick={toggleSound} className={pill}>
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            ENGINE {soundOn ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => setSpecOpen(true)} className={pill}>
            FULL SPEC SHEET →
          </button>
        </div>
        <MiniMap cars={leMansCars} active={active} onSelect={goTo} onScrub={scrubTo} onScrubEnd={scrubEnd} />
      </div>

      <SpecModal car={car} open={specOpen} onClose={closeSpec} />
    </main>
  )
}