import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

export default function Home(){
  const bg = `${process.env.PUBLIC_URL}/uploads/header.jpg`;
  return (
    <header className="home-header" style={{ backgroundImage: `url(${bg})` }}>
      <div className="header-content">
        <h3>Welcome</h3>
        <h1>
          Kohee Shop, Where Every Sip <br />
          Feels Like Home
        </h1>
        <h6>brewed with love and care</h6>

        <Link to="/coffee"> <button>Order Now</button></Link>
      </div>
    </header>
  )
}
