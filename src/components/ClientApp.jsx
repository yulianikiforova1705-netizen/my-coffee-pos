import React, { useState, useEffect } from 'react';

const ClientApp = ({ appData, clients = {}, menuItems = [], onClose }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('menu'); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Все');
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pickupTime, setPickupTime] = useState('asap'); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Определяем, мобильное ли устройство для коррекции верстки
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 🚀 ДОБАВИЛИ УМНЫЕ ИКОНКИ ДЛЯ ГОСТЯ
  const getSmartIconDisplay = (item) => {
    const text = ((item.name || '') + ' ' + (item.category || '')).toLowerCase();
    if (text.includes('круассан')) return '🥐';
    if (text.includes('ролл') || text.includes('рол ') || text.includes('шаурма') || text.includes('wrap') || text.includes('врап')) return '🌯';
    if (text.includes('сэндвич') || text.includes('сендвич') || text.includes('панини') || text.includes('тост')) return '🥪';
    if (text.includes('сырник') || text.includes('блин') || text.includes('завтрак') || text.includes('омлет') || text.includes('яичниц') || text.includes('каша')) return '🍳';
    if (text.includes('печенье') || text.includes('кукис') || text.includes('макарон')) return '🍪';
    if (text.includes('чизкейк') || text.includes('торт') || text.includes('пирож') || text.includes('эклер') || text.includes('десерт') || text.includes('сладк')) return '🍰';
    if (text.includes('булоч') || text.includes('хлеб') || text.includes('выпеч')) return '🥐';
    if (text.includes('салат') || text.includes('боул')) return '🥗';
    if (text.includes('суп')) return '🥣';
    if (text.includes('матча') || text.includes('чай')) return '🍵';
    if (text.includes('лимонад') || text.includes('айс') || text.includes('сок') || text.includes('фреш') || text.includes('смузи') || text.includes('вода') || text.includes('колд')) return '🥤';
    if (text.includes('какао') || text.includes('шоколад') || text.includes('латте') || text.includes('капучино') || text.includes('эспрессо')) return '☕';
    return '☕'; 
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    const fadeTimer = setTimeout(() => {
      const splash = document.getElementById('client-splash');
      if (splash) splash.style.animation = 'splashFadeOut 0.8s forwards';
    }, 2000);

    const removeTimer = setTimeout(() => setShowSplash(false), 2800);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const availablePhones = Object.keys(clients);
  const targetPhone = availablePhones.length > 0 ? availablePhones[0] : '9990000000';
  const dbGuest = clients[targetPhone] || {};
  
  const currentGuest = {
    name: dbGuest.name || 'Любимый гость',
    points: dbGuest.points || 0, 
    totalSpent: dbGuest.totalSpent || 0,
    phone: targetPhone
  };

  const displayPhone = currentGuest.phone.length >= 4 
    ? currentGuest.phone.slice(-4) 
    : currentGuest.phone;

  const getClientStatusDetails = (totalSpent) => {
    if (!totalSpent || totalSpent < 3000) return { level: 'Бронза', icon: '🥉', cashback: '5%', gradient: 'linear-gradient(45deg, #cd7f32, #8b4513, #d2691e, #cd7f32)', nextThreshold: 3000, nextLevel: 'Серебро', nextCashback: '7%' };
    if (totalSpent >= 10000) return { level: 'Золото', icon: '🥇', cashback: '10%', gradient: 'linear-gradient(45deg, #fbbf24, #f59e0b, #ea580c, #fbbf24)', nextThreshold: null, nextLevel: null, nextCashback: null };
    if (totalSpent >= 3000) return { level: 'Серебро', icon: '🥈', cashback: '7%', gradient: 'linear-gradient(45deg, #9ca3af, #4b5563, #e5e7eb, #9ca3af)', nextThreshold: 10000, nextLevel: 'Золото', nextCashback: '10%' };
    return { level: 'Бронза', icon: '🥉', cashback: '5%', gradient: 'linear-gradient(45deg, #cd7f32, #8b4513, #d2691e, #cd7f32)', nextThreshold: 3000, nextLevel: 'Серебро', nextCashback: '7%' };
  };

  const statusInfo = getClientStatusDetails(currentGuest.totalSpent);
  
  let progressPercent = 100;
  let remainingToNext = 0;
  
  if (statusInfo.nextThreshold) {
    let currentLevelBase = statusInfo.level === 'Серебро' ? 3000 : 0;
    const pointsInCurrentLevel = currentGuest.totalSpent - currentLevelBase;
    const levelSpan = statusInfo.nextThreshold - currentLevelBase;
    progressPercent = Math.min((pointsInCurrentLevel / levelSpan) * 100, 100);
    remainingToNext = statusInfo.nextThreshold - currentGuest.totalSpent;
  }

  const realMenu = (menuItems && menuItems.length > 0) ? menuItems : [];
  const categories = ['Все', ...new Set(realMenu.map(item => item.category).filter(Boolean))];
  const filteredMenu = activeCategory === 'Все' ? realMenu : realMenu.filter(item => item.category === activeCategory);

  const updateCart = (id, delta) => {
    setCart(prev => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      const newCart = { ...prev };
      if (next === 0) delete newCart[id]; else newCart[id] = next;
      return newCart;
    });
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = realMenu.find(m => m.id.toString() === id.toString());
    return sum + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div className="theme-client" data-theme={isDarkMode ? 'dark' : 'light'} style={{ 
      backgroundColor: 'var(--bg-main)', minHeight: '100vh', width: '100vw', 
      fontFamily: 'system-ui, -apple-system, sans-serif', color: 'var(--text-main)', 
      position: 'relative', overflowX: 'hidden', transition: 'all 0.3s ease' 
    }}>
      
      <style>{`
        .theme-client {
          --bg-main: #f8fafc; --text-main: #0f172a; --text-muted: #64748b;
          --card-bg: #ffffff; --border-color: rgba(0,0,0,0.06); --icon-bg: #f1f5f9;
          --nav-bg: rgba(255, 255, 255, 0.95); --drawer-bg: #ffffff; --overlay-bg: rgba(15, 23, 42, 0.4);
        }
        .theme-client[data-theme="dark"] {
          --bg-main: #0f172a; --text-main: #f8fafc; --text-muted: #94a3b8;
          --card-bg: #1e293b; --border-color: rgba(255,255,255,0.08); --icon-bg: #334155;
          --nav-bg: rgba(15, 23, 42, 0.95); --drawer-bg: #1e293b;
        }
        @keyframes splashFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes splashFadeOut { from { opacity: 1; } to { opacity: 0; transform: scale(1.05); } }
        @keyframes cardAppearance { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes shine { 0% { transform: translateX(-200%) rotate(30deg); } 100% { transform: translateX(200%) rotate(30deg); } }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        * { box-sizing: border-box; }
      `}</style>

      {showSplash && (
        <div id="client-splash" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--bg-main)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', animation: 'splashFadeIn 0.5s ease-out forwards' }}>
          <div style={{ fontSize: '60px' }}>☕</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>GOURMET COFFEE</div>
        </div>
      )}

      {!showSplash && (
        <div style={{ animation: 'cardAppearance 0.5s ease-out forwards', padding: '16px', paddingBottom: '100px', maxWidth: '600px', margin: '0 auto' }}>
          
          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', color: 'var(--text-main)', cursor: 'pointer' }}>←</button>}
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Привет,</div>
                  <div style={{ fontSize: '20px', fontWeight: '800' }}>{currentGuest.name} ✨</div>
                </div>
             </div>
             <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: statusInfo.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: 'white', animation: 'gradientFlow 5s infinite', backgroundSize: '200%' }}>{statusInfo.icon}</div>
          </div>

          {/* TAB: CARD */}
          {activeTab === 'card' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ 
                background: statusInfo.gradient, backgroundSize: '200%', animation: 'gradientFlow 5s infinite',
                padding: '24px', borderRadius: '24px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 24px rgba(0,0,0,0.2)' 
              }}>
                <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)', animation: 'shine 4s infinite' }} />
                
                {/* 🚀 ВЕРНУЛИ СТАТУС В БЕЙДЖИК НА КАРТЕ */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px', opacity: 0.8 }}>
                  Статус: {statusInfo.level} 
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '6px' }}>{statusInfo.cashback} Cashback</span>
                </div>
                
                <div style={{ fontSize: '14px', marginBottom: '4px', opacity: 0.9 }}>Ваши баллы:</div>
                <div style={{ fontSize: '42px', fontWeight: '900', marginBottom: '20px' }}>{currentGuest.points} <span style={{ fontSize: '16px' }}>Б</span></div>
                
                {statusInfo.nextLevel && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                      <span>{statusInfo.level}</span>
                      <span>До {statusInfo.nextLevel} {remainingToNext}₽</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '3px' }}>
                      <div style={{ width: `${progressPercent}%`, height: '100%', background: 'white', borderRadius: '3px', boxShadow: '0 0 10px white' }} />
                    </div>
                  </>
                )}
              </div>

              <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Покажите код бариста</div>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${currentGuest.phone}`} style={{ width: '160px', height: '160px', borderRadius: '12px' }} alt="QR" />
                <div style={{ marginTop: '16px', fontSize: '16px', fontWeight: '900', letterSpacing: '2px' }}>+7 *** *** {displayPhone}</div>
              </div>
            </div>
          )}

          {/* TAB: MENU */}
          {activeTab === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="hide-scroll" style={{ display: 'flex', gap: '8px', overflowX: 'auto', margin: '0 -16px', padding: '0 16px' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{ 
                    padding: '10px 18px', borderRadius: '20px', border: 'none', whiteSpace: 'nowrap',
                    backgroundColor: activeCategory === cat ? '#3b82f6' : 'var(--card-bg)',
                    color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                    fontWeight: '700', fontSize: '14px', transition: '0.2s'
                  }}>{cat}</button>
                ))}
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile && window.innerWidth < 360 ? '1fr' : '1fr 1fr', 
                gap: '12px' 
              }}>
                {filteredMenu.map(item => {
                  const qty = cart[item.id] || 0;
                  return (
                  <div key={item.id} style={{ backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '12px', border: '1px solid var(--border-color)' }}>
                    {/* 🚀 ИСПОЛЬЗУЕМ УМНЫЕ ИКОНКИ */}
                    <div style={{ height: '80px', backgroundColor: 'var(--icon-bg)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '10px' }}>
                      {getSmartIconDisplay(item)}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px', height: '34px', overflow: 'hidden' }}>{item.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '900', color: '#10b981' }}>{item.price}₽</span>
                      
                      {qty > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', borderRadius: '10px', padding: '2px 8px' }}>
                          <button onClick={() => updateCart(item.id, -1)} style={{ background: 'none', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>-</button>
                          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{qty}</span>
                          <button onClick={() => updateCart(item.id, 1)} style={{ background: 'none', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>+</button>
                        </div>
                      ) : (
                        <button onClick={() => updateCart(item.id, 1)} style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#3b82f6', border: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>+</button>
                      )}
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: statusInfo.gradient, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'white' }}>{statusInfo.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: '900' }}>{currentGuest.name}</div>
                <div style={{ color: 'var(--text-muted)' }}>+7 *** *** {displayPhone}</div>
              </div>
              
              <button onClick={() => setIsSettingsOpen(true)} style={{ padding: '16px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: '700', cursor: 'pointer' }}>
                <span>⚙️ Настройки приложения</span> <span>›</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* FLOAT CART */}
      {!showSplash && cartTotal > 0 && activeTab === 'menu' && (
        <div style={{ position: 'fixed', bottom: '80px', left: '16px', right: '16px', backgroundColor: '#10b981', color: 'white', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: '900', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)', zIndex: 99, cursor: 'pointer' }} onClick={() => setIsCartOpen(true)}>
          <span>Оформить заказ</span>
          <span>{cartTotal} ₽ ➝</span>
        </div>
      )}

      {/* NAVIGATION */}
      {!showSplash && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '70px', backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid var(--border-color)', zIndex: 100, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {[
            { id: 'card', label: 'Карта', icon: '💳' },
            { id: 'menu', label: 'Меню', icon: '☕' },
            { id: 'profile', label: 'Я', icon: '👤' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === tab.id ? '#3b82f6' : 'var(--text-muted)', cursor: 'pointer' }}>
              <span style={{ fontSize: '22px' }}>{tab.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* 🚀 МОДАЛКА НАСТРОЕК ВЕРНУЛАСЬ! */}
      {isSettingsOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--bg-main)', zIndex: 9999, display: 'flex', flexDirection: 'column', animation: 'cardAppearance 0.3s ease-out' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--card-bg)' }}>
            <button onClick={() => setIsSettingsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', color: 'var(--text-main)', cursor: 'pointer' }}>←</button>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Настройки</div>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div style={{ backgroundColor: 'var(--card-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>🌙 Темная тема</div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{ width: '50px', height: '28px', borderRadius: '14px', backgroundColor: isDarkMode ? '#3b82f6' : '#e2e8f0', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: isDarkMode ? '25px' : '3px', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>🔔 Push-уведомления</div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                style={{ width: '50px', height: '28px', borderRadius: '14px', backgroundColor: notificationsEnabled ? '#10b981' : '#e2e8f0', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: notificationsEnabled ? '25px' : '3px', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '12px' }}>
              Версия приложения: 1.0.4<br/>
              © {new Date().getFullYear()} Gourmet Coffee
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClientApp;