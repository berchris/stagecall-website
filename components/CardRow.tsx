'use client'

import { Children, ReactNode, useRef, useState } from 'react'

// Grid of cards on desktop; on phones a sideways swipeable row (one card at a time) with dots.
export default function CardRow({ children, min = 280 }: { children: ReactNode; min?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const count = Children.count(children)

  function onScroll() {
    const el = ref.current
    if (!el || !el.firstElementChild) return
    const first = el.firstElementChild as HTMLElement
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
    setActive(Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / step))))
  }

  function goTo(i: number) {
    const el = ref.current
    const child = el?.children[i] as HTMLElement | undefined
    if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft - 24, behavior: 'smooth' })
  }

  return (
    <>
      <div ref={ref} className="card-row" style={{ ['--card-min' as string]: `${min}px` }} onScroll={onScroll}>
        {children}
      </div>
      <div className="card-dots" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <button key={i} type="button" tabIndex={-1} onClick={() => goTo(i)} className={i === active ? 'card-dot active' : 'card-dot'} />
        ))}
      </div>
    </>
  )
}
