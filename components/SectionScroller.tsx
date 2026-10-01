'use client'

import { useEffect } from 'react'

const GLIDE_MS = 700
const TOUCH_GLIDE_MS = 800
const COOLDOWN_MS = 250

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Section-by-section scrolling for the landing page, plus the `.is-shown` flag that plays each section's entrance.
// One gesture (wheel, trackpad swipe, arrow key or touch swipe) glides exactly one screen with a slow-fast-slow ease.
// With a mouse or trackpad, a section taller than the window scrolls normally until its edge is reached.
// If the visitor prefers reduced motion the script stays out of the way (plain scrolling).
export default function SectionScroller() {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const active = () => !reduced.matches
    // `snap-js` turns off CSS smooth scrolling and native snap, which would otherwise fight the scripted glide.
    // `snap-touch` stops the page panning vertically under a finger, so a swipe can be turned into one glide.
    root.classList.add('snap-page')
    root.classList.toggle('snap-js', active())
    root.classList.toggle('snap-touch', active() && window.matchMedia('(any-pointer: coarse)').matches)

    // Play a section's entrance once most of it is on screen; reset it when it has mostly left.
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        const ref = Math.min(en.boundingClientRect.height, window.innerHeight)
        const seen = en.intersectionRect.height
        if (seen >= ref * 0.7) en.target.classList.add('is-shown')
        else if (seen <= ref * 0.25) en.target.classList.remove('is-shown')
      }
    }, { threshold: Array.from({ length: 41 }, (_, i) => i / 40) })
    document.querySelectorAll('.snap-section, .snap-stop').forEach((el) => io.observe(el))

    const sections = () => Array.from(document.querySelectorAll<HTMLElement>('.snap-section'))
    const top = (el: HTMLElement) => Math.round(el.getBoundingClientRect().top + window.scrollY)

    let animating = false
    let lockedUntil = 0
    let lastWheelAt = 0
    let lastWheelAbs = 0
    let raf = 0
    let settleTimer = 0

    function glideTo(y: number, ms = GLIDE_MS) {
      const max = root.scrollHeight - window.innerHeight
      const to = Math.round(Math.max(0, Math.min(max, y)))
      const from = window.scrollY
      if (Math.abs(to - from) < 2) return
      cancelAnimationFrame(raf)
      animating = true
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / ms)
        // Whole pixels only: fractional positions make text shimmer while it moves.
        window.scrollTo(0, t < 1 ? Math.round(from + (to - from) * ease(t)) : to)
        if (t < 1) {
          raf = requestAnimationFrame(step)
        } else {
          animating = false
          lockedUntil = performance.now() + COOLDOWN_MS
        }
      }
      raf = requestAnimationFrame(step)
    }

    // Index of the section that holds the top edge of the window.
    function currentIndex(list: HTMLElement[]) {
      const y = window.scrollY + 2
      let idx = 0
      list.forEach((el, i) => { if (top(el) <= y) idx = i })
      return idx
    }

    // Returns true when a glide was started (or the gesture should be swallowed).
    function move(dir: 1 | -1) {
      const list = sections()
      if (!list.length) return false
      const i = currentIndex(list)
      const cur = list[i]
      const curTop = top(cur)
      const curBottom = curTop + cur.offsetHeight
      const vh = window.innerHeight

      if (dir > 0) {
        if (curBottom > window.scrollY + vh + 2) return false // more of this section below: scroll normally
        if (i === list.length - 1) return false
        glideTo(top(list[i + 1]))
        return true
      }
      if (curTop < window.scrollY - 2) {
        if (cur.offsetHeight > vh + 2) return false // tall section: scroll normally back to its top
        glideTo(curTop)
        return true
      }
      if (i === 0) return false
      const prev = list[i - 1]
      // Land on the bottom of a tall previous section, otherwise on its top.
      glideTo(Math.max(top(prev), top(prev) + prev.offsetHeight - vh))
      return true
    }

    function onWheel(e: WheelEvent) {
      if (!active() || e.ctrlKey) return
      const inRow = !!(e.target as HTMLElement | null)?.closest?.('.card-row')
      if (inRow && Math.abs(e.deltaX) > Math.abs(e.deltaY)) return // sideways scroll in a card row
      const now = performance.now()
      const abs = Math.abs(e.deltaY)
      const gap = now - lastWheelAt
      // A trackpad keeps sending decaying "momentum" events after a swipe; only a fresh or accelerating gesture counts
      // (a mouse wheel sends large, steady steps, which also count).
      const fresh = gap > 140 || abs > lastWheelAbs + 4 || (abs >= 60 && abs >= lastWheelAbs)
      lastWheelAt = now
      lastWheelAbs = abs

      if (animating || now < lockedUntil) { e.preventDefault(); return }
      const list = sections()
      const cur = list[currentIndex(list)]
      const tall = cur && cur.offsetHeight > window.innerHeight + 2
      // Never let the browser scroll a normal section itself: any leak shows up as an overshoot that then gets corrected.
      if (!tall) e.preventDefault()
      if (!fresh || abs < 2) return
      if (move(e.deltaY > 0 ? 1 : -1)) e.preventDefault()
    }

    // Touch: every position a swipe can land on. Section tops, the hero's second screen on phones, and for a
    // section taller than the screen also its bottom-aligned position.
    function stops() {
      const vh = window.innerHeight
      const ys: number[] = []
      for (const el of sections()) {
        ys.push(top(el))
        if (el.offsetHeight > vh + 8) ys.push(top(el) + el.offsetHeight - vh)
      }
      document.querySelectorAll<HTMLElement>('.snap-stop').forEach((el) => {
        if (el.offsetHeight >= vh - 4) ys.push(top(el)) // only full-screen stops
      })
      ys.sort((a, b) => a - b)
      return ys.filter((y, i) => i === 0 || y - ys[i - 1] > 8)
    }

    const SWIPE_PX = 26
    let touchStart: { x: number; y: number } | null = null
    let touchAxis: 'v' | 'h' | 'done' | null = null

    function onTouchStart(e: TouchEvent) {
      if (!active() || e.touches.length !== 1) { touchStart = null; return }
      const t = e.target as HTMLElement | null
      if (t?.closest?.('nav, .nav-mobile, .float-top')) { touchStart = null; return }
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      touchAxis = null
    }

    function onTouchMove(e: TouchEvent) {
      if (!active() || !touchStart || e.touches.length !== 1) return
      const dx = e.touches[0].clientX - touchStart.x
      const dy = e.touches[0].clientY - touchStart.y
      if (touchAxis === null && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
        touchAxis = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
      }
      if (touchAxis === 'h') return // sideways swipe: card rows scroll natively
      if (e.cancelable) e.preventDefault()
      if (touchAxis !== 'v' || animating || Math.abs(dy) < SWIPE_PX) return
      touchAxis = 'done' // one glide per swipe
      const ys = stops()
      const y = window.scrollY
      const target = dy < 0 ? ys.find((s) => s > y + 4) : [...ys].reverse().find((s) => s < y - 4)
      if (target !== undefined) glideTo(target, TOUCH_GLIDE_MS)
    }

    function onKey(e: KeyboardEvent) {
      if (!active() || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      let dir: 1 | -1 | 0 = 0
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) dir = 1
      else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) dir = -1
      if (!dir) return
      if (animating) { e.preventDefault(); return }
      if (move(dir)) e.preventDefault()
    }

    // In-page links ("Save my seat", nav links) glide with the same easing.
    function onClick(e: MouseEvent) {
      if (!active()) return
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const target = document.getElementById(a.getAttribute('href')!.slice(1))
      if (!target) return
      e.preventDefault()
      const screens = Math.abs(top(target) - window.scrollY) / window.innerHeight
      glideTo(top(target), Math.min(1200, GLIDE_MS + Math.max(0, screens - 1) * 120))
      history.replaceState(null, '', a.getAttribute('href'))
    }

    // After a scrollbar drag or resize leaves the page between two sections, settle on the nearest one.
    function onScroll() {
      window.clearTimeout(settleTimer)
      if (!active() || animating) return
      settleTimer = window.setTimeout(() => {
        if (animating || /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName ?? '')) return
        const list = sections()
        const i = currentIndex(list)
        const cur = list[i]
        if (!cur || cur.offsetHeight > window.innerHeight + 2) return
        const next = list[i + 1]
        const curTop = top(cur)
        if (Math.abs(window.scrollY - curTop) < 3 || !next) return
        const target = window.scrollY - curTop < cur.offsetHeight / 2 ? curTop : top(next)
        glideTo(target, 450)
      }, 180)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      root.classList.remove('snap-page', 'snap-js', 'snap-touch')
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      io.disconnect()
      cancelAnimationFrame(raf)
      window.clearTimeout(settleTimer)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return null
}
