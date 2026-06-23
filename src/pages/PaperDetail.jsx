import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPaper } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function PaperDetail() {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaper(id)
      .then(r => setPaper(r.data))
      .catch(() => toast.error('Paper not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!paper) return (
    <div className="page"><div className="container">
      <div className="empty-state"><div className="empty-icon">📭</div><p>Paper not found</p></div>
    </div></div>
  );

  return (
    <div className="page">
      <div className="container">
        <Link to="/papers" className="back-link">← Back to Papers</Link>
        <div className="card card-body paper-detail">
          <div className="paper-meta" style={{ marginBottom: '1rem' }}>
            <span className="badge badge-primary">{paper.category}</span>
            <span className="badge badge-muted">{paper.year}</span>
            <span className="badge badge-accent">{paper.subject}</span>
          </div>
          <h1>{paper.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '1rem 0 1.5rem', lineHeight: 1.7 }}>{paper.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div><p style={{ fontSize: '.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.25rem' }}>Subject</p><strong>{paper.subject}</strong></div>
            <div><p style={{ fontSize: '.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.25rem' }}>Year</p><strong>{paper.year}</strong></div>
            <div><p style={{ fontSize: '.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.25rem' }}>Category</p><strong>{paper.category}</strong></div>
            <div><p style={{ fontSize: '.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.25rem' }}>Uploaded</p><strong>{formatDate(paper.uploadDate)}</strong></div>
          </div>
          <a href={paper.downloadUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">
            ⬇ Download Paper
          </a>
        </div>
      </div>
    </div>
  );
}
