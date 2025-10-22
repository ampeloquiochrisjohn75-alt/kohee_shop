import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Login.css';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    try{
      await login(email,password);
      navigate('/');
    }catch(err){
      alert(err.response?.data?.message || err.message);
    }
  };

  const bg = `${process.env.PUBLIC_URL}/uploads/header.jpg`;

  return (
    <div className="login-page" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <main className="login-card">
        <h2>Login</h2>
        <form onSubmit={submit} className="login-form">
          <label>Email</label>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <label>Password</label>
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit" className="primary">Login</button>
        </form>
      </main>
    </div>
  )
}
