import './featuredGallery.css'

type Project = { name: string; category: string; subtitle: string; description: string; source: string; details: string; highlights: string[]; technologies: string[] }
// One purpose-built cover per project avoids repeating dashboards in a tiny gallery.
const COVERS = [
  { label: 'RETAIL SALES LAKEHOUSE', stages: ['Ingest', 'Transform', 'Warehouse'], logos: ['airflow-icon', 'apache-spark', 'snowflake-icon'], tone: 'cyan' },
  { label: 'CRICKX', stages: ['Events', 'Stream', 'Analyse'], logos: ['kafka-icon', 'apache-spark', 'postgresql'], tone: 'violet' },
  { label: 'ROLEGRAPH', stages: ['Discover', 'Index', 'Explore'], logos: ['django', 'postgresql', 'react'], tone: 'orange' },
  { label: 'DATABRICKS RETAIL', stages: ['Bronze', 'Silver', 'Gold'], logos: ['databricks', 'apache-spark', 'apacheparquet'], tone: 'blue' },
]

/** Render four aligned project cards with legible, code-native technology covers. */
export default function FeaturedGallery({ projects }: { projects: Project[] }) {
  return <section className="fg-root" id="projects" aria-labelledby="featured-projects-title">
    <header className="fg-head"><p>SELECTED WORK</p><h2 id="featured-projects-title">Featured projects</h2><span>Data systems I’ve designed and built.</span></header>
    <div className="fg-grid">{projects.map((project, index) => {
      const cover = COVERS[index]
      return <article className="fg-project" key={project.name}>
        <a className={`fg-cover fg-${cover.tone}`} href={project.details} aria-label={`Explore ${project.name}`}>
          <span className="fg-cover-label">{cover.label}</span>
          <div className="fg-flow" aria-hidden="true">{cover.stages.map((stage, i) => <div className="fg-node" key={stage}><img src={`/logos/${cover.logos[i]}.svg`} alt="" width="36" height="36" /><span>{stage}</span></div>)}</div>
          <span className="fg-cover-note">{project.category}<span aria-hidden="true">↗</span></span>
        </a>
        <div className="fg-body"><p className="fg-category">{project.category}</p><h3>{project.name}</h3><p className="fg-description">{project.description}</p><p className="fg-tools">{project.technologies.join(' · ')}</p><footer><a href={project.source} target="_blank" rel="noopener noreferrer">Source ↗</a><a href={project.details}>{project.details.startsWith('/') ? 'Case study' : 'Project overview'} ↗</a></footer></div>
      </article>
    })}</div>
  </section>
}
