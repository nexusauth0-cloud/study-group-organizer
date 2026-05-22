import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || (window.location.origin + '/api');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  oauth: (data) => api.post('/auth/oauth', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  becomeMentor: () => api.put('/auth/become-mentor'),
  deleteAccount: () => api.delete('/auth/account'),
};

export const groupAPI = {
  getAll: (params) => api.get('/groups', { params }),
  getMy: () => api.get('/groups/my'),
  getById: (id) => api.get(`/groups/${id}`),
  create: (data) => api.post('/groups', data),
  join: (id) => api.post(`/groups/${id}/join`),
  leave: (id) => api.post(`/groups/${id}/leave`),
  update: (id, data) => api.put(`/groups/${id}`, data),
};

export const sessionAPI = {
  getByGroup: (groupId) => api.get(`/groups/${groupId}/sessions`),
  create: (groupId, data) => api.post(`/groups/${groupId}/sessions`, data),
  rsvp: (groupId, sessionId) => api.post(`/groups/${groupId}/sessions/${sessionId}/rsvp`),
  update: (groupId, sessionId, data) => api.put(`/groups/${groupId}/sessions/${sessionId}`, data),
  delete: (groupId, sessionId) => api.delete(`/groups/${groupId}/sessions/${sessionId}`),
};

export const resourceAPI = {
  getByGroup: (groupId, params) => api.get(`/groups/${groupId}/resources`, { params }),
  upload: (groupId, data) => api.post(`/groups/${groupId}/resources`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (groupId, resourceId, data) => api.put(`/groups/${groupId}/resources/${resourceId}`, data),
  delete: (groupId, resourceId) => api.delete(`/groups/${groupId}/resources/${resourceId}`),
  download: (groupId, resourceId) => api.post(`/groups/${groupId}/resources/${resourceId}/download`),
};

export const messageAPI = {
  getByGroup: (groupId, params) => api.get(`/groups/${groupId}/messages`, { params }),
  send: (groupId, data) => api.post(`/groups/${groupId}/messages`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  markRead: (groupId) => api.post(`/groups/${groupId}/messages/read`),
};

export const mentorAPI = {
  getAll: (params) => api.get('/mentors', { params }),
  sendRequest: (data) => api.post('/mentors/request', data),
  getMyRequests: () => api.get('/mentors/requests'),
  getRequestsForMe: () => api.get('/mentors/requests/me'),
  respond: (id, data) => api.put(`/mentors/requests/${id}/respond`, data),
  rate: (id, data) => api.put(`/mentors/requests/${id}/rate`, data),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const userAPI = {
  search: (q) => api.get('/users/search', { params: { q } }),
  getById: (id) => api.get(`/users/${id}`),
};

export default api;
