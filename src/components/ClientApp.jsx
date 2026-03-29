import React, { useState, useEffect } from 'react';

const ClientApp = ({ appData, clients = {}, onClose }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('menu'); 
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState('Все');
  const [cart, setCart] = useState({});
  
  // 🚀 НОВОЕ СОСТОЯНИЕ: Открыта ли корзина (шторка)
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pickupTime, setPickupTime] = useState('asap'); // 'asap' или 'later'

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
      // Если корзина опустела, закрываем шторку
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
    const item = mockMenu.find(m => m.id === parseInt(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const getAnimationForCategory = (category) => {
    if (category === 'Кофе' || category === 'Чай') return 'anim-coffee 3s ease-in-out infinite';
    if (category === 'Выпечка') return 'anim-pastry 4s ease-in-out infinite';
    if (category === 'Десерты') return 'anim-dessert 2s ease-in-out infinite';
    return 'none';
  };

  // Имитация отправки заказа
  const handleCheckout = () => {
    alert(`Заказ на сумму ${cartTotal} ₽ успешно отправлен на кассу!`);
    setCart({});
    setIsCartOpen(false);
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
        }

        @keyframes splashFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes splashFadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.1); } }
        @keyframes cardAppearance { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        /* 🚀 Анимации для шторки корзины */
        @keyframes drawerSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        
        @keyframes anim-coffee { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
        @keyframes anim-pastry { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes anim-dessert { 0%, 100% { transform: translateY(0); } 25% { transform: translateY(-5px) rotate(-5deg); } 75% { transform: translateY(-5px) rotate(5deg); } }
        
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ☕ ЭКРАН ЗАСТАВКИ (Скрыт) */}
      {showSplash && (
        <div 
          id="client-splash"
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'var(--bg-main)', zIndex: 99999, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
            animation: 'splashFadeIn 0.5s ease-out forwards', willChange: 'opacity, transform'
          }}
        >
          <svg width="120" height="120" viewBox="0 0 80 80" fill="none" style={{ filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))', animation: 'anim-coffee 3s ease-in-out infinite' }}>
            <path d="M40 5 C60 5, 75 20, 75 40 C75 60, 60 75, 40 75 C20 75, 5 60, 5 40 C5 20, 20 5, 40 5 Z" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4"/>
            <path d="M25 30 h30 a4 4 0 0 1 4 4 v20 a10 10 0 0 1 -10 10 h-18 a10 10 0 0 1 -10 -10 v-20 a4 4 0 0 1 4 -4 Z" fill="var(--bg-main)" stroke="#3b82f6" strokeWidth="2"/>
            <path d="M59 36 a6 6 0 0 1 0 12 h-3" stroke="#3b82f6" strokeWidth="2"/>
          </svg>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-1px' }}>
            GOURMET COFFEE
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
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '26px', cursor: 'pointer', padding: '0 8px 0 0', display: 'flex', alignItems: 'center', transition: '0.2s' }}
                >
                  ←
                </button>
              )}
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Добро пожаловать,</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{currentGuest.name} ✨</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '18px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
                  transition: '0.3s'
                }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '2px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)', flexShrink: 0 }}>👤</div>
            </div>
          </div>

          {activeTab === 'card' && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
               <div style={{ fontSize: '60px' }}>💳</div>
               <div style={{ fontWeight: 'bold', marginTop: '15px', fontSize: '18px', color: 'var(--text-main)' }}>Карта лояльности</div>
            </div>
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
                      border: `1px solid ${activeCategory === cat ? '#3b82f6' : 'var(--border-color)'}`, 
                      fontWeight: 'bold', 
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      backgroundColor: activeCategory === cat ? '#3b82f6' : 'var(--card-bg)',
                      color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
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
                      backgroundColor: 'var(--card-bg)', 
                      border: qty > 0 ? '1px solid #3b82f6' : '1px solid var(--border-color)', 
                      borderRadius: '20px', 
                      padding: '16px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px',
                      boxShadow: qty > 0 ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'var(--shadow-sm)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ 
                        height: '100px', 
                        backgroundColor: 'var(--icon-bg)', 
                        borderRadius: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '48px',
                      }}>
                        <div style={{ animation: getAnimationForCategory(item.category) }}>
                          {item.icon}
                        </div>
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

      {/* 🛒 ПЛАВАЮЩАЯ КНОПКА КОРЗИНЫ (Открывает шторку) */}
      {!showSplash && cartItemsCount > 0 && activeTab === 'menu' && !isCartOpen && (
        <div 
          onClick={() => setIsCartOpen(true)}
          style={{ 
            position: 'fixed', bottom: '75px', left: '20px', right: '20px', 
            backgroundColor: '#10b981', 
            borderRadius: '16px', 
            padding: '16px 20px', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            zIndex: 99,
            cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
              {cartItemsCount}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontWeight: '800', fontSize: '15px' }}>Оформить заказ</span>
              <span onClick={clearCart} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '600', textDecoration: 'underline', marginTop: '2px' }}>
                Очистить всё
              </span>
            </div>
          </div>
          <div style={{ color: '#fff', fontWeight: '900', fontSize: '20px' }}>
            {cartTotal} ₽ ➝
          </div>
        </div>
      )}

      {/* 🚀 МОДАЛЬНОЕ ОКНО ОФОРМЛЕНИЯ ЗАКАЗА (ШТОРКА) */}
      {isCartOpen && (
        <>
          {/* Темный фон-оверлей */}
          <div 
            onClick={() => setIsCartOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--overlay-bg)', zIndex: 1000, animation: 'fadeInOverlay 0.3s forwards', backdropFilter: 'blur(4px)' }} 
          />
          
          {/* Сама шторка */}
          <div style={{ 
            position: 'fixed', bottom: 0, left: 0, right: 0, 
            backgroundColor: 'var(--drawer-bg)', 
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px', 
            padding: '24px', 
            zIndex: 1001, 
            animation: 'drawerSlideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1) forwards',
            maxHeight: '85vh', overflowY: 'auto',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--text-main)', fontWeight: '900' }}>Ваш заказ</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'var(--icon-bg)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {/* Список выбранных товаров */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {Object.entries(cart).map(([id, qty]) => {
                const item = mockMenu.find(m => m.id === parseInt(id));
                if (!item) return null;
                return (
                  <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '28px' }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>{item.name}</div>
                        <div style={{ fontSize: '14px', color: '#10b981', fontWeight: 'bold' }}>{item.price} ₽</div>
                      </div>
                    </div>
                    {/* Кнопки управления количеством внутри корзины */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--icon-bg)', borderRadius: '12px', padding: '4px 8px' }}>
                      <button onClick={() => updateCart(item.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>-</button>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', width: '16px', textAlign: 'center', color: 'var(--text-main)' }}>{qty}</span>
                      <button onClick={() => updateCart(item.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Выбор времени */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Время готовности</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setPickupTime('asap')}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: pickupTime === 'asap' ? 'rgba(59, 130, 246, 0.1)' : 'var(--icon-bg)', border: `1px solid ${pickupTime === 'asap' ? '#3b82f6' : 'var(--border-color)'}`, color: pickupTime === 'asap' ? '#3b82f6' : 'var(--text-main)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: '0.2s' }}
                >
                  ⚡ Прямо сейчас
                </button>
                <button 
                  onClick={() => setPickupTime('later')}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: pickupTime === 'later' ? 'rgba(59, 130, 246, 0.1)' : 'var(--icon-bg)', border: `1px solid ${pickupTime === 'later' ? '#3b82f6' : 'var(--border-color)'}`, color: pickupTime === 'later' ? '#3b82f6' : 'var(--text-main)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: '0.2s' }}
                >
                  ⏱ Ко времени
                </button>
              </div>
            </div>

            {/* Итого и кнопка заказа */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '600' }}>Итого к оплате:</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>{cartTotal} ₽</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              style={{ width: '100%', padding: '18px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)', transition: '0.2s' }}
            >
              Оплатить и заказать
            </button>
          </div>
        </>
      )}

      {/* 🚀 📱 НИЖНЯЯ ПАНЕЛЬ С ЖЕСТКОЙ ВЫСОТОЙ (55px) */}
      {!showSplash && (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          height: '55px', 
          backgroundColor: 'var(--nav-bg)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)', 
          display: 'flex', 
          justifyContent: 'space-around', 
          alignItems: 'center',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', 
          zIndex: 100, 
          borderTop: '1px solid var(--border-color)',
          padding: '0', 
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
                  height: '55px', 
                  backgroundColor: 'transparent', 
                  color: isActive ? '#3b82f6' : 'var(--text-muted)', 
                  border: 'none', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '2px', 
                  cursor: 'pointer',
                  padding: 0,
                  margin: 0
                }}
              >
                <span style={{ 
                  fontSize: '20px', 
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