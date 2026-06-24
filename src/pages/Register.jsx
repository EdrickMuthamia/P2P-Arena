import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, createUser } from '../services/api';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

function PasswordToggle({ field, showPassword, setShowPassword, value, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        className="form-control"
        type={showPassword ? 'text' : 'password'}
        required
        placeholder={field === 'password' ? 'Min. 6 characters' : 'Repeat your password'}
        style={{ paddingRight: '3rem' }}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword(s => !s)}
        style={{
          position: 'absolute', right: '0.75rem', top: '50%',
          transform: 'translateY(-50%)', background: 'none',
          border: 'none', cursor: 'pointer', fontSize: '1.1rem',
          color: 'var(--text-muted)', lineHeight: 1,
        }}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data: accounts } = await getUsers();
      if (accounts.find(u => u.email === form.email)) { toast.error('Email already registered'); setLoading(false); return; }
      const newUser = {
        id: generateId(), name: form.name, email: form.email,
        password: form.password, role: 'student', avatar: '',
        joinedAt: new Date().toISOString().split('T')[0], bio: '',
      };
      await createUser(newUser);
      login(newUser);
      toast.success('Account created!');
      navigate('/');
    } catch {
      toast.error('Server error. Run: npm run dev');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Create Account</h2>
        <p>Join P2P Arena and start learning</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input className="form-control" type="text" required placeholder="Your full name"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" required placeholder="you@example.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <PasswordToggle field="password" showPassword={showPassword} setShowPassword={setShowPassword} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <PasswordToggle field="confirm" showPassword={showPassword} setShowPassword={setShowPassword} value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
