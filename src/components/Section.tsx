import type { ReactNode } from 'react'

export function Section({ id, label, children, className = '' }: { id: string; label: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`section reveal ${className}`}>
    <div className="section-label"><span />{label}</div>
    {children}
  </section>
}
