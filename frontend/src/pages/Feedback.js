import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import './Feedback.css';
import menubg from './menubg.jpg';

export default function Feedback(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [consent, setConsent] = useState(false);
  const [saved, setSaved] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(()=>{
    // load saved feedback if present
    try{
      const raw = localStorage.getItem('feedback');
      if (raw){ const f = JSON.parse(raw); setName(f.name||''); setEmail(f.email||''); setMessage(f.message||''); setRating(f.rating||5); setConsent(!!f.consent); setSaved(true); }
    }catch(err){}
  },[]);

  const validate = ()=>{
    if (!message.trim()) return 'Message is required';
    if (consent && email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Email is invalid';
    return null;
  };

  const submit = async (e)=>{
    e?.preventDefault();
    const err = validate();
    if (err) return alert(err);
    if (consent){
      localStorage.setItem('feedback', JSON.stringify({ name, email, rating, message, consent }));
      setSaved(true);
    }
    if (token){
      try{
        await axios.post('http://localhost:4000/api/feedback', { message, rating }, { headers: { Authorization: `Bearer ${token}` } });
        alert('Thanks for feedback');
      }catch(err){ console.error(err); alert('Failed to send feedback to server'); }
    }else{
      alert('Saved locally. Login to send to server.');
    }
  };

  const clearSaved = ()=>{ localStorage.removeItem('feedback'); setSaved(false); setName(''); setEmail(''); setMessage(''); setRating(5); setConsent(false); };

  const editSaved = ()=>{ setSaved(false); };

  return (
    <div className="feedback-page" style={{ backgroundImage: `url(${menubg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <main className="container">
        <p className="back-link"><a href="/">&larr; Back</a></p>
        <h1>Send us your feedback</h1>
        <p className="lead">We appreciate your thoughts — tell us what you liked or how we can improve.</p>

        {!saved ? (
          <form onSubmit={submit} noValidate>
            <div className="row">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
              <small className="error" data-for="name"></small>
            </div>

            <div className="row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
              <small className="error" data-for="email"></small>
            </div>

            <div className="row">
              <label htmlFor="rating">Rating</label>
              <select id="rating" name="rating" value={rating} onChange={e=>setRating(Number(e.target.value))}>
                <option value="">Choose a rating</option>
                {[5,4,3,2,1].map(r=> <option key={r} value={r}>{r} — {['Excellent','Very good','Good','Fair','Poor'][5-r]}</option>)}
              </select>
              <small className="error" data-for="rating"></small>
            </div>

            <div className="row">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={6} placeholder="What would you like to tell us?" value={message} onChange={e=>setMessage(e.target.value)}></textarea>
              <small className="error" data-for="message"></small>
            </div>

            <div className="row checkbox-row">
              <input id="consent" name="consent" type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
              <label htmlFor="consent">I agree to having this feedback stored locally on this device.</label>
              <small className="error" data-for="consent"></small>
            </div>

            <div className="actions">
              <button type="submit" id="submitBtn">Send feedback</button>
              <button type="button" id="clearBtn" className="secondary" onClick={clearSaved}>Clear saved</button>
            </div>
          </form>
        ) : (
          <div id="success">
            <h2>Thanks!</h2>
            <p>Your feedback has been saved locally. You can edit it later from this device.</p>
            <button id="editBtn" onClick={editSaved}>Edit feedback</button>
          </div>
        )}

      </main>
    </div>
  );
}
