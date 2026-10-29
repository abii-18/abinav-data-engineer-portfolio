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
    const box=(x:number,y:number,w:number,h:number,fill:string|CanvasGradient='#191919',stroke='#444',r=7)=>{g.fillStyle=fill;g.strokeStyle=stroke;g.lineWidth=1;g.beginPath();g.roundRect(x,y,w,h,r);g.fill();g.stroke()}
    function documentTile(size:number){
      g.fillStyle='#777';g.strokeStyle='#bbb';g.lineWidth=.7
      g.beginPath();g.moveTo(-size/2,-size*.65);g.lineTo(size*.18,-size*.65);g.lineTo(size/2,-size*.3);g.lineTo(size/2,size*.65);g.lineTo(-size/2,size*.65);g.closePath();g.fill();g.stroke()
      g.beginPath();g.moveTo(size*.18,-size*.65);g.lineTo(size*.18,-size*.3);g.lineTo(size/2,-size*.3);g.stroke()
      g.strokeStyle='#ddd';for(let row=0;row<3;row++)line(-size*.27,row*size*.21,size*.26,row*size*.21)
    }
    function spawn(b:number){for(let i=0;i<per;i++){const id=b*per+i,a=id*2.39996,r=18+(id*37%140);events.push({id,created:1+b*interval,src:[195+Math.cos(a)*r,231+Math.sin(a)*r*.87],slots:folders.map((f,j)=>{const s=(id*13+j*19)%100;return[f.x+14+(s%13)*16.4,f.y+46+Math.floor(s/13)*11]})})}}
    function draw(now:number){
      if(!el?.isConnected)return
      if(!origin)origin=now
      const elapsed=(now-origin)/1000,currentCycle=Math.floor(elapsed/cycle),t=elapsed%cycle
      if(currentCycle!==previousCycle){
        previousCycle=currentCycle;next=0;events.length=0;last=-1
      }
      while(next<batches&&1+next*interval<=t){spawn(next);next++}
      g.fillStyle='#0c0c0c';g.fillRect(0,0,1000,1260)
      text('RAW FILES',114,420,17,'#eee',true);text(events.length+' / '+total+' FILES',114,442,12,'#999')
      for(let i=0;i<38;i++){
        const x=52+(i*67%278),y=78+(i*97%290),size=10+i%5
        g.save();g.translate(x,y+Math.sin(t*.7+i)*3);g.globalAlpha=.35+(i%4)*.13
        documentTile(size);g.restore()
      }
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
        const size=done?9:8+(e.id%5)
        g.save();g.translate(x,y);g.rotate(done?0:Math.sin(e.id*.713)*Math.sin(p*Math.PI)*.5);g.globalAlpha=.75
        documentTile(size);g.restore()
      }
      g.strokeStyle='#aaa';g.lineWidth=1.8;g.setLineDash([5,6]);line(549,393,549,466);g.setLineDash([])
      text('DOWNSTREAM / BI',574,434,10,'#bbb',true)
      for(let i=0;i<6;i++){const y=399+((t*115+i*15)%65);g.fillStyle='#ddd';g.fillRect(547,y,4,7)}
      const X=425,Y=482,W=518
      // Five illustrative reporting batches follow the same curated-packet clock.
      const progress=clamp((t-(1+3*step+travel))/(runEnd-(1+3*step+travel)))
      const targets=[1206722,1184331,1298441,1266504,1328190]
      const fractions=targets.map((_,i)=>clamp(progress*5-i))
      const records=targets.map((target,i)=>Math.floor(target*fractions[i]))
      const ready=records.reduce((sum,n)=>sum+n,0),completed=fractions.filter(p=>p===1).length
      const fmt=(n:number)=>Math.floor(n).toLocaleString('en-US')
      const panel=(x:number,y:number,w:number,h:number,r=9)=>{
        const gradient=g.createLinearGradient(x,y,x+w,y+h);gradient.addColorStop(0,'#1a1b1b');gradient.addColorStop(.5,'#101111');gradient.addColorStop(1,'#080909')
        box(x,y,w,h,gradient,'#454747',r)
      }
      const arrow=(x:number,y:number)=>{g.strokeStyle='#bbb';g.lineWidth=1;line(x-4,y-4,x,y);line(x,y,x+4,y-4)}
      panel(X,Y,W,744,14)
      text('2 / SQL → INSIGHTS',X+22,Y+32,17,'#f2f2f2',true)
      text('From curated data',X+348,Y+23,11,'#aaa');text('to clear insights',X+360,Y+39,11,'#aaa')
      const innerX=X+14,innerY=Y+61
      panel(innerX,innerY,490,661,10)
      text('OPERATIONS ANALYTICS',X+32,Y+92,14,'#eee',true)
      text(progress===1?'COMPLETE':'TRANSFORMING…',X+352,Y+91,9,'#bbb',true)
      for(let i=0;i<3;i++){g.fillStyle=progress===1?'#aaa':Math.sin(t*4-i)>0?'#eee':'#555';g.beginPath();g.arc(X+467+i*7,Y+88,1.5,0,Math.PI*2);g.fill()}
      const tableY=Y+114
      panel(X+32,tableY,454,192,7)
      text('batch',X+47,tableY+23,10,'#bbb');text('records',X+210,tableY+23,10,'#bbb');text('status',X+350,tableY+23,10,'#bbb')
      for(let row=0;row<5;row++){
        const y=tableY+47+row*28,fraction=fractions[row]
        g.strokeStyle='#292b2b';line(X+46,y+9,X+473,y+9)
        g.font='11px monospace';g.fillStyle='#bbb';g.fillText('2025-01-10-'+String(8+row).padStart(2,'0'),X+47,y)
        g.fillStyle='#eee';g.fillText(fraction?fmt(records[row]):'—',X+210,y)
        g.strokeStyle=fraction?'#ddd':'#777';g.lineWidth=1.2;g.beginPath();g.arc(X+349,y-4,5,0,Math.PI*2);g.stroke()
        if(fraction===1){line(X+346,y-4,X+348,y-2);line(X+348,y-2,X+352,y-6)}
        else if(fraction>0){g.beginPath();g.arc(X+349,y-4,7,t*4,t*4+Math.PI);g.stroke()}
        text(fraction===1?'COMPLETED':fraction?'RUNNING':'PENDING',X+362,y,9,fraction?'#ddd':'#777')
      }
      const queryY=Y+339
      g.strokeStyle='#bbb';g.setLineDash([3,4]);line(X+259,tableY+194,X+259,queryY-8);g.setLineDash([]);arrow(X+259,queryY-5)
      panel(X+96,queryY,344,87,9)
      text('SQL',X+108,queryY+24,10,'#aaa');g.font='11px monospace';g.fillStyle='#ddd'
      g.fillText('SELECT batch, COUNT(*)',X+155,queryY+26);g.fillText('FROM curated',X+155,queryY+46);g.fillText('GROUP BY batch;',X+155,queryY+66)
      const play=g.createLinearGradient(X+402,queryY+29,X+424,queryY+54);play.addColorStop(0,'#555');play.addColorStop(1,'#222')
      g.fillStyle=play;g.beginPath();g.arc(X+414,queryY+43,12,0,Math.PI*2);g.fill();g.fillStyle='#eee';g.beginPath();g.moveTo(X+411,queryY+37);g.lineTo(X+420,queryY+43);g.lineTo(X+411,queryY+49);g.closePath();g.fill()
      const cardY=Y+460,cards=[['TOTAL RECORDS',fmt(ready)],['AVG PER BATCH',fmt(ready/Math.max(1,Math.ceil(progress*5)))],['COMPLETION RATE',(completed/5*100).toFixed(1)+'%']]
      cards.forEach(([label,value],i)=>{
        const x=X+32+i*154
        g.strokeStyle='#aaa';g.setLineDash([3,4]);line(X+259,queryY+87,X+259,cardY-16);line(X+109,cardY-16,X+417,cardY-16);line(x+73,cardY-16,x+73,cardY-4);g.setLineDash([]);arrow(x+73,cardY-2)
        panel(x,cardY,146,92,8);text(label,x+11,cardY+21,9,'#bbb',true);text(value,x+11,cardY+49,20,'#f0f0f0',true)
        if(i<2){for(let j=0;j<9;j++){
          const h=(3+j*2.1)*clamp(progress*9-j)
          const grad=g.createLinearGradient(0,cardY+80-h,0,cardY+80);grad.addColorStop(0,'#ddd');grad.addColorStop(1,'#444');g.fillStyle=grad;g.fillRect(x+12+j*14,cardY+80-h,7,h)
        }}else{
          g.strokeStyle='#ddd';g.beginPath();for(let j=0;j<20;j++){const px=x+12+j*6,py=cardY+80-(j*.6+Math.sin(j*.7)*2)*progress;if(j===0)g.moveTo(px,py);else g.lineTo(px,py)}g.stroke()
        }
      })
      const chartY=Y+565
      panel(X+32,chartY,454,141,8);text('RECORDS PER BATCH',X+45,chartY+22,10,'#ccc',true)
      for(let i=0;i<3;i++){const y=chartY+39+i*31;g.strokeStyle='#252727';line(X+78,y,X+473,y);text((2-i)+'.0M',X+44,y+3,9,'#888')}
      for(let b=0;b<7;b++){
        const x=X+89+b*54,base=chartY+101,target=b<5?targets[b]:1350000,height=target/2000000*62,fraction=b<5?fractions[b]:0
        g.strokeStyle='#606363';g.setLineDash([3,3]);g.strokeRect(x,base-height,26,height);g.setLineDash([])
        if(fraction){const h=height*fraction,grad=g.createLinearGradient(x,base-h,x,base);grad.addColorStop(0,'#e3e5e5');grad.addColorStop(.25,'#adb0b0');grad.addColorStop(1,'#505454');g.fillStyle=grad;g.fillRect(x,base-h,26,h)}
        text(String(8+b).padStart(2,'0'),x+6,base+16,9,'#999')
      }
      text('Batch (hour) →',X+222,chartY+133,9,'#888')
      if(Math.floor(t*8)!==last){last=Math.floor(t*8);const values=[events.length,...counts];setStats(values);setBatch(next)}
      frame=requestAnimationFrame(draw)
    }
    frame=requestAnimationFrame(draw)
    return()=>cancelAnimationFrame(frame)
  },[])
  return <div className="sorting-studio">
    <div className="sorting-live"><span className="sorting-pulse"/>LIVE SIMULATION <small>0.55s / BATCH</small></div>
    <div className="pipeline-journey" aria-label="Pipeline progress">
      {['RAW','INGEST','CLEAN','VALIDATE','CURATE'].map((label,i)=>{
        const complete=stats[i]===504,active=stats[i]>0&&!complete
        const icons=[<><ellipse cx="24" cy="12" rx="12" ry="5"/><path d="M12 12v23c0 7 24 7 24 0V12M12 23c0 7 24 7 24 0M12 30c0 7 24 7 24 0"/></>,<path d="M13 34h23a8 8 0 0 0 0-16 12 12 0 0 0-23-3 10 10 0 0 0 0 19Z"/>,<><path d="m20 8 8 0 2 7 7 2 3 7-5 5-1 8-8 3-6-5-8-1-3-8 5-6 1-8Z"/><circle cx="24" cy="24" r="6"/></>,<><path d="M24 6 39 12v12c0 10-15 18-15 18S9 34 9 24V12Z"/><path d="m17 24 5 5 10-11"/></>,<path d="M10 39V24m10 15V15m10 24V8m10 31V20"/>]
        return <div className="pipeline-step" key={label} data-state={complete?'complete':active?'active':'waiting'}>
          <div className="pipeline-node"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{icons[i]}</svg><span>{label}</span></div>
          {i<4&&<div className="pipeline-connection" data-running={stats[i]>stats[i+1]} aria-hidden="true"><i/><i/><i/><b>›</b></div>}
          <strong>{stats[i].toLocaleString('en-US')}</strong><small>{['files detected','ingested','cleaned','validated','curated'][i]}</small>
        </div>
      })}
    </div>
    <div className="sorting-flow">RAW STREAM <i/> PROCESSING <i/> ANALYTICS READY</div>
    <canvas ref={canvas} width={1000} height={1260} aria-label="Animated simulated pipeline from scattered raw files through ingestion, cleaning, validation, curation and a live SQL query, result metrics and records-per-batch chart"/>
    <div className="sorting-foot">ZERO → INGEST → CURATE → COMPLETE <span>BATCH {batch}</span></div>
    <p className="sorting-note">Illustrative simulation, not live production telemetry. SQL record volumes are illustrative; all batches animate from zero to completion.</p>
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
