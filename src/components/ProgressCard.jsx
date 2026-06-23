import { getGradeColor } from '../utils/helpers';

export default function ProgressCard({ result }) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.75rem' }}>
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: '.2rem' }}>{result.quizTitle}</h4>
          <span className="badge badge-accent">{result.subject}</span>
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: getGradeColor(result.percentage) }}>
          {result.percentage}%
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: 'var(--text-muted)' }}>
        <span>Score: {result.score}/{result.total}</span>
        <span>📅 {result.dateTaken}</span>
      </div>
      <div className="progress-bar-wrap" style={{ marginTop: '.75rem' }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${result.percentage}%`, background: getGradeColor(result.percentage) }}
        />
      </div>
    </div>
  );
}
