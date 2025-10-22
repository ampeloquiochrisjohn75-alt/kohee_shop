import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Signup.css';

export default function Signup(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    try{
      await signup(name,email,password);
      navigate('/');
    }catch(err){
      alert(err.response?.data?.message || err.message);
    }
  };

  const bg = `${process.env.PUBLIC_URL}/uploads/header.jpg`;

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <main className="signup-card">
        <h2>Create an account</h2>
        <form onSubmit={submit} className="signup-form">
          <label>Name</label>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <label>Email</label>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <label>Password</label>
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit" className="primary">Sign Up</button>
        </form>
      </main>
    </div>
  )
}
