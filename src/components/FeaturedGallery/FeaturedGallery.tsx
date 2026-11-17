import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import './featuredGallery.css'

type Project = { name: string; details: string }

/** Move alternating columns in opposite directions as the reference gallery unfolds. */
function GalleryColumn({ projects, column, progress, reduced }: {
  projects: Project[]; column: number; progress: MotionValue<number>; reduced: boolean
}) {
  const y = useTransform(progress, [0, 1], column === 1 ? ['12%', '-4%'] : ['-5%', '3%'])
  return <motion.div className="fg-image-column" style={reduced ? undefined : { y }}>
    {projects.map((project, index) => index % 3 === column && <a key={project.name} href={project.details} aria-label={`Explore ${project.name}`}>
      <img src={`/projects/project-cover-${index}.svg`} alt={`${project.name} — highlights and technology stack`} width="900" height="500" loading="lazy" />
    </a>)}
  </motion.div>
}

/** Keep the supplied perspective-and-column gallery animation with one original-card image per project. */
export default function FeaturedGallery({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = Boolean(useReducedMotion())
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [65, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1])
  return <section className="fg-root" id="projects" aria-labelledby="featured-projects-title">
    <header className="fg-head"><p>SELECTED WORK</p><h2 id="featured-projects-title">Featured projects</h2><span>Data systems I’ve designed and built.</span></header>
    <div ref={ref} className="fg-surface"><motion.div className="fg-image-grid" style={reduced ? undefined : { rotateX, scale }}>
      {[0, 1, 2].map(column => <GalleryColumn key={column} projects={projects} column={column} progress={scrollYProgress} reduced={reduced} />)}
    </motion.div></div>
  </section>
}
