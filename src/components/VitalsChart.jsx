import React, { useState, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
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

// Format timestamp to readable format
const formatTimestamp = (timestamp) => {
  try {
    return format(new Date(timestamp), 'MMM d, yyyy HH:mm:ss');
  } catch (e) {
    return timestamp; // Return original if formatting fails
  }
};

// Get a color based on prediction
const getPredictionColor = (prediction) => {
  if (!prediction) return '#9e9e9e';
  const pred = prediction.toLowerCase();
  if (pred.includes('normal')) return '#10b981';
  if (pred.includes('warn')) return 'var(--warning-color)';
  if (pred.includes('crit') || pred.includes('emergency')) return 'var(--error-color)';
  return '#9e9e9e';
};

export default function VitalsChart({ data, patientId, onStartMonitor, onStopMonitor, onTriggerAlert }) {
  const [selected, setSelected] = useState(vitalOptions.map(opt => opt.key));
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  // Transform the data for the table view
  const tableData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    // Get the latest 5 readings
    const latestData = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
    
    return latestData.map(item => ({
      timestamp: formatTimestamp(item.timestamp),
      ...item.readings
    }));
  }, [data]);
    
  // Chart colors - keeping original colors for plots, only changing background
  const chartColors = {
    grid: isDark ? 'var(--border-color)' : 'var(--border-color)',
    axis: isDark ? 'var(--text-secondary)' : 'var(--text-secondary)',
    background: 'var(--card-bg)',
    cardBg: 'var(--card-bg)',
    text: 'var(--text-primary)',
    secondaryText: 'var(--text-secondary)',
  };

  return (
    <div style={{ color: 'var(--text-primary)' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Vitals Overview</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Monitor vital signs over time</p>
      </div>

      {/* Filter Controls */}
      <div className="filter-container">
        <div className="filter-header">
          Select Vitals to Display:
        </div>
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
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: opt.color
                }}
              />
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: opt.color
              }} />
              <span style={{ 
                fontSize: '0.9rem',
                fontWeight: selected.includes(opt.key) ? '600' : '400'
              }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{
        background: chartColors.background,
        padding: '1.5rem',
        borderRadius: '12px',
        border: `1px solid ${isDark ? '#2d3748' : '#e0e0e0'}`,
        marginBottom: '1.5rem',
        boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        {data.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: chartColors.secondaryText
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
            <p style={{ fontSize: '1.1rem', color: chartColors.text }}>No vitals data available yet</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: chartColors.secondaryText }}>Use the Quick Actions to send vitals data</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart 
                data={data}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <defs>
                  {vitalOptions.map(opt => (
                    <linearGradient key={opt.key} id={`color${opt.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={opt.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={opt.color} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={chartColors.grid}
                  opacity={0.5}
                />
                <XAxis 
                  dataKey="timestamp" 
                  stroke={chartColors.axis}
                  tick={{ fill: chartColors.text, fontSize: '0.75rem' }}
                  tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                  tickMargin={10}
                />
                <YAxis 
                  stroke={chartColors.axis}
                  tick={{ fill: chartColors.text, fontSize: '0.75rem' }}
                  tickMargin={10}
                />
                <Tooltip 
                  contentStyle={{
                    background: isDark ? '#2d3748' : '#ffffff',
                    border: `1px solid ${isDark ? '#4a5568' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    color: chartColors.text,
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  labelFormatter={(value) => format(new Date(value), 'PPpp')}
                />
                <Legend 
                  wrapperStyle={{
                    padding: '10px 0',
                    color: chartColors.text,
                    fontSize: '0.85rem'
                  }}
                />
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
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
            
            {/* Quick Actions - Moved below the chart */}
          </>
        )}
      </div>

      {/* Recent Vitals History */}
      <div style={{
        background: chartColors.cardBg,
        borderRadius: '12px',
        border: `1px solid ${isDark ? '#2d3748' : '#e0e0e0'}`,
        marginBottom: '1.5rem',
        overflow: 'hidden',
        boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: '600',
            color: chartColors.text
          }}>
            Recent Vitals History
          </h3>
        </div>
        
        {tableData.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: isDark ? '#2d3748' : '#f7fafc',
                  borderBottom: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`
                }}>
                  <th style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--card-header-bg)',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap'
                  }}>Timestamp</th>
                  {vitalOptions.map(opt => (
                    <th 
                      key={opt.key}
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        backgroundColor: 'var(--card-header-bg)',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {opt.label}
                    </th>
                  ))}
                  <th style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'right',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--card-header-bg)',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    paddingRight: '1.5rem'
                  }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    style={{
                      borderBottom: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
                      backgroundColor: rowIndex % 2 === 0 
                        ? (isDark ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc') 
                        : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <td style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--card-bg)',
                      whiteSpace: 'nowrap'
                    }}>
                      {format(new Date(row.timestamp), 'MMM d, yyyy HH:mm:ss')}
                    </td>
                    {vitalOptions.map(opt => (
                      <td 
                        key={opt.key} 
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid var(--border-color)',
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--card-bg)',
                          whiteSpace: 'nowrap',
                          textAlign: 'right',
                          paddingRight: '1.5rem'
                        }}
                      >
                        {row[opt.key] !== undefined ? row[opt.key].toFixed(2) : '--'}
                      </td>
                    ))}
                    <td style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--card-bg)',
                      whiteSpace: 'nowrap',
                      textAlign: 'right',
                      paddingRight: '1.5rem'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        backgroundColor: getPredictionColor(row.prediction).bg,
                        color: getPredictionColor(row.prediction).text,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {row.prediction || 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: chartColors.secondaryText,
            fontStyle: 'italic'
          }}>
            No vitals history available
          </div>
        )}
      </div>
    </div>
  );
}

const styles = `
  .filter-container {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .filter-header {
    font-size: 0.95rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
  }
  
  .filter-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }
  
  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    color: var(--text-primary);
  }
  
  .filter-option:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }
  
  .filter-option.selected {
    background: rgba(99, 102, 241, 0.1);
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .filter-option input[type="checkbox"] {
    accent-color: var(--primary-color);
  }
`;

// Add styles to the document head
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
