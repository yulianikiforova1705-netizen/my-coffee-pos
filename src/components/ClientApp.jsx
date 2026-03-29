import React, { useState, useEffect } from 'react';

const ClientApp = ({ appData, clients = {}, onClose }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('menu'); 
  
  const [activeCategory, setActiveCategory] = useState('Все');
  const [cart, setCart] = useState({});

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

  const mockMenu = [
    { id: 1, name: 'Капучино', price: 250, category: 'Кофе', icon: '☕', desc: 'Классика с густой пенкой' },
    { id: 2, name: 'Латте Макиато', price: 280, category: 'Кофе', icon: '🥛', desc: 'Много взбитого молока' },
    { id: 3, name: 'Флэт Уайт', price: 260, category: 'Кофе', icon: '☕', desc: 'Двойной эспрессо и молоко' },
    { id: 4, name: 'Матча Латте', price: 320, category: 'Чай', icon: '🍵', desc: 'Японский зеленый чай' },
    { id: 5, name: 'Круассан классический', price: 180, category: 'Выпечка', icon: '🥐', desc: 'Свежий и хрустящий' },
    { id: 6, name: 'Миндальный круассан', price: 240, category: 'Выпечка', icon: '🥐', desc: 'С миндальным кремом' },
    { id: 7, name: 'Макарон', price: 120, category: 'Десерты', icon: '🧁', desc: 'Французский десерт' },
  ];

  const categories = ['Все', 'Кофе', 'Чай', 'Выпечка', 'Десерты'];
  
  const filteredMenu = activeCategory === 'Все' 
    ? mockMenu 
    : mockMenu.filter(item => item.category === activeCategory);

  const getQuantity = (id) => cart[id] || 0;

  const updateCart = (id, delta) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev };
      if (next === 0) {
        delete newCart[id];
      } else {
        newCart[id] = next;
      }
      return newCart;
    });
  };

  const clearCart = (e) => {
    e.stopPropagation(); 
    setCart({});
  };

  const cartItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = mockMenu.find(m => m.id === parseInt(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const getAnimationForCategory = (category) => {
    if (category === 'Кофе' || category === 'Чай') return 'anim-coffee 3s ease-in-out infinite';
    if (category === 'Выпечка') return 'anim-pastry 4s ease-in-out infinite';
    if (category === 'Десерты') return 'anim-dessert 2s ease-in-out infinite';
    return 'none';
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      
      <style>{`
        @keyframes splashFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes splashFadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.1); } }
        @keyframes cardAppearance { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shine { 0% { transform: translateX(-100%) rotate(30deg); } 100% { transform: translateX(100%) rotate(30deg); } }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        @keyframes anim-coffee { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
        @keyframes anim-pastry { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes anim-dessert { 0%, 100% { transform: translateY(0); } 25% { transform: translateY(-5px) rotate(-5deg); } 75% { transform: translateY(-5px) rotate(5deg); } }
        
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
          <svg width="120" height="120" viewBox="0 0 80 80" fill="none" style={{ filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))', animation: 'anim-coffee 3s ease-in-out infinite' }}>
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
        <div style={{ animation: 'cardAppearance 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards', padding: '20px', paddingBottom: '160px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
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
              <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #db2777 100%)', padding: '24px', borderRadius: '24px', color: 'white', boxShadow: '0 15px 30px -10px rgba(168, 85, 247, 0.3), 0 0 15px rgba(59, 130, 246, 0.2)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(30deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)', animation: 'shine 3s infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.08, fontSize: '120px', transform: 'rotate(-15deg)' }}>☕</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.9)' }}>Loyalty Card</div>
                  <div style={{ fontSize: '18px' }}>👑</div>
                </div>
                
                <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>Доступный баланс:</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-2px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{currentGuest.points}</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', opacity: 0.9 }}>баллов</div>
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
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', marginBottom: '16px', letterSpacing: '-0.3px' }}>Покажите этот код бариста</div>
                <div style={{ width: '180px', height: '180px', backgroundColor: '#fff', margin: '0 auto 16px auto', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', position: 'relative', boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}>
                  {[ 'top:5px;left:5px', 'top:5px;right:5px', 'bottom:5px;left:5px', 'bottom:5px;right:5px'].map((pos, idx) => (
                    <div key={idx} style={{ position: 'absolute', ...Object.fromEntries(pos.split(';').map(p=>p.split(':'))), width: '15px', height: '15px', border: '2px solid #3b82f6', borderRight: pos.includes('right') ? 'none' : '2px solid #3b82f6', borderLeft: pos.includes('left') ? 'none' : '2px solid #3b82f6', borderTop: pos.includes('top') ? 'none' : '2px solid #3b82f6', borderBottom: pos.includes('bottom') ? 'none' : '2px solid #3b82f6' }} />
                  ))}
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentGuest.phone}&color=0f172a`} alt="Guest QR Code" style={{ borderRadius: '8px', width: '100%', height: '100%' }} />
                </div>
                <div style={{ fontSize: '14px', color: '#94a3b8', letterSpacing: '2px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '8px', display: 'inline-block', fontFamily: 'Courier New, monospace' }}>
                  +7 *** *** {displayPhone}
                </div>
              </div>
            </>
          )}

          {/* ☕ ВИТРИНА ПРЕДЗАКАЗА */}
          {activeTab === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' }}>
              
              <div className="hide-scroll" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px', margin: '0 -20px', padding: '0 20px' }}>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{ 
                      padding: '10px 20px', 
                      borderRadius: '20px', 
                      border: 'none', 
                      fontWeight: 'bold', 
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      backgroundColor: activeCategory === cat ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                      color: activeCategory === cat ? '#fff' : '#94a3b8',
                      boxShadow: activeCategory === cat ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                {filteredMenu.map(item => {
                  const qty = getQuantity(item.id);
                  return (
                    <div key={item.id} style={{ 
                      backgroundColor: 'rgba(255,255,255,0.03)', 
                      border: qty > 0 ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: '20px', 
                      padding: '16px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px',
                      boxShadow: qty > 0 ? '0 0 15px rgba(59, 130, 246, 0.2)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ 
                        height: '100px', 
                        backgroundColor: 'rgba(255,255,255,0.02)', 
                        borderRadius: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '48px',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                      }}>
                        <div style={{ animation: getAnimationForCategory(item.category) }}>
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', marginBottom: '4px', lineHeight: '1.2' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.3', height: '32px', overflow: 'hidden' }}>{item.desc}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: '#10b981' }}>{item.price} ₽</div>
                        
                        {qty > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', padding: '4px' }}>
                            <button onClick={() => updateCart(item.id, -1)} style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: 'transparent', color: '#3b82f6', border: 'none', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>-</button>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', width: '14px', textAlign: 'center', color: '#fff' }}>{qty}</span>
                            <button onClick={() => updateCart(item.id, 1)} style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => updateCart(item.id, 1)}
                            style={{ 
                              width: '32px', height: '32px', 
                              borderRadius: '10px', 
                              backgroundColor: '#3b82f6', 
                              color: 'white', 
                              border: 'none', 
                              fontSize: '18px', 
                              fontWeight: 'bold',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
                            }}
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🛒 ПЛАВАЮЩАЯ КНОПКА КОРЗИНЫ */}
      {!showSplash && cartItemsCount > 0 && activeTab === 'menu' && (
        <div style={{ 
          position: 'fixed', bottom: '75px', left: '20px', right: '20px', 
          backgroundColor: '#10b981', 
          borderRadius: '16px', 
          padding: '16px 20px', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
          animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          zIndex: 99
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
              {cartItemsCount}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontWeight: '800', fontSize: '15px' }}>В корзине</span>
              <span onClick={clearCart} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', marginTop: '2px' }}>
                Очистить всё
              </span>
            </div>
          </div>
          <div style={{ color: '#fff', fontWeight: '900', fontSize: '20px' }}>
            {cartTotal} ₽
          </div>
        </div>
      )}

      {/* 🚀 📱 ИДЕАЛЬНО ТОНКАЯ НИЖНЯЯ ПАНЕЛЬ С ЖЕСТКОЙ ВЫСОТОЙ (55px) */}
      {!showSplash && (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          height: '55px', /* 🚀 Жесткая высота 55px */
          backgroundColor: 'rgba(15, 23, 42, 0.95)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)', 
          display: 'flex', 
          justifyContent: 'space-around', 
          alignItems: 'center',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.5)', 
          zIndex: 100, 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '0', /* 🚀 Убрали все лишние отступы внутри панели */
          margin: '0'
        }}>
          {[
            { id: 'card', label: 'Лояльность', icon: '💳' },
            { id: 'menu', label: 'Предзаказ', icon: '☕' },
            { id: 'profile', label: 'Профиль', icon: '👤' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                style={{ 
                  flex: 1, 
                  height: '55px', /* 🚀 Кнопка занимает всю высоту панели */
                  backgroundColor: 'transparent', 
                  color: isActive ? '#3b82f6' : '#64748b', 
                  border: 'none', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '2px', /* 🚀 Минимальный отступ между иконкой и текстом */
                  cursor: 'pointer',
                  padding: 0,
                  margin: 0
                }}
              >
                <span style={{ 
                  fontSize: '20px', /* 🚀 Иконки стали чуть аккуратнее */
                  transform: isActive ? 'scale(1.1)' : 'scale(1)', 
                  transition: '0.2s',
                  textShadow: isActive ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
                }}>
                  {tab.icon}
                </span>
                <span style={{ fontSize: '9px', fontWeight: isActive ? '700' : '500', letterSpacing: '0.5px' }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientApp;