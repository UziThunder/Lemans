// Procedural engine sound (Web Audio API). No audio files needed.
// Optional: drop a looping clip at public/sounds/car-<id>.mp3 and it replaces the synth for that car.

const VOL = 0.2

// f0 = idle pitch, f1 = full-throttle pitch (Hz). cut/cutMax = filter brightness. drive = grit.
// whine = [low, high] Hz turbo/electric whistle. noise = intake/exhaust hiss.
export const PROFILES = {
  1: { f0: 32, f1: 125, wave: 'sawtooth', cut: 500, cutMax: 2200, drive: 8, noise: 0.05 },
  2: { f0: 55, f1: 240, wave: 'sawtooth', cut: 900, cutMax: 4500, drive: 5, noise: 0.08 },
  3: { f0: 38, f1: 150, wave: 'sawtooth', cut: 700, cutMax: 3000, drive: 10, noise: 0.12, whine: [900, 2400] },
  4: { f0: 52, f1: 210, wave: 'sawtooth', cut: 800, cutMax: 4000, drive: 4, noise: 0.06 },
  5: { f0: 36, f1: 140, wave: 'sawtooth', cut: 600, cutMax: 2800, drive: 12, noise: 0.14, whine: [700, 1800] },
  6: { f0: 70, f1: 400, wave: 'square', cut: 1200, cutMax: 6500, drive: 14, noise: 0.18 },
  7: { f0: 50, f1: 200, wave: 'sawtooth', cut: 900, cutMax: 3800, drive: 4, noise: 0.06 },
  8: { f0: 52, f1: 210, wave: 'sawtooth', cut: 900, cutMax: 4200, drive: 5, noise: 0.07 },
  9: { f0: 30, f1: 105, wave: 'sawtooth', cut: 350, cutMax: 1400, drive: 16, noise: 0.1, whine: [1400, 3200] },
  10: { f0: 45, f1: 170, wave: 'sawtooth', cut: 700, cutMax: 3000, drive: 6, noise: 0.08, whine: [1500, 4200] },
}

let ctx = null
let master = null
let voice = null
let enabled = false
let curId = null
let suspendTimer = null
let noiseBuf = null
let last = 0
const samples = {}

function ensureCtx() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)
  return ctx
}

function curve(amount) {
  const n = 256
  const c = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1
    c[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x))
  }
  return c
}

function getNoise() {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  return noiseBuf
}

function release(out, sources) {
  const now = ctx.currentTime
  out.gain.cancelScheduledValues(now)
  out.gain.setTargetAtTime(0.0001, now, 0.05)
  setTimeout(() => {
    sources.forEach((s) => {
      try { s.stop() } catch (e) { /* already stopped */ }
    })
    out.disconnect()
  }, 400)
}

function buildSynth(p) {
  const out = ctx.createGain()
  out.gain.value = 0.0001
  out.connect(master)

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.Q.value = 2
  lp.frequency.value = p.cut
  lp.connect(out)

  const shaper = ctx.createWaveShaper()
  shaper.curve = curve(p.drive)
  shaper.oversample = '2x'
  shaper.connect(lp)

  const mix = ctx.createGain()
  mix.gain.value = 0.5
  mix.connect(shaper)

  // fundamental + octave up + sub octave
  const layers = [
    [1, 0.55, p.wave],
    [2, 0.25, 'sawtooth'],
    [0.5, 0.4, 'square'],
  ].map(([mult, g, type]) => {
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.value = p.f0 * mult
    const og = ctx.createGain()
    og.gain.value = g
    o.connect(og)
    og.connect(mix)
    o.start()
    return { o, mult }
  })

  // intake / exhaust hiss
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = getNoise()
  noiseSrc.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1800
  bp.Q.value = 0.7
  const ng = ctx.createGain()
  ng.gain.value = 0
  noiseSrc.connect(bp)
  bp.connect(ng)
  ng.connect(out)
  noiseSrc.start()

  // turbo / electric whine
  let whine = null
  let wg = null
  if (p.whine) {
    whine = ctx.createOscillator()
    whine.type = 'sine'
    whine.frequency.value = p.whine[0]
    wg = ctx.createGain()
    wg.gain.value = 0
    whine.connect(wg)
    wg.connect(out)
    whine.start()
  }

  const sources = [...layers.map((l) => l.o), noiseSrc, whine].filter(Boolean)

  return {
    update(t) {
      const now = ctx.currentTime
      const wob = 1 + Math.sin(performance.now() / 90) * 0.007 * (1 - t) // lumpy idle
      const f = (p.f0 + (p.f1 - p.f0) * Math.pow(t, 0.85)) * wob
      layers.forEach(({ o, mult }) => o.frequency.setTargetAtTime(f * mult, now, 0.06))
      lp.frequency.setTargetAtTime(p.cut + (p.cutMax - p.cut) * t, now, 0.08)
      ng.gain.setTargetAtTime(p.noise * (0.3 + 0.7 * t), now, 0.1)
      if (whine) {
        whine.frequency.setTargetAtTime(p.whine[0] + (p.whine[1] - p.whine[0]) * t, now, 0.1)
        wg.gain.setTargetAtTime(0.015 + 0.07 * t, now, 0.1)
      }
      out.gain.setTargetAtTime(0.55 + 0.45 * t, now, 0.1)
    },
    stop: () => release(out, sources),
  }
}

function buildSample(buf) {
  const out = ctx.createGain()
  out.gain.value = 0.0001
  out.connect(master)
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true
  src.connect(out)
  src.start()
  return {
    update(t) {
      const now = ctx.currentTime
      src.playbackRate.setTargetAtTime(0.75 + 0.9 * t, now, 0.1)
      out.gain.setTargetAtTime(0.6 + 0.4 * t, now, 0.1)
    },
    stop: () => release(out, [src]),
  }
}

function loadSample(id) {
  if (!samples[id]) {
    samples[id] = fetch(`/sounds/car-${id}.mp3`)
      .then((r) => {
        // Vite serves index.html for missing files, so check the type
        if (!r.ok || !(r.headers.get('content-type') || '').startsWith('audio')) throw new Error('no sample')
        return r.arrayBuffer()
      })
      .then((b) => ctx.decodeAudioData(b))
  }
  return samples[id]
}

async function swap() {
  const id = curId
  if (voice && voice.id === id) return
  if (voice) {
    voice.stop()
    voice = null
  }
  const sample = await loadSample(id).catch(() => null)
  if (id !== curId) return
  if (voice) {
    voice.stop()
    voice = null
  }
  voice = sample ? buildSample(sample) : buildSynth(PROFILES[id] || PROFILES[1])
  voice.id = id
}

/* ---------------- public API ---------------- */

// Call from a click handler (browsers block audio until a user gesture).
export function unlock() {
  if (!ensureCtx()) return
  ctx.resume()
}

export function setCar(id) {
  curId = id
  if (ctx && enabled) swap()
}

export function setEnabled(on) {
  enabled = on
  if (!ctx) return
  clearTimeout(suspendTimer)
  if (on) {
    ctx.resume()
    master.gain.setTargetAtTime(VOL, ctx.currentTime, 0.25)
    swap()
  } else {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.15)
    suspendTimer = setTimeout(() => ctx.suspend(), 700)
  }
}

// t = throttle 0..1 (call every frame; internally throttled)
export function update(t) {
  if (!voice || !enabled || !ctx) return
  const n = performance.now()
  if (n - last < 40) return
  last = n
  voice.update(t)
}