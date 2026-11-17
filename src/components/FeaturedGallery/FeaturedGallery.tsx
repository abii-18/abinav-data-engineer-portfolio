import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import './featuredGallery.css'

/** Present the original project cards as the gallery surface, with a brief native-scroll tilt. */
export default function FeaturedGallery({ projects }: { projects: { name: string; details: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [35, 0])
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])
  return <section className="fg-root" id="projects" aria-labelledby="featured-projects-title">
    <header className="fg-head"><p>SELECTED WORK</p><h2 id="featured-projects-title">Featured projects</h2><span>Data systems Iâ€™ve designed and built.</span></header>
    <div ref={ref} className="fg-surface"><motion.div style={reduced ? undefined : { rotateX, y }}><div className="fg-image-grid">{projects.map((project, index) => <a key={project.name} href={project.details} aria-label={`Explore ${project.name}`}><img src={`/projects/project-cover-${index}.svg`} alt={`${project.name} — overview and technology stack`} width="900" height="660" loading="lazy" /></a>)}</div></motion.div></div>
  </section>
}
