// Crops transparent padding so tyres touch the bottom edge. Cached per image.
const cache = {}

export function trimImage(src) {
  if (cache[src]) return cache[src]
  cache[src] = new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, 1800 / img.naturalWidth)
      const w = Math.round(img.naturalWidth * k)
      const h = Math.round(img.naturalHeight * k)
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const ctx = c.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0, w, h)
      const { data } = ctx.getImageData(0, 0, w, h)

      const ALPHA = 40
      const MIN = 3
      const rowHas = (y) => {
        let n = 0
        for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > ALPHA && ++n >= MIN) return true
        return false
      }
      const colHas = (x) => {
        let n = 0
        for (let y = 0; y < h; y++) if (data[(y * w + x) * 4 + 3] > ALPHA && ++n >= MIN) return true
        return false
      }

      let top = 0, bottom = h - 1, left = 0, right = w - 1
      while (top < bottom && !rowHas(top)) top++
      while (bottom > top && !rowHas(bottom)) bottom--
      while (left < right && !colHas(left)) left++
      while (right > left && !colHas(right)) right--

      const cw = right - left + 1
      const ch = bottom - top + 1
      const out = document.createElement('canvas')
      out.width = cw
      out.height = ch
      out.getContext('2d').drawImage(c, left, top, cw, ch, 0, 0, cw, ch)
      out.toBlob((blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('blob failed'))), 'image/png')
    }
    img.onerror = () => reject(new Error('image failed'))
    img.src = src
  })
  return cache[src]
}
