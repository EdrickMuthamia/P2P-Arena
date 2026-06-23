import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../services/api';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser: updateCtx } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, bio: user.bio || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(user.id, form);
      updateCtx(form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="profile-header">
          <div className="profile-avatar-lg">{user.name[0]}</div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>
              <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                {user.role === 'admin' ? '⚡ Admin' : '🎓 Student'}
              </span>
              &nbsp; Joined {formatDate(user.joinedAt)}
            </p>
          </div>
        </div>

        {!editing ? (
          <div className="card card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700 }}>Profile Details</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>
            </div>
            <p><strong>Name:</strong> {user.name}</p>
            <p style={{ marginTop: '.5rem' }}><strong>Email:</strong> {user.email}</p>
            <p style={{ marginTop: '.5rem' }}><strong>Bio:</strong> {user.bio || <em style={{ color: 'var(--text-muted)' }}>No bio yet</em>}</p>
          </div>
        ) : (
          <form className="card card-body" onSubmit={handleSave}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Edit Profile</h3>
            <div className="form-group">
              <label>Name</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea className="form-control" rows={3} value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself..." />
            </div>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
