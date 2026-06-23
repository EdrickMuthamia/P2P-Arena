import { useState, useEffect } from 'react';
import { getQuizResults } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProgressCard from '../components/ProgressCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getGradeColor } from '../utils/helpers';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Progress() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuizResults(user.id)
      .then(r => setResults(r.data))
      .catch(() => toast.error('Failed to load progress'))
      .finally(() => setLoading(false));
  }, [user.id]);

  const total = results.length;
  const avgScore = total ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / total) : 0;
  const best = total ? Math.max(...results.map(r => r.percentage)) : 0;
  const passed = results.filter(r => r.percentage >= 40).length;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>📈 My Progress</h1>
          <p>Track your quiz performance and learning journey</p>
        </div>

        <div className="stats-grid">
          <div className="card stat-card">
            <div className="stat-number">{total}</div>
            <div className="stat-label">Quizzes Attempted</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number" style={{ color: getGradeColor(avgScore) }}>{avgScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number" style={{ color: getGradeColor(best) }}>{best}%</div>
            <div className="stat-label">Best Score</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number" style={{ color: 'var(--success)' }}>{passed}</div>
            <div className="stat-label">Quizzes Passed</div>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>No quiz results yet. <Link to="/quizzes" style={{ color: 'var(--primary)' }}>Take a quiz!</Link></p>
            </div>
          ) : (
            <>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Quiz History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {results.map(r => <ProgressCard key={r.id} result={r} />)}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
