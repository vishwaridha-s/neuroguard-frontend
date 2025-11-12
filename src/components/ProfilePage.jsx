import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Sidebar from './Sidebar';
import { logout } from '../utils/auth';

export default function ProfilePage() {
  const { role, id } = useParams();
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch(`/${role}/${id}`).then(setDetails).catch(console.error);
  }, [role, id]);

  const routes =
    role === 'patient'
      ? [
          { path: `/dashboard/${role}/${id}`, label: 'Dashboard', icon: '🏠' },
          { path: `/profile/${role}/${id}`, label: 'Profile', icon: '👤' },
        ]
      : [
          { path: `/patients/${id}`, label: 'Patients', icon: '👥' },
          { path: `/profile/${role}/${id}`, label: 'Profile', icon: '👤' },
        ];

  if (!details) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--body-bg)' }}>
        <Sidebar onLogout={() => logout(navigate)} routes={routes} />
        <div
          style={{
            marginLeft: 230,
            flex: 1,
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⌛</div>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const InfoCard = ({ icon, label, value }) => (
    <div
      style={{
        background: 'var(--card-bg)',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.25rem',
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          {value}
        </div>
      </div>
    </div>
  );

  // 🧩 Dynamically add only non-null info cards
  const infoItems = [];

  if (details.email) infoItems.push({ icon: '📧', label: 'Email', value: details.email });
  if (role === 'patient') {
    if (details.age) infoItems.push({ icon: '🎂', label: 'Age', value: details.age });
    if (details.sex) infoItems.push({ icon: '⚧️', label: 'Sex', value: details.sex });
    if (details.homeAddress)
      infoItems.push({ icon: '🏠', label: 'Home Address', value: details.homeAddress });
    if (details.code) infoItems.push({ icon: '💳', label: 'Patient Code', value: details.code });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--body-bg)' }}>
      <Sidebar onLogout={() => logout(navigate)} routes={routes} />
      <div style={{ marginLeft: 230, flex: 1, padding: '2rem', maxWidth: '1200px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
            }}
          >
            Profile Information
          </h1>
        </div>

        {/* Profile Header Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            borderRadius: '16px',
            marginBottom: '2rem',
            color: 'white',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                border: '3px solid rgba(255,255,255,0.3)',
              }}
            >
              {details.name?.charAt(0).toUpperCase() || '👤'}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>
                {details.name || 'User'}
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', opacity: 0.9 }}>
                {role === 'patient' ? '🩺 Patient' : '👨‍⚕️ Caregiver'} • ID:{' '}
                {details.id || details._id || id}
              </p>
            </div>
          </div>
        </div>

        {/* Information Grid (Only non-null) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {infoItems.map((item, index) => (
            <InfoCard key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
