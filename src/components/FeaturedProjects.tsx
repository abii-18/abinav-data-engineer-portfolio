import { ArrowUpRight } from 'lucide-react'
import './FeaturedProjects.css'

const technologyLogos: Record<string, string> = { Python: 'python', Airflow: 'airflow-icon', PySpark: 'apache-spark', Snowflake: 'snowflake-icon', dbt: 'dbt-icon', Kafka: 'kafka-icon', PostgreSQL: 'postgresql', Streamlit: 'streamlit', Docker: 'docker-icon', Prometheus: 'prometheus', Grafana: 'grafana' }

const projects = [
  {
    name: 'Retail Sales Lakehouse', category: 'Batch pipeline', subtitle: 'End-to-end incremental data platform',
    description: 'An end-to-end batch platform connecting incremental ingestion, distributed processing, cloud warehousing, and dimensional models. Built to turn raw transactional data into validated, analytics-ready datasets.',
    highlights: ['Watermark-based extraction and idempotent Airflow workflows', 'PySpark schema enforcement, deduplication, and reject handling', 'Snowflake warehousing with dbt models and automated tests'],
    technologies: ['Python', 'SQL', 'Airflow', 'PySpark', 'Parquet', 'Snowflake', 'dbt'],
    source: 'https://github.com/abii-18/Retail_Sales_lakehouse', details: '/projects/retail-sales-lakehouse',
  },
  {
    name: 'CrickX', category: 'Streaming pipeline', subtitle: 'Event-driven cricket analytics system',
    description: 'A simulated cricket streaming pipeline serving ball-by-ball scorecards, player statistics, and match analytics. Handles duplicate, late, and corrected events while keeping downstream results consistent.',
    highlights: ['Kafka and PySpark Structured Streaming with checkpoints', 'Revision-aware deduplication and transactional PostgreSQL updates', 'Streamlit analytics with Prometheus and Grafana monitoring'],
    technologies: ['Python', 'Kafka', 'PySpark', 'PostgreSQL', 'Streamlit', 'Docker', 'Prometheus', 'Grafana'],
    source: 'https://github.com/abii-18/CrickX', details: '/projects/crickx',
  },
]

export function FeaturedProjects() {
  return <section className="featured-projects" aria-labelledby="featured-projects-title">
    <header className="featured-projects-heading"><p>PROJECTS</p><h2 id="featured-projects-title">Featured Projects</h2><span>Data systems I’ve designed and built</span></header>
    <div className="featured-projects-grid">{projects.map(project => <article className="featured-project-card" key={project.name}>
      <div className="featured-project-top"><h3>{project.name}</h3><span className="featured-project-category">{project.category}</span></div>
      <p className="featured-project-subtitle">{project.subtitle}</p>
      <p className="featured-project-description">{project.description}</p>
      <ul>{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
      <div className="featured-project-tags" aria-label="Technologies">{project.technologies.map(tech => <span key={tech} title={tech}>{technologyLogos[tech] ? <img src={`/logos/${technologyLogos[tech]}.svg`} width={22} height={22} alt={tech} loading="lazy"/> : <span className="featured-tech-wordmark">{tech}</span>}</span>)}</div>
      <footer className="featured-project-links"><a href={project.source} target="_blank" rel="noopener noreferrer"><img src="/logos/github-icon.svg" width={17} height={17} alt="" aria-hidden="true"/> Source</a><a href={project.details}><ArrowUpRight size={15} aria-hidden="true"/> Case study</a></footer>
    </article>)}</div>
  </section>
}
