/**
 * API Endpoints
 * All API calls go through the unified apiClient.
 * This file consolidates endpoints from: authApi, userApi, favoritesApi, etc.
 */

import { apiClient } from './client';

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export const auth = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// ============================================================================
// USER ENDPOINTS
// ============================================================================

export const user = {
  getMe: () => apiClient.get('/users/me'),
  updateMe: (data) => apiClient.put('/users/me', data),
  updatePreferences: (data) => apiClient.put('/users/me/preferences', data),
};

// ============================================================================
// ACTIVITIES ENDPOINTS
// ============================================================================

export const activity = {
  getLog: (limit = 50, offset = 0) =>
    apiClient.get(`/activity?limit=${limit}&offset=${offset}`),
};

// ============================================================================
// ALERTS ENDPOINTS
// ============================================================================

export const alerts = {
  create: (data) => apiClient.post('/alerts', data),
  list: () => apiClient.get('/alerts'),
  get: (id) => apiClient.get(`/alerts/${id}`),
  update: (id, data) => apiClient.put(`/alerts/${id}`, data),
  delete: (id) => apiClient.delete(`/alerts/${id}`),
};

// ============================================================================
// REGIONS ENDPOINTS
// ============================================================================

export const regions = {
  create: (data) => apiClient.post('/regions', data),
  list: () => apiClient.get('/regions'),
  get: (id) => apiClient.get(`/regions/${id}`),
  update: (id, data) => apiClient.put(`/regions/${id}`, data),
  delete: (id) => apiClient.delete(`/regions/${id}`),
};

// ============================================================================
// EVENTS ENDPOINTS
// ============================================================================

export const events = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/events${query ? '?' + query : ''}`);
  },
  get: (id) => apiClient.get(`/events/${id}`),
  sync: (slug, year) => apiClient.post(`/events/sync/${slug}/${year}`, {}),
};

// ============================================================================
// CATEGORIES ENDPOINTS
// ============================================================================

export const categories = {
  list: () => apiClient.get('/categories'),
  get: (slug) => apiClient.get(`/categories/${slug}`),
  create: (data) => apiClient.post('/categories', data),
  update: (slug, data) => apiClient.put(`/categories/${slug}`, data),
};

// ============================================================================
// FAVORITES ENDPOINTS
// ============================================================================

export const favorites = {
  list: () => apiClient.get('/favorites'),
  create: (data) => apiClient.post('/favorites', data),
  delete: (id) => apiClient.delete(`/favorites/${id}`),
};

// ============================================================================
// SAVED VIEWS ENDPOINTS
// ============================================================================

export const savedViews = {
  list: () => apiClient.get('/saved-views'),
  create: (data: any) => apiClient.post('/saved-views', data),
  delete: (id: any) => apiClient.delete(`/saved-views/${id}`),
};

// ============================================================================
// NOTIFICATIONS ENDPOINTS
// ============================================================================

export const notifications = {
  list: (limit = 20, offset = 0) =>
    apiClient.get(`/notifications?limit=${limit}&offset=${offset}`),
  unreadCount: () => apiClient.get('/notifications/unread-count'),
  markAsRead: (id: number) => apiClient.put(`/notifications/${id}`, { isRead: true }),
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
  delete: (id: number) => apiClient.delete(`/notifications/${id}`),
};

// ============================================================================
// COMMENTS ENDPOINTS
// ============================================================================

export const comments = {
  listByEvent: (eventId: string) => apiClient.get(`/comments?eventId=${eventId}`),
  create: (data: any) => apiClient.post('/comments', data),
  update: (id: string, data: any) => apiClient.put(`/comments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/comments/${id}`),
};

// ============================================================================
// EVENT STATS ENDPOINTS
// ============================================================================

export const eventStats = {
  get: (eventId: string) => apiClient.get(`/event-stats/${eventId}`),
  recordView: (eventId: string) => apiClient.post(`/event-stats/${eventId}/view`),
};
