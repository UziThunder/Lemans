import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initScrollFx() {
  const cleanups = []
  const canHover = window.matchMedia('(hover: hover)').matches

  // Re-measure triggers once fonts/images settle
  const refresh = () => ScrollTrigger.refresh()
  if (document.fonts?.ready) document.fonts.ready.then(refresh)
  if (document.readyState === 'complete') setTimeout(refresh, 300)
  else window.addEventListener('load', refresh, { once: true })
  setTimeout(refresh, 1200)

  // Split a heading into letters (restored on cleanup)
  const splitChars = (h) => {
    const text = h.textContent
    h.textContent = ''
    h.style.overflow = 'hidden'
    const chars = [...text].map((ch) => {
      const s = document.createElement('span')
      s.textContent = ch === ' ' ? '\u00A0' : ch
      s.style.display = 'inline-block'
      h.appendChild(s)
      return s
    })
    cleanups.push(() => {
      h.textContent = text
      h.style.overflow = ''
    })
    return chars
  }

  // Replay an animation whenever React changes something inside an element
  const watch = (sel, onChange, opts) => {
    const el = document.querySelector(sel)
    if (!el) return
    let raf
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(onChange)
    })
    mo.observe(el, opts)
    cleanups.push(() => mo.disconnect())
  }

  const ctx = gsap.context(() => {
    // ---------- GLOBAL: top scroll-progress bar ----------
    const bar = document.createElement('div')
    Object.assign(bar.style, {
      position: 'fixed', top: '0', left: '0', height: '3px', width: '100%',
      transformOrigin: '0 50%', transform: 'scaleX(0)', zIndex: '60', pointerEvents: 'none',
      background: 'linear-gradient(90deg,#2b5bff,#ffb020)',
    })
    document.body.appendChild(bar)
    cleanups.push(() => bar.remove())
    gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })

    // ---------- GLOBAL: cursor spotlight (no blend mode: that was costly over the pinned showcase) ----------
    if (canHover) {
      const glow = document.createElement('div')
      Object.assign(glow.style, {
        position: 'fixed', left: '0', top: '0', width: '520px', height: '520px',
        marginLeft: '-260px', marginTop: '-260px', borderRadius: '50%', pointerEvents: 'none',
        zIndex: '40',
        background: 'radial-gradient(circle, rgba(80,120,255,0.10), transparent 65%)',
      })
      document.body.appendChild(glow)
      const qx = gsap.quickTo(glow, 'x', { duration: 0.6, ease: 'power3' })
      const qy = gsap.quickTo(glow, 'y', { duration: 0.6, ease: 'power3' })
      const move = (e) => { qx(e.clientX); qy(e.clientY) }
      window.addEventListener('mousemove', move)
      cleanups.push(() => { window.removeEventListener('mousemove', move); glow.remove() })
    }

    // ---------- HERO ----------
    gsap.to('#hero > .relative', {
      yPercent: -14, opacity: 0.1, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    })

    if (canHover) {
      // 3D tilt on the record cards
      gsap.utils.toArray('#hero .grid-cols-2 > div').forEach((c) => {
        const mv = (e) => {
          const r = c.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width - 0.5
          const py = (e.clientY - r.top) / r.height - 0.5
          gsap.to(c, { rotationY: px * 16, rotationX: -py * 16, transformPerspective: 700, duration: 0.4, ease: 'power2.out' })
        }
        const lv = () => gsap.to(c, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out' })
        c.addEventListener('mousemove', mv)
        c.addEventListener('mouseleave', lv)
        cleanups.push(() => { c.removeEventListener('mousemove', mv); c.removeEventListener('mouseleave', lv) })
      })

      // Magnetic hero buttons
      gsap.utils.toArray('#hero button').forEach((b) => {
        const mv = (e) => {
          const r = b.getBoundingClientRect()
          gsap.to(b, { x: (e.clientX - (r.left + r.width / 2)) * 0.25, y: (e.clientY - (r.top + r.height / 2)) * 0.35, duration: 0.3 })
        }
        const lv = () => gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
        b.addEventListener('mousemove', mv)
        b.addEventListener('mouseleave', lv)
        cleanups.push(() => { b.removeEventListener('mousemove', mv); b.removeEventListener('mouseleave', lv) })
      })
    }

    // ---------- BIG HEADINGS: letter-by-letter rise, scrubbed ----------
    gsap.utils.toArray('#circuit h2, #fame h2, #compare h2').forEach((h) => {
      const chars = splitChars(h)
      gsap.fromTo(
        chars,
        { yPercent: 120, rotate: 8, opacity: 0 },
        {
          yPercent: 0, rotate: 0, opacity: 1, stagger: 0.03, ease: 'power3.out',
          scrollTrigger: { trigger: h, start: 'top 95%', end: 'top 55%', scrub: true },
        }
      )
    })

    // ---------- Simple blocks rise in ----------
    gsap.utils.toArray('#circuit > *, #compare > *').forEach((el) => {
      if (el.tagName === 'H2' || el.matches('.grid, .snap-x')) return
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', clearProps: 'transform,opacity',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true } }
      )
    })

    // ---------- CIRCUIT ----------
    gsap.fromTo(
      '#circuit .grid > div:first-child > button',
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.09, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '#circuit .grid', start: 'top 95%', once: true } }
    )
    gsap.fromTo(
      '#circuit svg',
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '#circuit svg', start: 'top 95%', once: true } }
    )
    // Track line DRAWS itself as you scroll
    const trackPath = document.querySelectorAll('#circuit svg path')[1]
    if (trackPath) {
      const len = trackPath.getTotalLength()
      gsap.fromTo(
        trackPath,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, ease: 'none',
          scrollTrigger: { trigger: '#circuit svg', start: 'top 85%', end: 'top 25%', scrub: true } }
      )
    }
    // Corner dots fade in one by one
    gsap.fromTo(
      '#circuit svg g',
      { opacity: 0 },
      { opacity: 1, stagger: 0.15, duration: 0.5, clearProps: 'opacity',
        scrollTrigger: { trigger: '#circuit svg', start: 'top 60%', once: true } }
    )
    // Replay the info panel every time a corner is selected
    watch(
      '#circuit .mt-5',
      () => {
        gsap.fromTo('#circuit .mt-5 > div:first-child > *', { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out', clearProps: 'transform,opacity' })
        gsap.fromTo('#circuit .mt-5 .grid-cols-3 > div', { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.07, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform,opacity' })
      },
      { subtree: true, childList: true, characterData: true }
    )

    // ---------- HALL OF FAME: rank numbers slide in on scrub ----------
    gsap.utils.toArray('.fame-row > div:first-child > div:first-child > span:first-child').forEach((n) => {
      gsap.fromTo(n, { x: -50, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: n, start: 'top 95%', end: 'top 65%', scrub: true } })
    })

    // ---------- COMPARE ----------
    gsap.fromTo(
      '#compare .snap-x > button',
      { x: 90, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.07, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '#compare .snap-x', start: 'top 95%', once: true } }
    )
    // VS badge pulses
    gsap.to('#compare .rounded-3xl > .grid > div:nth-child(2)', {
      scale: 1.2, opacity: 0.6, duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut',
    })
    // Cars swap with a slide whenever you pick new ones
    watch(
      '#compare .rounded-3xl',
      () => {
        gsap.fromTo('#compare .rounded-3xl > .grid > div:first-child', { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity' })
        gsap.fromTo('#compare .rounded-3xl > .grid > div:last-child', { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity' })
      },
      { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['src'] }
    )
  })

  return {
    revert() {
      ctx.revert()
      cleanups.forEach((fn) => fn())
    },
  }
}