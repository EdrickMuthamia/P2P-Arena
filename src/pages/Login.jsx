import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: users } = await getUsers();
      const found = users.find(u => u.email === form.email && u.password === form.password);
      if (!found) { toast.error('Invalid email or password'); return; }
      login(found);
      toast.success(`Welcome back, ${found.name.split(' ')[0]}!`);
      navigate(found.role === 'admin' ? '/admin' : '/');
    } catch {
      toast.error('Server error. Is json-server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your P2P Arena account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" required placeholder="you@example.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" required placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        <div style={{ marginTop: '1rem', padding: '.75rem', background: '#f1f5f9', borderRadius: 'var(--radius)', fontSize: '.8rem' }}>
          <strong>Demo accounts:</strong><br />
          Admin: admin@p2parena.com / admin123<br />
          Student: jane@student.com / jane123
        </div>
      </div>
    </div>
  );
}
