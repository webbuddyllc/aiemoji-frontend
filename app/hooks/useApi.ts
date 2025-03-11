'use client';

import { useAuth } from '@/app/contexts/AuthContext';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

export function useApi() {
  const { token, logout } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const api = async (endpoint: string, options: ApiOptions = {}) => {
    try {
      const { method = 'GET', body, headers = {} } = options;

      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
      };

      // Add authorization header if token exists
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        logout(); // Clear auth state
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error: any) {
      // Re-throw the error to be handled by the component
      throw error;
    }
  };

  return api;
} 