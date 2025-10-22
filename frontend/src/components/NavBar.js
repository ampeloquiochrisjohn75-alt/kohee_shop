import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import './NavBar.css';

export default function NavBar() {
  const { isAuthenticated } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const count = isAuthenticated ? items.reduce((s, it) => s + it.quantity, 0) : 0;
  return (
    <nav className="site-nav">
      <ul>
        <li className="logo"><Link to="/">Kohee Shop</Link></li>
        <li><Link to="/" className="active">Home</Link></li>
        <li><Link to="/coffee">CoffeeShop</Link></li>
        <li><Link to="/pastries">Pastries</Link></li>
        {isAuthenticated && <li><Link to="/feedback">Feedback</Link></li>}
      </ul>

      <ul>
        {isAuthenticated && <li><Link to="/cart">Cart ({count})</Link></li>}
        {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
        {/* <li>{isAuthenticated ? <Link to="/logout">Logout</Link> : <><Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link></>}</li> */}
      </ul>
    </nav>
  );
}
