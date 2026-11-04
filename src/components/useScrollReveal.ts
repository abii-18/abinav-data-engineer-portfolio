import { useLayoutEffect } from 'react'

/** Reveal sections and individual experience cards once as they enter the viewport. */
export function useScrollReveal(path: string) {
  useLayoutEffect(() => {
    const main = document.querySelector<HTMLElement>('.journal-main')
    if (!main || !('IntersectionObserver' in window)) return

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (preference.matches) return

    const sections = Array.from(main.querySelectorAll<HTMLElement>(
      ':scope > section:not(.journal-hero), :scope > .journal-hero > p, :scope > .journal-hero > .achievement-marquee, :scope > header, :scope > .data-motion-group > section, :scope > .project-listings > a, .experience-section-heading, .experience-timeline-item, .featured-projects-heading, .featured-project-card, .tech-stack-heading, .tech-stack-group',
    )).filter(section => !section.querySelector('.experience-timeline, .featured-projects-grid, .tech-stack-groups'))
    const reveal = (section: HTMLElement) => {
      section.dataset.scrollReveal = 'visible'
      observer.unobserve(section)
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement)
      })
    }, { threshold: 0.01, rootMargin: '0px 0px -72px 0px' })

    sections.forEach(section => {
      const bounds = section.getBoundingClientRect()
      // Keep content above a restored scroll position readable; animate the initial viewport too.
      if (bounds.bottom <= 0) return
      section.dataset.scrollReveal = 'pending'
      observer.observe(section)
    })

    const showFocusedSection = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      const section = event.target.closest<HTMLElement>('[data-scroll-reveal="pending"]')
      if (section) {
        section.dataset.scrollReveal = 'instant'
        observer.unobserve(section)
      }
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
