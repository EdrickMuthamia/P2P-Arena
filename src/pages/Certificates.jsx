import { useState, useEffect, useRef } from 'react';
import { getCertificates, deleteCertificate } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CertificateCard from '../components/CertificateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Certificates() {
  const { user, isAdmin } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const certRef = useRef(null);

  useEffect(() => {
    getCertificates(user.id)
      .then(r => setCerts(r.data))
      .catch(() => toast.error('Failed to load certificates'))
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this certificate?')) return;
    await deleteCertificate(id);
    setCerts(c => c.filter(x => x.id !== id));
    toast.success('Certificate deleted');
  };

  const handleDownload = async (cert) => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      // Background
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, W, H, 'F');
      doc.setFillColor(37, 99, 235);
      doc.roundedRect(10, 10, W - 20, H - 20, 6, 6, 'F');

      // Border
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(1.5);
      doc.roundedRect(14, 14, W - 28, H - 28, 4, 4, 'S');

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('CERTIFICATE OF ACHIEVEMENT', W / 2, 40, { align: 'center' });

      // Seal
      doc.setFontSize(28);
      doc.text('🏆', W / 2, 72, { align: 'center' });

      // Name
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(user.name, W / 2, 95, { align: 'center' });

      // Achievement
      doc.setFontSize(13);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(245, 158, 11);
      doc.text(cert.title, W / 2, 112, { align: 'center' });

      doc.setTextColor(220, 230, 255);
      doc.setFontSize(11);
      doc.text(cert.achievement, W / 2, 125, { align: 'center' });

      // Grade
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
      doc.text(`Grade: ${cert.grade}`, W / 2, 140, { align: 'center' });

      // Date
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 200, 255);
      doc.setFontSize(10);
      doc.text(`Issued on ${formatDate(cert.issuedDate)} | P2P Arena`, W / 2, 162, { align: 'center' });

      doc.save(`${cert.title.replace(/ /g, '_')}.pdf`);
      toast.success('Certificate downloaded!');
    } catch {
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🏆 My Certificates</h1>
          <p>Certificates earned by scoring 80%+ on quizzes</p>
        </div>

        {loading ? <LoadingSpinner /> : (
          certs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <p>No certificates yet. Score 80%+ on a quiz to earn one! <Link to="/quizzes" style={{ color: 'var(--primary)' }}>Take a quiz</Link></p>
            </div>
          ) : (
            <div className="certs-grid">
              {certs.map(c => (
                <CertificateCard key={c.id} cert={c} onDownload={handleDownload} onDelete={handleDelete} isAdmin={isAdmin} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
