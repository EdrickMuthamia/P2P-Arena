import { useState, useEffect } from 'react';
import { getFeedback, deleteFeedback } from '../services/api';
import FeedbackForm from '../components/FeedbackForm';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const STARS = '⭐⭐⭐⭐⭐';

export default function Feedback() {
  const { user, isAdmin } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await getFeedback();
      setFeedbackList(data.reverse());
    } catch {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this feedback?')) return;
    await deleteFeedback(id);
    setFeedbackList(f => f.filter(x => x.id !== id));
    toast.success('Feedback deleted');
  };

  const avgRating = feedbackList.length
    ? (feedbackList.reduce((a, f) => a + f.rating, 0) / feedbackList.length).toFixed(1)
    : '0.0';

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>💬 Feedback</h1>
          <p>Share your experience and help us improve</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Form */}
          <div>
            {user ? <FeedbackForm onSubmit={load} /> : (
              <div className="card card-body">
                <p>Please <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>login</a> to submit feedback.</p>
              </div>
            )}
          </div>

          {/* List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700 }}>Community Feedback</h3>
              {feedbackList.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>⭐</span>
                  <strong style={{ fontSize: '1.1rem' }}>{avgRating}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>({feedbackList.length})</span>
                </div>
              )}
            </div>

            {loading ? <LoadingSpinner /> : (
              feedbackList.length === 0
                ? <div className="empty-state"><div className="empty-icon">💬</div><p>No feedback yet. Be the first!</p></div>
                : (
                  <div className="feedback-list">
                    {feedbackList.map(f => (
                      <div key={f.id} className="card feedback-item">
                        <div className="feedback-header">
                          <div className="feedback-meta">
                            <strong>{f.userName}</strong>
                            <span>{f.category} · {formatDate(f.createdAt)}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                            <span>{STARS.slice(0, f.rating * 2)}</span>
                            {isAdmin && (
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}>×</button>
                            )}
                          </div>
                        </div>
                        <p style={{ fontSize: '.9rem', color: 'var(--text)' }}>{f.comment}</p>
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
