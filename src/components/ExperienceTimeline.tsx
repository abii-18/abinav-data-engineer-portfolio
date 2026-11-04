import './ExperienceTimeline.css'

const technologyLogos: Record<string, string> = { Python: 'python', AWS: 'aws', 'Apache Airflow': 'airflow-icon', PySpark: 'apache-spark', Redshift: 'aws-redshift', 'AWS S3': 'aws-s3', Lambda: 'aws-lambda', Docker: 'docker-icon', 'Amazon Redshift': 'aws-redshift', 'AWS Glue': 'aws-glue', 'Amazon MWAA': 'aws-mwaa', 'Amazon S3': 'aws-s3', 'AWS Lambda': 'aws-lambda', 'Amazon CloudWatch': 'aws-cloudwatch', 'Amazon SNS': 'aws-sns', 'Amazon SES': 'aws-ses', 'Amazon Kinesis': 'aws-kinesis', 'Power BI': 'microsoft-power-bi' }

const summary = [
  "Built and maintained Python, SQL, and AWS Glue (PySpark) batch pipelines for financial datasets with 50M+ records, using SQL deduplication, incremental loads, and Redshift COPY across raw and reporting layers.",
  "Orchestrated Airflow DAGs across 150+ daily production runs, implementing business-day logic, conditional branching, and task dependencies.",
  "Since June 2026, led a four-person offshore L3 team responsible for BMO’s Airflow, Glue, and Redshift pipeline reliability; investigated recurring failures and drove 4+ permanent fixes covering DAG concurrency limits, retries with backoff, data type casting, and notification date handling.",
  "Reduced Redshift query execution time by approximately 30% by recommending automated ANALYZE and VACUUM maintenance on approximately 30 high-churn tables, implemented by the infrastructure team as scheduled Airflow DAGs.",
  "Optimized Redshift stored procedures by replacing function-based date filters with range predicates and simplifying deduplication using QUALIFY.",
  "Lowered AWS Glue compute costs by an estimated $450 per month through shorter job runtimes.",
  "Added pre-execution data quality checks to Airflow DAGs, validating schemas, dates, required columns, and duplicates before starting Glue jobs.",
]
const internship = [
  'Developed POC ETL workflows using Python and SQL.',
  'Implemented Airflow dependencies and retries, with AWS S3 and Lambda integrations.',
  'Worked with Docker-based pipeline environments.',
]

export function ExperienceTimeline({ detailed = false, achievements = [] }: { detailed?: boolean; achievements?: string[] }) {
  const roles = [
    { title: 'Data Engineer', company: 'Virtusa', status: 'Current', dates: 'Jan 2024 – Present', type: 'Production data engineering', bullets: detailed ? achievements : summary, skills: ['Python', 'SQL', 'AWS', 'Apache Airflow', 'PySpark', 'Amazon Redshift', 'AWS Glue', 'Amazon MWAA', 'Amazon S3', 'AWS Lambda', 'Amazon Kinesis', 'Power BI'] },
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
