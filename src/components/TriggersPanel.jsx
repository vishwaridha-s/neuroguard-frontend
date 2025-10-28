import React from 'react';
import { apiFetch } from '../utils/api';

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

export default function TriggersPanel({ patientId, onVitalsUpdate, onMonitorStart }) {
  
  // Manual buttons send full payload
  const sendVitals = async (payload) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const response = await apiFetch('/vitals/upload', {
          method: 'POST',
          body: JSON.stringify({
            patientId,
            ...payload,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        });
        alert('Vitals sent!');
        if (response?.vitals) onVitalsUpdate(response.vitals); // notify dashboard
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
            patientId,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        });
        alert('Monitor initialized! ESP32 hardware can now send vitals.');
        if (response?.message) onMonitorStart(); // start polling in dashboard
      },
      () => alert('Enable location to start monitor')
    );
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem'
    }}>
      <button
        onClick={() => sendVitals(normalPayload)}
        style={{
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseOver={e => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
        }}
        onMouseOut={e => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>✅</span>
        <span>Normal</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Send normal vitals</span>
      </button>

      <button
        onClick={() => sendVitals(panicPayload)}
        style={{
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseOver={e => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(255, 152, 0, 0.4)';
        }}
        onMouseOut={e => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
        <span>Panic</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Send panic alert</span>
      </button>

      <button
        onClick={() => sendVitals(seizurePayload)}
        style={{
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(229, 57, 53, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseOver={e => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(229, 57, 53, 0.4)';
        }}
        onMouseOut={e => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(229, 57, 53, 0.3)';
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>🚨</span>
        <span>Seizure</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Send seizure alert</span>
      </button>

      <button
        onClick={initMonitor}
        style={{
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseOver={e => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(33, 150, 243, 0.4)';
        }}
        onMouseOut={e => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>📱</span>
        <span>Monitor (ESP32)</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Start hardware monitor</span>
      </button>
    </div>
  );
}
