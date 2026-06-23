import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createFeedback } from '../services/api';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

const CATEGORIES = ['General', 'Quizzes', 'Papers', 'Certificates', 'Platform'];

export default function FeedbackForm({ onSubmit }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ rating: 0, comment: '', category: 'General' });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to submit feedback');
    if (!form.rating) return toast.error('Please select a rating');
    if (!form.comment.trim()) return toast.error('Please write a comment');
    setLoading(true);
    try {
      const newFeedback = {
        id: generateId(),
        userId: user.id,
        userName: user.name,
        ...form,
        createdAt: new Date().toISOString().split('T')[0],
      };
      await createFeedback(newFeedback);
      toast.success('Feedback submitted!');
      setForm({ rating: 0, comment: '', category: 'General' });
      onSubmit?.();
    } catch {
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card card-body" onSubmit={handleSubmit} style={{ maxWidth: 540 }}>
      <h3 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>Share Your Feedback</h3>

      <div className="form-group">
        <label>Category</label>
        <select className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Rating</label>
        <div className="stars">
          {[1,2,3,4,5].map(n => (
            <button
              type="button" key={n}
              className="star-btn"
              onMouseEnter={() => setHoveredStar(n)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setForm(f => ({ ...f, rating: n }))}
            >
              {n <= (hoveredStar || form.rating) ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Comment</label>
        <textarea
          className="form-control"
          rows={4}
          value={form.comment}
          onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
          placeholder="Share your experience with P2P Arena..."
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
