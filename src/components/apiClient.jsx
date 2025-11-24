const API_BASE_URL = 'https://pispas.bobinadosdumalek.es/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${endpoint}`);
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Manejar respuesta vacía (204)
      if (response.status === 204) {
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API Error:', data);
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('❌ Request failed:', error);
      throw error;
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AUTENTICACIÓN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  auth = {
    login: async (email, password) => {
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (data.token) {
        this.setToken(data.token);
      }
      
      return data;
    },

    logout: async () => {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } finally {
        this.setToken(null);
      }
    },

    me: async () => {
      return this.request('/auth/me', { method: 'GET' });
    },

    updateMe: async (userData) => {
      return this.request('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    },
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ENTIDADES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  entities = {
    // ═══════════════════════════════════════════════
    // INCIDENCIAS
    // ═══════════════════════════════════════════════
    Incident: {
      list: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/incidents${queryString ? '?' + queryString : ''}`;
        return this.request(url, { method: 'GET' });
      },

      filter: async (filters) => {
        return this.entities.Incident.list(filters);
      },

      create: async (data) => {
        return this.request('/incidents', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },

      update: async (id, data) => {
        return this.request(`/incidents/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },

      delete: async (id) => {
        return this.request(`/incidents/${id}`, { method: 'DELETE' });
      },

      get: async (id) => {
        return this.request(`/incidents/${id}`, { method: 'GET' });
      },

      listNotes: async (incidentId) => {
        return this.request(`/incidents/${incidentId}/notes`, {
          method: 'GET',
        });
      },

      addNote: async (incidentId, body) => {
        return this.request(`/incidents/${incidentId}/notes`, {
          method: 'POST',
          body: JSON.stringify({ body }),
        });
      },

      getHistory: async (incidentId) => {
        return this.request(`/incidents/${incidentId}/history`, {
          method: 'GET',
        });
      },
    },

    // ═══════════════════════════════════════════════
    // USUARIOS
    // ═══════════════════════════════════════════════
    User: {
      me: async () => {
        return this.request('/auth/me', { method: 'GET' });
      },

      list: async () => {
        return this.request('/users', { method: 'GET' });
      },
    },

    // ═══════════════════════════════════════════════
    // STOCK (INVENTARIO)
    // ═══════════════════════════════════════════════
    Stock: {
      // Listar todos los items de stock con filtros opcionales
      list: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/stock${queryString ? '?' + queryString : ''}`;
        return this.request(url, { method: 'GET' });
      },

      // Obtener un item específico por ID
      get: async (id) => {
        return this.request(`/stock/${id}`, { method: 'GET' });
      },

      // Buscar item por SKU
      getBySku: async (sku) => {
        return this.request(`/stock/sku/${sku}`, { method: 'GET' });
      },

      // Crear nuevo item de stock
      create: async (data) => {
        return this.request('/stock', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },

      // Actualizar item existente
      update: async (id, data) => {
        return this.request(`/stock/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },

      // Eliminar item
      delete: async (id) => {
        return this.request(`/stock/${id}`, { method: 'DELETE' });
      },

      // Obtener items con stock bajo
      lowStock: async () => {
        return this.request('/stock/low-stock', { method: 'GET' });
      },

      // Obtener estadísticas de inventario
      stats: async () => {
        return this.request('/stock/stats', { method: 'GET' });
      },

      // Agregar stock (entrada de inventario)
      addStock: async (id, quantity, notes = '') => {
        return this.request(`/stock/${id}/add-stock`, {
          method: 'POST',
          body: JSON.stringify({ quantity, notes }),
        });
      },

      // Quitar stock (salida de inventario)
      removeStock: async (id, quantity, reason = '') => {
        return this.request(`/stock/${id}/remove-stock`, {
          method: 'POST',
          body: JSON.stringify({ quantity, reason }),
        });
      },
    },
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MEMORIA (KEY-VALUE STORAGE)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  memory = {
    list: async () => {
      return this.request('/memory', { method: 'GET' });
    },

    get: async (scope, key) => {
      return this.request(`/memory/${scope}/${key}`, { method: 'GET' });
    },

    set: async (scope, key, value, expiresAt = null) => {
      return this.request('/memory', {
        method: 'POST',
        body: JSON.stringify({ scope, key, value, expiresAt }),
      });
    },

    delete: async (scope, key) => {
      return this.request(`/memory/${scope}/${key}`, { method: 'DELETE' });
    },
  };
}

// Crear instancia única del cliente
const apiClient = new ApiClient();

// Hacer disponible globalmente para debugging
if (typeof window !== 'undefined') {
  window.apiClient = apiClient;
}

export default apiClient;
