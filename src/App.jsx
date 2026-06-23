import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Papers from './pages/Papers';
import PaperDetail from './pages/PaperDetail';
import Quizzes from './pages/Quizzes';
import QuizPlay from './pages/QuizPlay';
import Progress from './pages/Progress';
import Certificates from './pages/Certificates';
import Feedback from './pages/Feedback';
import Admin from './pages/Admin';

import './styles/main.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/papers" element={<Papers />} />
            <Route path="/papers/:id" element={<PaperDetail />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/:id" element={<QuizPlay />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="*" element={
              <div className="page"><div className="container">
                <div className="empty-state"><div className="empty-icon">🔍</div><p>Page not found</p></div>
              </div></div>
            } />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
