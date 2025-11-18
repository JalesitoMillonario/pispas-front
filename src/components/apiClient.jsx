// ✅ Cliente API completamente independiente - SIN dependencias de base44
const API_BASE_URL = 'https://pispas.bobinadosdumalek.es/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    console.log('🔧 ApiClient initialized. Token exists:', !!this.token);
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
    console.log('✅ Token saved to localStorage');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    console.log('🗑️ Token cleared from localStorage');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    console.log('📤 Making request:', {
      method: config.method || 'GET',
      url,
      hasToken: !!this.token
    });

    try {
      const response = await fetch(url, config);
      
      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText
      });

      if (response.status === 401) {
        this.clearToken();
        throw new Error('Unauthorized - Por favor inicia sesión');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }));
        console.error('❌ Request failed:', error);
        throw new Error(error.error || error.message || `Request failed with status ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      console.log('✅ Request successful');
      return data;
    } catch (error) {
      console.error('❌ Request error:', error);
      throw error;
    }
  }

  auth = {
    login: async (email, password) => {
      console.log('🔐 Attempting login for:', email);
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      console.log('✅ Login successful, saving token...');
      this.setToken(data.token);
      return data.user;
    },

    logout: async () => {
      console.log('👋 Logging out...');
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error('Error during logout:', error);
      }
      this.clearToken();
    },

    me: async () => {
      console.log('👤 Fetching current user...');
      return this.request('/auth/me');
    },

    updateMe: async (userData) => {
      console.log('📝 Updating current user...');
      return this.request('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    },

    isAuthenticated: () => {
      return !!this.token;
    },

    redirectToLogin: (nextUrl) => {
      const url = nextUrl ? `/auth?next=${encodeURIComponent(nextUrl)}` : '/auth';
      window.location.href = url;
    },
  };

  entities = {
    Incident: {
      list: async (sort = '-created_date', limit = 100) => {
        const params = new URLSearchParams();
        if (sort) params.append('sort', sort);
        if (limit) params.append('limit', limit);
        return this.request(`/incidents?${params.toString()}`);
      },

      filter: async (filters = {}, sort = '-created_date', limit = 100) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            params.append(key, filters[key]);
          }
        });
        if (sort) params.append('sort', sort);
        if (limit) params.append('limit', limit);
        return this.request(`/incidents?${params.toString()}`);
      },

      create: async (incidentData) => {
        return this.request('/incidents', {
          method: 'POST',
          body: JSON.stringify(incidentData),
        });
      },

      update: async (id, incidentData) => {
        return this.request(`/incidents/${id}`, {
          method: 'PUT',
          body: JSON.stringify(incidentData),
        });
      },

      delete: async (id) => {
        return this.request(`/incidents/${id}`, {
          method: 'DELETE',
        });
      },

      get: async (id) => {
        return this.request(`/incidents/${id}`);
      },

      listNotes: async (incidentId) => {
        return this.request(`/incidents/${incidentId}/notes`);
      },

      addNote: async (incidentId, body) => {
        return this.request(`/incidents/${incidentId}/notes`, {
          method: 'POST',
          body: JSON.stringify({ body }),
        });
      },

      getHistory: async (incidentId) => {
        return this.request(`/incidents/${incidentId}/history`);
      },
    },

    User: {
      me: async () => {
        return this.request('/auth/me');
      },

      list: async () => {
        return this.request('/users');
      },
    },
  };

  memory = {
    list: async () => {
      return this.request('/memory');
    },

    get: async (scope, key) => {
      return this.request(`/memory/${scope}/${key}`);
    },

    set: async (scope, key, value) => {
      return this.request('/memory', {
        method: 'POST',
        body: JSON.stringify({ scope, key, value }),
      });
    },

    delete: async (scope, key) => {
      return this.request(`/memory/${scope}/${key}`, {
        method: 'DELETE',
      });
    },
  };
}

export const apiClient = new ApiClient();