import { useLayoutEffect, useRef, useState } from 'react'

export function parseCountUp(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  return { target: Number(match[1]), decimals: match[1].split('.')[1]?.length ?? 0, suffix: match[2] }
}

/** Count numeric impact values once, when that card becomes visible. */
export function CountUpValue({ value, decorative = false }: { value: string; decorative?: boolean }) {
  const node = useRef<HTMLSpanElement>(null)
  const parsed = parseCountUp(value)
  const [display, setDisplay] = useState(parsed ? (0).toFixed(parsed.decimals)+parsed.suffix : value)
  useLayoutEffect(() => {
    const element = node.current, number = parseCountUp(value)
    if (!element || !number) { setDisplay(value); return }
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    if (preference.matches || decorative || !('IntersectionObserver' in window)) { setDisplay(value); return }
    let frame = 0, start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const progress = Math.min((now-start)/1500,1), eased = 1-Math.pow(1-progress,3)
      const current = number.target*eased
      setDisplay((number.decimals ? current.toFixed(number.decimals) : String(Math.floor(current)))+number.suffix)
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setDisplay(value)
    }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect(); frame=requestAnimationFrame(tick)
    }, { threshold: .25 })
    observer.observe(element)
    const finish = () => {
      if (preference.matches) { cancelAnimationFrame(frame); observer.disconnect(); setDisplay(value) }
    }
    preference.addEventListener('change', finish)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); preference.removeEventListener('change', finish) }
  }, [value, decorative])
  return <span ref={node} className="impact-count-up" aria-label={decorative ? undefined : value} style={{fontVariantNumeric:'tabular-nums'}}><span aria-hidden="true">{display}</span></span>
}
