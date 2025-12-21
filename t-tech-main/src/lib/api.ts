// Production API utilities for T-Tech & Appliances
const API_BASE_URL = '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
  accessToken: string;
}

interface RegisterResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
  accessToken: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdAt: string;
}

interface Cart {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('accessToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.message || 'Request failed' };
    }
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}

// Authentication API
export const authAPI = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }
    
    // Store token and user data
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Registration failed');
    }
    
    // Store token and user data
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },
};

// Products API
export const productsAPI = {
  async getAll(): Promise<Product[]> {
    const response = await apiRequest<Product[]>('/products');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch products');
    }
    
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await apiRequest<Product>(`/products/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch product');
    }
    
    return response.data;
  },
};

// Cart utility functions (localStorage-based for simplicity)
export const cartUtils = {
  getCartItems(): Array<{ _id: string; name: string; price: number; image: string; quantity: number }> {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  saveCartItems(items: Array<{ _id: string; name: string; price: number; image: string; quantity: number }>): void {
    localStorage.setItem('cart', JSON.stringify(items));
  },

  clearCart(): void {
    localStorage.removeItem('cart');
  },
};

export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartUtils,
};
