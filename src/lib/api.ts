import { supabase } from './supabase';

// Vérification de la connexion Supabase
if (!supabase) {
  throw new Error('Client Supabase non initialisé')
}

console.log('🔗 API Client initialisé avec Supabase')

// Configuration de base pour les APIs
const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Classe utilitaire pour les appels API
class ApiClient {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const { data: session } = await supabase.auth.getSession();
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.session?.access_token || ''}`,
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}/functions/v1/${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }));
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    }

    return response.json();
  }

  // API Registration
  async createRegistration(data: any) {
    return this.makeRequest('api-registration', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRegistrations(filters: { status?: string; user_type?: string; limit?: number } = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    return this.makeRequest(`api-registration?${params.toString()}`);
  }

  async updateRegistration(id: string, data: any) {
    return this.makeRequest(`api-registration/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // API Users
  async getUsers(filters: { user_type?: string; limit?: number } = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    return this.makeRequest(`api-users?${params.toString()}`);
  }

  async getUser(id: string) {
    return this.makeRequest(`api-users/${id}`);
  }

  async updateUser(id: string, data: any) {
    return this.makeRequest(`api-users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.makeRequest(`api-users/${id}`, {
      method: 'DELETE',
    });
  }

  // API Stats
  async getStats() {
    return this.makeRequest('api-stats');
  }

  // API Notifications
  async sendNotification(data: {
    type: 'email' | 'system' | 'push';
    recipient: string;
    title: string;
    message: string;
    data?: any;
  }) {
    return this.makeRequest('api-notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNotifications(filters: { recipient?: string; type?: string; limit?: number } = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    return this.makeRequest(`api-notifications?${params.toString()}`);
  }

  // API OTP (microservice externe)
  async sendOtp(email: string, username?: string) {
    const response = await fetch('http://localhost:3001/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur OTP' }));
      throw new Error(errorData.error || 'Erreur lors de l\'envoi OTP');
    }

    return response.json();
  }

  async verifyOtp(email: string, otp: string) {
    const response = await fetch('http://localhost:3001/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur OTP' }));
      throw new Error(errorData.error || 'Code OTP invalide');
    }

    return response.json();
  }

  // API Approval (utilise les fonctions existantes)
  async approveRegistration(pendingUserId: string, adminUserId: string) {
    return this.makeRequest('approve-registration', {
      method: 'POST',
      body: JSON.stringify({ pendingUserId, adminUserId }),
    });
  }
}

// Instance singleton
export const apiClient = new ApiClient();

// Fonctions utilitaires pour l'usage direct
export const api = {
  // Registration
  registration: {
    create: (data: any) => apiClient.createRegistration(data),
    list: (filters?: any) => apiClient.getRegistrations(filters),
    update: (id: string, data: any) => apiClient.updateRegistration(id, data),
  },

  // Users
  users: {
    list: (filters?: any) => apiClient.getUsers(filters),
    get: (id: string) => apiClient.getUser(id),
    update: (id: string, data: any) => apiClient.updateUser(id, data),
    delete: (id: string) => apiClient.deleteUser(id),
  },

  // Stats
  stats: {
    get: () => apiClient.getStats(),
  },

  // Notifications
  notifications: {
    send: (data: any) => apiClient.sendNotification(data),
    list: (filters?: any) => apiClient.getNotifications(filters),
  },

  // OTP
  otp: {
    send: (email: string, username?: string) => apiClient.sendOtp(email, username),
    verify: (email: string, otp: string) => apiClient.verifyOtp(email, otp),
  },

  // Approval
  approval: {
    approve: (pendingUserId: string, adminUserId: string) => 
      apiClient.approveRegistration(pendingUserId, adminUserId),
  },
};

export default apiClient;