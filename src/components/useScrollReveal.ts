import { useLayoutEffect } from 'react'

/** Reveal each section once, without hiding the initial viewport or changing layout. */
export function useScrollReveal(path: string) {
  useLayoutEffect(() => {
    const main = document.querySelector<HTMLElement>('.journal-main')
    if (!main || !('IntersectionObserver' in window)) return

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (preference.matches) return

    const sections = Array.from(main.querySelectorAll<HTMLElement>(
      ':scope > section, :scope > header, :scope > .data-motion-group > section, :scope > .project-listings > a',
    ))
    const reveal = (section: HTMLElement) => {
      section.dataset.scrollReveal = 'visible'
      observer.unobserve(section)
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement)
      })
    }, { threshold: 0.01, rootMargin: '0px 0px -24px 0px' })

    sections.forEach(section => {
      const bounds = section.getBoundingClientRect()
      // Above-the-fold content and restored scroll positions remain immediately readable.
      if (bounds.top < window.innerHeight && bounds.bottom > 0) return
      if (bounds.bottom <= 0) return
      section.dataset.scrollReveal = 'pending'
      observer.observe(section)
    })

    const showFocusedSection = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      const section = event.target.closest<HTMLElement>('[data-scroll-reveal="pending"]')
      if (section) reveal(section)
    }
    const showAll = () => {
      if (!preference.matches) return
      observer.disconnect()
      sections.forEach(section => section.removeAttribute('data-scroll-reveal'))
    }
    main.addEventListener('focusin', showFocusedSection)
    preference.addEventListener('change', showAll)
    return () => {
      observer.disconnect()
      main.removeEventListener('focusin', showFocusedSection)
      preference.removeEventListener('change', showAll)
      sections.forEach(section => section.removeAttribute('data-scroll-reveal'))
    }
  }, [path])
}
