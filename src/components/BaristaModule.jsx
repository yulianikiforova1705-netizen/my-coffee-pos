import React, { useState, useEffect } from 'react';
import DeliveryWidget from './DeliveryWidget';
import TelegramWidget from './TelegramWidget';
import AdvancedInventory from './AdvancedInventory';
import { CustomerDisplayModal, ZReportModal } from './BaristaModals';

import BaristaMenu from './BaristaMenu';
import BaristaCart from './BaristaCart';
import BaristaQueue from './BaristaQueue';
import BaristaCabinet from './BaristaCabinet'; 
import ReceiptModal from './ReceiptModal'; 

const BaristaModule = ({
  onCloseShift, onNewOrder, onOpenDrawer, menuItems = [], stopList = [],
  onToggleStopList, clients = {}, salarySettings, baristaStats,
  baristas, promocodes = [], cashbackPercent, loggedInBarista,
  onRequestBaristaSwitch, onRateBarista, onAddDeliveryToRevenue,
  handleWriteOff, ingredients = [],
  orders = [], onCompleteOrder = () => {}, onCancelOrder = () => {},
  onLogout,
  // 🚀 ПРИНИМАЕМ ПАМЯТЬ СВЕРХУ:
  isShiftOpen, setIsShiftOpen, startingCash, setStartingCash
}) => {


  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Все');
  const [activeRightTab, setActiveRightTab] = useState('cart'); 

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileView, setMobileView] = useState('menu'); 

  const [showBaristaCabinet, setShowBaristaCabinet] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const [clientPhone, setClientPhone] = useState('');
  const [foundClient, setFoundClient] = useState(null);
  const [pointsToSpend, setPointsToSpend] = useState(0);

  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');

  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrderForReceipt, setLastOrderForReceipt] = useState(null);

  const activeOrders = orders.filter(o => o.status === 'В процессе');

  const getProductIcon = (name, category) => {
    const text = ((name || '') + ' ' + (category || '')).toLowerCase();
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
    if (text.includes('лимонад') || text.includes('айс') || text.includes('сок') || text.includes('фреш') || text.includes('смузи') || text.includes('вода') || text.includes('колд') || text.includes('раф')) return '🥤';
    if (text.includes('какао') || text.includes('шоколад') || text.includes('латте') || text.includes('капучино') || text.includes('эспрессо')) return '☕';
    if (text.includes('еда') || text.includes('перекус')) return '🥪';
    return '☕'; 
  };

  // 🚀 ЖЕСТКАЯ БЛОКИРОВКА ПУСТЫХ ОСТАТКОВ
  const handleAddToCart = (item) => {
    // 1. Берем самую СВЕЖУЮ версию товара из базы меню, а не ту, что зависла на кнопке
    const freshItem = menuItems.find(m => m.id === item.id) || item;

    // 2. Проверяем ручной стоп-лист
    if (stopList.includes(freshItem.id)) {
      alert(`❌ ${freshItem.name} сейчас в ручном стоп-листе!`);
      return;
    }

    // 3. Универсальная функция поиска остатка (ищет по всем возможным названиям)
    const findStock = (obj) => {
      if (!obj) return undefined;
      if (obj.stock !== undefined && obj.stock !== '') return Number(obj.stock);
      if (obj.inventory !== undefined && obj.inventory !== '') return Number(obj.inventory);
      if (obj.quantity !== undefined && obj.quantity !== '') return Number(obj.quantity);
      if (obj.count !== undefined && obj.count !== '') return Number(obj.count);
      return undefined;
    };

    let availableStock = findStock(freshItem);

    // 4. Если в самом товаре нет остатка, ищем его на общем складе ингредиентов
    if (availableStock === undefined && ingredients && ingredients.length > 0) {
      const linkedIngredient = ingredients.find(ing => 
        ing.name.toLowerCase().trim() === freshItem.name.toLowerCase().trim() || 
        ing.id === freshItem.id
      );
      if (linkedIngredient) {
        availableStock = findStock(linkedIngredient);
      }
    }

    // 5. ЖЕСТКАЯ ПРОВЕРКА И БЛОКИРОВКА КОРЗИНЫ
    if (availableStock !== undefined && !isNaN(availableStock)) {
      const inCartCount = cart.filter(c => c.id === freshItem.id).length;
      
      if (availableStock <= 0) {
        alert(`❌ Товар "${freshItem.name}" закончился на складе! (Остаток: 0)`);
        return; // ⛔️ БЛОКИРУЕМ!
      }
      
      if (inCartCount >= availableStock) {
        alert(`❌ Вы пытаетесь пробить больше, чем есть на складе! Доступно всего: ${availableStock} шт.`);
        return; // ⛔️ БЛОКИРУЕМ!
      }
    }

    // Если всё ок — пускаем в корзину
    setCart([...cart, freshItem]);
    if (activeRightTab !== 'cart') setActiveRightTab('cart');
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const finalCharge = Math.max(0, cartTotal - pointsToSpend); 

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

  const handleSimulateQRScan = () => {
    setClientPhone('9990000000');
    setTimeout(() => {
      setFoundClient({ phone: '9990000000', ...clients['9990000000'] });
      setPointsToSpend(0);
    }, 500);
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return alert('Корзина пуста!');
    setTipAmount(0);
    setCustomTip('');
    setShowTipModal(true); 
  };

  const proceedToPayment = () => {
    const finalTip = customTip ? Number(customTip) : tipAmount;
    setTipAmount(finalTip); 
    
    setShowTipModal(false);
    setCheckoutStep('summary');
    setRatingSubmitted(false);
    setShowFeedbackReasons(false);
    setFeedbackSubmitted(false);
    setShowCustomerDisplay(true);
  };

  const handlePaymentSuccess = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime); 
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.1); 
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (err) {
      console.log('Браузер не поддерживает синтез звука', err);
    }

    const orderDescription = cart.map(i => i.name).join(' + ');
    const totalWithTip = finalCharge + tipAmount;

    setLastOrderForReceipt({
      id: `#${Date.now().toString().slice(-4)}`, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      barista: loggedInBarista,
      orderType: 'В зале',
      item: orderDescription,
      total: totalWithTip
    });

    setShowCustomerDisplay(false);
    setFloatingRevenue(totalWithTip);
    setIsSuccessFlash(true); 
    
    onNewOrder(
      orderDescription, 
      cartTotal, 
      foundClient ? foundClient.phone : clientPhone.replace(/\D/g, ''), 
      pointsToSpend, 
      tipAmount, 
      loggedInBarista, 
      'В зале'
    );
    
    setShowReceipt(true);

    setTimeout(() => {
      setCart([]);
      setClientPhone('');
      setFoundClient(null);
      setPointsToSpend(0);
      setTipAmount(0);
      setCustomTip('');
      setIsSuccessFlash(false);
      setFloatingRevenue(null);
      setCheckoutStep('rating');
      setShowCustomerDisplay(true);
      if (isMobile) setMobileView('menu');
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
    
    // 🚀 СБРАСЫВАЕМ СМЕНУ ПРИ Z-ОТЧЕТЕ
    setIsShiftOpen(false); 
    
    if (onLogout) onLogout(); 
  };

  const categories = ['Все', ...Array.from(new Set(menuItems.map(item => item.category || 'Прочее')))];
  const filteredMenu = activeCategory === 'Все' ? menuItems : menuItems.filter(item => item.category === activeCategory);

  const currentDessertsSold = baristaStats[loggedInBarista]?.dessertsSold || 0;
  const challengeGoal = 10;
  const challengeProgress = Math.min((currentDessertsSold / challengeGoal) * 100, 100);

  if (!isShiftOpen) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, height: '100%', minHeight: '60vh', animation: 'fadeIn 0.3s ease' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>☕</div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: 'var(--text-main)', fontWeight: '900' }}>Привет, {loggedInBarista}!</h2>
          <p style={{ margin: '0 0 32px 0', color: 'var(--text-muted)', fontSize: '16px' }}>Твоя смена еще не открыта.</p>

          <div style={{ textAlign: 'left', marginBottom: '32px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>РАЗМЕН В КАССЕ НА НАЧАЛО ДНЯ (₽)</label>
            <input 
              type="number" 
              value={startingCash} 
              onChange={(e) => setStartingCash(e.target.value)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <button 
            onClick={() => setIsShiftOpen(true)}
            style={{ width: '100%', padding: '16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🟢 ОТКРЫТЬ СМЕНУ
          </button>

          <button 
            onClick={onLogout}
            style={{ marginTop: '16px', padding: '12px', backgroundColor: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
          >
            🚪 Выйти из аккаунта
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: isMobile ? '12px' : '20px', paddingBottom: isMobile ? '80px' : '0' }}>
      
      <style>
        {`
          @keyframes classicFlyUp {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-60px); opacity: 0; }
          }
          .classic-money-fly {
            animation: classicFlyUp 0.7s ease-out forwards;
          }
          .hide-scroll::-webkit-scrollbar { display: none; }
          .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
          .barista-profile-hover:hover { background-color: rgba(59, 130, 246, 0.1); }
        `}
      </style>

      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '12px', backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          
          <div 
            onClick={() => setShowBaristaCabinet(true)}
            className="barista-profile-hover"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, cursor: 'pointer', padding: '6px 12px', borderRadius: '12px', transition: '0.2s', marginLeft: '-12px' }}
            title="Открыть личный кабинет"
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
              {loggedInBarista.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '16px', whiteSpace: 'nowrap' }}>{loggedInBarista}</div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Смена открыта</div>
            </div>
          </div>
          
          <button onClick={() => baristas.length > 1 ? onRequestBaristaSwitch(baristas.find(b => b !== loggedInBarista)) : alert('Нет других бариста')} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-main)', fontWeight: 'bold', flexShrink: 0 }}>
            🔄 Сменить
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onOpenDrawer(loggedInBarista)} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-main)' }}>💵 Касса</button>
          <button onClick={() => setShowZReport(true)} style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>🛑 Z-Отчет</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexGrow: 1, flexDirection: isMobile ? 'column' : 'row' }}>
        
        <BaristaMenu 
          isMobile={isMobile}
          mobileView={mobileView}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filteredMenu={filteredMenu}
          stopList={stopList}
          handleAddToCart={handleAddToCart}
          getProductIcon={getProductIcon}
          challengeGoal={challengeGoal}
          currentDessertsSold={currentDessertsSold}
          challengeProgress={challengeProgress}
          // 🚀 ДОБАВЛЯЕМ ВОТ ЭТИ ДВЕ СТРОЧКИ:
          ingredients={ingredients}
          cart={cart}
        />

        <div style={{ flex: 1, display: (!isMobile || mobileView === 'cart') ? 'flex' : 'none', flexDirection: 'column', gap: '16px', height: isMobile ? 'auto' : '100%', minHeight: isMobile ? 'auto' : '600px', width: '100%' }}>
          
          <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-card)', padding: '8px', borderRadius: '16px', boxShadow: '0 2px 4px -1px var(--shadow-color)', border: '1px solid var(--border-color)', overflowX: 'auto' }} className="hide-scroll">
            <button onClick={() => setActiveRightTab('cart')} style={{ flex: 1, minWidth: '80px', padding: '12px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === 'cart' ? '#3b82f6' : 'transparent', color: activeRightTab === 'cart' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px' }}>
              🛒 Касса
            </button>
            <button onClick={() => setActiveRightTab('queue')} style={{ flex: 1, minWidth: '80px', padding: '12px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === 'queue' ? '#f59e0b' : 'transparent', color: activeRightTab === 'queue' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px', position: 'relative' }}>
              🛎️ Очередь
              {activeOrders.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>{activeOrders.length}</span>}
            </button>
            <button onClick={() => setActiveRightTab('delivery')} style={{ flex: 1, minWidth: '80px', padding: '12px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === 'delivery' ? '#10b981' : 'transparent', color: activeRightTab === 'delivery' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px' }}>
              🛵 Дост.
            </button>
            <button onClick={() => setActiveRightTab('telegram')} style={{ flex: 1, minWidth: '80px', padding: '12px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === 'telegram' ? '#0088cc' : 'transparent', color: activeRightTab === 'telegram' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px' }}>
              ✈️ TG
            </button>
            <button onClick={() => setActiveRightTab('tools')} style={{ flex: 1, minWidth: '80px', padding: '12px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === 'tools' ? '#8b5cf6' : 'transparent', color: activeRightTab === 'tools' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px' }}>
              🛠 Инстр.
            </button>
          </div>

          {activeRightTab === 'cart' && (
            <BaristaCart 
              cart={cart}
              removeFromCart={removeFromCart}
              isSuccessFlash={isSuccessFlash}
              foundClient={foundClient}
              clientPhone={clientPhone}
              setClientPhone={setClientPhone}
              handleFindClient={handleFindClient}
              handleSimulateQRScan={handleSimulateQRScan}
              setFoundClient={setFoundClient}
              setPointsToSpend={setPointsToSpend}
              pointsToSpend={pointsToSpend}
              cartTotal={cartTotal}
              floatingRevenue={floatingRevenue}
              finalCharge={finalCharge}
              handleCheckoutClick={handleCheckoutClick}
              isMobile={isMobile}
            />
          )}

          {activeRightTab === 'queue' && (
            <BaristaQueue 
              activeOrders={activeOrders}
              onCompleteOrder={onCompleteOrder}
              onCancelOrder={onCancelOrder}
              isMobile={isMobile}
            />
          )}

          {activeRightTab === 'delivery' && <div style={{ animation: 'fadeIn 0.2s ease', flexGrow: 1 }}><DeliveryWidget onAddDeliveryToRevenue={onAddDeliveryToRevenue} /></div>}
          {activeRightTab === 'telegram' && <div style={{ animation: 'fadeIn 0.2s ease', flexGrow: 1 }}><TelegramWidget onNewOrder={onNewOrder} loggedInBarista={loggedInBarista} /></div>}
          {activeRightTab === 'tools' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.2s ease', flexGrow: 1 }}>
              <AdvancedInventory ingredients={ingredients} onWriteOff={handleWriteOff} />
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)' }}>🛑 Стоп-лист</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {menuItems.map(item => (
                    <button key={item.id} onClick={() => onToggleStopList(item.id)} style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', border: 'none', backgroundColor: stopList.includes(item.id) ? '#ef4444' : 'var(--bg-main)', color: stopList.includes(item.id) ? 'white' : 'var(--text-muted)' }}>
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {isMobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--bg-card)', padding: '12px 16px', display: 'flex', gap: '12px', boxShadow: '0 -4px 15px rgba(0,0,0,0.1)', zIndex: 100, borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setMobileView('menu')} 
            style={{ flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: mobileView === 'menu' ? '#3b82f6' : 'var(--bg-main)', color: mobileView === 'menu' ? 'white' : 'var(--text-main)', fontWeight: 'bold', border: 'none', fontSize: '16px', transition: '0.2s' }}
          >
            ☕ Меню
          </button>
          <button 
            onClick={() => { setMobileView('cart'); setActiveRightTab('cart'); }} 
            style={{ flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: mobileView === 'cart' ? '#10b981' : 'var(--bg-main)', color: mobileView === 'cart' ? 'white' : 'var(--text-main)', fontWeight: 'bold', border: 'none', fontSize: '16px', position: 'relative', transition: '0.2s' }}
          >
            🛒 Корзина {cart.length > 0 && <span style={{opacity: 0.9}}>({cartTotal} ₽)</span>}
            {cart.length > 0 && (
              <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '24px', height: '24px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                {cart.length}
              </div>
            )}
          </button>
        </div>
      )}

      {showTipModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '360px', borderRadius: '24px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)', animation: 'slideUp 0.3s ease' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>💖</div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>Чаевые бариста</h2>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>Гость хочет оставить на чай?</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[0, 50, 100, 150].map(amt => (
                <button 
                  key={amt} 
                  onClick={() => { setTipAmount(amt); setCustomTip(''); }} 
                  style={{ padding: '12px', borderRadius: '12px', border: `2px solid ${tipAmount === amt && customTip === '' ? '#3b82f6' : 'var(--border-color)'}`, backgroundColor: tipAmount === amt && customTip === '' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-main)', color: tipAmount === amt && customTip === '' ? '#3b82f6' : 'var(--text-main)', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: '0.2s' }}
                >
                  {amt === 0 ? 'Без чаевых' : `${amt} ₽`}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <input 
                type="number" 
                placeholder="Другая сумма (₽)..." 
                value={customTip} 
                onChange={(e) => { setCustomTip(e.target.value); setTipAmount(0); }} 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `2px solid ${customTip ? '#3b82f6' : 'var(--border-color)'}`, backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '16px', textAlign: 'center', boxSizing: 'border-box', outline: 'none' }} 
              />
            </div>

            <button onClick={proceedToPayment} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
              К оплате: {finalCharge + (customTip ? Number(customTip) : tipAmount)} ₽
            </button>
            
            <button onClick={() => setShowTipModal(false)} style={{ width: '100%', padding: '12px', marginTop: '12px', borderRadius: '16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      {showReceipt && (
        <ReceiptModal 
          order={lastOrderForReceipt} 
          onClose={() => setShowReceipt(false)} 
          appData={{ appName: 'GOURMET COFFEE' }} 
        />
      )}

      <CustomerDisplayModal 
        showCustomerDisplay={showCustomerDisplay} showConfetti={showConfetti} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep}
        cart={cart} finalCharge={finalCharge + tipAmount} handlePaymentSuccess={handlePaymentSuccess} closeCustomerDisplay={() => { setShowCustomerDisplay(false); setCheckoutStep('summary'); }}
        ratingSubmitted={ratingSubmitted} loggedInBarista={loggedInBarista} hoveredStar={hoveredStar} setHoveredStar={setHoveredStar}
        handleRatingSubmit={handleRatingSubmit} selectedRating={selectedRating} showFeedbackReasons={showFeedbackReasons} feedbackSubmitted={feedbackSubmitted}
        handleFeedbackReasonSubmit={(reason) => { setFeedbackSubmitted(true); }}
      />

      <ZReportModal 
        showZReport={showZReport} shiftTime={new Date().getTime()} shiftRevenue={baristaStats[loggedInBarista]?.revenue || 0}
        baristas={baristas} baristaStats={baristaStats} salarySettings={salarySettings} finishZReport={finishZReport}
      />

      <BaristaCabinet 
        isOpen={showBaristaCabinet} 
        onClose={() => setShowBaristaCabinet(false)} 
        baristaName={loggedInBarista} 
        baristaStats={baristaStats} 
        salarySettings={salarySettings} 
      />
    </div>
  );
};

export default BaristaModule;