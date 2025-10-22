import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';
import './CoffeeMenu.css';
import menubg from './menubg.jpg';

export default function CoffeeMenu(){
  const [items, setItems] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(()=>{ fetchItems(); },[]);

  const fetchItems = async ()=>{
    const res = await axios.get('http://localhost:4000/api/products?type=coffee');
    setItems(res.data);
  };

    return (
      <div className="shop-page" style={{ padding: 16, backgroundImage: `url(${menubg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
        <h2 className="menu-h1">Coffee Menu</h2>
        <div className="menu-container">
          {items.map(it=> (
            <div key={it.id} className="card">
              <div className="card-image">
                {/* Placeholder image - replace the src with your own image path */}
                <img src="/uploads/iced.jpg" alt="coffee placeholder" />
              </div>
              <div className="card-body">
                <div className="coffee-title">
                  <h2>{it.name}</h2>
                  <h3>${it.price}</h3>
                </div>
                <p>{it.description}</p>
                <button className="add-to-cart" onClick={()=>addToCart(it.id,1)}>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}
