import { useState, useEffect } from 'react';
import { getQuizzes } from '../services/api';
import QuizCard from '../components/QuizCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { SUBJECTS } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    getQuizzes()
      .then(r => setQuizzes(r.data))
      .catch(() => toast.error('Failed to load quizzes'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = quizzes.filter(q =>
    (!search || q.title.toLowerCase().includes(search.toLowerCase()) || q.subject.toLowerCase().includes(search.toLowerCase())) &&
    (!subject || q.subject === subject)
  );

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🧠 Quizzes</h1>
          <p>Test your knowledge with practice quizzes</p>
        </div>

        <div className="filter-row">
          <SearchBar value={search} onChange={setSearch} placeholder="Search quizzes..." />
          <select className="form-control" value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {loading ? <LoadingSpinner /> : (
          filtered.length === 0
            ? <div className="empty-state"><div className="empty-icon">🧠</div><p>No quizzes found</p></div>
            : <div className="quizzes-grid">{filtered.map(q => <QuizCard key={q.id} quiz={q} />)}</div>
        )}
      </div>
    </div>
  );
}
