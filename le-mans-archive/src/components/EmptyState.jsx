// Compact empty state for inside a panel or list.
// Image slot (optional): public/assets/states/<name>.png
export default function EmptyState({ title, body, icon: Icon, image, imageAlt, action, onAction }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center"
    >
      {image && (
        <img
          src={image}
          alt={imageAlt ?? ''}
          loading="lazy"
          draggable={false}
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="h-24 w-24 object-contain opacity-80"
        />
      )}
      {!image && Icon && <Icon size={32} className="text-white/30" aria-hidden />}
      <div className="font-display text-3xl">{title}</div>
      {body && <p className="max-w-sm text-sm text-white/55">{body}</p>}
      {action && onAction && (
        <button
          onClick={onAction}
          className="mt-2 rounded-lg border border-white/20 px-4 py-2 font-mono text-[10px] tracking-widest transition hover:bg-white/10"
        >
          {action}
        </button>
      )}
    </div>
  )
}