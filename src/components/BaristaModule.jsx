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
  // 🚀 БРОНЯ: ДОБАВЛЕНЫ ДЕФОЛТНЫЕ ПУСТЫЕ ЗНАЧЕНИЯ, ЧТОБЫ ИЗБЕЖАТЬ БЕЛОГО ЭКРАНА
  onCloseShift, onNewOrder, onOpenDrawer, menuItems = [], stopList = [],
  onToggleStopList, clients = {}, salarySettings = {}, baristaStats = {},
  baristas = [], promocodes = [], cashbackPercent = 0, loggedInBarista = '',
  onRequestBaristaSwitch, onRateBarista, onAddDeliveryToRevenue,
  handleWriteOff, ingredients = [],
  orders = [], onCompleteOrder = () => {}, onCancelOrder = () => {},
  onLogout,
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
    if (text.includes('лимонад') || text.includes('айс') || text.includes('сок') || text.includes('фреш') || text.includes('смузи') || text.includes('вода') || text.includes('колд')) return '🥤';
    if (text.includes('какао') || text.includes('шоколад') || text.includes('латте') || text.includes('капучино') || text.includes('эспрессо')) return '☕';
    return '☕'; 
  };

  const handleAddToCart = (item) => {
    const freshItem = menuItems.find(m => m.id === item.id) || item;
    if (stopList.includes(freshItem.id)) { alert(`❌ ${freshItem.name} в стоп-листе!`); return; }
    
    const findStock = (obj) => {
      if (!obj) return undefined;
      if (obj.stock !== undefined && obj.stock !== '') return Number(obj.stock);
      if (obj.inventory !== undefined && obj.inventory !== '') return Number(obj.inventory);
      if (obj.quantity !== undefined && obj.quantity !== '') return Number(obj.quantity);
      if (obj.count !== undefined && obj.count !== '') return Number(obj.count);
      return undefined;
    };
    
    let availableStock = findStock(freshItem);
    
    if (availableStock === undefined && ingredients && ingredients.length > 0) {
      const linkedIngredient = ingredients.find(ing => ing.name.toLowerCase().trim() === freshItem.name.toLowerCase().trim() || ing.id === freshItem.id);
      if (linkedIngredient) availableStock = findStock(linkedIngredient);
    }
    
    if (availableStock !== undefined && !isNaN(availableStock)) {
      const inCartCount = cart.filter(c => c.id === freshItem.id).length;
      if (availableStock <= 0) { alert(`❌ "${freshItem.name}" закончился! (Остаток: 0)`); return; }
      if (inCartCount >= availableStock) { alert(`❌ Доступно всего: ${availableStock} шт.`); return; }
    }
    
    setCart([...cart, freshItem]);
    if (activeRightTab !== 'cart') setActiveRightTab('cart');
  };

  const removeFromCart = (indexToRemove) => { setCart(cart.filter((_, index) => index !== indexToRemove)); };
  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const finalCharge = Math.max(0, cartTotal - pointsToSpend); 

  const handleFindClient = () => {
    const phoneDigits = clientPhone.replace(/\D/g, '');
    if (clients[phoneDigits]) { setFoundClient({ phone: phoneDigits, ...clients[phoneDigits] }); setPointsToSpend(0); } else { alert('Гость не найден!'); setFoundClient(null); setPointsToSpend(0); }
  };

  const handleCheckoutClick = () => { if (cart.length === 0) return alert('Корзина пуста!'); setTipAmount(0); setCustomTip(''); setShowTipModal(true); };
  const proceedToPayment = () => { setTipAmount(customTip ? Number(customTip) : tipAmount); setShowTipModal(false); setCheckoutStep('summary'); setRatingSubmitted(false); setShowFeedbackReasons(false); setFeedbackSubmitted(false); setShowCustomerDisplay(true); };

  const handlePaymentSuccess = () => {
    // 🚀 ВОЗВРАЩАЕМ ЗВУК КАССЫ
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
    
    onNewOrder(orderDescription, cartTotal, foundClient ? foundClient.phone : clientPhone.replace(/\D/g, ''), pointsToSpend, tipAmount, loggedInBarista, 'В зале');
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

  const finishZReport = () => {
    // 🚀 БРОНЯ: Безопасное чтение выручки
    const revenue = baristaStats?.[loggedInBarista]?.revenue || 0;
    const tips = baristaStats?.[loggedInBarista]?.tips || 0;
    onCloseShift({ revenue, ordersCount: 0, salary: 1500, tips });
    setShowZReport(false);
    setIsShiftOpen(false); // СБРОС СМЕНЫ
    if (onLogout) onLogout(); 
  };

  const categories = ['Все', ...Array.from(new Set(menuItems.map(item => item.category || 'Прочее')))];
  const filteredMenu = activeCategory === 'Все' ? menuItems : menuItems.filter(item => item.category === activeCategory);

  // 🚀 БРОНЯ: Безопасное чтение статистики десертов
  const currentDessertsSold = baristaStats?.[loggedInBarista]?.dessertsSold || 0;
  const challengeGoal = 10;
  const challengeProgress = Math.min((currentDessertsSold / challengeGoal) * 100, 100);

  if (!isShiftOpen) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, height: '100%', minHeight: '60vh', animation: 'fadeIn 0.3s ease' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>☕</div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: 'var(--text-main)', fontWeight: '900' }}>Привет, {loggedInBarista || 'Бариста'}!</h2>
          <p style={{ margin: '0 0 32px 0', color: 'var(--text-muted)', fontSize: '16px' }}>Твоя смена еще не открыта.</p>
          <div style={{ textAlign: 'left', marginBottom: '32px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>РАЗМЕН В КАССЕ (₽)</label>
            <input type="number" value={startingCash} onChange={(e) => setStartingCash(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <button onClick={() => setIsShiftOpen(true)} style={{ width: '100%', padding: '16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)' }}>🟢 ОТКРЫТЬ СМЕНУ</button>
          <button onClick={onLogout} style={{ marginTop: '16px', padding: '12px', backgroundColor: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🚪 Выйти из аккаунта</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: isMobile ? '12px' : '20px', paddingBottom: isMobile ? '80px' : '0' }}>
      <style>{`.hide-scroll::-webkit-scrollbar { display: none; } .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; } .barista-profile-hover:hover { background-color: rgba(59, 130, 246, 0.1); }`}</style>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '12px', backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div onClick={() => setShowBaristaCabinet(true)} className="barista-profile-hover" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, cursor: 'pointer', padding: '6px 12px', borderRadius: '12px', transition: '0.2s', marginLeft: '-12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
              {loggedInBarista?.charAt(0) || 'Б'} {/* 🚀 БРОНЯ: защита первой буквы */}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '16px' }}>{loggedInBarista || 'Бариста'}</div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>Смена открыта</div>
            </div>
          </div>
          <button onClick={() => baristas.length > 1 ? onRequestBaristaSwitch(baristas.find(b => b !== loggedInBarista)) : alert('Вы единственный бариста в системе')} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🔄 Сменить</button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onOpenDrawer(loggedInBarista)} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '12px', fontWeight: 'bold' }}>💵 Касса</button>
          <button onClick={() => setShowZReport(true)} style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: 'white', borderRadius: '12px', fontWeight: 'bold' }}>🛑 Z-Отчет</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexGrow: 1, flexDirection: isMobile ? 'column' : 'row' }}>
        <BaristaMenu isMobile={isMobile} mobileView={mobileView} categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} filteredMenu={filteredMenu} stopList={stopList} handleAddToCart={handleAddToCart} challengeGoal={challengeGoal} currentDessertsSold={currentDessertsSold} challengeProgress={challengeProgress} ingredients={ingredients} cart={cart} />
        <div style={{ flex: 1, display: (!isMobile || mobileView === 'cart') ? 'flex' : 'none', flexDirection: 'column', gap: '16px', minHeight: isMobile ? 'auto' : '600px', width: '100%' }}>
          <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-card)', padding: '8px', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto' }} className="hide-scroll">
            {['cart', 'queue', 'delivery', 'telegram', 'tools'].map(tab => (
              <button key={tab} onClick={() => setActiveRightTab(tab)} style={{ flex: 1, minWidth: '80px', padding: '12px 4px', borderRadius: '10px', border: 'none', backgroundColor: activeRightTab === tab ? '#3b82f6' : 'transparent', color: activeRightTab === tab ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                {tab === 'cart' ? '🛒 Касса' : tab === 'queue' ? '🛎️ Очередь' : tab === 'delivery' ? '🛵 Дост.' : tab === 'telegram' ? '✈️ TG' : '🛠 Инстр.'}
              </button>
            ))}
          </div>
          {activeRightTab === 'cart' && <BaristaCart cart={cart} removeFromCart={removeFromCart} isSuccessFlash={isSuccessFlash} foundClient={foundClient} clientPhone={clientPhone} setClientPhone={setClientPhone} handleFindClient={handleFindClient} setFoundClient={setFoundClient} setPointsToSpend={setPointsToSpend} pointsToSpend={pointsToSpend} cartTotal={cartTotal} floatingRevenue={floatingRevenue} finalCharge={finalCharge} handleCheckoutClick={handleCheckoutClick} isMobile={isMobile} />}
          {activeRightTab === 'queue' && <BaristaQueue activeOrders={activeOrders} onCompleteOrder={onCompleteOrder} onCancelOrder={onCancelOrder} isMobile={isMobile} />}
          {activeRightTab === 'delivery' && <DeliveryWidget onAddDeliveryToRevenue={onAddDeliveryToRevenue} />}
          {activeRightTab === 'telegram' && <TelegramWidget onNewOrder={onNewOrder} loggedInBarista={loggedInBarista} />}
          {activeRightTab === 'tools' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <AdvancedInventory ingredients={ingredients} onWriteOff={handleWriteOff} />
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>🛑 Стоп-лист</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {menuItems.map(item => (
                    <button key={item.id} onClick={() => onToggleStopList(item.id)} style={{ padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', border: 'none', backgroundColor: stopList.includes(item.id) ? '#ef4444' : 'var(--bg-main)', color: stopList.includes(item.id) ? 'white' : 'var(--text-muted)' }}>{item.name}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--bg-card)', padding: '12px 16px', display: 'flex', gap: '12px', boxShadow: '0 -4px 15px rgba(0,0,0,0.1)', zIndex: 100, borderTop: '1px solid var(--border-color)' }}>
          <button onClick={() => setMobileView('menu')} style={{ flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: mobileView === 'menu' ? '#3b82f6' : 'var(--bg-main)', color: mobileView === 'menu' ? 'white' : 'var(--text-main)', fontWeight: 'bold', border: 'none' }}>☕ Меню</button>
          <button onClick={() => { setMobileView('cart'); setActiveRightTab('cart'); }} style={{ flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: mobileView === 'cart' ? '#10b981' : 'var(--bg-main)', color: mobileView === 'cart' ? 'white' : 'var(--text-main)', fontWeight: 'bold', border: 'none' }}>🛒 Корзина {cart.length > 0 && `(${cartTotal} ₽)`}</button>
        </div>
      )}

      {showTipModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '360px', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}><div style={{ fontSize: '48px', marginBottom: '8px' }}>💖</div><h2 style={{ margin: 0, fontSize: '20px' }}>Чаевые бариста</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>{[0, 50, 100, 150].map(amt => <button key={amt} onClick={() => { setTipAmount(amt); setCustomTip(''); }} style={{ padding: '12px', borderRadius: '12px', border: `2px solid ${tipAmount === amt && customTip === '' ? '#3b82f6' : 'var(--border-color)'}`, backgroundColor: tipAmount === amt && customTip === '' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-main)', fontWeight: 'bold' }}>{amt === 0 ? 'Без чаевых' : `${amt} ₽`}</button>)}</div>
            <input type="number" placeholder="Другая сумма..." value={customTip} onChange={(e) => { setCustomTip(e.target.value); setTipAmount(0); }} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-main)', textAlign: 'center' }} />
            <button onClick={proceedToPayment} style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', marginTop: '24px' }}>К оплате: {finalCharge + (customTip ? Number(customTip) : tipAmount)} ₽</button>
            <button onClick={() => setShowTipModal(false)} style={{ width: '100%', padding: '12px', marginTop: '12px', backgroundColor: 'transparent', color: 'var(--text-muted)' }}>Отмена</button>
          </div>
        </div>
      )}

      {showReceipt && <ReceiptModal order={lastOrderForReceipt} onClose={() => setShowReceipt(false)} appData={{ appName: 'GOURMET COFFEE' }} />}
      <CustomerDisplayModal showCustomerDisplay={showCustomerDisplay} showConfetti={showConfetti} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep} cart={cart} finalCharge={finalCharge + tipAmount} handlePaymentSuccess={handlePaymentSuccess} closeCustomerDisplay={() => { setShowCustomerDisplay(false); setCheckoutStep('summary'); }} ratingSubmitted={ratingSubmitted} loggedInBarista={loggedInBarista} hoveredStar={hoveredStar} setHoveredStar={setHoveredStar} handleRatingSubmit={(star) => { setSelectedRating(star); setRatingSubmitted(true); onRateBarista(loggedInBarista, star); if (star >= 4) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000); } else { setShowFeedbackReasons(true); } }} selectedRating={selectedRating} showFeedbackReasons={showFeedbackReasons} feedbackSubmitted={feedbackSubmitted} handleFeedbackReasonSubmit={() => setFeedbackSubmitted(true)} />
      <ZReportModal showZReport={showZReport} shiftTime={new Date().getTime()} shiftRevenue={baristaStats?.[loggedInBarista]?.revenue || 0} baristas={baristas} baristaStats={baristaStats} salarySettings={salarySettings} finishZReport={finishZReport} />
      <BaristaCabinet isOpen={showBaristaCabinet} onClose={() => setShowBaristaCabinet(false)} baristaName={loggedInBarista} baristaStats={baristaStats} salarySettings={salarySettings} />
    </div>
  );
};

export default BaristaModule;