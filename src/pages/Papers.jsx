import { useState, useEffect } from 'react';
import { getPapers, deletePaper } from '../services/api';
import PaperCard from '../components/PaperCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { SUBJECTS, CATEGORIES } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Papers() {
  const { isAdmin } = useAuth();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');

  const load = async () => {
    try {
      const { data } = await getPapers();
      setPapers(data);
    } catch {
      toast.error('Failed to load papers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this paper?')) return;
    await deletePaper(id);
    setPapers(p => p.filter(x => x.id !== id));
    toast.success('Paper deleted');
  };

  const filtered = papers.filter(p => {
    const q = search.toLowerCase();
    return (
      (!q || p.title.toLowerCase().includes(q) || p.subject.toLowerCase().includes(q)) &&
      (!subject || p.subject === subject) &&
      (!category || p.category === category)
    );
  });

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>📄 Past Papers</h1>
          <p>Browse and download past examination papers</p>
        </div>

        <div className="filter-row">
          <SearchBar value={search} onChange={setSearch} placeholder="Search papers..." />
          <select className="form-control" value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {(search || subject || category) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setSubject(''); setCategory(''); }}>
              Clear
            </button>
          )}
        </div>

        {loading ? <LoadingSpinner /> : (
          filtered.length === 0
            ? <div className="empty-state"><div className="empty-icon">📭</div><p>No papers found</p></div>
            : (
              <>
                <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>{filtered.length} paper(s) found</p>
                <div className="papers-grid">
                  {filtered.map(p => <PaperCard key={p.id} paper={p} onDelete={handleDelete} isAdmin={isAdmin} />)}
                </div>
              </>
            )
        )}
      </div>
    </div>
  );
}
