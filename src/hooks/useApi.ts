import { useState, useEffect } from 'react';
import { api } from '../lib/api';

// Hook pour les statistiques
export function useStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.stats.get();
      setStats(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}

// Hook pour les demandes d'inscription
export function useRegistrations(filters?: any) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.registration.list(filters);
      setRegistrations(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRegistration = async (id: string, data: any) => {
    try {
      await api.registration.update(id, data);
      await fetchRegistrations(); // Refresh
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [JSON.stringify(filters)]);

  return { 
    registrations, 
    loading, 
    error, 
    refetch: fetchRegistrations,
    updateRegistration 
  };
}

// Hook pour les utilisateurs
export function useUsers(filters?: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.users.list(filters);
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: any) => {
    try {
      await api.users.update(id, data);
      await fetchUsers(); // Refresh
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.users.delete(id);
      await fetchUsers(); // Refresh
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(filters)]);

  return { 
    users, 
    loading, 
    error, 
    refetch: fetchUsers,
    updateUser,
    deleteUser 
  };
}

// Hook pour les notifications
export function useNotifications(filters?: any) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.notifications.list(filters);
      setNotifications(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (data: any) => {
    try {
      await api.notifications.send(data);
      await fetchNotifications(); // Refresh
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [JSON.stringify(filters)]);

  return { 
    notifications, 
    loading, 
    error, 
    refetch: fetchNotifications,
    sendNotification 
  };
}

// Hook pour l'OTP
export function useOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = async (email: string, username?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.otp.send(email, username);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.otp.verify(email, otp);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, verifyOtp, loading, error };
}