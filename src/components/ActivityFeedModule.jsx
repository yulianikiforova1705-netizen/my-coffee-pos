import React from 'react';

const ActivityFeedModule = ({ logs }) => {
  
  const getLogColor = (type) => {
    switch(type) {
      case 'order': return 'rgba(59, 130, 246, 0.15)';
      case 'success': return 'rgba(16, 185, 129, 0.15)';
      case 'warning': return 'rgba(239, 68, 68, 0.15)';
      case 'info': return 'rgba(167, 139, 250, 0.15)';
      default: return 'var(--btn-bg)';
    }
  };

  const getLogIcon = (type) => {
    switch(type) {
      case 'order': return '☕️';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return '⚙️';
      default: return '📌';
    }
  };

  return (
    // 🚀 ИСПРАВЛЕНИЕ: Убрали жесткие 280px. Ставим minWidth: 0.
    // Это разрешает блоку сжиматься Flexbox-ом без выталкивания за края.
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', minWidth: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'var(--text-main)', flexShrink: 0 }}>📋 Журнал событий</h2>
      
      <div style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden', paddingRight: '8px', flexGrow: 1 }} className="hide-scroll">
        {(!logs || logs.length === 0) ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>Событий пока нет...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {logs.map((log, index) => (
              <div key={log.id} style={{ display: 'flex', gap: '16px', marginBottom: '20px', position: 'relative', width: '100%' }}>
                
                {index !== logs.length - 1 && (
                  <div style={{ position: 'absolute', left: '19px', top: '40px', bottom: '-20px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 1 }}></div>
                )}
                
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: getLogColor(log.type), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', zIndex: 2, flexShrink: 0 }}>
                  {getLogIcon(log.type)}
                </div>
                
                {/* Текст и время (minWidth: 0 заставляет текст аккуратно переноситься) */}
                <div style={{ paddingTop: '2px', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '600', marginBottom: '4px', wordBreak: 'break-word', lineHeight: '1.4' }}>
                    {log.text}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
                    {log.time}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedModule;