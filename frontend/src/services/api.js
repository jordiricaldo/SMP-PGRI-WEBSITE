// services/api.js
// Service untuk komunikasi dengan Backend API + Authentication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper: Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper: Set token to localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper: Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Helper: Get headers with auth token
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function untuk handle response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// ==================== AUTHENTICATION API ====================

const authAPI = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password }),
      });
      const data = await handleResponse(response);
      if (data.success && data.token) {
        setToken(data.token);
      }
      return data;
    } catch (error) {
      console.error('Error login:', error);
      throw error;
    }
  },

  register: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password }),
      });
      const data = await handleResponse(response);
      if (data.success && data.token) {
        setToken(data.token);
      }
      return data;
    } catch (error) {
      console.error('Error register:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(true),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  logout: () => {
    removeToken();
  },

  isLoggedIn: () => {
    return !!getToken();
  },
};

// ==================== SCHOOL DATA API ====================

const schoolAPI = {
  getSchoolData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/school`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching school data:', error);
      throw error;
    }
  },

  getAboutData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/school/about`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching about data:', error);
      throw error;
    }
  },

  updateAboutData: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/school/about`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating about data:', error);
      throw error;
    }
  },

  getSocialMediaData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/school/social-media`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching social media data:', error);
      throw error;
    }
  },

  updateSocialMediaData: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/school/social-media`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating social media data:', error);
      throw error;
    }
  },

  getContactData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/school/contact`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching contact data:', error);
      throw error;
    }
  },

  updateContactData: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/school/contact`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating contact data:', error);
      throw error;
    }
  },
};

// ==================== NEWS API (BARU) ====================

const newsAPI = {
  getAllNews: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },
  createNews: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  },
  deleteNews: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }
};

// ==================== EXPORT ====================

const api = {
  auth: authAPI,
  school: schoolAPI,
  news: newsAPI,       // <--- Pastikan ini ada
  getToken,
  setToken,
  removeToken,
  isLoggedIn: () => !!getToken(),
};

export default api;

// ==================== USAGE EXAMPLES ====================

/*
// Di component React:

import api from './services/api';

// 1. Login
const handleLogin = async (username, password) => {
  try {
    const response = await api.auth.login(username, password);
    if (response.success) {
      console.log('Login successful:', response.user);
      // Token sudah tersimpan otomatis
    }
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// 2. Get data (PUBLIC - tidak perlu token)
const fetchData = async () => {
  try {
    const response = await api.school.getSocialMediaData();
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// 3. Update data (PROTECTED - perlu login dulu)
const updateData = async (newData) => {
  try {
    const response = await api.school.updateSocialMediaData(newData);
    if (response.success) {
      console.log('Update successful!');
    }
  } catch (error) {
    if (error.message.includes('401')) {
      console.error('Unauthorized - Please login');
    } else {
      console.error('Update failed:', error.message);
    }
  }
};

// 4. Logout
const handleLogout = () => {
  api.auth.logout();
  console.log('Logged out');
};

// 5. Check if logged in
const checkAuth = () => {
  if (api.auth.isLoggedIn()) {
    console.log('User is logged in');
  } else {
    console.log('User is not logged in');
  }
};
*/