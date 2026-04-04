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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);

    const fadeTimer = setTimeout(() => {
      const splash = document.getElementById('client-splash');
      if (splash) splash.style.animation = 'splashFadeOut 0.8s forwards';
    }, 2000);

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);

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

  // 🚀 ПЕРЕЛИВАЮЩИЕСЯ ГРАДИЕНТЫ МЕТАЛЛОВ
  const getClientStatusDetails = (totalSpent) => {
    if (!totalSpent) return { level: 'Бронза', icon: '🥉', cashback: '5%', gradient: 'linear-gradient(45deg, #cd7f32, #8b4513, #d2691e, #cd7f32)', nextThreshold: 5000, nextLevel: 'Серебро', nextCashback: '10%' };
    if (totalSpent >= 15000) return { level: 'Золото', icon: '🥇', cashback: '15%', gradient: 'linear-gradient(45deg, #fbbf24, #f59e0b, #ea580c, #fbbf24)', nextThreshold: null, nextLevel: null, nextCashback: null };
    if (totalSpent >= 5000) return { level: 'Серебро', icon: '🥈', cashback: '10%', gradient: 'linear-gradient(45deg, #9ca3af, #4b5563, #e5e7eb, #9ca3af)', nextThreshold: 15000, nextLevel: 'Золото', nextCashback: '15%' };
    return { level: 'Бронза', icon: '🥉', cashback: '5%', gradient: 'linear-gradient(45deg, #cd7f32, #8b4513, #d2691e, #cd7f32)', nextThreshold: 5000, nextLevel: 'Серебро', nextCashback: '10%' };
  };

  const statusInfo = getClientStatusDetails(currentGuest.totalSpent);
  
  let progressPercent = 100;
  let remainingToNext = 0;
  
  if (statusInfo.nextThreshold) {
    let currentLevelBase = 0;
    if (statusInfo.level === 'Серебро') currentLevelBase = 5000;
    
    const pointsInCurrentLevel = currentGuest.totalSpent - currentLevelBase;
    const levelSpan = statusInfo.nextThreshold - currentLevelBase;
    
    progressPercent = Math.min((pointsInCurrentLevel / levelSpan) * 100, 100);
    remainingToNext = statusInfo.nextThreshold - currentGuest.totalSpent;
  }

  const fallbackMenu = [
    { id: 991, name: 'Капучино', price: 250, category: 'Кофе', icon: '☕', desc: 'Классика с густой пенкой' },
    { id: 992, name: 'Круассан', price: 180, category: 'Выпечка', icon: '🥐', desc: 'Свежий и хрустящий' }
  ];

  const getSmartIcon = (item) => {
    const name = (item.name || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();
    const text = name + ' ' + cat;

    if (text.includes('круассан')) return '🥐';
    if (text.includes('ролл') || text.includes('шаурма') || text.includes('wrap') || text.includes('врап')) return '🌯';
    if (text.includes('сэндвич') || text.includes('сендвич') || text.includes('панини') || text.includes('тост')) return '🥪';
    if (text.includes('сырник') || text.includes('блин') || text.includes('завтрак') || text.includes('омлет') || text.includes('яичниц') || text.includes('каша')) return '🍳';
    if (text.includes('печенье') || text.includes('кукис') || text.includes('макарон')) return '🍪';
    if (text.includes('чизкейк') || text.includes('торт') || text.includes('пирож') || text.includes('эклер') || text.includes('десерт') || text.includes('сладк')) return '🍰';
    if (text.includes('булоч') || text.includes('хлеб') || text.includes('выпеч')) return '🥐';
    if (text.includes('салат') || text.includes('боул')) return '🥗';
    if (text.includes('суп')) return '🥣';
    
    if (text.includes('матча') || text.includes('чай')) return '🍵';
    if (text.includes('лимонад') || text.includes('айс') || text.includes('сок') || text.includes('фреш') || text.includes('смузи') || text.includes('вода') || text.includes('колд')) return '🥤';
    if (text.includes('какао') || text.includes('шоколад')) return '☕';

    if (text.includes('еда') || text.includes('перекус')) return '🥪';
    
    return '☕'; 
  };

  const realMenu = (menuItems && menuItems.length > 0) 
    ? menuItems.map(item => ({
        ...item,
        icon: getSmartIcon(item),
        desc: item.desc || 'Отличный выбор'
      }))
    : fallbackMenu;

  const categories = ['Все', ...new Set(realMenu.map(item => item.category).filter(Boolean))];
  
  const filteredMenu = activeCategory === 'Все' 
    ? realMenu 
    : realMenu.filter(item => item.category === activeCategory);

  const getQuantity = (id) => cart[id] || 0;

  const updateCart = (id, delta) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev };
      if (next === 0) delete newCart[id];
      else newCart[id] = next;
      if (Object.keys(newCart).length === 0) setIsCartOpen(false);
      return newCart;
    });
  };

  const clearCart = (e) => {
    e.stopPropagation(); 
    setCart({});
    setIsCartOpen(false);
  };

  const cartItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = realMenu.find(m => m.id === id || m.id === parseInt(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const getAnimationForCategory = (category) => {
    if (!category) return 'none';
    const cat = category.toLowerCase();
    if (cat.includes('кофе') || cat.includes('чай') || cat.includes('напит')) return 'anim-coffee 3s ease-in-out infinite';
    if (cat.includes('выпечка') || cat.includes('еда') || cat.includes('сэндвич') || cat.includes('ролл') || cat.includes('хлеб')) return 'anim-pastry 4s ease-in-out infinite';
    if (cat.includes('десерт') || cat.includes('сладк')) return 'anim-dessert 2s ease-in-out infinite';
    return 'none';
  };

  const handleCheckout = () => {
    alert(`Заказ на сумму ${cartTotal} ₽ успешно отправлен на кассу!`);
    setCart({});
    setIsCartOpen(false);
  };

  const handleProfileMenuClick = (label) => {
    if (label === 'Служба поддержки') {
      window.open('https://t.me/telegram', '_blank'); 
    } else if (label === 'Настройки приложения') {
      setIsSettingsOpen(true);
    } else {
      alert(`Раздел "${label}" в разработке 🚧`);
    }
  };

  return (
    <div className="theme-client" data-theme={isDarkMode ? 'dark' : 'light'} style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'var(--text-main)', position: 'relative', overflow: 'hidden', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      
      <style>{`
        .theme-client {
          --bg-main: #f8fafc;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --card-bg: #ffffff;
          --border-color: rgba(0,0,0,0.06);
          --icon-bg: #f1f5f9;
          --nav-bg: rgba(255, 255, 255, 0.95);
          --shadow-sm: 0 4px 10px rgba(0,0,0,0.05);
          --drawer-bg: #ffffff;
          --overlay-bg: rgba(15, 23, 42, 0.4);
          --phone-bg: #f1f5f9;
          --toggle-bg: #e2e8f0;
        }
        
        .theme-client[data-theme="dark"] {
          --bg-main: #0f172a;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --card-bg: rgba(255, 255, 255, 0.03);
          --border-color: rgba(255,255,255,0.06);
          --icon-bg: rgba(255,255,255,0.02);
          --nav-bg: rgba(15, 23, 42, 0.95);
          --shadow-sm: 0 4px 6px -1px rgba(0,0,0,0.2);
          --drawer-bg: #1e293b;
          --overlay-bg: rgba(0, 0, 0, 0.6);
          --phone-bg: rgba(255,255,255,0.05);
          --toggle-bg: #334155;
        }

        @keyframes splashFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes splashFadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.1); } }
        @keyframes cardAppearance { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes drawerSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes anim-coffee { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
        @keyframes anim-pastry { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes anim-dessert { 0%, 100% { transform: translateY(0); } 25% { transform: translateY(-5px) rotate(-5deg); } 75% { transform: translateY(-5px) rotate(5deg); } }
        
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shine {
          0% { transform: translateX(-200%) rotate(30deg); }
          100% { transform: translateX(200%) rotate(30deg); }
        }

        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ЗАСТАВКА */}
      {showSplash && (
        <div id="client-splash" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--bg-main)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', animation: 'splashFadeIn 0.5s ease-out forwards', willChange: 'opacity, transform' }}>
          <svg width="120" height="120" viewBox="0 0 80 80" fill="none" style={{ filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))', animation: 'anim-coffee 3s ease-in-out infinite' }}>
            <path d="M40 5 C60 5, 75 20, 75 40 C75 60, 60 75, 40 75 C20 75, 5 60, 5 40 C5 20, 20 5, 40 5 Z" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4"/>
            <path d="M25 30 h30 a4 4 0 0 1 4 4 v20 a10 10 0 0 1 -10 10 h-18 a10 10 0 0 1 -10 -10 v-20 a4 4 0 0 1 4 -4 Z" fill="var(--bg-main)" stroke="#3b82f6" strokeWidth="2"/>
            <path d="M59 36 a6 6 0 0 1 0 12 h-3" stroke="#3b82f6" strokeWidth="2"/>
          </svg>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-1px' }}>GOURMET COFFEE</div>
        </div>
      )}

      {/* ОСНОВНОЙ КОНТЕНТ */}
      {!showSplash && (
        <div style={{ animation: 'cardAppearance 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards', padding: '20px', paddingBottom: '160px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {onClose && (
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '26px', cursor: 'pointer', padding: '0 8px 0 0', display: 'flex', alignItems: 'center', transition: '0.2s' }}>←</button>
              )}
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Добро пожаловать,</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{currentGuest.name} ✨</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', 
                background: statusInfo.gradient, backgroundSize: '300% 300%', animation: 'gradientFlow 5s ease infinite',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', 
                border: '2px solid rgba(255,255,255,0.2)', color: '#fff', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)', flexShrink: 0 
              }}>{statusInfo.icon}</div>
            </div>
          </div>

          {/* ЛОЯЛЬНОСТЬ */}
          {activeTab === 'card' && (
            <>
              <div style={{ 
                background: statusInfo.gradient, 
                backgroundSize: '300% 300%',
                animation: 'gradientFlow 5s ease infinite',
                padding: '24px', borderRadius: '24px', color: 'white', 
                boxShadow: '0 15px 30px -10px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' 
              }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.15, fontSize: '140px', transform: 'rotate(-15deg)' }}>{statusInfo.icon}</div>
                <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)', animation: 'shine 4s infinite', pointerEvents: 'none', zIndex: 0 }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.9)' }}>Loyalty Card</div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>Кэшбэк {statusInfo.cashback}</div>
                </div>
                <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px', position: 'relative', zIndex: 1 }}>Доступный баланс:</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{currentGuest.points}</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', opacity: 0.9 }}>баллов</div>
                </div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {statusInfo.nextLevel ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}>
                        <span>{statusInfo.level} статус</span>
                        <span>Ещё {remainingToNext.toLocaleString('ru-RU')} ₽ до {statusInfo.nextLevel}</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ width: `${progressPercent}%`, height: '100%', background: '#fff', borderRadius: '4px', boxShadow: '0 0 10px rgba(255,255,255,0.8)' }} />
                      </div>
                      <div style={{ fontSize: '11px', textAlign: 'center', marginTop: '8px', opacity: 0.8 }}>Следующий кэшбэк: {statusInfo.nextCashback}</div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>🎉 Вы достигли максимального статуса!</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ backgroundColor: 'var(--card-bg)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.3px' }}>Покажите этот код бариста</div>
                <div style={{ width: '180px', height: '180px', backgroundColor: '#fff', margin: '0 auto 16px auto', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', position: 'relative', boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)' }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentGuest.phone}&color=0f172a`} alt="Guest QR Code" style={{ borderRadius: '8px', width: '100%', height: '100%' }} />
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', letterSpacing: '2px', backgroundColor: 'var(--phone-bg)', padding: '8px 16px', borderRadius: '8px', display: 'inline-block', fontFamily: 'Courier New, monospace', fontWeight: 'bold' }}>
                  +7 *** *** {displayPhone}
                </div>
              </div>
            </>
          )}

          {/* ПРЕДЗАКАЗ */}
          {activeTab === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' }}>
              <div className="hide-scroll" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px', margin: '0 -20px', padding: '0 20px' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '10px 20px', borderRadius: '20px', border: `1px solid ${activeCategory === cat ? '#3b82f6' : 'var(--border-color)'}`, fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', backgroundColor: activeCategory === cat ? '#3b82f6' : 'var(--card-bg)', color: activeCategory === cat ? '#fff' : 'var(--text-muted)', boxShadow: activeCategory === cat ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none', transition: 'all 0.2s ease', cursor: 'pointer' }}>
                    {cat}
                  </button>
                ))}
              </div>

              {filteredMenu.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>В этой категории пока ничего нет 😔</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                  {filteredMenu.map(item => {
                    const qty = getQuantity(item.id);
                    return (
                      <div key={item.id} style={{ backgroundColor: 'var(--card-bg)', border: qty > 0 ? '1px solid #3b82f6' : '1px solid var(--border-color)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: qty > 0 ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'var(--shadow-sm)', transition: 'all 0.3s ease' }}>
                        <div style={{ height: '100px', backgroundColor: 'var(--icon-bg)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                          <div style={{ animation: getAnimationForCategory(item.category) }}>{item.icon}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '4px', lineHeight: '1.2' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.3', height: '32px', overflow: 'hidden' }}>{item.desc}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          <div style={{ fontSize: '16px', fontWeight: '900', color: '#10b981' }}>{item.price} ₽</div>
                          {qty > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', padding: '4px' }}>
                              <button onClick={() => updateCart(item.id, -1)} style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: 'transparent', color: '#3b82f6', border: 'none', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>-</button>
                              <span style={{ fontSize: '14px', fontWeight: 'bold', width: '14px', textAlign: 'center', color: 'var(--text-main)' }}>{qty}</span>
                              <button onClick={() => updateCart(item.id, 1)} style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
                            </div>
                          ) : (
                            <button onClick={() => updateCart(item.id, 1)} style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>+</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ПРОФИЛЬ */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: statusInfo.gradient, backgroundSize: '300% 300%', animation: 'gradientFlow 5s ease infinite', opacity: 0.2 }} />
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: statusInfo.gradient, backgroundSize: '300% 300%', animation: 'gradientFlow 5s ease infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#fff', marginBottom: '16px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', position: 'relative', zIndex: 1, border: '4px solid var(--card-bg)' }}>{statusInfo.icon}</div>
                <h2 style={{ margin: '0 0 4px 0', color: 'var(--text-main)', fontSize: '24px', fontWeight: '900', position: 'relative', zIndex: 1 }}>{currentGuest.name}</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '15px', fontFamily: 'monospace', position: 'relative', zIndex: 1, fontWeight: 'bold' }}>+7 *** *** {displayPhone}</div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, padding: '16px', backgroundColor: 'var(--card-bg)', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#10b981' }}>{Math.floor(currentGuest.totalSpent / 250)}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>Заказов</span>
                </div>
                <div style={{ flex: 1, padding: '16px', backgroundColor: 'var(--card-bg)', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#3b82f6' }}>{currentGuest.totalSpent >= 1000 ? `${(currentGuest.totalSpent/1000).toFixed(1)}k` : currentGuest.totalSpent}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>Потрачено, ₽</span>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                {[
                  { icon: '🕒', label: 'История заказов' },
                  { icon: '❤️', label: 'Любимые напитки' },
                  { icon: '💳', label: 'Способы оплаты' },
                  { icon: '💬', label: 'Служба поддержки' },
                  { icon: '⚙️', label: 'Настройки приложения' }
                ].map((item, idx, arr) => (
                  <div key={idx} onClick={() => handleProfileMenuClick(item.label)} style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: idx === arr.length - 1 ? 'none' : '1px solid var(--border-color)', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--icon-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{item.icon}</div>
                    <span style={{ flex: 1, fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>{item.label}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '20px' }}>›</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>Выйти из аккаунта</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🛒 ПЛАВАЮЩАЯ КОРЗИНА */}
      {!showSplash && cartItemsCount > 0 && activeTab === 'menu' && !isCartOpen && (
        <div onClick={() => setIsCartOpen(true)} style={{ position: 'fixed', bottom: '70px', left: '20px', right: '20px', backgroundColor: '#10b981', borderRadius: '16px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)', animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards', zIndex: 99, cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{cartItemsCount}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontWeight: '800', fontSize: '15px' }}>Оформить заказ</span>
              <span onClick={clearCart} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '600', textDecoration: 'underline', marginTop: '2px' }}>Очистить всё</span>
            </div>
          </div>
          <div style={{ color: '#fff', fontWeight: '900', fontSize: '20px' }}>{cartTotal} ₽ ➝</div>
        </div>
      )}

      {/* 🚀 МОДАЛЬНОЕ ОКНО ЗАКАЗА */}
      {isCartOpen && (
        <>
          <div onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--overlay-bg)', zIndex: 1000, animation: 'fadeInOverlay 0.3s forwards', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--drawer-bg)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', zIndex: 1001, animation: 'drawerSlideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1) forwards', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--text-main)', fontWeight: '900' }}>Ваш заказ</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'var(--icon-bg)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {Object.entries(cart).map(([id, qty]) => {
                const item = realMenu.find(m => m.id === id || m.id === parseInt(id));
                if (!item) return null;
                return (
                  <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ fontSize: '28px' }}>{item.icon}</div><div><div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>{item.name}</div><div style={{ fontSize: '14px', color: '#10b981', fontWeight: 'bold' }}>{item.price} ₽</div></div></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--icon-bg)', borderRadius: '12px', padding: '4px 8px' }}>
                      <button onClick={() => updateCart(item.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', width: '16px', textAlign: 'center', color: 'var(--text-main)' }}>{qty}</span>
                      <button onClick={() => updateCart(item.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Время готовности</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setPickupTime('asap')} style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: pickupTime === 'asap' ? 'rgba(59, 130, 246, 0.1)' : 'var(--icon-bg)', border: `1px solid ${pickupTime === 'asap' ? '#3b82f6' : 'var(--border-color)'}`, color: pickupTime === 'asap' ? '#3b82f6' : 'var(--text-main)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>⚡ Прямо сейчас</button>
                <button onClick={() => setPickupTime('later')} style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: pickupTime === 'later' ? 'rgba(59, 130, 246, 0.1)' : 'var(--icon-bg)', border: `1px solid ${pickupTime === 'later' ? '#3b82f6' : 'var(--border-color)'}`, color: pickupTime === 'later' ? '#3b82f6' : 'var(--text-main)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>⏱ Ко времени</button>
              </div>
            </div>
            <button onClick={handleCheckout} style={{ width: '100%', padding: '18px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>Оплатить и заказать</button>
          </div>
        </>
      )}

      {/* МОДАЛЬНОЕ ОКНО НАСТРОЕК */}
      {isSettingsOpen && (
        <>
          <div onClick={() => setIsSettingsOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--overlay-bg)', zIndex: 1000, animation: 'fadeInOverlay 0.3s forwards', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--drawer-bg)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', zIndex: 1001, animation: 'drawerSlideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1) forwards', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--text-main)', fontWeight: '900' }}>Настройки</h2>
              <button onClick={() => setIsSettingsOpen(false)} style={{ background: 'var(--icon-bg)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <div><div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)' }}>Темная тема</div><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Оформление приложения</div></div>
                <div onClick={() => setIsDarkMode(!isDarkMode)} style={{ width: '50px', height: '28px', backgroundColor: isDarkMode ? '#3b82f6' : 'var(--toggle-bg)', borderRadius: '14px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}><div style={{ width: '24px', height: '24px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: isDarkMode ? '24px' : '2px', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <div><div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)' }}>Push-уведомления</div><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Статусы заказов и акции</div></div>
                <div onClick={() => setNotificationsEnabled(!notificationsEnabled)} style={{ width: '50px', height: '28px', backgroundColor: notificationsEnabled ? '#10b981' : 'var(--toggle-bg)', borderRadius: '14px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}><div style={{ width: '24px', height: '24px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: notificationsEnabled ? '24px' : '2px', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} /></div>
              </div>
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>ВАШЕ ИМЯ</div>
                <input type="text" defaultValue={currentGuest.name} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--icon-bg)', color: 'var(--text-main)', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button onClick={() => alert('Функция удаления аккаунта требует подтверждения по SMS.')} style={{ width: '100%', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Удалить профиль</button>
            </div>
          </div>
        </>
      )}

      {/* НИЖНЯЯ ПАНЕЛЬ */}
      {!showSplash && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '50px', minHeight: '50px', maxHeight: '50px', boxSizing: 'border-box', overflow: 'hidden', backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', zIndex: 100, borderTop: '1px solid var(--border-color)', padding: 0, margin: 0 }}>
          {[
            { id: 'card', label: 'Лояльность', icon: '💳' },
            { id: 'menu', label: 'Предзаказ', icon: '☕' },
            { id: 'profile', label: 'Профиль', icon: '👤' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, height: '100%', backgroundColor: 'transparent', color: isActive ? '#3b82f6' : 'var(--text-muted)', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', cursor: 'pointer', padding: 0, margin: 0, boxSizing: 'border-box' }}>
                <span style={{ fontSize: '20px', transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: '0.2s', textShadow: isActive ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none', lineHeight: '1' }}>{tab.icon}</span>
                <span style={{ fontSize: '9px', fontWeight: isActive ? '700' : '500', letterSpacing: '0.5px', lineHeight: '1' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientApp;