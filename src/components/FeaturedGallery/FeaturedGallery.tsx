import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import './featuredGallery.css'

/** Present the original project cards as the gallery surface, with a brief native-scroll tilt. */
export default function FeaturedGallery({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [35, 0])
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])
  return <section className="fg-root" id="projects" aria-labelledby="featured-projects-title">
    <header className="fg-head"><p>SELECTED WORK</p><h2 id="featured-projects-title">Featured projects</h2><span>Data systems I’ve designed and built.</span></header>
    <div ref={ref} className="fg-surface"><motion.div style={reduced ? undefined : { rotateX, y }}>{children}</motion.div></div>
  </section>
}
