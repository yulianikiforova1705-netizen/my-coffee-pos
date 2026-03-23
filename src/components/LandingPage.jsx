import React from 'react';

const LandingPage = ({ appData, onRoleSelect, onGuestEnter }) => {
  const OwnerIcon = () => (
    <svg className="role-icon-svg crown-icon" viewBox="0 0 64 64" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 44 L6 20 L22 30 L32 10 L42 30 L58 20 L52 44 Z" fill="rgba(245, 158, 11, 0.1)"/>
      <circle cx="32" cy="54" r="4" fill="#f59e0b"/>
    </svg>
  );

  const ManagerIcon = () => (
    <svg className="role-icon-svg clipboard-icon" viewBox="0 0 64 64" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="16" y="12" width="32" height="44" rx="4" fill="rgba(59, 130, 246, 0.1)"/>
      <path d="M24 8 h16 a4 4 0 0 1 4 4 v4 h-24 v-4 a4 4 0 0 1 4 -4 Z"/>
      <path className="check-mark" d="M26 36 l6 6 l10 -12" stroke="#10b981" strokeWidth="4"/>
    </svg>
  );

  const BaristaIcon = () => (
    <svg className="role-icon-svg cup-icon" viewBox="0 0 64 64" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 24 h36 a4 4 0 0 1 4 4 v20 a12 12 0 0 1 -12 12 h-20 a12 12 0 0 1 -12 -12 v-20 a4 4 0 0 1 4 -4 Z" fill="rgba(16, 185, 129, 0.1)"/>
      <path d="M52 30 a8 8 0 0 1 0 16 h-4" strokeWidth="4"/>
      <path className="steam-line steam-1" d="M22 16 c0 -4, 4 -4, 4 -8"/>
      <path className="steam-line steam-2" d="M32 16 c0 -4, 4 -4, 4 -8"/>
      <path className="steam-line steam-3" d="M42 16 c0 -4, 4 -4, 4 -8"/>
    </svg>
  );

  const MainLogo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
      <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path d="M40 5 C60 5, 75 20, 75 40 C75 60, 60 75, 40 75 C20 75, 5 60, 5 40 C5 20, 20 5, 40 5 Z" stroke="url(#logo-grad)" strokeWidth="4" strokeDasharray="6 6"/>
        <path d="M25 30 h30 a4 4 0 0 1 4 4 v20 a10 10 0 0 1 -10 10 h-18 a10 10 0 0 1 -10 -10 v-20 a4 4 0 0 1 4 -4 Z" fill="#fff" stroke="url(#logo-grad)" strokeWidth="3"/>
        <path d="M59 36 a6 6 0 0 1 0 12 h-3" stroke="url(#logo-grad)" strokeWidth="3"/>
        <path d="M32 24 c0 -3, 3 -3, 3 -6 M40 24 c0 -3, 3 -3, 3 -6 M48 24 c0 -3, 3 -3, 3 -6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
        <text x="40" y="88" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="Courier New">EST. 2026</text>
      </svg>
      <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#fff', margin: '16px 0 8px 0', textAlign: 'center', letterSpacing: '-1px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>GOURMET COFFEE CO.</h1>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', margin: 0, textAlign: 'center', maxWidth: '500px' }}>{appData.appName}</p>
    </div>
  );

  return (
    <div className="landing-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 20px' }}>
      <style>{`
        .landing-wrapper { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
        [data-theme="dark"] .landing-wrapper { background: linear-gradient(135deg, #0f172a 0%, #000 100%); }
        .role-card-new { background-color: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.06); border-top: 4px solid var(--border-base); cursor: pointer; width: 240px; display: flex; flex-direction: column; align-items: center; gap: 16px; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .role-card-new:hover { transform: translateY(-8px); background-color: rgba(255, 255, 255, 0.07); border-color: var(--accent); box-shadow: 0 15px 35px -5px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.05); }
        .card-icon-container { width: 80px; height: 80px; margin-bottom: 8px; }
        .card-role-title { margin: 0; fontSize: 22px; color: #fff; fontWeight: 800; textAlign: center; }
        .card-role-desc { margin: 0; color: rgba(255,255,255,0.7); fontSize: 14px; textAlign: center; lineHeight: 1.5; }
        .card-hover-arrow { position: absolute; bottom: 20px; right: -30px; color: var(--accent); fontSize: 20px; transition: right 0.3s ease; opacity: 0; }
        .role-card-new:hover .card-hover-arrow { right: 20px; opacity: 1; }
        .role-icon-svg { width: 100%; height: 100%; transition: transform 0.3s ease; }
        .role-card-new:hover .role-icon-svg { transform: scale(1.1); }
        .role-card-new:hover .crown-icon { animation: crown-wobble 1s ease-in-out infinite; filter: drop-shadow(0 0 5px var(--accent)); }
        .role-card-new .check-mark { stroke-dasharray: 50; stroke-dashoffset: 50; transition: stroke-dashoffset 0.5s ease 0.2s; }
        .role-card-new:hover .check-mark { stroke-dashoffset: 0; }
        .role-card-new:hover .clipboard-icon { animation: clip-bounce 0.5s ease-in-out; }
        .steam-line { stroke-dasharray: 10; stroke-dashoffset: 0; animation: steam-rise 1.5s linear infinite; opacity: 0.6; }
        .steam-2 { animation-delay: 0.3s; }
        .steam-3 { animation-delay: 0.6s; }
        .role-card-new:hover .steam-line { stroke: #fff; animation-duration: 1s; opacity: 1; }
        
        /* 🚀 СТИЛИ ДЛЯ НОВОЙ КНОПКИ ГОСТЯ */
        .guest-btn-glass {
          margin-top: 48px;
          padding: 16px 32px;
          background: rgba(16, 185, 129, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 16px;
          color: #10b981;
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }
        .guest-btn-glass:hover {
          transform: translateY(-4px);
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #fff;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
        }

        @keyframes crown-wobble { 0%, 100% { transform: scale(1.1) rotate(0deg); } 25% { transform: scale(1.1) rotate(-5deg); } 75% { transform: scale(1.1) rotate(5deg); } }
        @keyframes clip-bounce { 0%, 100% { transform: scale(1.1) translateY(0); } 50% { transform: scale(1.1) translateY(-10px); } }
        @keyframes steam-rise { 0% { stroke-dashoffset: 10; transform: translateY(0); opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.8; } 100% { stroke-dashoffset: 0; transform: translateY(-5px); opacity: 0; } }
      `}</style>
      
      <MainLogo />
      
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { role: 'Владелец', Icon: OwnerIcon, color: '#f59e0b', desc: 'Финансы, P&L, Цели сети', border: 'rgba(245, 158, 11, 0.4)' },
          { role: 'Управляющий', Icon: ManagerIcon, color: '#3b82f6', desc: 'Склад, Расписание, КДС', border: 'rgba(59, 130, 246, 0.4)' },
          { role: 'Бариста', Icon: BaristaIcon, color: '#10b981', desc: 'Касса, Стоп-лист, Челлендж', border: 'rgba(16, 185, 129, 0.4)' }
        ].map(r => (
          <div key={r.role} className="role-card-new" onClick={() => onRoleSelect(r.role)} 
               style={{ '--accent': r.color, '--border-base': r.border }}>
            <div className="card-icon-container"><r.Icon /></div>
            <h2 className="card-role-title">{r.role}</h2>
            <p className="card-role-desc">{r.desc}</p>
            <div className="card-hover-arrow">➝</div>
          </div>
        ))}
      </div>

      {/* 🚀 ИНТЕГРИРОВАННАЯ КНОПКА ГОСТЯ */}
      {onGuestEnter && (
        <button className="guest-btn-glass" onClick={onGuestEnter}>
          <span style={{ fontSize: '24px' }}>📱</span> Приложение гостя
        </button>
      )}
    </div>
  );
};

export default LandingPage;