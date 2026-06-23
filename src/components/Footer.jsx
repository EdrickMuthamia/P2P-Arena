import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>P2P Arena</h2>
            <p style={{ fontSize: '.875rem', maxWidth: 300 }}>
              A collaborative student learning platform for past papers, quizzes, and academic progress tracking.
            </p>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/papers">Past Papers</Link></li>
              <li><Link to="/quizzes">Quizzes</Link></li>
              <li><Link to="/progress">Progress</Link></li>
              <li><Link to="/certificates">Certificates</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Account</h3>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} P2P Arena. Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
}
