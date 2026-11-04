import './Architecture.css'

const diagrams = {
  retail: {
    title: 'Retail Sales Lakehouse',
    image: '/architecture/retail-lakehouse.gif',
    description: 'PostgreSQL and Currency API → Airflow → S3 Raw → six Bronze Glue jobs → Silver Glue → S3 Parquet → Snowflake → dbt models, Gold analytics and tests.',
  },
  crickx: {
    title: 'CrickX',
    image: '/architecture/crickx.gif',
    description: 'Python delivery events flow through Kafka and PySpark Structured Streaming into PostgreSQL and Streamlit, with a separate monitoring path for Prometheus and Grafana.',
  },
}

function ArchitectureDiagram({ project }: { project: keyof typeof diagrams }) {
  const diagram = diagrams[project]
  return <figure className="project-architecture-diagram">
    <a href={diagram.image} target="_blank" rel="noopener noreferrer" aria-label={`Open ${diagram.title} architecture diagram at full size`}>
      <img src={diagram.image} alt={`${diagram.title} animated architecture: ${diagram.description}`} loading="lazy" decoding="async" />
    </a>
    <figcaption><span>{diagram.description}</span><a href={diagram.image} target="_blank" rel="noopener noreferrer">View full-size diagram ↗</a></figcaption>
  </figure>
}

export function Architecture() { return <ArchitectureDiagram project="retail" /> }
export function CrickXArchitecture() { return <ArchitectureDiagram project="crickx" /> }
