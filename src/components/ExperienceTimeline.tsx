import './ExperienceTimeline.css'

const technologyLogos: Record<string, string> = { Python: 'python', AWS: 'aws', 'Apache Airflow': 'airflow-icon', PySpark: 'apache-spark', Redshift: 'aws-redshift', 'AWS S3': 'aws-s3', Lambda: 'aws-lambda', Docker: 'docker-icon' }

const summary = [
  'Designed and developed AWS-based production ETL pipelines processing 50M+ financial records daily with a 99.9% success rate.',
  'Built Airflow workflows spanning ingestion, transformation, validation, and delivery across 150+ production workflows.',
  'Assumed offshore L3 ownership of the platform, supporting pipeline recovery, issue resolution, and downstream data validation.',
  'Designed layered Redshift architecture (L1 raw → L2 reporting), improving query performance by 40%.',
]
const internship = [
  'Developed POC ETL workflows using Python and SQL.',
  'Implemented Airflow dependencies and retries, with AWS S3 and Lambda integrations.',
  'Worked with Docker-based pipeline environments.',
]

export function ExperienceTimeline({ detailed = false, achievements = [] }: { detailed?: boolean; achievements?: string[] }) {
  const roles = [
    { title: 'Data Engineer', company: 'Virtusa', status: 'Current', dates: 'Jan 2024 – Present', type: 'Production data engineering', bullets: detailed ? achievements : summary, skills: ['Python', 'SQL', 'AWS', 'Apache Airflow', 'PySpark', 'Redshift'] },
    { title: 'Software Engineering Intern — Data Engineering', company: 'Virtusa', status: 'Completed', dates: 'Jan 2023 – Apr 2023', type: 'Internship', bullets: internship, skills: ['Python', 'SQL', 'Apache Airflow', 'AWS S3', 'Lambda', 'Docker'] },
  ]
  return <div className="experience-timeline">
    {roles.map((role, index) => <article className="experience-timeline-item" key={role.title}>
      <span className="experience-timeline-marker" aria-hidden="true" />
      <div className="experience-timeline-card">
        <div className="experience-timeline-top">
          <div><h3>{role.title}</h3><p className="experience-timeline-company">{role.company}</p></div>
          <div className="experience-timeline-meta"><span className={`experience-timeline-status ${index === 0 ? 'current' : ''}`}>{role.status}</span><time>{role.dates}</time></div>
        </div>
        <p className="experience-timeline-type">{role.type}</p>
        <ul>{role.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
        {detailed && index === 0 && <div className="experience-timeline-ownership"><strong>Production ownership</strong><p>After the development transition in June 2026, assumed offshore L3 ownership of the platform, driving critical issue resolution, pipeline recovery, upstream dependency coordination, and downstream data validation.</p></div>}
        <div className="experience-timeline-skills" aria-label="Technologies">{role.skills.map(skill => {
          const logo = technologyLogos[skill]
          return <span className="experience-tool-icon" key={skill} title={skill}>{logo ? <img src={`/logos/${logo}.svg`} alt={skill} width={32} height={28} loading="lazy" /> : <span className="sql-wordmark">SQL</span>}</span>
        })}</div>
      </div>
    </article>)}
  </div>
}
