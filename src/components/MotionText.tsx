import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import './MotionText.css'

/** Stagger words into view once, leaving a single accessible text label. */
export function MotionText({ text }: { text: string }) {
  const element = useRef<HTMLSpanElement>(null)
  const [state, setState] = useState('idle')
  useLayoutEffect(() => {
    const node = element.current
    if (!node || !('IntersectionObserver' in window)) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    if (preference.matches) return
    setState('pending')
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      setState('visible')
      observer.disconnect()
    }, { threshold: .05, rootMargin: '0px 0px -36px 0px' })
    observer.observe(node)
    const show = () => {
      if (preference.matches) { observer.disconnect(); setState('idle') }
    }
    preference.addEventListener('change', show)
    return () => { observer.disconnect(); preference.removeEventListener('change', show) }
  }, [text])
  const words = text.split(/\s+/)
  return <span ref={element} className="motion-text" data-text-reveal={state} aria-label={text}>
    <span aria-hidden="true">{words.map((word,index) => <Fragment key={`${index}-${word}`}><span className="motion-word" style={{ animationDelay: `${Math.min(index,12)*55}ms` }}>{word}</span>{index < words.length-1 ? ' ' : ''}</Fragment>)}</span>
  </span>
}
