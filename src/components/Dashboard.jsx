import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import SummaryWidget from './SummaryWidget';
import VitalsChart from './VitalsChart';
import { apiFetch } from '../utils/api';
import { logout } from '../utils/auth';

const normalPayload = {
  heartRate: 75,
  spo2: 98,
  accelX: 0,
  accelY: 0,
  accelZ: 0,
  gyroX: 0,
  gyroY: 0,
  gyroZ: 0,
  temperature: 36.7,
};
const panicPayload = {
  heartRate: 132,
  spo2: 92,
  accelX: 0.35,
  accelY: 0.22,
  accelZ: 0.25,
  gyroX: 0.98,
  gyroY: 0.63,
  gyroZ: 0.75,
  temperature: 37.9,
};
const seizurePayload = {
  heartRate: 150,
  spo2: 88,
  accelX: 2.6,
  accelY: 2.3,
  accelZ: 2.8,
  gyroX: 4.3,
  gyroY: 5.2,
  gyroZ: 4.2,
  temperature: 38.7,
};

export default function Dashboard() {
  const { id } = useParams(); // patientId from router
  const [summary, setSummary] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [monitorActive, setMonitorActive] = useState(false);
  const navigate = useNavigate();

  // Fetch summary & vitals on load
  useEffect(() => {
    apiFetch(`/patient/${id}/summary`).then(setSummary).catch(console.error);
    apiFetch(`/patient/${id}/vitals`).then(v => setVitals(Array.isArray(v) ? v : []))
      .catch(console.error);
  }, [id]);

  // Live polling for ESP32 monitor
  useEffect(() => {
    if (!monitorActive) return;
    const interval = setInterval(async () => {
      try {
        const live = await apiFetch(`/vitals/monitor/latest`);
        if (live && !live.error) {
          setVitals(v => ([live, ...v.filter(x => x._id !== live._id)]));
        }
      } catch (err) {
        console.error('Live monitor error:', err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [monitorActive]);

  // Send vitals with geolocation
  const sendVitals = async (payload) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const response = await apiFetch('/vitals/upload', {
          method: 'POST',
          body: JSON.stringify({
            patientId: id,
            ...payload,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        });
        alert('Vitals sent!');
        if (response?.vitals) {
          setVitals(v => [response.vitals, ...v]);
          apiFetch(`/patient/${id}/summary`).then(setSummary).catch(console.error);
        }
      },
      () => alert('Enable location to send vitals')
    );
  };

  // Monitor button: only sends patientId + location to backend
  const initMonitor = async () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const response = await apiFetch('/vitals/monitor/init', {
          method: 'POST',
          body: JSON.stringify({
            patientId: id,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        });
        alert('Monitor initialized! ESP32 hardware can now send vitals.');
        if (response?.message) setMonitorActive(true);
      },
      () => alert('Enable location to start monitor')
    );
  };

  const stopMonitor = () => setMonitorActive(false);

  // Sidebar routes
  const routes = [
    { path: `/dashboard/patient/${id}`, label: 'Dashboard', icon: '🏠' },
    { path: `/profile/patient/${id}`, label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={() => logout(navigate)} routes={routes} />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Patient Dashboard</h1>
          <p className="subtitle">Real-time monitoring and health insights</p>
        </div>
        {/* Quick Actions Bar at the top */}
        <div className="quick-actions" style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => sendVitals(normalPayload)}
            style={{
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(76,175,80,0.3)'
            }}
          >✅ Normal</button>
          <button
            onClick={() => sendVitals(panicPayload)}
            style={{
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255,152,0,0.3)'
            }}
          >⚠️ Panic</button>
          <button
            onClick={() => sendVitals(seizurePayload)}
            style={{
              background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(229,57,53,0.3)'
            }}
          >🚨 Seizure</button>
          {!monitorActive ? (
            <button
              onClick={initMonitor}
              style={{
                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(33,150,243,0.3)'
              }}
            >📱 Monitor (ESP32)</button>
          ) : (
            <button
              onClick={stopMonitor}
              style={{
                background: 'linear-gradient(135deg, #333 0%, #666 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(33,33,33,0.3)'
              }}
            >⛔ Stop Monitoring</button>
          )}
        </div>
        <div className="dashboard-grid">
          {/* SummaryWidget - full width */}
          <div className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
            <SummaryWidget summary={summary} />
          </div>
          {/* VitalsChart - full width */}
          <div className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
            <VitalsChart
              data={vitals}
              patientId={id}
              onStartMonitor={initMonitor}
              onStopMonitor={stopMonitor}
              onTriggerAlert={() => {/* Optional extra alert */}}
            />
          </div>
        </div>
      </main>
      <style>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: var(--body-bg, #f8fafc);
        }
        .dashboard-main {
          flex: 1;
          padding: 1.5rem;
          margin-left: 250px;
          transition: all 0.3s;
        }
        .dashboard-header {
          margin-bottom: 2rem;
        }
        .dashboard-header h1 {
          font-size: 1.5rem;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          width: 100%;
        }
        .dashboard-section {
          background: var(--card-bg, #fff);
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          padding: 1.25rem;
          min-height: 250px;
        }
        @media (max-width: 900px) {
          .dashboard-main { margin-left: 0; padding: 1rem;}
          .dashboard-grid { grid-template-columns: 1fr;}
        }
      `}</style>
    </div>
  );
}
