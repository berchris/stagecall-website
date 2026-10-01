import { CSSProperties, ReactNode } from 'react'

// Entrance animation for content inside a `.snap-section`. The section gets `.is-shown` from
// SectionScroller when it arrives, and the CSS transition (globals.css) runs off the main thread,
// so it stays smooth while the page is gliding. Replays each time the section comes back.
export default function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div className={className ? `reveal ${className}` : 'reveal'} style={{ '--d': `${delay}s` } as CSSProperties}>
      {children}
    </div>
  )
}

// A card inside CardRow: same entrance, staggered by its position in the row (see `.card-slide` in globals.css).
// The outer div is the slide the sideways scroller snaps to; only the inner one is transformed, so the
// entrance never moves a snap position.
export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <div className="card-slide">
      <div className="reveal reveal-card">{children}</div>
    </div>
  )
}
