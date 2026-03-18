import React, { useState, useMemo } from 'react';
import DeliveryWidget from './DeliveryWidget';
import TelegramWidget from './TelegramWidget';
import AdvancedInventory from './AdvancedInventory';
import { CustomerDisplayModal, ZReportModal } from './BaristaModals';

const BaristaModule = ({
  onCloseShift, onNewOrder, onOpenDrawer, menuItems = [], stopList = [],
  onToggleStopList, clients = {}, salarySettings, baristaStats,
  baristas, promocodes = [], cashbackPercent, loggedInBarista,
  onRequestBaristaSwitch, onRateBarista, onAddDeliveryToRevenue,
  handleWriteOff, ingredients = [],
  orders = [], onCompleteOrder = () => {}, onCancelOrder = () => {}
}) => {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Все');
  const [activeRightTab, setActiveRightTab] = useState('cart'); 

  const [showCustomerDisplay, setShowCustomerDisplay] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('summary');
  const [showZReport, setShowZReport] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showFeedbackReasons, setShowFeedbackReasons] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [isSuccessFlash, setIsSuccessFlash] = useState(false);
  const [floatingRevenue, setFloatingRevenue] = useState(null);

  // 🚀 НОВЫЕ СОСТОЯНИЯ ДЛЯ CRM И ЛОЯЛЬНОСТИ
  const [clientPhone, setClientPhone] = useState('');
  const [foundClient, setFoundClient] = useState(null);
  const [pointsToSpend, setPointsToSpend] = useState(0);

  const activeOrders = orders.filter(o => o.status === 'В процессе');

  const getProductIcon = (name) => {
    if (name.includes('Капучино')) return '☕';
    if (name.includes('Латте')) return '🥛';
    if (name.includes('Эспрессо') || name.includes('Американо')) return '☕️';
    if (name.includes('Флэт')) return '☕';
    if (name.includes('Раф')) return '🥤';
    if (name.includes('Круассан')) return '🥐';
    if (name.includes('Сэндвич')) return '🥪';
    return '🍽️';
  };

  const handleAddToCart = (item) => {
    if (stopList.includes(item.id)) return;
    setCart([...cart, item]);
    if (activeRightTab !== 'cart') setActiveRightTab('cart');
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  
  // Пересчитываем итоговую сумму с учетом списанных баллов
  const finalCharge = Math.max(0, cartTotal - pointsToSpend); 

  // 🔍 Поиск клиента по базе
  const handleFindClient = () => {
    const phoneDigits = clientPhone.replace(/\D/g, '');
    if (clients[phoneDigits]) {
      setFoundClient({ phone: phoneDigits, ...clients[phoneDigits] });
      setPointsToSpend(0);
    } else {
      alert('Гость не найден. Зарегистрируем при первой покупке!');
      setFoundClient(null);
      setPointsToSpend(0);
    }
  };

  // 📷 Имитация сканера QR
  const handleSimulateQRScan = () => {
    setClientPhone('9990000000'); // Подставляем номер из нашей тестовой базы
    setTimeout(() => {
      setFoundClient({ phone: '9990000000', ...clients['9990000000'] });
      setPointsToSpend(0);
    }, 500);
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return alert('Корзина пуста!');
    setCheckoutStep('summary');
    setRatingSubmitted(false);
    setShowFeedbackReasons(false);
    setFeedbackSubmitted(false);
    setShowCustomerDisplay(true);
  };

  const handlePaymentSuccess = () => {
    setShowCustomerDisplay(false);
    setFloatingRevenue(finalCharge);
    setIsSuccessFlash(true); 
    
    // Передаем телефон и потраченные баллы в главный мозг!
    onNewOrder(
      cart.map(i => i.name).join(' + '), 
      finalCharge, 
      foundClient ? foundClient.phone : '', 
      pointsToSpend, 
      0, 
      loggedInBarista, 
      'В зале'
    );
    
    setTimeout(() => {
      setCart([]);
      setClientPhone('');
      setFoundClient(null);
      setPointsToSpend(0);
      setIsSuccessFlash(false);
      setFloatingRevenue(null);
      setCheckoutStep('rating');
      setShowCustomerDisplay(true);
    }, 700); 
  };

  const handleRatingSubmit = (star) => {
    setSelectedRating(star);
    setRatingSubmitted(true);
    onRateBarista(loggedInBarista, star);

    if (star >= 4) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setShowFeedbackReasons(true);
    }
  };

  const finishZReport = () => {
    const revenue = baristaStats[loggedInBarista]?.revenue || 0;
    const tips = baristaStats[loggedInBarista]?.tips || 0;
    onCloseShift({ revenue, ordersCount: 0, salary: 1500, tips });
    setShowZReport(false);
  };

  const categories = ['Все', ...Array.from(new Set(menuItems.map(item => item.category || 'Прочее')))];
  const filteredMenu = activeCategory === 'Все' ? menuItems : menuItems.filter(item => item.category === activeCategory);

  const currentDessertsSold = baristaStats[loggedInBarista]?.dessertsSold || 0;
  const challengeGoal = 10;
  const challengeProgress = Math.min((currentDessertsSold / challengeGoal) * 100, 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      
      <style>
        {`
          @keyframes classicFlyUp {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-60px); opacity: 0; }
          }
          .classic-money-fly {
            animation: classicFlyUp 0.7s ease-out forwards;
          }
        `}
      </style>

      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '16px 24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
            {loggedInBarista.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '16px' }}>{loggedInBarista}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Смена открыта</div>
          </div>
          <button onClick={() => baristas.length > 1 ? onRequestBaristaSwitch(baristas.find(b => b !== loggedInBarista)) : alert('Нет других бариста')} style={{ marginLeft: '12px', padding: '6px 12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-main)' }}>
            🔄 Сменить
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => onOpenDrawer(loggedInBarista)} style={{ padding: '10px 16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-main)' }}>💵 Открыть ящик</button>
          <button onClick={() => setShowZReport(true)} style={{ padding: '10px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🛑 Z-Отчет</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexGrow: 1 }}>
        
        {/* ЛЕВАЯ ЧАСТЬ (МЕНЮ) */}
        <div style={{ flex: 1.8, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '32px' }}>🏆</div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '14px' }}>Челлендж: Продай {challengeGoal} десертов!</span>
                <span style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '14px' }}>{currentDessertsSold} / {challengeGoal}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${challengeProgress}%`, height: '100%', backgroundColor: '#3b82f6', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '12px 24px', backgroundColor: activeCategory === cat ? '#3b82f6' : 'var(--bg-card)', color: activeCategory === cat ? 'white' : 'var(--text-main)', border: activeCategory === cat ? 'none' : '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
            {filteredMenu.map(item => {
              const isStopped = stopList.includes(item.id);
              return (
                <div 
                  key={item.id} 
                  onClick={() => handleAddToCart(item)}
                  style={{ backgroundColor: isStopped ? 'var(--bg-main)' : 'var(--bg-card)', border: `2px solid ${isStopped ? 'var(--border-color)' : 'transparent'}`, opacity: isStopped ? 0.5 : 1, padding: '16px', borderRadius: '16px', cursor: isStopped ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: isStopped ? 'none' : '0 4px 6px -1px var(--shadow-color)', transition: 'transform 0.1s', position: 'relative' }}
                  onMouseDown={(e) => { if(!isStopped) e.currentTarget.style.transform = 'scale(0.95)'; }}
                  onMouseUp={(e) => { if(!isStopped) e.currentTarget.style.transform = 'scale(1)'; }}
                  onMouseLeave={(e) => { if(!isStopped) e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {isStopped && <div style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px', zIndex: 10 }}>СТОП</div>}
                  <div style={{ fontSize: '36px', textAlign: 'center', margin: '4px 0' }}>{getProductIcon(item.name)}</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.2', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ color: '#10b981', fontWeight: '900', fontSize: '16px' }}>{item.price} ₽</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ (ТАБЫ) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', minHeight: '600px' }}>
          
          <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-card)', padding: '8px', borderRadius: '16px', boxShadow: '0 2px 4px -1px var(--shadow-color)', border: '1px solid var(--border-color)' }}>
            <button onClick={() => setActiveRightTab('cart')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === 'cart' ? '#3b82f6' : 'transparent', color: activeRightTab === 'cart' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '12px' }}>
              🛒 Касса
            </button>
            <button onClick={() => setActiveRightTab('queue')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === 'queue' ? '#f59e0b' : 'transparent', color: activeRightTab === 'queue' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '12px', position: 'relative' }}>
              🛎️ Очередь
              {activeOrders.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>{activeOrders.length}</span>}
            </button>
            <button onClick={() => setActiveRightTab('delivery')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === 'delivery' ? '#10b981' : 'transparent', color: activeRightTab === 'delivery' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '12px' }}>
              🛵 Дост.
            </button>
            <button onClick={() => setActiveRightTab('telegram')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === 'telegram' ? '#0088cc' : 'transparent', color: activeRightTab === 'telegram' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '12px' }}>
              ✈️ TG
            </button>
            <button onClick={() => setActiveRightTab('tools')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === 'tools' ? '#8b5cf6' : 'transparent', color: activeRightTab === 'tools' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '12px' }}>
              🛠 Инстр.
            </button>
          </div>

          {/* ВКЛАДКА КАССЫ */}
          {activeRightTab === 'cart' && (
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '24px', boxShadow: '0 10px 25px -5px var(--shadow-color)', display: 'flex', flexDirection: 'column', flexGrow: 1, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
              
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-main)', fontWeight: '900' }}>Текущий чек</h2>
              </div>
              
              <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px', overflowX: 'hidden' }}>
                {cart.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛒</div>
                    <div>Выберите товары из меню</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 0.5s ease', transform: isSuccessFlash ? 'translateY(-50px)' : 'translateY(0)', opacity: isSuccessFlash ? 0 : 1 }}>
                    {cart.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px dashed var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button onClick={() => removeFromCart(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '18px', cursor: 'pointer', padding: 0 }}>✖</button>
                          <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</span>
                        </div>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{item.price} ₽</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 🚀 БЛОК CRM И ЛОЯЛЬНОСТИ */}
              <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)' }}>
                {!foundClient ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Номер телефона" 
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }}
                    />
                    <button onClick={handleFindClient} style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                      🔍 Найти
                    </button>
                    <button onClick={handleSimulateQRScan} style={{ padding: '10px 12px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Сканировать QR-код карты">
                      📷 QR
                    </button>
                  </div>
                ) : (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Гость: +7 {foundClient.phone}</span>
                      <button onClick={() => { setFoundClient(null); setPointsToSpend(0); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>✖ Отмена</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#10b981', fontWeight: '900' }}>Баланс: {foundClient.points} баллов</span>
                      {foundClient.points > 0 && cartTotal > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Списать:</span>
                          <input 
                            type="number" 
                            max={Math.min(foundClient.points, cartTotal)} 
                            min="0"
                            value={pointsToSpend}
                            onChange={(e) => setPointsToSpend(Math.min(Number(e.target.value), foundClient.points, cartTotal))}
                            style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', textAlign: 'center' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* БЛОК ОПЛАТЫ */}
              <div style={{ padding: '20px', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Сумма:</span>
                  <span style={{ color: 'var(--text-main)', fontSize: '16px', fontWeight: 'bold' }}>{cartTotal} ₽</span>
                </div>
                {pointsToSpend > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', color: '#ef4444' }}>
                    <span style={{ fontSize: '14px' }}>Списано баллов:</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>-{pointsToSpend} ₽</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>К оплате:</span>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    {floatingRevenue !== null && (
                      <span className="classic-money-fly" style={{ position: 'absolute', right: '0', bottom: '0', color: '#10b981', fontSize: '32px', fontWeight: '900', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 50 }}>
                        +{floatingRevenue} ₽
                      </span>
                    )}
                    <span style={{ color: '#10b981', fontSize: '32px', fontWeight: '900' }}>{finalCharge} ₽</span>
                  </div>
                </div>
                <button onClick={handleCheckoutClick} style={{ width: '100%', padding: '20px', backgroundColor: cart.length > 0 ? '#3b82f6' : 'var(--border-color)', color: cart.length > 0 ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: '16px', fontSize: '20px', fontWeight: '900', cursor: cart.length > 0 ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s', boxShadow: cart.length > 0 ? '0 10px 20px rgba(59, 130, 246, 0.3)' : 'none' }}>
                  ОПЛАТИТЬ
                </button>
              </div>
            </div>
          )}

          {activeRightTab === 'queue' && (
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '24px', boxShadow: '0 10px 25px -5px var(--shadow-color)', display: 'flex', flexDirection: 'column', flexGrow: 1, border: '1px solid var(--border-color)', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-main)', fontWeight: '900' }}>В работе</h2>
                <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold' }}>{activeOrders.length}</span>
              </div>
              <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeOrders.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>✨</div>
                    <div>Все заказы отданы!</div>
                  </div>
                ) : (
                  activeOrders.map(order => (
                    <div key={order.id} style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', backgroundColor: 'var(--bg-main)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontWeight: '900', color: 'var(--text-main)', fontSize: '18px' }}>{order.id}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{order.time}</span>
                      </div>
                      <div style={{ color: 'var(--text-main)', fontSize: '16px', marginBottom: '16px', lineHeight: '1.4' }}>
                        {order.item.split(' + ').map((it, i) => <div key={i}>• {it}</div>)}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => onCompleteOrder(order.id)} style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>✅ ВЫДАТЬ</button>
                        <button onClick={() => onCancelOrder(order.id)} style={{ padding: '12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Отмена</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeRightTab === 'delivery' && <div style={{ animation: 'fadeIn 0.2s ease', flexGrow: 1 }}><DeliveryWidget onAddDeliveryToRevenue={onAddDeliveryToRevenue} /></div>}
          {activeRightTab === 'telegram' && <div style={{ animation: 'fadeIn 0.2s ease', flexGrow: 1 }}><TelegramWidget onNewOrder={onNewOrder} loggedInBarista={loggedInBarista} /></div>}
          {activeRightTab === 'tools' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.2s ease', flexGrow: 1 }}>
              <AdvancedInventory ingredients={ingredients} onWriteOff={handleWriteOff} />
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: 'var(--text-main)' }}>🛑 Стоп-лист</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {menuItems.map(item => (
                    <button key={item.id} onClick={() => onToggleStopList(item.id)} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none', backgroundColor: stopList.includes(item.id) ? '#ef4444' : 'var(--bg-main)', color: stopList.includes(item.id) ? 'white' : 'var(--text-muted)' }}>
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <CustomerDisplayModal 
        showCustomerDisplay={showCustomerDisplay} showConfetti={showConfetti} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep}
        cart={cart} finalCharge={finalCharge} handlePaymentSuccess={handlePaymentSuccess} closeCustomerDisplay={() => { setShowCustomerDisplay(false); setCheckoutStep('summary'); }}
        ratingSubmitted={ratingSubmitted} loggedInBarista={loggedInBarista} hoveredStar={hoveredStar} setHoveredStar={setHoveredStar}
        handleRatingSubmit={handleRatingSubmit} selectedRating={selectedRating} showFeedbackReasons={showFeedbackReasons} feedbackSubmitted={feedbackSubmitted}
        handleFeedbackReasonSubmit={(reason) => { setFeedbackSubmitted(true); }}
      />

      <ZReportModal 
        showZReport={showZReport} shiftTime={new Date().getTime()} shiftRevenue={baristaStats[loggedInBarista]?.revenue || 0}
        baristas={baristas} baristaStats={baristaStats} salarySettings={salarySettings} finishZReport={finishZReport}
      />
    </div>
  );
};

export default BaristaModule;