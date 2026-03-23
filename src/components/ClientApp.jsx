import React, { useState, useEffect } from 'react';

const ClientApp = ({ appData, clients }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('card');

  // 🚀 ЭФФЕКТ ДЛЯ ЗАСТАВКИ
  useEffect(() => {
    // Через 2 секунды запускаем анимацию исчезновения (fadeOut)
    const fadeTimer = setTimeout(() => {
      const splash = document.getElementById('client-splash');
      if (splash) splash.style.animation = 'splashFadeOut 0.8s forwards';
    }, 2000);

    // Через 2.8 секунды полностью убираем заставку из верстки
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Имитируем, что зашел конкретный гость (возьмем одного из базы)
  const phoneDigits = '9990000000';
  const currentGuest = clients[phoneDigits] || { name: 'Гость', points: 150 };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111827', position: 'relative', overflow: 'hidden' }}>
      
      {/* CSS АНИМАЦИИ */}
      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes splashFadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(1.1); }
        }
        @keyframes cardAppearance {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ☕ ЭКРАН ЗАСТАВКИ (SPLASH SCREEN) */}
      {showSplash && (
        <div 
          id="client-splash"
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: '#ffffff', zIndex: 99999, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
            animation: 'splashFadeIn 0.5s ease-out forwards', willChange: 'opacity, transform'
          }}
        >
          {/* Наш фирменный логотип (взят из CoreModule) */}
          <svg width="120" height="120" viewBox="0 0 80 80" fill="none" style={{ filter: 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.2))' }}>
            <path d="M40 5 C60 5, 75 20, 75 40 C75 60, 60 75, 40 75 C20 75, 5 60, 5 40 C5 20, 20 5, 40 5 Z" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4"/>
            <path d="M25 30 h30 a4 4 0 0 1 4 4 v20 a10 10 0 0 1 -10 10 h-18 a10 10 0 0 1 -10 -10 v-20 a4 4 0 0 1 4 -4 Z" fill="#ffffff" stroke="#3b82f6" strokeWidth="2"/>
            <path d="M59 36 a6 6 0 0 1 0 12 h-3" stroke="#3b82f6" strokeWidth="2"/>
          </svg>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', letterSpacing: '-1px' }}>
            GOURMET COFFEE
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '-10px' }}>
            Приложение гостя
          </div>
        </div>
      )}

      {/* 🏠 ОСНОВНОЙ КОНТЕНТ (Появляется после заставки) */}
      {!showSplash && (
        <div style={{ animation: 'cardAppearance 0.6s ease-out forwards', padding: '20px', paddingBottom: '90px' }}>
          
          {/* Шапка приветствия */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Рады видеть вас,</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>{currentGuest.name}! 👋</div>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>
          </div>

          {activeTab === 'card' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* КАРТА ЛОЯЛЬНОСТИ */}
              <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', padding: '24px', borderRadius: '24px', color: 'white', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, fontSize: '100px' }}>☕</div>
                <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Ваш баланс:</div>
                <div style={{ fontSize: '36px', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' }}>
                  {currentGuest.points} <span style={{ fontSize: '20px', fontWeight: 'bold' }}>баллов</span>
                </div>
                <div style={{ backgroundColor: 'white', color: '#1d4ed8', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <span>🔄 1 балл = 1 рубль</span>
                </div>
              </div>

              {/* QR-КОД ДЛЯ СКАНИРОВАНИЯ */}
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>Покажите этот код бариста</div>
                <div style={{ width: '180px', height: '180px', backgroundColor: '#f3f4f6', margin: '0 auto 16px auto', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${currentGuest.phone}`} alt="Guest QR Code" style={{ border: '10px solid white', borderRadius: '8px' }} />
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  +7 *** *** {currentGuest.phone.slice(-4)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '40px' }}>
              <div style={{ fontSize: '40px' }}>☕</div>
              <div style={{ fontWeight: 'bold', marginTop: '10px' }}>Меню в разработке</div>
            </div>
          )}
        </div>
      )}

      {/* 📱 НИЖНЕЕ МЕНЮ (НАВИГАЦИЯ) - Не показываем во время Splash Screen */}
      {!showSplash && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '12px 20px 20px 20px', display: 'flex', gap: '10px', boxShadow: '0 -4px 15px rgba(0,0,0,0.05)', zIndex: 100, borderTop: '1px solid #e5e7eb' }}>
          {[
            { id: 'card', label: 'Лояльность', icon: '💳' },
            { id: 'menu', label: 'Предзаказ', icon: '☕' },
            { id: 'profile', label: 'Профиль', icon: '👤' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '12px', borderRadius: '14px', backgroundColor: isActive ? '#3b82f6' : 'transparent', color: isActive ? 'white' : '#6b7280', fontWeight: 'bold', border: 'none', fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: '0.2s' }}>
                <span style={{ fontSize: '20px' }}>{tab.icon}</span>
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