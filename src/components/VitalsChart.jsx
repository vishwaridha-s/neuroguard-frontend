import React, { useState, useContext, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { ThemeContext } from '../App';

const vitalOptions = [
  { key: 'heartRate', label: 'Heart Rate', color: '#9c27b0' },
  { key: 'spo2', label: 'SpO2', color: '#2196f3' },
  { key: 'temperature', label: 'Temperature', color: '#ff9800' },
  { key: 'accelX', label: 'Accel X', color: '#8bc34a' },
  { key: 'accelY', label: 'Accel Y', color: '#cddc39' },
  { key: 'accelZ', label: 'Accel Z', color: '#ffc107' },
  { key: 'gyroX', label: 'Gyro X', color: '#009688' },
  { key: 'gyroY', label: 'Gyro Y', color: '#4caf50' },
  { key: 'gyroZ', label: 'Gyro Z', color: '#e91e63' }
];

// Format timestamp to readable full date + 12-hour time
const formatTimestamp = (timestamp) => {
  try {
    return format(new Date(timestamp), 'MMM d, yyyy hh:mm:ss a'); // 12-hr format with AM/PM
  } catch (e) {
    return timestamp;
  }
};

export default function VitalsChart({ data, windowSize = 10 }) {
  const [selected, setSelected] = useState(vitalOptions.map(opt => opt.key));
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;
    setChartData(prev => {
      const newData = data.slice(-windowSize); // keep only latest `windowSize` readings
      return newData;
    });
  }, [data, windowSize]);

  return (
    <div style={{ color: 'var(--text-primary)' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Vitals Overview</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Monitor vital signs over time</p>
      </div>

      {/* Filter Controls */}
      <div className="filter-container">
        <div className="filter-header">Select Vitals to Display:</div>
        <div className="filter-options">
          {vitalOptions.map(opt => (
            <label
              key={opt.key}
              className={`filter-option ${selected.includes(opt.key) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.key)}
                onChange={() =>
                  setSelected(prev =>
                    prev.includes(opt.key)
                      ? prev.filter(k => k !== opt.key)
                      : [...prev, opt.key]
                  )
                }
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: opt.color }}
              />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: opt.color }} />
              <span style={{ fontSize: '0.9rem', fontWeight: selected.includes(opt.key) ? '600' : '400' }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{
        background: 'var(--card-bg)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: `1px solid ${isDark ? '#2d3748' : '#e0e0e0'}`,
        marginBottom: '1.5rem',
        boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        {chartData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
            <p>No vitals data available yet</p>
            <p style={{ fontSize: '0.9rem' }}>Use the Quick Actions to send vitals data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#555' : '#eee'} />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fill: 'var(--text-primary)', fontSize: '0.75rem' }}
                tickFormatter={formatTimestamp} // full date + 12hr time
              />
              <YAxis tick={{ fill: 'var(--text-primary)', fontSize: '0.75rem' }} />
              <Tooltip 
                contentStyle={{
                  background: isDark ? '#2d3748' : '#fff',
                  border: `1px solid ${isDark ? '#4a5568' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
                labelFormatter={formatTimestamp} // full date + 12hr time in tooltip
              />
              <Legend wrapperStyle={{ padding: '10px 0', color: 'var(--text-primary)', fontSize: '0.85rem' }} />
              {vitalOptions
                .filter(opt => selected.includes(opt.key))
                .map(opt => (
                  <Line
                    key={opt.key}
                    type="monotone"
                    dataKey={opt.key}
                    name={opt.label}
                    stroke={opt.color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={500}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
