import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CoffeeMenu.css';
import menubg from './menubg.jpg';

export default function PastriesMenu(){
  const [items, setItems] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{ fetchItems(); },[]);

  const fetchItems = async ()=>{
    const res = await axios.get('http://localhost:4000/api/products?type=pastry');
    setItems(res.data);
  };

  return (
    <div className="shop-page" style={{ padding: 16, backgroundImage: `url(${menubg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <h2 className="menu-h1">Pastries Menu</h2>
      <div className="menu-container">
        {items.map(it=> (
          <div key={it.id} className="card">
            <div className="card-image">
              {/* Placeholder pastry image - replace the src with your own image path */}
              <img src="/uploads/croissant.jpg" alt="pastry placeholder" />
            </div>
            <div className="card-body">
              <div className="coffee-title">
                <h2>{it.name}</h2>
                <h3>${it.price}</h3>
              </div>
              <p>{it.description}</p>
              {isAuthenticated ? (
                <button className="add-to-cart" onClick={()=>addToCart(it.id,1)}>Add to cart</button>
              ) : (
                <button className="add-to-cart" onClick={()=>navigate('/login')}>Login to add to cart</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
