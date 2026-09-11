const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  getProblems: () =>
    request('/problems'),

  getProblem: (problemId) =>
    request(`/problems/${problemId}`),

  startAttempt: (problemId) =>
    request(`/practice/problems/${problemId}/attempts`, {
      method: 'POST',
    }),

  submitAttempt: (attemptId, submission) =>
    request(`/practice/attempts/${attemptId}/submission`, {
      method: 'POST',
      body: JSON.stringify(submission),
    }),

  getAttempt: (attemptId) =>
    request(`/practice/attempts/${attemptId}`),

  getAttemptHistory: (problemId) =>
    request(`/practice/problems/${problemId}/attempts`),
};