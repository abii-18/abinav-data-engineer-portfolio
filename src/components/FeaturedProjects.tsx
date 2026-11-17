import { MotionText } from './MotionText'
import { ArrowUpRight } from 'lucide-react'
import './FeaturedProjects.css'

// Local brand assets keep project technology rows consistent without runtime icon downloads.
const technologyLogos: Record<string, string> = { Python: 'python', Django: 'django', React: 'react', TypeScript: 'typescript', Databricks: 'databricks', 'Spark SQL': 'apache-spark', Parquet: 'apacheparquet', Airflow: 'airflow-icon', PySpark: 'apache-spark', Snowflake: 'snowflake-icon', dbt: 'dbt-icon', Kafka: 'kafka-icon', PostgreSQL: 'postgresql', Streamlit: 'streamlit', Docker: 'docker-icon', Prometheus: 'prometheus', Grafana: 'grafana' }

// Keep featured order shared with the full project directory.
export const projects = [
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
  {
    name: 'RoleGraph', category: 'Job data platform', subtitle: 'An evidence-backed index for job discovery',
    description: 'A Django and React application for discovering, indexing, and monitoring jobs across applicant tracking systems and job boards. Connects canonical job records to original postings and source evidence.',
    highlights: ['Complete-feed validation, failure rollback, and suspicious-drop quarantine', 'Canonical job records with source appearances and lifecycle history', 'Search, coverage inspection, and a map-led interface with analytics previews'],
    technologies: ['Python', 'Django', 'PostgreSQL', 'React', 'TypeScript', 'Docker'],
    source: 'https://github.com/abii-18/RoleGraph', details: 'https://github.com/abii-18/RoleGraph#readme', detailsLabel: 'Project overview',
  },
  {
    name: 'PySpark Retail Analytics', category: 'Batch analytics', subtitle: 'Retail analytics on the Databricks platform',
    description: 'A Databricks notebook project exploring PySpark batch-processing patterns on retail data. Moves from typed ingestion and cleaned datasets to customer metrics, product analysis, and segmentation.',
    highlights: ['Explicit schemas, CSV ingestion, and Bronze / Silver / Gold-style layers', 'Multi-table joins, aggregations, and window-based customer segmentation', 'Parquet output, partitioning concepts, and execution-plan inspection'],
    technologies: ['Databricks', 'Python', 'PySpark', 'Spark SQL', 'Parquet'],
    source: 'https://github.com/abii-18/retail-pyspark-analytics', details: 'https://github.com/abii-18/retail-pyspark-analytics#readme', detailsLabel: 'Project overview',
  },
]

/** Render the ordered project collection using the existing responsive card system. */
export function FeaturedProjects() {
  return <section className="featured-projects" aria-labelledby="featured-projects-title">
    <header className="featured-projects-heading"><p>PROJECTS</p><h2 id="featured-projects-title"><MotionText text="Featured Projects" /></h2><span>Data systems I’ve designed and built</span></header>
    <div className="featured-projects-grid">{projects.map(project => <article className="featured-project-card" key={project.name}>
      <div className="featured-project-top"><h3>{project.name}</h3><span className="featured-project-category">{project.category}</span></div>
      <p className="featured-project-subtitle">{project.subtitle}</p>
      <p className="featured-project-description">{project.description}</p>
      <ul>{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
      <div className="featured-project-tags" aria-label="Technologies">{project.technologies.map(tech => <span key={tech} title={tech}>{technologyLogos[tech] ? <img src={`/logos/${technologyLogos[tech]}.svg`} width={22} height={22} alt={tech} loading="lazy"/> : <span className="featured-tech-wordmark">{tech}</span>}</span>)}</div>
      <footer className="featured-project-links"><a href={project.source} target="_blank" rel="noopener noreferrer"><img src="/logos/github-icon.svg" width={17} height={17} alt="" aria-hidden="true"/> Source</a><a href={project.details} target={project.details.startsWith('https://') ? '_blank' : undefined} rel={project.details.startsWith('https://') ? 'noopener noreferrer' : undefined}><ArrowUpRight size={15} aria-hidden="true"/> {project.detailsLabel || 'Case study'}</a></footer>
    </article>)}</div>
  </section>
}
