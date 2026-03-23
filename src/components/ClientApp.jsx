import React, { useState, useEffect } from 'react';

const ClientApp = ({ appData, clients = {}, onClose }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('card');

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      const splash = document.getElementById('client-splash');
      if (splash) splash.style.animation = 'splashFadeOut 0.8s forwards';
    }, 2000);

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const availablePhones = Object.keys(clients);
  const targetPhone = availablePhones.length > 0 ? availablePhones[0] : '9990000000';
  const dbGuest = clients[targetPhone] || {};
  
  const currentGuest = {
    name: dbGuest.name || 'Любимый гость',
    points: dbGuest.points || 1350, 
    phone: targetPhone
  };

  const displayPhone = currentGuest.phone.length >= 4 
    ? currentGuest.phone.slice(-4) 
    : currentGuest.phone;

  const nextLevelPoints = 5000;
  const progressToNextLevel = Math.min(((currentGuest.points % nextLevelPoints) / nextLevelPoints) * 100, 100);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      
      <style>{`
        @keyframes splashFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes splashFadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.1); } }
        @keyframes cardAppearance { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shine { 0% { transform: translateX(-100%) rotate(30deg); } 100% { transform: translateX(100%) rotate(30deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ☕ ЭКРАН ЗАСТАВКИ */}
      {showSplash && (
        <div 
          id="client-splash"
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: '#0f172a', zIndex: 99999, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
            animation: 'splashFadeIn 0.5s ease-out forwards', willChange: 'opacity, transform'
          }}
        >
          <svg width="120" height="120" viewBox="0 0 80 80" fill="none" style={{ filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))', animation: 'float 2s ease-in-out infinite' }}>
            <path d="M40 5 C60 5, 75 20, 75 40 C75 60, 60 75, 40 75 C20 75, 5 60, 5 40 C5 20, 20 5, 40 5 Z" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4"/>
            <path d="M25 30 h30 a4 4 0 0 1 4 4 v20 a10 10 0 0 1 -10 10 h-18 a10 10 0 0 1 -10 -10 v-20 a4 4 0 0 1 4 -4 Z" fill="#0f172a" stroke="#3b82f6" strokeWidth="2"/>
            <path d="M59 36 a6 6 0 0 1 0 12 h-3" stroke="#3b82f6" strokeWidth="2"/>
          </svg>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', letterSpacing: '-1px' }}>
            GOURMET COFFEE
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '-10px' }}>
            Приложение гостя
          </div>
        </div>
      )}

      {/* 🏠 ОСНОВНОЙ КОНТЕНТ */}
      {!showSplash && (
        <div style={{ animation: 'cardAppearance 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards', padding: '20px', paddingBottom: '75px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 🚀 Шапка с кнопкой назад */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {onClose && (
                <button 
                  onClick={onClose} 
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '26px', cursor: 'pointer', padding: '0 8px 0 0', display: 'flex', alignItems: 'center', transition: '0.2s' }}
                >
                  ←
                </button>
              )}
              <div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>Добро пожаловать,</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>{currentGuest.name} ✨</div>
              </div>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '2px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05)', flexShrink: 0 }}>👤</div>
          </div>

          {activeTab === 'card' && (
            <>
              {/* 💳 КАРТА ЛОЯЛЬНОСТИ */}
              <div style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #db2777 100%)', 
                padding: '24px', 
                borderRadius: '24px', 
                color: 'white', 
                boxShadow: '0 15px 30px -10px rgba(168, 85, 247, 0.3), 0 0 15px rgba(59, 130, 246, 0.2)', 
                position: 'relative', 
                overflow: 'hidden', 
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(30deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)', animation: 'shine 3s infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.08, fontSize: '120px', transform: 'rotate(-15deg)' }}>☕</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.9)' }}>
                    Loyalty Card
                  </div>
                  <div style={{ fontSize: '18px', animation: 'float 3s ease-in-out infinite' }}>👑</div>
                </div>
                
                <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>Доступный баланс:</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-2px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                    {currentGuest.points}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', opacity: 0.9 }}>
                    баллов
                  </div>
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>
                    <span>Уровень: Ценитель</span>
                    <span>{currentGuest.points % nextLevelPoints} / {nextLevelPoints} до "Эксперт"</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ width: `${progressToNextLevel}%`, height: '100%', background: 'linear-gradient(90deg, #fff 0%, #3b82f6 100%)', borderRadius: '3px', boxShadow: '0 0 10px #fff' }} />
                  </div>
                </div>
              </div>

              {/* 📷 QR-КОД */}
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                backdropFilter: 'blur(10px)', 
                padding: '24px', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.06)', 
                textAlign: 'center', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', marginBottom: '16px', letterSpacing: '-0.3px' }}>
                  Покажите этот код бариста
                </div>
                
                <div style={{ 
                  width: '180px', 
                  height: '180px', 
                  backgroundColor: '#fff', 
                  margin: '0 auto 16px auto', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '12px', 
                  position: 'relative', 
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' 
                }}>
                  {[ 'top:5px;left:5px', 'top:5px;right:5px', 'bottom:5px;left:5px', 'bottom:5px;right:5px'].map((pos, idx) => (
                    <div key={idx} style={{ position: 'absolute', ...Object.fromEntries(pos.split(';').map(p=>p.split(':'))), width: '15px', height: '15px', border: '2px solid #3b82f6', borderRight: pos.includes('right') ? 'none' : '2px solid #3b82f6', borderLeft: pos.includes('left') ? 'none' : '2px solid #3b82f6', borderTop: pos.includes('top') ? 'none' : '2px solid #3b82f6', borderBottom: pos.includes('bottom') ? 'none' : '2px solid #3b82f6' }} />
                  ))}
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentGuest.phone}&color=0f172a`} alt="Guest QR Code" style={{ borderRadius: '8px', width: '100%', height: '100%' }} />
                </div>
                
                <div style={{ 
                  fontSize: '14px', 
                  color: '#94a3b8', 
                  letterSpacing: '2px', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  display: 'inline-block',
                  fontFamily: 'Courier New, monospace'
                }}>
                  +7 *** *** {displayPhone}
                </div>
              </div>

              {/* АКЦИЯ ДНЯ */}
              <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)', padding: '16px', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px', animation: 'pulse 1.5s infinite' }}>🎁</div>
                <div>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '14px' }}>Акция дня!</div>
                  <div style={{ color: '#fff', fontSize: '13px' }}>Скидка 20% на все десерты после 18:00!</div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'menu' && (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '60px' }}>
              <div style={{ fontSize: '60px', animation: 'float 3s ease-in-out infinite' }}>☕</div>
              <div style={{ fontWeight: 'bold', marginTop: '15px', fontSize: '18px', color: '#fff' }}>Режим предзаказа</div>
              <p style={{ fontSize: '14px' }}>Готовим для вас великолепное меню.</p>
            </div>
          )}
        </div>
      )}

      {/* 🚀 📱 НИЖНЕЕ МЕНЮ (СТАЛО КОМПАКТНЫМ И УЗКИМ) */}
      {!showSplash && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(15px)', padding: '6px 12px 12px 12px', display: 'flex', gap: '4px', boxShadow: '0 -5px 20px rgba(0,0,0,0.3)', zIndex: 100, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { id: 'card', label: 'Лояльность', icon: '💳' },
            { id: 'menu', label: 'Предзаказ', icon: '☕' },
            { id: 'profile', label: 'Профиль', icon: '👤' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '6px', borderRadius: '10px', backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: isActive ? '#fff' : '#94a3b8', fontWeight: 'bold', border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent', fontSize: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                <span style={{ fontSize: '18px', filter: isActive ? 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.5))' : 'none' }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientApp;