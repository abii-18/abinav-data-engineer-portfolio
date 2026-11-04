import groups from '../data/techStack.json'
import './TechStack.css'

export function TechStack() {
  return <section className="portfolio-tech-stack" aria-labelledby="tech-stack-title">
    <header className="tech-stack-heading"><p>SKILLS</p><h2 id="tech-stack-title">Tech Stack</h2><span>Tools I build with</span></header>
    <div className="tech-stack-groups">{groups.map(group => <div className="tech-stack-group" key={group.title}>
      <h3>{group.title}</h3>
      <div className="tech-stack-badges">{group.tools.map(tool => <span className="tech-stack-badge" key={tool.name}>
        {tool.logo && <img src={`/logos/${tool.logo}.svg`} alt="" width={20} height={20} loading="lazy" aria-hidden="true"/>}
        {tool.name}
      </span>)}</div>
    </div>)}</div>
  </section>
}
