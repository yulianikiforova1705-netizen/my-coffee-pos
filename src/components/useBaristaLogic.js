import { useState, useEffect } from 'react';

export const useBaristaLogic = (props) => {
  const { onCloseShift, onNewOrder, menuItems, stopList, clients = {}, salarySettings, baristaStats, baristas, promocodes, cashbackPercent, loggedInBarista, onRateBarista, addLog } = props;

  const [cart, setCart] = useState([]);
  const [shiftTime, setShiftTime] = useState(0);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [shiftRevenue, setShiftRevenue] = useState(0); 
  const [shiftOrdersCount, setShiftOrdersCount] = useState(0); 
  const [showZReport, setShowZReport] = useState(false); 

  const [phone, setPhone] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [orderTips, setOrderTips] = useState(0);
  const [orderType, setOrderType] = useState('В зале');

  const [floatingMoneys, setFloatingMoneys] = useState([]);

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const [showCustomerDisplay, setShowCustomerDisplay] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('summary'); 
  
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFeedbackReasons, setShowFeedbackReasons] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    let interval;
    if (isShiftActive) interval = setInterval(() => setShiftTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isShiftActive]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addToCart = (item) => { if (!stopList.includes(item.id)) setCart([...cart, item]); };
  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));

  const baseSum = cart.reduce((sum, item) => sum + item.price, 0); 
  const currentHour = new Date().getHours();
  const isHappyHour = currentHour >= 20 || currentHour < 4;

  let happyHourDiscount = 0;
  if (isHappyHour) {
    cart.forEach(item => {
      if (item.category === 'Десерты' || item.category === 'Еда' || item.isDessert) {
        happyHourDiscount += item.price * 0.3; 
      }
    });
  }

  let promoDiscount = 0;
  if (appliedPromo) {
    const sumAfterHH = baseSum - happyHourDiscount;
    if (appliedPromo.type === 'percent') { promoDiscount = sumAfterHH * (appliedPromo.value / 100); } 
    else { promoDiscount = appliedPromo.value; }
  }

  const itemsSum = Math.max(0, Math.round(baseSum - happyHourDiscount - promoDiscount));
  const availablePoints = clients[phone] ? (typeof clients[phone] === 'object' ? clients[phone].points : clients[phone]) : 0; 
  const pointsToSpend = usePoints ? Math.min(availablePoints, itemsSum) : 0; 
  const finalCharge = (itemsSum - pointsToSpend) + orderTips; 

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const foundPromo = promocodes.find(p => p.code === code);
    if (foundPromo) { setAppliedPromo(foundPromo); setPromoError(''); } 
    else { setAppliedPromo(null); setPromoError('Неверный код'); }
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    if (orderType === 'Доставка 🛵') { handlePaymentSuccess(); } 
    else { 
      setCheckoutStep('summary'); 
      setRatingSubmitted(false); 
      setShowConfetti(false); 
      setShowFeedbackReasons(false);
      setFeedbackSubmitted(false);
      setSelectedRating(0);
      setShowCustomerDisplay(true); 
    }
  };

  const handlePaymentSuccess = () => {
    const orderDescription = cart.map(item => item.name).join(' + ');
    const charge = finalCharge; 
    
    const animId = Date.now();
    const offset = (Math.random() - 0.5) * 60; 
    setFloatingMoneys(prev => [...prev, { id: animId, amount: charge, offset }]);
    setTimeout(() => { setFloatingMoneys(prev => prev.filter(m => m.id !== animId)); }, 1200);

    onNewOrder(orderDescription, itemsSum, phone, pointsToSpend, orderTips, loggedInBarista, orderType);
    setShiftRevenue(prev => prev + (itemsSum - pointsToSpend));
    setShiftOrdersCount(prev => prev + 1);
    
    setCart([]); setPhone(''); setUsePoints(false); setOrderTips(0); setOrderType('В зале');
    setPromoInput(''); setAppliedPromo(null); setPromoError(''); 
    
    if (orderType !== 'Доставка 🛵') { setCheckoutStep('rating'); }
  };

  const handleRatingSubmit = (stars) => {
    setSelectedRating(stars);
    onRateBarista(loggedInBarista, stars); 
    setRatingSubmitted(true);

    if (stars === 5) { 
      setShowConfetti(true); 
    } else if (stars <= 3) {
      setShowFeedbackReasons(true);
    }
  };

  const handleFeedbackReasonSubmit = (reason) => {
    setFeedbackSubmitted(true);
    setShowFeedbackReasons(false);
    if (addLog) {
      addLog(`⚠️ Причина низкой оценки (${selectedRating}⭐) бариста ${loggedInBarista}: ${reason}`, 'warning');
    }
  };

  const closeCustomerDisplay = () => {
    setShowCustomerDisplay(false); 
    setCheckoutStep('summary'); 
    setShowConfetti(false); 
    setRatingSubmitted(false);
    setShowFeedbackReasons(false);
    setFeedbackSubmitted(false);
    setSelectedRating(0);
  };

  const handleToggleShift = () => {
    if (isShiftActive) { setShowZReport(true); setIsShiftActive(false); } 
    else { setShiftTime(0); setShiftRevenue(0); setShiftOrdersCount(0); setIsShiftActive(true); setShowZReport(false); }
  };

  const finishZReport = () => {
    const salaryDetails = baristas.map(b => {
      const rev = baristaStats[b]?.revenue || 0;
      const sal = Math.round(salarySettings.base + (rev * (salarySettings.percent / 100)));
      return `${b}: ${sal} ₽`;
    }).join(' | ');
    onCloseShift({ revenue: shiftRevenue, ordersCount: shiftOrdersCount, salary: salaryDetails, tips: '...' });
    setShowZReport(false);
  };

  const simulateDeliveryOrder = () => {
    try { const audio = new Audio('https://actions.google.com/sounds/v1/doors/wood_door_open.ogg'); audio.play(); } catch (e) {}
    const availableItems = menuItems.filter(i => !stopList.includes(i.id));
    if (availableItems.length < 2) return;
    const randomItems = availableItems.sort(() => 0.5 - Math.random()).slice(0, 2);
    const orderDesc = randomItems.map(i => i.name).join(' + ');
    const orderSum = randomItems.reduce((sum, i) => sum + i.price, 0);

    onNewOrder(orderDesc, orderSum, '', 0, 0, 'Авто-касса', 'Доставка 🛵');
    setShiftRevenue(prev => prev + orderSum);
    setShiftOrdersCount(prev => prev + 1);
  };

  const currentStats = baristaStats[loggedInBarista] || { tips: 0, dessertsSold: 0, revenue: 0 };
  const challengeGoal = 10;
  const progressPercent = Math.min(100, (currentStats.dessertsSold / challengeGoal) * 100);

  return {
    ...props, 
    cart, shiftTime, isShiftActive, shiftRevenue, shiftOrdersCount, showZReport,
    phone, setPhone, usePoints, setUsePoints, orderTips, setOrderTips, orderType, setOrderType,
    floatingMoneys, promoInput, setPromoInput, appliedPromo, promoError,
    showCustomerDisplay, checkoutStep, setCheckoutStep, hoveredStar, setHoveredStar, showConfetti, ratingSubmitted,
    selectedRating, showFeedbackReasons, feedbackSubmitted, handleFeedbackReasonSubmit,
    formatTime, addToCart, removeFromCart, isHappyHour, happyHourDiscount, promoDiscount,
    availablePoints, pointsToSpend, finalCharge, handleApplyPromo, handleCheckoutClick, handlePaymentSuccess,
    handleRatingSubmit, closeCustomerDisplay, handleToggleShift, finishZReport, simulateDeliveryOrder,
    currentStats, challengeGoal, progressPercent
  };
};