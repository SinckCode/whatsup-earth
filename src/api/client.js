/**
 * Unified API Client
 * Consolidates all API calls into a single, centralized client with:
 * - Token-aware auth handling
 * - Consistent error handling
 * - Automatic retry on 401 (token refresh)
 * - Request/response interceptors
 */

import { API_BASE_URL } from './config';

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = null;
    this.onTokenRefresh = null; // Callback for token refresh
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Set auth token
   * @param {string|null} token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Get current auth token
   * @returns {string|null}
   */
  getToken() {
    return this.token;
  }

  /**
   * Register token refresh callback
   * @param {Function} callback - Called when token refresh is needed
   */
  onNeedTokenRefresh(callback) {
    this.onTokenRefresh = callback;
  }

  /**
   * Add request interceptor
   * @param {Function} interceptor
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   * @param {Function} interceptor
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Make API request
   * @param {string} path - Relative path (e.g., '/auth/login')
   * @param {Object} options
   * @param {string} [options.method='GET']
   * @param {Object} [options.body] - Serialized as JSON
   * @param {Object} [options.headers] - Additional headers
   * @param {string} [options.token] - Override auth token
   * @returns {Promise<Object>}
   */
  async request(path, {
    method = 'GET',
    body,
    headers: customHeaders = {},
    token,
  } = {}) {
    const url = `${this.baseUrl}${path}`;
    const authToken = token || this.token;

    // Build headers
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    // Apply request interceptors
    let requestConfig = { method, headers, body, url };
    for (const interceptor of this.requestInterceptors) {
      requestConfig = await interceptor(requestConfig);
    }

    // Build fetch options
    const fetchOptions = {
      method: requestConfig.method,
      headers: requestConfig.headers,
    };

    if (requestConfig.body !== undefined) {
      fetchOptions.body = JSON.stringify(requestConfig.body);
    }

    // Make request
    let response = await fetch(requestConfig.url, fetchOptions);

    // Parse response
    let data;
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text || null;
    }

    // Apply response interceptors
    let responseConfig = { status: response.status, data, ok: response.ok };
    for (const interceptor of this.responseInterceptors) {
      responseConfig = await interceptor(responseConfig);
    }

    // Handle errors
    if (!responseConfig.ok) {
      // If 401 and we have a token refresh callback, try refreshing
      if (responseConfig.status === 401 && this.onTokenRefresh) {
        try {
          await this.onTokenRefresh();
          // Retry request with new token
          return this.request(path, { method, body, headers: customHeaders });
        } catch (err) {
          const error = new Error(responseConfig.data?.message || 'Unauthorized');
          error.status = 401;
          error.data = responseConfig.data;
          throw error;
        }
      }

      const error = new Error(
        responseConfig.data?.message ||
        responseConfig.data?.error ||
        `Error ${responseConfig.status}`
      );
      error.status = responseConfig.status;
      error.data = responseConfig.data;
      throw error;
    }

    return responseConfig.data;
  }

  // Convenience methods
  get(path, options) {
    return this.request(path, { ...options, method: 'GET' });
  }

  post(path, body, options) {
    return this.request(path, { ...options, method: 'POST', body });
  }

  put(path, body, options) {
    return this.request(path, { ...options, method: 'PUT', body });
  }

  patch(path, body, options) {
    return this.request(path, { ...options, method: 'PATCH', body });
  }

  delete(path, options) {
    return this.request(path, { ...options, method: 'DELETE' });
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export class for testing/custom instances
export default ApiClient;
