import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import CoffeeMenu from './pages/CoffeeMenu';
import PastriesMenu from './pages/PastriesMenu';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import CartPage from './pages/CartPage';
import './App.css';

function App(){
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/coffee" element={<CoffeeMenu/>} />
            <Route path="/pastries" element={<PastriesMenu/>} />
            <Route path="/feedback" element={<Feedback/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/cart" element={<CartPage/>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
