import { Link } from 'react-router-dom';

export default function QuizCard({ quiz }) {
  return (
    <Link to={`/quizzes/${quiz.id}`} style={{ display: 'block' }}>
      <div className="card quiz-card">
        <div className="quiz-card-body">
          <div className="paper-meta" style={{ marginBottom: '.5rem' }}>
            <span className="badge badge-primary">{quiz.category}</span>
          </div>
          <h3>{quiz.title}</h3>
          <p>{quiz.subject}</p>
          <div className="quiz-meta">
            <span className="badge badge-accent">{quiz.subject}</span>
            <span className="quiz-q-count">📝 {quiz.questions.length} questions</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
