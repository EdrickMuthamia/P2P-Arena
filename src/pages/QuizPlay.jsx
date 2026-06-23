import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuiz, saveQuizResult, createCertificate } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { generateId, getGrade, getGradeColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function QuizPlay() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getQuiz(id)
      .then(r => setQuiz(r.data))
      .catch(() => { toast.error('Quiz not found'); navigate('/quizzes'); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!quiz) return null;

  const q = quiz.questions[current];
  const total = quiz.questions.length;
  const progress = ((current) / total) * 100;

  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) { toast.error('Please select an answer'); return; }
    if (!showFeedback) { setShowFeedback(true); return; }
    const updated = [...answers, selected];
    setAnswers(updated);
    setSelected(null);
    setShowFeedback(false);
    if (current + 1 < total) {
      setCurrent(c => c + 1);
    } else {
      finishQuiz(updated);
    }
  };

  const finishQuiz = async (finalAnswers) => {
    const score = finalAnswers.reduce((acc, ans, i) => acc + (ans === quiz.questions[i].correct ? 1 : 0), 0);
    const percentage = Math.round((score / total) * 100);
    const grade = getGrade(percentage);
    const res = { id: generateId(), userId: user?.id, quizId: quiz.id, quizTitle: quiz.title, subject: quiz.subject, score, total, percentage, grade, dateTaken: new Date().toISOString().split('T')[0], answers: finalAnswers };
    setResult(res);
    setFinished(true);
    if (user) {
      await saveQuizResult(res);
      if (percentage >= 80) {
        await createCertificate({ id: generateId(), userId: user.id, title: `${quiz.subject} Excellence`, subject: quiz.subject, achievement: `Scored ${percentage}% in ${quiz.title}`, issuedDate: new Date().toISOString().split('T')[0], grade });
        toast.success('🏆 Certificate earned!');
      }
    }
  };

  if (finished && result) {
    const color = getGradeColor(result.percentage);
    return (
      <div className="page">
        <div className="container">
          <div className="card result-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Quiz Complete! 🎉</h2>
            <div className="result-score" style={{ color }}>{result.percentage}%</div>
            <div className="result-grade" style={{ color }}>{result.grade}</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{result.score} out of {result.total} correct</p>
            {result.percentage >= 80 && <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '1rem' }}>🏆 Certificate awarded!</p>}
            <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <p style={{ fontWeight: 700, marginBottom: '.75rem' }}>Answer Review</p>
              {quiz.questions.map((q, i) => {
                const correct = result.answers[i] === q.correct;
                return (
                  <div key={q.id} style={{ marginBottom: '.5rem', fontSize: '.875rem', display: 'flex', gap: '.5rem' }}>
                    <span>{correct ? '✅' : '❌'}</span>
                    <span>{q.question} — <em style={{ color: 'var(--text-muted)' }}>{q.options[q.correct]}</em></span>
                  </div>
                );
              })}
            </div>
            <div className="result-actions">
              <button className="btn btn-primary" onClick={() => { setCurrent(0); setAnswers([]); setSelected(null); setShowFeedback(false); setFinished(false); setResult(null); }}>Retry Quiz</button>
              <Link to="/quizzes" className="btn btn-outline">All Quizzes</Link>
              {user && <Link to="/progress" className="btn btn-ghost">View Progress</Link>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getOptionClass = (idx) => {
    if (!showFeedback) return selected === idx ? 'option-btn selected' : 'option-btn';
    if (idx === q.correct) return 'option-btn correct';
    if (idx === selected && selected !== q.correct) return 'option-btn wrong';
    return 'option-btn';
  };

  return (
    <div className="page">
      <div className="container">
        <div className="quiz-container">
          <div className="quiz-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{quiz.title}</h2>
              <span style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>Q{current + 1}/{total}</span>
            </div>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="badge badge-accent">{quiz.subject}</span>
          </div>

          <div className="question-card">
            <p className="question-text">{q.question}</p>
            <div className="options-list">
              {q.options.map((opt, idx) => (
                <button key={idx} className={getOptionClass(idx)} onClick={() => handleSelect(idx)} disabled={showFeedback}>
                  <span style={{ marginRight: '.5rem', fontWeight: 600 }}>{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-nav">
            <Link to="/quizzes" className="btn btn-ghost btn-sm">✕ Exit</Link>
            <button className="btn btn-primary" onClick={handleNext}>
              {!showFeedback ? 'Check Answer' : current + 1 < total ? 'Next Question →' : 'Finish Quiz 🎉'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
