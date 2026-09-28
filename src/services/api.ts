import { IUser, ITest, IBooking, IAdminStats } from '../types/index.js';

const API_BASE = '/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('medilab_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.message || (response.status === 404 ? 'Resource not found' : 'Something went wrong. Please try again.');
      throw new ApiError(errorMessage, response.status);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or client connection error
    throw new ApiError('Unable to connect to MediLab services. Please check your connection and try again.', 0);
  }
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ token: string; user: IUser; message: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: { name: string; email: string; phone: string; password: string; confirmPassword?: string; address?: string }) =>
      request<{ token: string; user: IUser; message: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getMe: () => request<{ user: IUser }>('/auth/me'),
  },

  // Tests
  tests: {
    getAll: (params?: { category?: string; search?: string; sort?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== 'All') searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.sort) searchParams.set('sort', params.sort);
      const qs = searchParams.toString();
      return request<{ count: number; tests: ITest[] }>(`/tests${qs ? `?${qs}` : ''}`);
    },
    getById: (id: string) => request<{ test: ITest }>(`/tests/${id}`),
    create: (testData: Partial<ITest>) =>
      request<{ message: string; test: ITest }>('/tests', {
        method: 'POST',
        body: JSON.stringify(testData),
      }),
    update: (id: string, testData: Partial<ITest>) =>
      request<{ message: string; test: ITest }>(`/tests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(testData),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/tests/${id}`, {
        method: 'DELETE',
      }),
  },

  // Bookings
  bookings: {
    create: (bookingData: {
      testId: string;
      patientDetails: {
        type: 'self' | 'family';
        name: string;
        age: number;
        gender: string;
        phone: string;
        relation?: string;
      };
      collectionMethod: 'home' | 'lab';
      address?: {
        street: string;
        city: string;
        pincode: string;
      };
      date: string;
      timeSlot: string;
    }) =>
      request<{ message: string; booking: IBooking; token?: string; user?: IUser }>('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }),
    getAll: (params?: { status?: string; search?: string; phone?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.status && params.status !== 'All') searchParams.set('status', params.status);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.phone) searchParams.set('phone', params.phone);
      const qs = searchParams.toString();
      return request<{ count: number; bookings: IBooking[] }>(`/bookings${qs ? `?${qs}` : ''}`);
    },
    getById: (id: string) => request<{ booking: IBooking }>(`/bookings/${id}`),
    update: (id: string, updateData: Partial<IBooking>) =>
      request<{ message: string; booking: IBooking }>(`/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      }),
    cancel: (id: string) =>
      request<{ message: string; booking: IBooking }>(`/bookings/${id}`, {
        method: 'DELETE',
      }),
  },

  // User Profile
  user: {
    getProfile: () => request<{ user: IUser }>('/users/profile'),
    updateProfile: (profileData: Partial<IUser>) =>
      request<{ message: string; user: IUser }>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
  },

  // Admin
  admin: {
    getStats: () => request<IAdminStats>('/admin/stats'),
    getUsers: () => request<{ users: IUser[] }>('/admin/users'),
  },
};
