import { useEffect, useRef, useState } from 'react';
import './EngineeringImpact.css';

type Metric = {
  value?: number;
  suffix?: string;
  text?: string;
  label: string;
  context: string;
};

const METRICS: Metric[] = [
  { value: 30, suffix: '%', label: 'Faster queries', context: 'Redshift query tuning' },
  { value: 3, suffix: 'x', label: 'Faster data loads', context: 'Redshift loads' },
  { value: 25, suffix: '%', label: 'Fewer recurring issues', context: 'Recurring failure fixes' },
  { text: 'L3', label: 'Production ownership', context: 'Four-person offshore team' },
  { text: 'SQL', label: 'Incremental loads and dedup', context: 'Incremental loads + QUALIFY' },
  { text: 'AWS', label: 'S3, Glue, Lambda, Monitoring', context: 'CloudWatch monitoring' },
];

const TAGS = [
  'SQL',
  'AWS Glue',
  'Lambda',
  'Airflow',
  'Redshift',
  'S3',
  'Kinesis',
  'SNS',
  'Monitoring',
];

/** Trigger metric animation once when the section enters view; disconnect on success or unmount. */
function useInViewOnce<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, seen] as const;
}

/** Animate to the final figure once, skipping interpolation when the OS requests reduced motion. */
function CountUp({ to, run, final = false }: { to: number; run: boolean; final?: boolean }) {
  const [v, setV] = useState(final ? to : 0);

  useEffect(() => {
    if (final || !run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 1100, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run, final]);

  return <>{v}</>;
}

/** Render a metric with a stable accessible final value and its documented context. */
function MetricCard({ m, run, final = false }: { m: Metric; run: boolean; final?: boolean }) {
  return (
    <div className="ei-card" aria-label={`${m.value !== undefined ? String(m.value) + (m.suffix || '') : m.text} ${m.label}. ${m.context}`}>
      <div className="ei-num">
        {m.value !== undefined ? (
          <>
            <CountUp to={m.value} run={run} final={final} />
            {m.suffix}
          </>
        ) : (
          m.text
        )}
      </div>
      <div className="ei-label">{m.label}</div>
      <div className="ei-ctx">{m.context}</div>
    </div>
  );
}

/** Present the supplied impact strip with hover-pausable rows and no pause button. */
export default function EngineeringImpact() {
  const [ref, run] = useInViewOnce<HTMLElement>();

  return (
    <section className="ei" ref={ref} aria-label="Engineering impact">
      <div className="ei-top">
        <div className="ei-title">Engineering impact</div>
        <div className="ei-sub">Production achievements</div>
      </div>

      <div className="ei-main">
        <div className="ei-hero">
          <div className="ei-num ei-num-hero">
            <CountUp to={50} run={run} />M+
          </div>
          <div className="ei-label">Financial records per day</div>
        </div>

        <div className="ei-fade" tabIndex={0} role="group" aria-label="Engineering achievements">
          <div className="ei-track">
            {METRICS.map((m) => (
              <MetricCard key={m.label} m={m} run={run} />
            ))}
            <div className="ei-clone" aria-hidden="true">
              {METRICS.map((m) => (
                <MetricCard key={m.label} m={m} run={run} final />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ei-fade ei-row2" tabIndex={0} role="group" aria-label="Engineering technologies">
        <div className="ei-track ei-track-rev">
          {TAGS.map((t) => (
            <span key={t} className="ei-tag">
              {t}
            </span>
          ))}
          <div className="ei-clone" aria-hidden="true">
            {TAGS.map((t) => (
              <span key={t} className="ei-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ei-foot">
        <span>Virtusa / Data Engineering</span>
        <i />
      </div>
    </section>
  );
}
