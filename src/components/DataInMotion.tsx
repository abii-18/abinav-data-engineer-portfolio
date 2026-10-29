import { useEffect, useRef, useState } from 'react'
import './DataInMotion.css'

const metrics = [
  { value: 50000000, suffix: '+', kind: 'million', label: 'Events/day' },
  { value: 99.9, suffix: '%', kind: 'decimal', label: 'Pipeline success' },
  { value: 150, suffix: '+', kind: 'integer', label: 'Daily production runs' },
  { value: 40, suffix: '%', kind: 'integer', label: 'Faster queries' },
  { value: 3, suffix: '×', kind: 'integer', label: 'Faster data loads' },
  { value: 25, suffix: '%', kind: 'integer', label: 'Fewer recurring issues' },
]
const stages = [
  { name: 'S3', subtitle: 'INGEST', detail: 'Amazon S3 supports ingestion and raw data storage for the financial data platform.' },
  { name: 'GLUE', subtitle: 'TRANSFORM', detail: 'AWS Glue transforms incoming data. Airflow coordinates scheduling, dependencies and retries.' },
  { name: 'VALIDATE', subtitle: 'QUALITY', detail: 'Python and SQL checks help detect missing data, duplicates and inconsistencies before delivery.' },
  { name: 'REPORTING', subtitle: 'DELIVER', detail: 'Validated datasets support downstream financial reporting, with CloudWatch monitoring and L3 production support.' },
]
const format = (value: number, kind: string) => kind === 'million' ? `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M` : kind === 'decimal' ? value.toFixed(1) : Math.floor(value).toString()
function useMotion() {
  const [seconds, setSeconds] = useState(0)
  const time = useRef(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setSeconds(-1); return }
    let frame = 0, previous = 0
    const tick = (now: number) => {
      if (previous) time.current = time.current + Math.min((now - previous) / 1000, .06)
      previous = now
      setSeconds(time.current)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])
  return seconds
}
function Metric({ value, suffix, kind, label, seconds }: typeof metrics[number] & { seconds: number }) {
  const phase = seconds < 0 ? 1 : (seconds % 6) / 6
  const progress = phase < .75 ? 1 - Math.pow(1 - phase / .75, 3) : 1
  return <div className="motion-metric"><strong>{format(value * progress, kind)}{suffix}</strong><span>{label}</span></div>
}

function SortingStudio() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [stats,setStats]=useState([0,0,0,0,0])
  const [batch,setBatch]=useState(0)
  const traces=useRef<number[][]>(Array.from({length:5},()=>Array(24).fill(0)))
  useEffect(()=>{
    const el=canvas.current;if(!el)return
    const ctx=el.getContext('2d');if(!ctx)return
    const g=ctx,folders=[{x:425,y:48,w:245,h:146,n:'01 / INGESTED',s:'RAW LANDING ZONE'},{x:695,y:48,w:245,h:146,n:'02 / CLEANED',s:'TRANSFORMED'},{x:695,y:247,w:245,h:146,n:'03 / VALIDATED',s:'QUALITY CHECKS'},{x:425,y:247,w:245,h:146,n:'04 / CURATED',s:'ANALYTICS READY'}]
    const interval=.55,travel=1.5,step=1.72,per=42,batches=12,total=per*batches,runEnd=1+(batches-1)*interval+step*4,cycle=runEnd+3
    type Tile={id:number,created:number,src:number[],slots:number[][]}
    const events:Tile[]=[]
    let next=0,origin=0,frame=0,last=-1,previousCycle=-1
    const clamp=(v:number)=>Math.max(0,Math.min(1,v)),ease=(v:number)=>v*v*(3-2*v)
    const text=(s:string,x:number,y:number,size=11,color='#ddd',bold=false)=>{g.fillStyle=color;g.font=(bold?'bold ':'')+size+'px system-ui';g.fillText(s,x,y)}
    const line=(x:number,y:number,X:number,Y:number)=>{g.beginPath();g.moveTo(x,y);g.lineTo(X,Y);g.stroke()}
    const box=(x:number,y:number,w:number,h:number,fill='#191919',stroke='#444',r=7)=>{g.fillStyle=fill;g.strokeStyle=stroke;g.lineWidth=1;g.beginPath();g.roundRect(x,y,w,h,r);g.fill();g.stroke()}
    function spawn(b:number){for(let i=0;i<per;i++){const id=b*per+i,a=id*2.39996,r=18+(id*37%140);events.push({id,created:1+b*interval,src:[195+Math.cos(a)*r,231+Math.sin(a)*r*.87],slots:folders.map((f,j)=>{const s=(id*13+j*19)%100;return[f.x+14+(s%13)*16.4,f.y+46+Math.floor(s/13)*11]})})}}
    function draw(now:number){
      if(!el?.isConnected)return
      if(!origin)origin=now
      const elapsed=(now-origin)/1000,currentCycle=Math.floor(elapsed/cycle),t=elapsed%cycle
      if(currentCycle!==previousCycle){
        previousCycle=currentCycle;next=0;events.length=0;last=-1
        traces.current=Array.from({length:5},()=>Array(24).fill(0))
      }
      while(next<batches&&1+next*interval<=t){spawn(next);next++}
      g.fillStyle='#0c0c0c';g.fillRect(0,0,1000,840)
      text('UNSTRUCTURED EVENTS',98,32,15,'#eee',true);text('INCOMING RAW STREAM',98,49,10,'#999')
      g.strokeStyle='#303030';g.beginPath();g.ellipse(195,231,171,156,0,0,Math.PI*2);g.stroke()
      const counts=[0,0,0,0],inside=[0,0,0,0];let moving=0
      const active:{e:Tile,stage:number,done:boolean,x:number,y:number,p:number}[]=[]
      for(const e of events){
        const age=t-e.created;if(age<0)continue
        let stage=4,done=true,p=1,x=550,y=437
        if(age<step*4){stage=Math.floor(age/step);const local=age-stage*step,delay=(.5+.5*Math.sin(e.id*.713))*.35;p=ease(clamp((local-delay)/(travel-delay)));done=local>=travel
          const a=stage?e.slots[stage-1]:e.src,b=e.slots[stage],arc=Math.sin(p*Math.PI)
          x=done?b[0]:a[0]+(b[0]-a[0])*p+arc*Math.cos(t*1.8+e.id*.713)*24
          y=done?b[1]:a[1]+(b[1]-a[1])*p+arc*Math.sin(t*1.8+e.id*.713)*20
        }
        active.push({e,stage,done,x,y,p})
        if(stage<4&&done)inside[stage]++
        if(!done)moving++
        for(let j=0;j<4;j++)if(stage>j||(stage===j&&done))counts[j]++
      }
      folders.forEach((f,j)=>{box(f.x,f.y,f.w,f.h,'#191919',inside[j]?'#bbb':'#555',9);g.fillStyle='#444';g.fillRect(f.x+9,f.y-6,70,7);text(f.n,f.x+12,f.y+18,12,'#eee',true);text(f.s,f.x+12,f.y+33,9,'#aaa');g.strokeStyle='#383838';line(f.x+10,f.y+39,f.x+f.w-10,f.y+39);text(inside[j]+' EVENTS IN STAGE',f.x+12,f.y+f.h-9,9,'#888')})
      g.strokeStyle='#777';g.setLineDash([5,7]);line(372,127,422,127);line(671,127,692,127);line(820,194,820,244);line(695,322,674,322);g.setLineDash([])
      for(const {e,stage,done,x,y,p} of active){if(stage===4)continue
        const size=done?9:8+(e.id%5),tone=['#fff','#bbb','#777','#ddd','#666'][e.id%5]
        g.save();g.translate(x,y);g.rotate(done?0:Math.sin(e.id*.713)*Math.sin(p*Math.PI)*.5);g.globalAlpha=.75
        g.fillStyle='#111';g.strokeStyle=tone;g.lineWidth=.8;g.fillRect(-size/2,-size*.36,size,size*.72);g.strokeRect(-size/2,-size*.36,size,size*.72);g.fillStyle=tone;g.fillRect(-size*.3,-size*.2,size*.37,size*.35);g.restore()
      }
      g.strokeStyle='#aaa';g.lineWidth=1.8;g.setLineDash([5,6]);line(549,393,549,466);g.setLineDash([])
      text('DOWNSTREAM / BI',574,434,10,'#bbb',true)
      for(let i=0;i<6;i++){const y=399+((t*115+i*15)%65);g.fillStyle='#ddd';g.fillRect(547,y,4,7)}
      const X=425,Y=482,ready=counts[3],intensity=clamp(ready/total)
      box(X,Y,518,324,'#151515','#777',10);text('OPERATIONS ANALYTICS',X+15,Y+24,15,'#fff',true);text('Executive overview / Curated event reporting',X+15,Y+41,10,'#999')
      box(X+379,Y+12,125,28,'#222','#444',5);text('LAST 24 HOURS',X+389,Y+30,10,'#ddd',true)
      const cards=[['EVENTS READY',ready.toLocaleString('en-US')],['DATA QUALITY',(98.6*intensity).toFixed(1)+'%'],['PIPELINE SLA',(99.9*intensity).toFixed(1)+'%'],['AVG LATENCY',(1.24*intensity).toFixed(2)+'s']]
      cards.forEach((v,i)=>{const x=X+15+i*124,y=Y+55;box(x,y,116,66,'#222','#383838',5);text(v[0],x+8,y+16,9,'#aaa');text(v[1],x+8,y+40,19,'#eee',true);text(i===0?'CURATED':i===1?'QUALITY PASSED':i===2?'HEALTHY':'PROCESSING',x+8,y+57,9,'#bbb')})
      const bx=X+15,by=Y+135;box(bx,by,290,131,'#1c1c1c','#363636',6);text('Event Volume',bx+12,by+19,12,'#eee',true);text('Ingestion trend / hourly',bx+12,by+34,9,'#888')
      g.strokeStyle='#343434';for(let i=0;i<3;i++)line(bx+12,by+52+i*25,bx+278,by+52+i*25)
      for(let i=0;i<12;i++){const h=(.3+i*.055)*68*intensity;g.fillStyle=i===11?'#fff':i%2?'#aaa':'#666';g.fillRect(bx+17+i*22,by+112-h,12,h)}
      const px=X+314,py=Y+135;box(px,py,189,131,'#1c1c1c','#363636',6);text('Quality Breakdown',px+11,py+19,11,'#eee',true)
      g.lineWidth=11;g.strokeStyle='#444';g.beginPath();g.arc(px+59,py+77,30,0,Math.PI*2);g.stroke();g.strokeStyle='#ddd';g.beginPath();g.arc(px+59,py+77,30,-Math.PI/2,-Math.PI/2+Math.PI*2*.986*intensity);g.stroke();text((intensity*98.6).toFixed(1)+'%',px+45,py+81,13,'#eee',true);text('VALID',px+107,py+68,10,'#ddd');text('REVIEW',px+107,py+88,10,'#999');text('RETRY',px+107,py+108,10,'#777')
      text('PROCESSING THROUGHPUT',X+16,Y+284,10,'#bbb',true);g.strokeStyle='#ddd';g.lineWidth=1.7;g.beginPath();for(let i=0;i<25;i++){const x=X+16+i*11.5,y=Y+312-(.15+i*.03)*28*intensity;if(!i)g.moveTo(x,y);else g.lineTo(x,y)}g.stroke()
      text('RECENT ACTIVITY',X+318,Y+284,10,'#bbb',true);text('Curated batches '+Math.floor(ready/per)+' / '+batches,X+318,Y+299,9,'#ddd');text(ready===total?'Run complete':ready?'Processing curated events':'Waiting for curated events',X+318,Y+312,9,'#999')
      if(Math.floor(t*8)!==last){last=Math.floor(t*8);const values=[events.length,...counts];setStats(values);setBatch(next);values.forEach((v,i)=>{traces.current[i].push(v);traces.current[i].shift()})}
      frame=requestAnimationFrame(draw)
    }
    frame=requestAnimationFrame(draw)
    return()=>cancelAnimationFrame(frame)
  },[])
  return <div className="sorting-studio">
    <div className="sorting-live"><span className="sorting-pulse"/>LIVE SIMULATION <small>0.55s / BATCH</small></div>
    <div className="sorting-metrics">{['TOTAL EVENTS','INGESTED','CLEANED','VALIDATED','CURATED'].map((label,i)=>{
      const values=traces.current[i],min=0,range=504
      return <div className="sorting-metric" key={label}><span>{label}</span><strong>{stats[i].toLocaleString('en-US')}</strong>
        <svg viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="#ddd" strokeWidth="1.5" points={values.map((v,j)=>`${j*99/(values.length-1)},${24-(v-min)/range*19}`).join(' ')}/></svg>
        <div className="sorting-track"><i style={{width:(stats[i]/504*100)+'%'}}/></div><small>{['RAW INPUT','S3 LANDING','TRANSFORM','QUALITY','BI READY'][i]}</small></div>
    })}</div>
    <div className="sorting-flow">RAW STREAM <i/> PROCESSING <i/> ANALYTICS READY</div>
    <canvas ref={canvas} width={1000} height={840} aria-label="Animated simulated pipeline from unstructured events through ingestion, cleaning, validation, curation and a downstream BI dashboard"/>
    <div className="sorting-foot">ZERO → INGEST → CURATE → COMPLETE <span>BATCH {batch}</span></div>
    <p className="sorting-note">Illustrative simulation, not live production telemetry. Dashboard SLA and quality figures are illustrative.</p>
  </div>
}

function ParticleField({ seconds }: { seconds: number }) {
  const blend = seconds < 0 ? 1 : (1 - Math.cos(seconds * .9)) / 2
  return <svg className="motion-svg" viewBox="0 0 640 270" role="img" aria-label="Animated raw data particles organizing into a structured grid">
    <circle cx="320" cy="125" r="109" fill="none" stroke="#747785" strokeDasharray="3 7" opacity=".4" />
    <circle cx="320" cy="125" r="68" fill="none" stroke="#747785" opacity=".2" />
    {Array.from({ length: 180 }, (_, i) => {
      const angle = i * 2.39996
      const radius = 32 + (i * 37 % 115)
      const x = 320 + Math.cos(angle + seconds * .1) * radius
      const y = 125 + Math.sin(angle + seconds * .1) * radius * .82
      const gx = 205 + (i % 19) * 12.6
      const gy = 46 + Math.floor(i / 19) * 16
      return <circle key={i} cx={x * (1 - blend) + gx * blend} cy={y * (1 - blend) + gy * blend} r={i % 8 === 0 ? 2.8 : 1.7} fill={i % 7 === 0 ? '#bcbcbc' : '#e6e7ef'} opacity={.28 + .72 * blend} />
    })}
    <text x="320" y="259" textAnchor="middle" fill="#a5a8b3" fontSize="11" letterSpacing="2">RAW SIGNALS → STRUCTURED DATA</text>
  </svg>
}
function Orbit({ seconds }: { seconds: number }) {
  const positions = [[350,35],[570,113],[490,286],[210,286],[130,113]]
  const labels = ['S3','GLUE','QUALITY','REDSHIFT','REPORT']
  return <div className="motion-visual"><div className="motion-visual-header"><small>01 / INFRASTRUCTURE</small><strong>Cloud Infrastructure Orbit</strong><span>{seconds < 0 ? 'STATIC' : 'LIVE · LOOP ' + (Math.floor(seconds / 6) + 1)}</span></div><svg className="motion-svg" viewBox="0 0 700 340" role="img" aria-label="Airflow orchestrating S3, Glue, Quality, Redshift and Reporting">
    <circle cx="350" cy="166" r="118" fill="none" stroke="#484848" strokeDasharray="5 7"/><circle cx="350" cy="166" r="84" fill="none" stroke="#303030"/>
    {positions.map(([x,y],i)=><g key={i}><line x1="350" y1="166" x2={x} y2={y} stroke="#525252" strokeDasharray="4 5"/><rect x={x-52} y={y-27} width="104" height="54" rx="10" fill="#1a1a1a" stroke="#858585"/><text x={x} y={y+4} textAnchor="middle" fill="#f5f5f5" fontSize="13" fontWeight="700">{labels[i]}</text></g>)}
    {Array.from({length:45},(_,i)=>{const angle=i*.78+seconds*.65,r=105+i%7*6;return <circle key={i} cx={350+Math.cos(angle)*r} cy={166+Math.sin(angle)*r*.75} r={i%6===0?3:2} fill={i%4===0?'#aaaaaa':'#dddddd'}/>})}
    <rect x="292" y="139" width="116" height="54" rx="10" fill="#1a1a1a" stroke="#858585"/><text x="350" y="160" textAnchor="middle" fill="#f5f5f5" fontSize="13" fontWeight="700">AIRFLOW</text><text x="350" y="178" textAnchor="middle" fill="#aaaaaa" fontSize="9">ORCHESTRATION</text>
  </svg><p>S3 · Glue · Quality · Redshift · Reporting — orchestrated with Airflow</p></div>
}
function TransformationMatrix({ seconds }: { seconds: number }) {
  const pct=seconds < 0 ? 100 : Math.round((seconds % 6) / 6 * 100)
  return <div className="motion-visual"><div className="motion-visual-header"><small>02 / DATA PROCESSING</small><strong>Data Transformation Matrix</strong><span>{seconds<0?'STATIC':'LIVE · LOOP '+(Math.floor(seconds/6)+1)}</span></div><svg className="motion-svg" viewBox="0 0 700 300" role="img" aria-label="Raw data particles becoming curated data through PySpark and SQL">
    {Array.from({length:9},(_,i)=><line key={'h'+i} x1="210" x2="490" y1={35+i*27} y2={35+i*27} stroke="#303030"/>)}
    {Array.from({length:14},(_,i)=><line key={'v'+i} x1={210+i*21.5} x2={210+i*21.5} y1="35" y2="251" stroke="#303030"/>)}
    {Array.from({length:100},(_,i)=>{const progress=(i/100+seconds/4.2)%1,x=45+610*progress,raw=145+Math.sin(i*2.4)*103,grid=65+Math.floor(i/14)*24;return <circle key={i} cx={x} cy={raw*(1-progress)+grid*progress} r={i%8===0?2.8:1.6} fill={i%7===0?'#aaaaaa':'#dddddd'}/>})}
    <rect x="274" y="103" width="152" height="90" rx="16" fill="#1a1a1a" stroke="#858585"/><text x="350" y="141" textAnchor="middle" fill="#f5f5f5" fontSize="16" fontWeight="700">TRANSFORM</text><text x="350" y="168" textAnchor="middle" fill="#aaaaaa" fontSize="11">PYSPARK / SQL</text><text x="93" y="156" textAnchor="middle" fill="#d0d0d0" fontSize="13">RAW</text><text x="608" y="156" textAnchor="middle" fill="#d0d0d0" fontSize="13">CURATED</text>
  </svg><div className="motion-progress-label"><span>RAW → TRANSFORM → CURATED</span><span>{pct}%</span></div><div className="motion-progress"><i style={{width:pct+'%'}}/></div></div>
}

const achievementItems = [["50M+","Financial records / day"],["99.9%","Pipeline success rate"],["150+","Production workflows"],["40%","Faster queries"],["3×","Faster data loads"],["25%","Fewer recurring issues"],["L3","Production ownership"],["SQL","Incremental loads & deduplication"],["AWS","S3 · Glue · Lambda · Monitoring"]]
function AchievementMarquee(){return <div className="achievement-marquee"><div className="achievement-head"><strong>ENGINEERING IMPACT</strong><span>PRODUCTION ACHIEVEMENTS</span></div><div className="achievement-window"><div className="achievement-track">{[...achievementItems,...achievementItems].map(([value,label],i)=><div className="achievement-card" key={i} aria-hidden={i>=achievementItems.length}><strong>{value}</strong><span>{label}</span></div>)}</div></div><div className="achievement-bottom"><span>VIRTUSA / DATA ENGINEERING</span><i/><span>AUTO-SCROLL</span></div></div>}

export function DataInMotion() {
  const seconds = useMotion()
  const firstSectionSeconds = seconds
  return <section className="data-motion" aria-label="Data engineering in motion">
    <div className="motion-heading"><div><span className="motion-eyebrow">ABINAV S. / DATA ENGINEERING</span><h2>Data.<br /><em>In Motion.</em></h2><p>Building, optimizing and operating production pipelines that turn complex raw data into trustworthy, analytics-ready information.</p></div></div>
    
    <AchievementMarquee />
    <div className="motion-section"><div className="motion-section-label">01 / WHAT I DO</div><SortingStudio /><p className="motion-description">I work across Python, SQL, Airflow and AWS to develop resilient ETL workflows, enforce data quality, improve performance and maintain production reliability.</p></div>
  </section>
}
