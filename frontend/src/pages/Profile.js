import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import './Profile.css';
import menubg from './menubg.jpg';

export default function Profile(){
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(()=>{ if (token) fetchProfile(); }, [token]);

  const fetchProfile = async ()=>{
    const res = await axios.get('http://localhost:4000/api/profile', { headers: { Authorization: `Bearer ${token}` } });
    setProfile(res.data);
  };

  if (!token) return <div style={{ padding: 16 }}>Please login to view profile.</div>
  return (
    <div className="profile-page" style={{ backgroundImage: `url(${menubg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <main className="profile-card">
        <h2>Profile</h2>
        {profile ? (
          <div className="profile-details">
            <div className="avatar">{profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}</div>
            <div className="info">
              <div><strong>Name:</strong> {profile.name}</div>
              <div><strong>Email:</strong> {profile.email}</div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </main>
    </div>
  )
}
