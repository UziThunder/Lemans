// Shared scroll progress (0..1) without touching the document root.
// `dragging` is true while the red timeline slider is being dragged.
// `subs` lets components (like the road) react to scroll without re-rendering React.
export const progress = { value: 0, el: null, dragging: false, subs: new Set() }

export const subscribe = (fn) => {
  progress.subs.add(fn)
  return () => progress.subs.delete(fn)
}