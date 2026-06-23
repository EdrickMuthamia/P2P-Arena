import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

export default function PaperCard({ paper, onDelete, isAdmin }) {
  return (
    <div className="card paper-card">
      <div className="paper-card-header">
        <div className="paper-meta" style={{ marginBottom: '.5rem' }}>
          <span className="badge badge-primary">{paper.category}</span>
          <span className="badge badge-muted">{paper.year}</span>
        </div>
        <h3>{paper.title}</h3>
      </div>
      <div className="paper-card-body">
        <p>{paper.description}</p>
        <div className="paper-meta">
          <span className="badge badge-accent">{paper.subject}</span>
          <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>📅 {formatDate(paper.uploadDate)}</span>
        </div>
        <div className="paper-actions">
          <Link to={`/papers/${paper.id}`} className="btn btn-outline btn-sm">View Details</Link>
          <a href={paper.downloadUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">⬇ Download</a>
          {isAdmin && (
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(paper.id)}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}
