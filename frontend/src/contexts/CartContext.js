import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (token) fetchCart();
    else setItems([]);
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/cart');
      setItems(res.data);
    } catch (err) {
      // if unauthorized, clear cart and redirect to login
      if (err.response?.status === 401) {
        setItems([]);
        navigate('/login');
      }
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post('http://localhost:4000/api/cart', { productId, quantity });
      await fetchCart();
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/${productId}`);
      await fetchCart();
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else throw err;
    }
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}
