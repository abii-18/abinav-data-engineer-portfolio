import { useState } from 'react'

const steps = [
  ['Source systems', 'Transactional and reference datasets entering from PostgreSQL and APIs.'],
  ['PostgreSQL / APIs', 'Source systems providing transactional and reference datasets.'],
  ['Apache Airflow', 'Dependency-driven orchestration with scheduling, retries, branching, and runtime parameters.'],
  ['Raw zone', 'Landing layer preserving incoming data before transformation.'],
  ['Bronze', 'Parallel ingestion layer for raw structured datasets.'],
  ['Silver', 'PySpark transformation layer for schema enforcement, deduplication, enrichment, standardization, and reject handling.'],
  ['Snowflake', 'Warehouse ingestion using stages, COPY INTO, and staging tables.'],
  ['dbt', 'Staging, dimensional, fact, and analytical models with automated tests.'],
  ['Analytics', 'Curated datasets prepared for downstream reporting and analysis.'],
]
export function Architecture() {
  const [active, setActive] = useState(0)
  return <div className="architecture" aria-label="Retail Sales Lakehouse data architecture">
    <div className="architecture-explainer" aria-live="polite"><span>Stage 0{active + 1}</span><p>{steps[active][1]}</p></div>
    <div className="architecture-stages">{steps.map(([step], i) => <button className={`architecture-step ${active === i ? 'active' : ''}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} key={step}>
      <span className="step-number">0{i + 1}</span><strong>{step}</strong>{i < steps.length - 1 && <i aria-hidden="true">↓</i>}
    </button>)}</div>
  </div>
}
