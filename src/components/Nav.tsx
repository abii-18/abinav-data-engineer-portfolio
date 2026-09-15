import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = ['About', 'Focus', 'Experience', 'Skills', 'Projects', 'Certifications', 'Education', 'Contact']

export function Nav() {
  const [open, setOpen] = useState(false)
  return <header className="nav-wrap">
    <nav className="nav" aria-label="Main navigation">
      <a href="#home" className="brand">Abinav.</a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X size={19} /> : <Menu size={20} />}</button>
      <div className={`nav-links ${open ? 'open' : ''}`}>{links.map(link => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)}>{link}</a>)}</div>
    </nav>
  </header>
}
