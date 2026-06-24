import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' });

// --- Auth ---
export const getUsers = () => API.get('/accounts');
export const getUserByEmail = (email) => API.get(`/accounts?email=${email}`);
export const createUser = (data) => API.post('/accounts', data);
export const updateUser = (id, data) => API.patch(`/accounts/${id}`, data);

// --- Papers ---
export const getPapers = () => API.get('/papers');
export const getPaper = (id) => API.get(`/papers/${id}`);
export const createPaper = (data) => API.post('/papers', data);
export const updatePaper = (id, data) => API.patch(`/papers/${id}`, data);
export const deletePaper = (id) => API.delete(`/papers/${id}`);

// --- Quizzes ---
export const getQuizzes = () => API.get('/quizzes');
export const getQuiz = (id) => API.get(`/quizzes/${id}`);
export const createQuiz = (data) => API.post('/quizzes', data);
export const updateQuiz = (id, data) => API.patch(`/quizzes/${id}`, data);
export const deleteQuiz = (id) => API.delete(`/quizzes/${id}`);

// --- Quiz Results ---
export const getQuizResults = (userId) => API.get(`/quizResults?userId=${userId}`);
export const saveQuizResult = (data) => API.post('/quizResults', data);
export const getAllQuizResults = () => API.get('/quizResults');

// --- Certificates ---
export const getCertificates = (userId) => API.get(`/certificates?userId=${userId}`);
export const createCertificate = (data) => API.post('/certificates', data);
export const deleteCertificate = (id) => API.delete(`/certificates/${id}`);

// --- Feedback ---
export const getFeedback = () => API.get('/feedback');
export const createFeedback = (data) => API.post('/feedback', data);
export const deleteFeedback = (id) => API.delete(`/feedback/${id}`);
