// Client-side API utilities for making requests to backend

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
          errors: data.errors,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    name: string;
    type: 'artist' | 'host';
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getUsers(params?: {
    type?: 'artist' | 'host';
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Booking endpoints
  async getBookings(params?: {
    status?: string;
    artistId?: string;
    hostId?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/bookings${query ? `?${query}` : ''}`);
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async createBooking(bookingData: {
    artistId: string;
    hostId: string;
    eventDate: string;
    duration: number;
    message?: string;
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(id: string, updates: { status?: string; message?: string }) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async cancelBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // Application endpoints
  async getApplications(params?: {
    status?: string;
    type?: 'artist' | 'host';
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/applications${query ? `?${query}` : ''}`);
  }

  async getApplication(id: string) {
    return this.request(`/applications/${id}`);
  }

  async submitApplication(applicationData: {
    type: 'artist' | 'host';
    data: any;
  }) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async reviewApplication(id: string, review: {
    status: 'approved' | 'rejected';
    notes?: string;
  }) {
    return this.request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(review),
    });
  }

  // Media endpoints
  async uploadMedia(formData: FormData) {
    return this.request('/media/upload', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  async getMedia(params?: {
    userId?: string;
    category?: string;
    type?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/media/upload${query ? `?${query}` : ''}`);
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Hook for React components
export function useApiClient() {
  return apiClient;
}

// Utility functions for common API patterns
export async function handleApiResponse<T>(
  response: ApiResponse<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: string, errors?: string[]) => void
): Promise<boolean> {
  if (response.success && response.data) {
    onSuccess?.(response.data);
    return true;
  } else {
    onError?.(response.error || 'Unknown error', response.errors);
    return false;
  }
}

// Error handling utilities
export function formatApiErrors(errors?: string[]): string {
  if (!errors || errors.length === 0) {
    return 'An unknown error occurred';
  }
  if (errors.length === 1) {
    return errors[0];
  }
  return errors.join(', ');
}
