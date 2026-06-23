import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, createUser } from '../services/api';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data: users } = await getUsers();
      if (users.find(u => u.email === form.email)) { toast.error('Email already registered'); return; }
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
      toast.error('Server error. Is json-server running?');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, type, placeholder) => (
    <div className="form-group">
      <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
      <input className="form-control" type={type} required placeholder={placeholder}
        value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
    </div>
  );

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Create Account</h2>
        <p>Join P2P Arena and start learning</p>
        <form onSubmit={handleSubmit}>
          {field('name', 'text', 'Your full name')}
          {field('email', 'email', 'you@example.com')}
          {field('password', 'password', 'Min. 6 characters')}
          {field('confirm', 'password', 'Repeat your password')}
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
