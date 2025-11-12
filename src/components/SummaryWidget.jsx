import React from 'react';

export default function SummaryWidget({ summary }) {
  if (!summary) return null;
  const { patientDetails, allVitals = [], allAlerts = [] } = summary;

  const last = allVitals[0] || {};
  const avgHR = allVitals.length
    ? (allVitals.reduce((sum, v) => sum + (v.heartRate || 0), 0) / allVitals.length).toFixed(1)
    : '-';

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        color: 'var(--text-primary)',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
          {patientDetails?.name || 'Patient'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Health Summary Overview
        </p>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          }}
        >
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
            Last Heart Rate
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{last.heartRate ?? '-'}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.25rem' }}>bpm</div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)',
          }}
        >
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
            Average Heart Rate
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{avgHR}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.25rem' }}>bpm</div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
          }}
        >
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
            Total Alerts
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{allAlerts.length}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.25rem' }}>
            notifications
          </div>
        </div>
      </div>

      {/* Vitals History */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <h4 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>Vitals History</h4>
          <span
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              background: 'var(--badge-bg)',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
            }}
          >
            {allVitals.length} records
          </span>
        </div>

        <div
          style={{
            overflowX: 'auto',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--table-bg)',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
            }}
          >
            <thead>
              <tr style={{ background: 'var(--table-header-bg)' }}>
                {allVitals[0] &&
                  Object.keys(allVitals[0]).map((k) => (
                    <th
                      key={k}
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        borderBottom: '2px solid var(--border-color)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {k}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {allVitals.map((vt, i) => (
                <tr
                  key={i}
                  style={{
                    background:
                      i % 2 === 0 ? 'var(--table-row-even)' : 'var(--table-row-odd)',
                    transition: 'background 0.2s',
                  }}
                >
                  {Object.values(vt).map((v, idx) => (
                    <td
                      key={idx}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      {v || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
