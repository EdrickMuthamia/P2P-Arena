import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: accounts } = await getUsers();
      const found = accounts.find(
        u => u.email === email && u.password === password && u.role === role
      );
      if (!found) {
        toast.error('Invalid credentials or wrong role selected');
        setLoading(false);
        return;
      }
      login(found);
      toast.success(`Welcome back, ${found.name.split(' ')[0]}!`);
      navigate(found.role === 'admin' ? '/admin' : '/');
    } catch {
      toast.error('Server error. Run: npm run dev');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your P2P Arena account</p>

        <form onSubmit={handleSubmit}>
          {/* Role Selector */}
          <div className="form-group">
            <label>Sign in as</label>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  flex: 1, padding: '.75rem', borderRadius: 'var(--radius)',
                  border: `2px solid ${role === 'student' ? 'var(--primary)' : 'var(--border)'}`,
                  background: role === 'student' ? '#eff6ff' : 'transparent',
                  color: role === 'student' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: 700, fontSize: '.95rem', cursor: 'pointer',
                  transition: 'all .2s',
                }}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                style={{
                  flex: 1, padding: '.75rem', borderRadius: 'var(--radius)',
                  border: `2px solid ${role === 'admin' ? 'var(--primary)' : 'var(--border)'}`,
                  background: role === 'admin' ? '#eff6ff' : 'transparent',
                  color: role === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: 700, fontSize: '.95rem', cursor: 'pointer',
                  transition: 'all .2s',
                }}
              >
                ⚡ Admin
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control" type="email" required placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-control"
                type={showPassword ? 'text' : 'password'}
                required placeholder="••••••••"
                style={{ paddingRight: '3rem' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                style={{
                  position: 'absolute', right: '.75rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: '1.1rem',
                  color: 'var(--text-muted)', lineHeight: 1,
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : `Sign In as ${role === 'admin' ? 'Admin' : 'Student'}`}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>

        <div style={{ marginTop: '1rem', padding: '.75rem', background: '#f1f5f9', borderRadius: 'var(--radius)', fontSize: '.8rem' }}>
          <strong>Demo accounts:</strong><br />
          🎓 Student: jane@student.com / jane123<br />
          ⚡ Admin: admin@p2parena.com / admin123
        </div>
      </div>
    </div>
  );
}
