import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // keep axios default header in sync with token
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:4000/api/login', { email, password });
    setToken(res.data.token);
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('http://localhost:4000/api/signup', { name, email, password });
    setToken(res.data.token);
    return res.data;
  };

  const logout = () => setToken(null);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
