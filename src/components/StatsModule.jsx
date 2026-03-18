import React from 'react';

const StatsModule = ({ stats }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
      {stats.map((item) => (
        <div key={item.id} style={{ 
          backgroundColor: 'var(--bg-card)', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px var(--shadow-color)', 
          borderLeft: `6px solid ${item.color}`, 
          transition: 'all 0.3s ease' 
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>{item.label}</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-main)' }}>{item.value}</div>
          <div style={{ color: item.change.startsWith('+') ? '#10b981' : '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {item.change} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', opacity: 0.7 }}>к прошлой смене</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsModule;