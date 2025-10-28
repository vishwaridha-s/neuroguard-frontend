import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiActivity,
  FiAlertCircle,
  FiTrendingUp,
} from 'react-icons/fi';
import { apiFetch } from '../utils/api';
import appIcon from '../assets/heart.png';
import darkBg from '../assets/dark-wave.jpeg';
import lightBg from '../assets/light-wave.webp';

export default function AuthLanding({ signup, theme }) {
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    sex: '',
    homeAddress: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();

    if (signup) {
      if (role === 'patient') {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const payload = {
                ...form,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                role,
              };
              await apiFetch('/auth/signup/patient', {
                method: 'POST',
                body: JSON.stringify(payload),
              });
              alert('Signup successful! Please log in.');
              navigate('/');
            } catch (err) {
              alert('Signup error: ' + err.message);
            }
          },
          () => alert('Enable location to continue!')
        );
        return;
      } else {
        try {
          await apiFetch('/auth/signup/caregiver', {
            method: 'POST',
            body: JSON.stringify(form),
          });
          alert('Signup successful! Please log in.');
          navigate('/');
        } catch (err) {
          alert('Signup error: ' + err.message);
        }
        return;
      }
    }

    try {
      let data;
      if (role === 'patient') {
        data = await apiFetch('/auth/login/patient', {
          method: 'POST',
          body: JSON.stringify({ email: form.email }),
        });
        navigate(
          `/dashboard/patient/${data.id || data._id || data.patientId || data.email}`
        );
      } else {
        data = await apiFetch('/auth/login/caregiver', {
          method: 'POST',
          body: JSON.stringify({ email: form.email }),
        });
        navigate(
          `/patients/${data.id || data._id || data.caregiverId || data.email}`
        );
      }
    } catch (err) {
      alert('Auth error: ' + err.message);
    }
  }

  const bgImage = theme === 'dark' ? darkBg : lightBg;

  const roleButtonStyle = {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border, #ddd)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '1rem',
    fontWeight: 500,
  };

  const containerStyle = {
    minHeight: '90vh',
    display: 'flex',
    backgroundColor: 'var(--bg, #f5f8fa)',
    color: 'var(--text, #222)',
    fontFamily: 'Inter, system-ui, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  };

  const leftPanelStyle = {
    flex: '0 0 50%',
    background: 'var(--card-bg)',
    color: 'var(--text)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '100vh',
    zIndex: 1,
  };

  const formContainerStyle = signup ? {
    width: '100%',
    maxWidth: '500px',
    margin: '0',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: 'var(--card-bg)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid var(--border-color, #e2e8f0)',
    maxHeight: '90vh',
    overflowY: 'auto',
  } : {
    width: '100%',
    maxWidth: '500px',
    margin: '0',
    padding: '2.5rem',
    borderRadius: '12px',
    backgroundColor: 'var(--card-bg)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid var(--border-color, #e2e8f0)',
  };

  const formStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: signup ? '0.6rem' : '1.1rem',
  };

  const rightPanelStyle = {
    flex: '0 0 50%',
    backgroundColor: 'var(--card-bg)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    padding: '2rem 2rem 2rem 0',
    marginLeft: '0',
    position: 'relative',
    zIndex: 2,
    top: 0,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'var(--card-bg)',
      zIndex: -1,
    },
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'var(--bg)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'var(--primary)',
      borderRadius: '3px',
    },
  };

  const inputStyle = signup ? {
    width: '100%',
    padding: '0.6rem 0.9rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color, #e2e8f0)',
    fontSize: '0.88rem',
    lineHeight: '1.3',
    outline: 'none',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text)',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    '&:focus': {
      borderColor: 'var(--primary)',
      boxShadow: '0 0 0 2px var(--accent)',
      backgroundColor: 'var(--bg)'
    },
    '&::placeholder': {
      color: 'var(--text-secondary, #94a3b8)',
      opacity: 0.8,
    }
  } : {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color, #e2e8f0)',
    fontSize: '0.92rem',
    lineHeight: '1.4',
    outline: 'none',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text)',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    '&:focus': {
      borderColor: 'var(--primary)',
      boxShadow: '0 0 0 2px var(--accent)',
      backgroundColor: 'var(--bg)'
    },
    '&::placeholder': {
      color: 'var(--text-secondary, #94a3b8)',
      opacity: 0.8,
    }
  };

  const labelStyle = signup ? {
    display: 'block',
    marginBottom: '0.2rem',
    fontWeight: '500',
    fontSize: '0.82rem',
    color: 'var(--text)',
    letterSpacing: '0.01em',
    transition: 'all 0.2s ease',
    opacity: 0.9,
  } : {
    display: 'block',
    marginBottom: '0.35rem',
    fontWeight: '500',
    fontSize: '0.88rem',
    color: 'var(--text)',
    letterSpacing: '0.01em',
    transition: 'all 0.2s ease',
    opacity: 0.9,
  };

  const buttonStyle = signup ? {
    width: '100%',
    padding: '0.7rem',
    borderRadius: '6px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    margin: '0.3rem 0',
    boxShadow: '0 2px 8px rgba(94, 96, 206, 0.2)',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px rgba(94, 96, 206, 0.25)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(94, 96, 206, 0.2)',
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    }
  } : {
    width: '100%',
    padding: '0.85rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    marginTop: '0.5rem',
    cursor: 'pointer',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    margin: '0.5rem 0',
    boxShadow: '0 4px 12px rgba(94, 96, 206, 0.25)',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px rgba(94, 96, 206, 0.25)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(94, 96, 206, 0.2)',
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    }
  };

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid var(--border-color)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    width: '100%',
    maxWidth: '280px',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
    }
  };

  return (
    <div style={containerStyle}>
      {/* Left Panel */}
      <div style={leftPanelStyle}>
        <div
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <img src={appIcon} alt="NeuroGuard" style={{ width: '40px' }} />
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            NeuroGuard
          </span>
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: '800' }}>
          Welcome to <span style={{ color: '#4F46E5' }}>NeuroGuard</span>
        </h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          Predict. Protect. Empower.
        </h2>
        <p
          style={{
            maxWidth: '600px',
            textAlign: 'center',
            opacity: 0.9,
            fontSize: '1.1rem',
          }}
        >
          Real-time neuro monitoring. AI-powered alerts for critical events.
          Actionable insights, anytime, anywhere. Because every second counts.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Link
            to="/"
            style={{
              backgroundColor: 'white',
              color: 'var(--primary)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Learn More
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '3rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            {
              icon: <FiActivity size={24} />,
              title: 'Real-time Monitoring',
              description: 'Track vital signs in real-time with our advanced monitoring system.'
            },
            {
              icon: <FiAlertCircle size={24} />,
              title: 'Emergency Alerts',
              description: 'Instant notifications for critical health events.'
            },
            {
              icon: <FiTrendingUp size={24} />,
              title: 'Health Trends',
              description: 'Monitor your health progress over time.'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1.5rem',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '300px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent, #e3e2fd)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text)' }}>{feature.title}</h3>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={rightPanelStyle}>
        <div style={formContainerStyle}>
          <div style={{
            textAlign: 'center',
            marginBottom: '1.2rem',
            width: '100%'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
              color: 'var(--primary)',
              fontWeight: '600',
              letterSpacing: '-0.5px',
            }}>
              {signup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.4',
              margin: '0 auto',
              maxWidth: '95%'
            }}>
              {signup
                ? 'Join our community to get started with personalized health monitoring and support.'
                : 'Sign in to access your personalized health dashboard and insights.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={formStyle}>
            {/* Role selector shows for both signup and login */}
            <div style={{ width: '100%' }}>
              <label style={labelStyle}>I am a</label>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  style={{
                    ...roleButtonStyle,
                    backgroundColor: role === 'patient' ? 'var(--primary)' : 'var(--bg)',
                    color: role === 'patient' ? 'white' : 'var(--text)',
                  }}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('caregiver')}
                  style={{
                    ...roleButtonStyle,
                    backgroundColor: role === 'caregiver' ? 'var(--primary)' : 'var(--bg)',
                    color: role === 'caregiver' ? 'white' : 'var(--text)',
                  }}
                >
                  Caregiver
                </button>
              </div>
            </div>

            {signup ? (
              <>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    style={inputStyle}
                    required
                  />
                </div>

                {role === 'patient' && (
                  <>
                    <div>
                      <label style={labelStyle}>Age</label>
                      <input
                        type="number"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        placeholder="Age"
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Sex</label>
                      <select
                        name="sex"
                        value={form.sex}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                      >
                        <option value="">Select Sex</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Home Address</label>
                      <input
                        name="homeAddress"
                        value={form.homeAddress}
                        onChange={handleChange}
                        placeholder="Home Address"
                        style={inputStyle}
                        required
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div style={{ width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>Welcome Back</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Sign in to continue</p>
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    style={inputStyle}
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              style={{
                ...buttonStyle,
                marginTop: signup ? '1rem' : '2rem',
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {signup ? 'Create Account' : 'Continue with Email'}
            </button>

            <div
              style={{
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: '0.9rem',
              }}
            >
              {signup ? 'Already have an account? ' : 'New user? '}
              <Link
                to={signup ? '/' : '/signup'}
                style={{
                  color: 'var(--primary)',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                {signup ? 'Log in' : 'Sign up'}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
