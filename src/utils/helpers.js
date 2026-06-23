export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const generateId = () => Date.now().toString();

export const getGrade = (percentage) => {
  if (percentage >= 80) return 'Distinction';
  if (percentage >= 60) return 'Merit';
  if (percentage >= 40) return 'Pass';
  return 'Fail';
};

export const getGradeColor = (percentage) => {
  if (percentage >= 80) return '#16a34a';
  if (percentage >= 60) return '#2563EB';
  if (percentage >= 40) return '#F59E0B';
  return '#dc2626';
};

export const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Science', 'History', 'Geography', 'Economics', 'Business', 'Computer Science', 'Accounting'];
export const CATEGORIES = ['A-Level', 'O-Level'];
