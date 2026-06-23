import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: '📄', title: 'Past Papers', desc: 'Access 20+ exam papers across all subjects and levels.' },
  { icon: '🧠', title: 'Quizzes', desc: 'Test your knowledge with multiple-choice quizzes and instant results.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Monitor your learning journey with detailed analytics.' },
  { icon: '🏆', title: 'Certificates', desc: 'Earn and download certificates for your achievements.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Your Academic <span>Success</span> Starts Here</h1>
            <p>
              Access past papers, take quizzes, track your progress, and earn certificates — all in one collaborative student platform.
            </p>
            <div className="hero-btns">
              <Link to="/papers" className="btn btn-accent btn-lg">Browse Papers</Link>
              {!user
                ? <Link to="/register" className="btn btn-outline btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>Get Started</Link>
                : <Link to="/quizzes" className="btn btn-outline btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>Take a Quiz</Link>
              }
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><h3>20+</h3><p>Past Papers</p></div>
            <div className="hero-stat"><h3>4+</h3><p>Subjects</p></div>
            <div className="hero-stat"><h3>100%</h3><p>Free Access</p></div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="mission-section">
            <p style={{ fontSize: '.875rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '.75rem' }}>OUR MISSION</p>
            <blockquote>
              "To provide students with a collaborative platform for accessing past papers, practicing through quizzes, tracking academic progress, and achieving learning goals."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Everything You Need to Succeed</h2>
            <p>All the tools a student needs to prepare for exams and track their learning journey.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="card feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="section" style={{ background: 'var(--primary)', color: '#fff' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '.75rem' }}>Ready to Start Learning?</h2>
            <p style={{ opacity: .85, marginBottom: '2rem' }}>Join hundreds of students already using P2P Arena.</p>
            <Link to="/register" className="btn btn-accent btn-lg">Create Free Account</Link>
          </div>
        </section>
      )}
    </>
  );
}
