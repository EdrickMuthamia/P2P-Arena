import { useRef } from 'react';
import { formatDate } from '../utils/helpers';

export default function CertificateCard({ cert, onDownload, onDelete, isAdmin }) {
  return (
    <div className="card cert-card">
      <div className="cert-card-body">
        <div className="cert-icon">🏆</div>
        <h3>{cert.title}</h3>
        <p>{cert.achievement}</p>
        <div className="cert-grade">{cert.grade}</div>
        <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Issued: {formatDate(cert.issuedDate)}
        </p>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={() => onDownload(cert)}>⬇ Download PDF</button>
          {isAdmin && (
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(cert.id)}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}
