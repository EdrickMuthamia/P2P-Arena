import { useState, useEffect } from 'react';
import {
  getPapers, createPaper, updatePaper, deletePaper,
  getQuizzes, createQuiz, deleteQuiz,
  getFeedback, deleteFeedback,
  getAllQuizResults, getUsers,
} from '../services/api';
import { generateId, SUBJECTS, CATEGORIES, formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TABS = ['Papers', 'Quizzes', 'Feedback', 'Stats'];

// --- Paper Modal ---
function PaperModal({ paper, onClose, onSave }) {
  const blank = { title: '', subject: SUBJECTS[0], description: '', year: new Date().getFullYear().toString(), category: CATEGORIES[0], downloadUrl: '', uploadDate: new Date().toISOString().split('T')[0] };
  const [form, setForm] = useState(paper || blank);

  const f = (key, label, type = 'text', opts = null) => (
    <div className="form-group" key={key}>
      <label>{label}</label>
      {opts ? (
        <select className="form-control" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}>
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea className="form-control" rows={3} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
      ) : (
        <input className="form-control" type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
      )}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{paper ? 'Edit Paper' : 'Add Paper'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          {f('title', 'Title')}
          {f('subject', 'Subject', 'text', SUBJECTS)}
          {f('description', 'Description', 'textarea')}
          {f('year', 'Year')}
          {f('category', 'Category', 'text', CATEGORIES)}
          {f('downloadUrl', 'Download URL')}
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Admin Page ---
export default function Admin() {
  const [tab, setTab] = useState('Papers');
  const [papers, setPapers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | paper-object

  useEffect(() => {
    Promise.all([getPapers(), getQuizzes(), getFeedback(), getAllQuizResults(), getUsers()])
      .then(([p, q, f, r, u]) => { setPapers(p.data); setQuizzes(q.data); setFeedback(f.data); setResults(r.data); setUsers(u.data); })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  // Papers CRUD
  const savePaper = async (form) => {
    if (modal === 'add') {
      const { data } = await createPaper({ ...form, id: generateId() });
      setPapers(p => [...p, data]);
      toast.success('Paper added');
    } else {
      await updatePaper(modal.id, form);
      setPapers(p => p.map(x => x.id === modal.id ? { ...x, ...form } : x));
      toast.success('Paper updated');
    }
    setModal(null);
  };

  const removePaper = async (id) => {
    if (!confirm('Delete this paper?')) return;
    await deletePaper(id);
    setPapers(p => p.filter(x => x.id !== id));
    toast.success('Paper deleted');
  };

  const removeQuiz = async (id) => {
    if (!confirm('Delete this quiz?')) return;
    await deleteQuiz(id);
    setQuizzes(q => q.filter(x => x.id !== id));
    toast.success('Quiz deleted');
  };

  const removeFeedback = async (id) => {
    if (!confirm('Delete this feedback?')) return;
    await deleteFeedback(id);
    setFeedback(f => f.filter(x => x.id !== id));
    toast.success('Feedback deleted');
  };

  const avgPlatformScore = results.length
    ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length)
    : 0;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>⚡ Admin Dashboard</h1>
          <p>Manage papers, quizzes, feedback, and view platform statistics</p>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="card stat-card"><div className="stat-number">{papers.length}</div><div className="stat-label">Total Papers</div></div>
          <div className="card stat-card"><div className="stat-number">{quizzes.length}</div><div className="stat-label">Total Quizzes</div></div>
          <div className="card stat-card"><div className="stat-number">{users.filter(u => u.role === 'student').length}</div><div className="stat-label">Students</div></div>
          <div className="card stat-card"><div className="stat-number">{results.length}</div><div className="stat-label">Quizzes Taken</div></div>
        </div>

        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Papers Tab */}
        {tab === 'Papers' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setModal('add')}>+ Add Paper</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Title</th><th>Subject</th><th>Year</th><th>Category</th><th>Actions</th></tr></thead>
                <tbody>
                  {papers.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.title}</td>
                      <td><span className="badge badge-accent">{p.subject}</span></td>
                      <td>{p.year}</td>
                      <td><span className="badge badge-primary">{p.category}</span></td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => setModal(p)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => removePaper(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Quizzes Tab */}
        {tab === 'Quizzes' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Subject</th><th>Questions</th><th>Actions</th></tr></thead>
              <tbody>
                {quizzes.map(q => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600 }}>{q.title}</td>
                    <td><span className="badge badge-accent">{q.subject}</span></td>
                    <td>{q.questions.length}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => removeQuiz(q.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Feedback Tab */}
        {tab === 'Feedback' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Student</th><th>Rating</th><th>Category</th><th>Comment</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {feedback.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600 }}>{f.userName}</td>
                    <td>{'⭐'.repeat(f.rating)}</td>
                    <td>{f.category}</td>
                    <td style={{ maxWidth: 220 }}>{f.comment}</td>
                    <td>{formatDate(f.createdAt)}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => removeFeedback(f.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Tab */}
        {tab === 'Stats' && (
          <>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Platform Statistics</h3>
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="card stat-card"><div className="stat-number">{avgPlatformScore}%</div><div className="stat-label">Avg. Quiz Score</div></div>
              <div className="card stat-card"><div className="stat-number">{feedback.length}</div><div className="stat-label">Feedback Received</div></div>
              <div className="card stat-card"><div className="stat-number">{users.length}</div><div className="stat-label">Total Users</div></div>
              <div className="card stat-card"><div className="stat-number">{results.filter(r => r.percentage >= 80).length}</div><div className="stat-label">Distinctions</div></div>
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Recent Quiz Results</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Student</th><th>Quiz</th><th>Score</th><th>Date</th></tr></thead>
                <tbody>
                  {results.slice(-10).reverse().map(r => {
                    const u = users.find(u => u.id === r.userId);
                    return (
                      <tr key={r.id}>
                        <td>{u?.name || 'Unknown'}</td>
                        <td>{r.quizTitle}</td>
                        <td><span className="badge" style={{ background: r.percentage >= 80 ? '#dcfce7' : r.percentage >= 60 ? '#dbeafe' : '#fee2e2', color: r.percentage >= 80 ? '#166534' : r.percentage >= 60 ? '#1e40af' : '#991b1b' }}>{r.percentage}%</span></td>
                        <td>{r.dateTaken}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {(modal === 'add' || (modal && modal.id)) && (
          <PaperModal paper={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={savePaper} />
        )}
      </div>
    </div>
  );
}
