import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Sidebar from './Sidebar';
import { logout } from '../utils/auth';

export default function PatientList() {
  const { caregiverId } = useParams();
  const [patients, setPatients] = useState([]);
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch(`/caregiver/${caregiverId}/patients`).then(setPatients);
  }, [caregiverId]);

  const linkPatient = async () => {
    try {
      // Correct endpoint and POST method
      const res = await apiFetch(`/auth/caregiver/link?caregiverId=${caregiverId}&code=${encodeURIComponent(code)}`, {
        method: 'POST'
      });
      alert(res.message || res);
      // Refresh list after linking
      apiFetch(`/caregiver/${caregiverId}/patients`).then(setPatients);
    } catch (err) {
      alert('Failed to link: ' + err.message);
    }
  };

  const routes = [
    { path: `/patients/${caregiverId}`, label: 'Patients', icon: '👥' },
    { path: `/profile/caregiver/${caregiverId}`, label: 'Profile', icon: '👤' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--body-bg)' }}>
      <Sidebar onLogout={() => logout(navigate)} routes={routes} />
      <div style={{ marginLeft: 230, flex: 1, padding: '2rem', maxWidth: '1200px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            My Patients
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Manage and monitor your linked patients
          </p>
        </div>

        {/* Link New Patient Card */}
        <div style={{
          background: 'var(--card-bg)',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Link New Patient</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                Patient Code
              </label>
              <input
                placeholder="Enter patient code"
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
            <button
              onClick={linkPatient}
              style={{
                padding: '0.75rem 2rem',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={e => e.target.style.background = '#45a049'}
              onMouseOut={e => e.target.style.background = '#4caf50'}
            >
              Link Patient
            </button>
          </div>
        </div>

        {/* Patients Grid */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Linked Patients ({patients.length})</h3>
          {patients.length === 0 ? (
            <div style={{
              background: 'var(--card-bg)',
              padding: '3rem',
              borderRadius: '16px',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <p style={{ fontSize: '1.1rem' }}>No patients linked yet. Use the form above to link a patient.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {patients.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/dashboard/patient/${p.id}`)}
                  style={{
                    background: 'var(--card-bg)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '2px solid transparent'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    e.currentTarget.style.borderColor = '#4caf50';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      color: 'white',
                      marginRight: '1rem'
                    }}>
                      {p.name?.charAt(0).toUpperCase() || '👤'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>{p.name}</h4>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        ID: {p.id}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(76, 175, 80, 0.1)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <span style={{ color: '#4caf50', fontWeight: '600', fontSize: '0.9rem' }}>
                      Click to view dashboard →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
