import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-p">P</span>
          <span className="brand-2">2</span>
          <span className="brand-rest">P Arena</span>
        </Link>

        <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/papers" onClick={() => setMenuOpen(false)}>Papers</NavLink>
          <NavLink to="/quizzes" onClick={() => setMenuOpen(false)}>Quizzes</NavLink>
          {user && <NavLink to="/progress" onClick={() => setMenuOpen(false)}>Progress</NavLink>}
          {user && <NavLink to="/certificates" onClick={() => setMenuOpen(false)}>Certificates</NavLink>}
          <NavLink to="/feedback" onClick={() => setMenuOpen(false)}>Feedback</NavLink>
          {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/profile" className="user-chip">
                <div className="user-avatar">{user.name[0]}</div>
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
