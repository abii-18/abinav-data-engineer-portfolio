import { useEffect, useRef } from 'react'
import './HeroDataPackets.css'

/** A quiet, decorative data-flow background for the introduction. */
export function HeroDataPackets() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext('2d')
    if (!element || !context) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0, height = 0, frame = 0, previous = 0, elapsed = 0, visible = true
    const routes = [
      [.02,.24,.29,.24,.39,.15,.94,.15], [.08,.81,.36,.81,.51,.9,.98,.9],
      [.72,.36,.82,.36,.88,.51,.99,.51], [.01,.63,.14,.63,.22,.71,.38,.71],
    ]
    const draw = () => {
      context.clearRect(0,0,width,height)
      context.globalAlpha = .8
      routes.forEach((route,index) => {
        const points = [[route[0]*width,route[1]*height],[route[2]*width,route[3]*height],[route[4]*width,route[5]*height],[route[6]*width,route[7]*height]]
        context.strokeStyle = 'rgba(137,150,169,.28)'
        context.lineWidth = .7
        context.beginPath()
        points.forEach(([x,y],i) => i ? context.lineTo(x,y) : context.moveTo(x,y))
        context.stroke()
        points.slice(1,3).forEach(([x,y]) => {
          context.fillStyle = 'rgba(157,165,185,.4)'
          context.beginPath(); context.arc(x,y,2,0,Math.PI*2); context.fill()
        })
        for (let i=0;i<3;i++) {
          const progress = (elapsed*.027+i/3+index*.17)%1
          const segment = Math.min(2,Math.floor(progress*3)), fraction = progress*3-segment
          const a=points[segment],b=points[segment+1]
          context.fillStyle=index%2?'rgba(163,154,206,.8)':'rgba(169,184,194,.72)'
          context.beginPath(); context.arc(a[0]+(b[0]-a[0])*fraction,a[1]+(b[1]-a[1])*fraction,1.8,0,Math.PI*2); context.fill()
        }
      })
      context.globalAlpha = 1
    }
    const resize = () => {
      const bounds = element.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1,2)
      width=bounds.width; height=bounds.height
      element.width=Math.round(width*ratio); element.height=Math.round(height*ratio)
      context.setTransform(ratio,0,0,ratio,0,0); draw()
    }
    const tick = (now:number) => {
      if (previous) elapsed+=Math.min((now-previous)/1000,.1)*.65
      previous=now
      if (visible && !document.hidden) draw()
      frame=requestAnimationFrame(tick)
    }
    const start = () => {
      cancelAnimationFrame(frame); previous=0
      if (!preference.matches) frame=requestAnimationFrame(tick)
      else draw()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    const intersection = new IntersectionObserver(entries => {
      visible=entries[0]?.isIntersecting ?? true
      if (visible) start(); else cancelAnimationFrame(frame)
    })
    intersection.observe(element)
    preference.addEventListener('change',start)
    resize(); start()
    return () => {cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();preference.removeEventListener('change',start)}
  },[])
  return <canvas ref={canvas} className="hero-data-packets" aria-hidden="true"/>
}
