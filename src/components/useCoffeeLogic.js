import { useState, useRef, useEffect, useMemo } from 'react';
import { db } from './firebase'; 
import { collection, doc, setDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export const useCoffeeLogic = () => {
  const [appData, setAppData] = useState({ appName: 'Аналитическая платформа сети кофеен', ownerName: 'Yulia Nikiforova' });
  const [city, setCity] = useState('Москва');

  // 🚨 ТУТ БУДУТ ТВОИ КЛЮЧИ ОТ TELEGRAM 🚨
  const TELEGRAM_TOKEN = '8495119049:AAFXN3RPlZZmSXopOGJJCjyKk8pjufoln2M'; 
  const TELEGRAM_CHAT_ID = '765319326'; 

  const [currentRole, setCurrentRole] = useState(null); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fileInputRef = useRef(null);
  
  const [pinModal, setPinModal] = useState({ isOpen: false, targetRole: '', targetBarista: '' });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const PIN_CODES = { 'Владелец': '7777', 'Управляющий': '1234' };
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastActiveDate, setLastActiveDate] = useState(new Date().toLocaleDateString('ru-RU'));

  const [stats, setStats] = useState([
    { id: 1, label: 'Выручка за день', value: '0 ₽', rawValue: 0, change: '0%', color: '#2563eb' },
    { id: 2, label: 'Продано товаров', value: '0 шт', rawValue: 0, change: '0%', color: '#10b981' },
    { id: 3, label: 'Средний чек', value: '0 ₽', rawValue: 0, change: '0%', color: '#f59e0b' },
    { id: 4, label: 'Чистая прибыль', value: '0 ₽', rawValue: 0, change: '0%', color: '#8b5cf6' },
  ]);

  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expText, setExpText] = useState(''); const [expAmount, setExpAmount] = useState(''); const [expCategory, setExpCategory] = useState('Закупка');
  
  const [ingredients, setIngredients] = useState([
    { id: 'beans', name: 'Кофейное зерно', stock: 2500, unit: 'гр', min: 500, orderStep: 2000, costPerStep: 2400 },
    { id: 'milk', name: 'Молоко', stock: 5000, unit: 'мл', min: 1000, orderStep: 10000, costPerStep: 850 },
    { id: 'cups', name: 'Стаканы', stock: 150, unit: 'шт', min: 50, orderStep: 500, costPerStep: 1500 },
    { id: 'syrup', name: 'Сироп ванильный', stock: 700, unit: 'мл', min: 100, orderStep: 1000, costPerStep: 600 }
  ]);

  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Эспрессо', price: 150, costPrice: 40, color: '#f87171', category: 'Кофе', recipe: { beans: 18, cups: 1 } },
    { id: 2, name: 'Американо', price: 180, costPrice: 45, color: '#fb923c', category: 'Кофе', recipe: { beans: 18, cups: 1 } },
    { id: 3, name: 'Капучино (L)', price: 250, costPrice: 75, color: '#fbbf24', category: 'Кофе', recipe: { beans: 18, milk: 150, cups: 1 } },
    { id: 4, name: 'Латте', price: 260, costPrice: 85, color: '#34d399', category: 'Кофе', recipe: { beans: 18, milk: 200, cups: 1 } },
    { id: 5, name: 'Флэт Уайт', price: 280, costPrice: 90, color: '#60a5fa', category: 'Кофе', recipe: { beans: 36, milk: 100, cups: 1 } },
    { id: 6, name: 'Раф Ванильный', price: 320, costPrice: 110, color: '#c084fc', category: 'Кофе', recipe: { beans: 18, milk: 150, syrup: 20, cups: 1 } },
    { id: 7, name: 'Круассан', price: 190, costPrice: 80, color: '#a78bfa', category: 'Десерты', isDessert: true, inventory: 10 },
    { id: 8, name: 'Сэндвич', price: 350, costPrice: 150, color: '#f472b6', category: 'Еда', inventory: 5 },
  ]);
  
  const [stopList, setStopList] = useState([]);
  const [clients, setClients] = useState({'9990000000': { points: 1850, visits: 24, totalSpent: 18500, lastVisit: '15.03.2026' }}); 
  const [salarySettings, setSalarySettings] = useState({ base: 1500, percent: 5 });
  
  const [baristas, setBaristas] = useState(['Маша', 'Паша']);
  const [baristaPins, setBaristaPins] = useState({ 'Маша': '1111', 'Паша': '2222' });
  
  const [baristaStats, setBaristaStats] = useState({ 
    'Маша': { tips: 0, dessertsSold: 0, revenue: 0, ratingSum: 0, ratingCount: 0 }, 
    'Паша': { tips: 0, dessertsSold: 0, revenue: 0, ratingSum: 0, ratingCount: 0 }
  });
  
  const [loggedInBarista, setLoggedInBarista] = useState('Маша');

  const [schedule, setSchedule] = useState({});
  const [shiftArchive, setShiftArchive] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [logs, setLogs] = useState([{ id: 1, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: 'Система готова к работе.', type: 'info' }]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [promocodes, setPromocodes] = useState([{ code: 'COFFEE20', type: 'percent', value: 20, label: '-20%' }, { code: 'GIFT100', type: 'fixed', value: 100, label: '-100 ₽' }]);
  const [cashbackPercent, setCashbackPercent] = useState(10);

  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showProcurementModal, setShowProcurementModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const getSmartIcon = (name, category) => {
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
    if (text.includes('какао') || text.includes('шоколад') || text.includes('раф') || text.includes('латте') || text.includes('капучино') || text.includes('эспрессо')) return '☕';
    if (text.includes('еда') || text.includes('перекус')) return '🥪';
    return '☕'; 
  };

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  const [weather, setWeather] = useState({ temp: '...', condition: '⏳', trend: 'Поиск спутника...' });

  useEffect(() => {
    if (!isLoaded) return; 
    const fetchWeather = async () => {
      try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru`);
        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) { setWeather({ temp: '?', condition: '🌍', trend: `Город "${city}" не найден` }); return; }
        const { latitude, longitude } = geoData.results[0];
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherResponse.json();
        const current = weatherData.current_weather;
        let conditionIcon = '🌤️'; let trendText = 'Отличная погода для кофе';
        if (current.weathercode >= 51 && current.weathercode <= 67) { conditionIcon = '🌧️'; trendText = 'Дождь — спрос на выпечку +20%'; } else if (current.weathercode >= 71) { conditionIcon = '❄️'; trendText = 'Снег — время горячего капучино'; } else if (current.temperature > 25) { conditionIcon = '☀️'; trendText = 'Жара — предлагаем айс-латте!'; }
        setWeather({ temp: `${current.temperature > 0 ? '+' : ''}${Math.round(current.temperature)}°C`, condition: conditionIcon, trend: trendText });
      } catch (error) { console.error("Ошибка загрузки погоды:", error); setWeather({ temp: '+?°C', condition: '☁️', trend: 'Нет связи с метеостанцией' }); }
    };
    fetchWeather(); const weatherTimer = setInterval(fetchWeather, 3600000); return () => clearInterval(weatherTimer);
  }, [city, isLoaded]);

  const sendTelegramMessage = async (message) => {
    if (TELEGRAM_TOKEN === 'ТВОЙ_ТОКЕН_ОТ_БОТА' || !TELEGRAM_CHAT_ID) { console.log('TG Имитация отправки:', message); return; }
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
      await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' }) });
    } catch (error) { console.error('Ошибка отправки в Telegram:', error); }
  };

  const updateStats = (updater) => {
    setStats(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setDoc(doc(db, 'system', 'stats'), { items: next }).catch(e => console.error(e));
      return next;
    });
  };

  const updateIngredients = (updater) => {
    setIngredients(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setDoc(doc(db, 'system', 'ingredients'), { items: next }).catch(e => console.error(e));
      return next;
    });
  };

  const updateMenu = (updater) => {
    setMenuItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setDoc(doc(db, 'system', 'menu'), { items: next }).catch(e => console.error(e));
      return next;
    });
  };

  useEffect(() => {
    try {
      const qOrders = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
      const unsubOrders = onSnapshot(qOrders, (snapshot) => {
        const cloudOrders = []; snapshot.forEach(doc => cloudOrders.push(doc.data()));
        if (cloudOrders.length > 0) setOrders(cloudOrders);
      });
      const unsubStats = onSnapshot(doc(db, 'system', 'stats'), (docSnap) => {
        if (docSnap.exists() && docSnap.data().items) setStats(docSnap.data().items);
      });
      const unsubIngredients = onSnapshot(doc(db, 'system', 'ingredients'), (docSnap) => {
        if (docSnap.exists() && docSnap.data().items) setIngredients(docSnap.data().items);
      });
      const unsubMenu = onSnapshot(doc(db, 'system', 'menu'), (docSnap) => {
        if (docSnap.exists() && docSnap.data().items) setMenuItems(docSnap.data().items);
      });
      
      return () => { unsubOrders(); unsubStats(); unsubIngredients(); unsubMenu(); };
    } catch (e) { console.log("Firebase sync waiting"); }
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem('coffee_pos_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.appData) setAppData(prev => ({ ...prev, ...parsed.appData })); 
        if (parsed.city) setCity(parsed.city);
        if (parsed.stopList) setStopList(parsed.stopList);
        if (parsed.menuItems && menuItems.length <= 8) setMenuItems(parsed.menuItems); 
        if (parsed.clients) setClients(parsed.clients); 
        if (parsed.salarySettings) setSalarySettings(parsed.salarySettings); 
        if (parsed.baristaStats) {
          const upgradedStats = {}; Object.keys(parsed.baristaStats).forEach(b => { upgradedStats[b] = { ...parsed.baristaStats[b], ratingSum: parsed.baristaStats[b].ratingSum || 0, ratingCount: parsed.baristaStats[b].ratingCount || 0 }; }); setBaristaStats(upgradedStats);
        }
        if (parsed.shiftArchive) setShiftArchive(parsed.shiftArchive); if (parsed.securityAlerts) setSecurityAlerts(parsed.securityAlerts);
        if (parsed.logs) setLogs(parsed.logs); if (parsed.expenses) setExpenses(parsed.expenses); 
        if (parsed.schedule) setSchedule(parsed.schedule); if (parsed.lastActiveDate) setLastActiveDate(parsed.lastActiveDate); 
        if (parsed.promocodes) setPromocodes(parsed.promocodes); if (parsed.cashbackPercent) setCashbackPercent(parsed.cashbackPercent); 
        if (parsed.baristas) setBaristas(parsed.baristas); if (parsed.baristaPins) setBaristaPins(parsed.baristaPins); 
        if (orders.length === 0 && parsed.orders) setOrders(parsed.orders);
        if (stats[0].rawValue === 0 && parsed.stats) setStats(parsed.stats);
        if (parsed.ingredients && ingredients[0].stock === 2500) setIngredients(parsed.ingredients);
      } catch (e) { console.error('Error LS', e); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('coffee_pos_data', JSON.stringify({ appData, city, stats, orders, stopList, menuItems, clients, salarySettings, baristaStats, shiftArchive, securityAlerts, logs, expenses, schedule, lastActiveDate, promocodes, cashbackPercent, ingredients, baristas, baristaPins }));
  }, [appData, city, stats, orders, stopList, menuItems, clients, salarySettings, baristaStats, shiftArchive, securityAlerts, logs, expenses, schedule, lastActiveDate, promocodes, cashbackPercent, ingredients, baristas, baristaPins, isLoaded]);

  const addLog = (text, type) => setLogs(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text, type }, ...(prev || [])]); 
  
  const triggerSecurityAlert = (text) => { 
    setSecurityAlerts(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text }, ...(prev || [])]); 
    addLog(`🚨 АЛЕРТ: ${text}`, 'warning'); 
    sendTelegramMessage(`🚨 <b>АЛЕРТ БЕЗОПАСНОСТИ</b>\n\n${text}\n🕒 ${new Date().toLocaleTimeString('ru-RU')}`);
  };

  const handleHardReset = () => {
    if (!window.confirm('💣 ВНИМАНИЕ! ВЫ УВЕРЕНЫ?')) return;
    localStorage.removeItem('coffee_pos_data'); window.location.reload(); 
  };

  const handleWriteOff = (ingredientId, amount, reason) => {
    const ing = ingredients.find(i => i.id === ingredientId);
    if (!ing) return;
    const costPerUnit = ing.costPerStep / ing.orderStep;
    const lossAmount = Math.round(amount * costPerUnit);
    updateIngredients(prev => prev.map(i => i.id === ingredientId ? { ...i, stock: Math.max(0, i.stock - amount) } : i));
    setExpenses(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: `Списание: ${ing.name} (${reason})`, amount: lossAmount, category: 'Прочее' }, ...prev]);
    updateStats(prevStats => prevStats.map(stat => stat.id === 4 ? { ...stat, rawValue: stat.rawValue - lossAmount, value: `${(stat.rawValue - lossAmount).toLocaleString('ru-RU')} ₽` } : stat));
    addLog(`🗑️ Списано ${amount}${ing.unit} ${ing.name} (${reason}). Убыток: ${lossAmount}₽`, 'warning');
  };

  const handleAddDeliveryRevenue = (price) => {
    updateStats(prevStats => prevStats.map(stat => { 
      if (stat.id === 1) return { ...stat, rawValue: stat.rawValue + price, value: `${(stat.rawValue + price).toLocaleString('ru-RU')} ₽` }; 
      if (stat.id === 4) return { ...stat, rawValue: stat.rawValue + price, value: `${(stat.rawValue + price).toLocaleString('ru-RU')} ₽` }; 
      return stat; 
    }));
    addLog(`🛵 Заказ доставки передан курьеру (+${price} ₽)`, 'success');
  };

  const handleRateBarista = (baristaName, stars) => {
    setBaristaStats(prev => {
      const current = prev[baristaName] || { tips: 0, dessertsSold: 0, revenue: 0, ratingSum: 0, ratingCount: 0 };
      return { ...prev, [baristaName]: { ...current, ratingSum: (current.ratingSum || 0) + stars, ratingCount: (current.ratingCount || 0) + 1 } };
    });
    addLog(`⭐ Гость поставил ${stars} звёзд бариста ${baristaName}`, 'success');
  };

  const handleUpdateSchedule = (dateKey, newWorkers) => { setSchedule(prev => ({ ...(prev || {}), [dateKey]: newWorkers })); };

  const handleAddExpense = () => { 
    if (!expText || !expAmount) return; const amountNum = Number(expAmount);
    setExpenses([{ id: Date.now(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: expText, amount: amountNum, category: expCategory }, ...(expenses || [])]);
    updateStats(prevStats => (prevStats || []).map(stat => { if (stat.id === 4) { const newProfit = stat.rawValue - amountNum; return { ...stat, rawValue: newProfit, value: `${newProfit.toLocaleString('ru-RU')} ₽` }; } return stat; }));
    addLog(`💸 Внесен расход: ${expText} (-${amountNum} ₽)`, 'warning'); setExpText(''); setExpAmount(''); setExpCategory('Закупка');
  };

  const handleSaveInventory = (newStockData, totalLoss) => {
    updateIngredients(prev => prev.map(ing => newStockData[ing.id] !== undefined ? { ...ing, stock: newStockData[ing.id] } : ing));
    if (totalLoss > 0) {
      const lossAmount = Math.round(totalLoss);
      setExpenses(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: 'Списание (Инвентаризация)', amount: lossAmount, category: 'Прочее' }, ...prev]);
      updateStats(prevStats => prevStats.map(stat => stat.id === 4 ? { ...stat, rawValue: stat.rawValue - lossAmount, value: `${(stat.rawValue - lossAmount).toLocaleString('ru-RU')} ₽` } : stat));
    }
    addLog(`📦 Проведена инвентаризация. Списано: ${Math.round(totalLoss)} ₽`, 'warning');
  };

  const handleApproveProcurement = () => {
    let totalCost = 0;
    let orderedItems = [];
    updateIngredients(prevIngs => {
      return prevIngs.map(i => {
        if (i.stock <= i.min) {
          totalCost += i.costPerStep;
          orderedItems.push(i.name);
          return { ...i, stock: i.stock + i.orderStep };
        }
        return i;
      });
    });
    updateMenu(prevMenu => {
      return prevMenu.map(m => {
        if (m.inventory !== undefined && m.inventory <= 5) {
          const cost = 20 * (m.costPrice || 0);
          totalCost += cost;
          orderedItems.push(m.name);
          return { ...m, inventory: m.inventory + 20 };
        }
        return m;
      });
    });

    if (totalCost > 0) {
      setExpenses(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: `Авто-закупка склада (${orderedItems.length} поз.)`, amount: totalCost, category: 'Закупка' }, ...(prev || [])]);
      updateStats(prevStats => (prevStats || []).map(stat => { 
        if (stat.id === 4) { 
          const newProfit = stat.rawValue - totalCost; 
          return { ...stat, rawValue: newProfit, value: `${newProfit.toLocaleString('ru-RU')} ₽` }; 
        } 
        return stat; 
      }));
      addLog(`🛒 Авто-закупка проведена. Списано: ${totalCost}₽. Пополнено: ${orderedItems.join(', ')}`, 'success');
      sendTelegramMessage(`📦 <b>АВТО-ЗАКУПКА</b>\n\nСклад пополнен.\nПотрачено: ${totalCost} ₽\nЗакуплено: ${orderedItems.join(', ')}\n🕒 ${new Date().toLocaleTimeString('ru-RU')}`);
    }
    setShowProcurementModal(false);
    alert(`Склад успешно пополнен! Сумма ${totalCost} ₽ списана из бюджета.`);
  };

  const handleRoleRequest = (role) => { if (role === currentRole) return; setPinModal({ isOpen: true, targetRole: role, targetBarista: '' }); setPinInput(''); setPinError(false); };
  
  const handlePinSubmit = () => { 
    if (pinModal.targetRole === 'Владелец' || pinModal.targetRole === 'Управляющий') {
      if (pinInput === PIN_CODES[pinModal.targetRole]) { setCurrentRole(pinModal.targetRole); setPinModal({ isOpen: false, targetRole: '', targetBarista: '' }); addLog(`Успешный вход: ${pinModal.targetRole}`, 'success'); } 
      else { setPinError(true); setPinInput(''); addLog(`⚠️ Неудачный вход: "${pinModal.targetRole}"`, 'warning'); }
    } else if (pinModal.targetRole === 'Бариста') {
      const foundBarista = Object.keys(baristaPins).find(name => baristaPins[name] === pinInput);
      if (foundBarista) { setCurrentRole('Бариста'); setLoggedInBarista(foundBarista); setPinModal({ isOpen: false, targetRole: '', targetBarista: '' }); addLog(`Вход на кассу: ${foundBarista}`, 'success'); } 
      else { setPinError(true); setPinInput(''); addLog(`⚠️ Неверный ПИН бариста`, 'warning'); }
    } else if (pinModal.targetRole === 'Смена Бариста') {
      if (pinInput === baristaPins[pinModal.targetBarista]) { setLoggedInBarista(pinModal.targetBarista); setPinModal({ isOpen: false, targetRole: '', targetBarista: '' }); addLog(`Смена бариста на кассе: ${pinModal.targetBarista}`, 'info'); } 
      else { setPinError(true); setPinInput(''); addLog(`⚠️ Неверный ПИН бариста`, 'warning'); }
    }
  };
  const cancelPin = () => setPinModal({ isOpen: false, targetRole: '', targetBarista: '' });

  const handleAddMenuItem = (newItem) => { 
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1; 
    const itemWithIcon = { ...newItem, id: newId, icon: getSmartIcon(newItem.name, newItem.category) };
    updateMenu([...menuItems, itemWithIcon]); 
    addLog(`Добавлена позиция: ${itemWithIcon.name}`, 'info'); 
  };
  const handleEditMenuItem = (updatedItem) => { 
    const itemWithIcon = { ...updatedItem, icon: getSmartIcon(updatedItem.name, updatedItem.category) };
    updateMenu(menuItems.map(item => item.id === itemWithIcon.id ? itemWithIcon : item)); 
    addLog(`Позиция меню обновлена: ${itemWithIcon.name}`, 'info'); 
  };
  const handleDeleteMenuItem = (id) => { updateMenu(menuItems.filter(i => i.id !== id)); setStopList(stopList.filter(i => i !== id)); };
  const handleUpdateInventory = (itemId, newAmount) => { updateMenu(menuItems.map(i => i.id === itemId ? { ...i, inventory: newAmount } : i)); };
  const handleToggleStopList = (itemId) => setStopList(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);

  const handleCreateOrder = (orderDescription, totalSum, phone = '', pointsSpent = 0, tips = 0, activeBarista = 'Маша', orderType = 'В зале') => {
    const newId = `#${1044 + orders.length}`; 
    const moneyPaid = totalSum - pointsSpent; 
    const pointsEarned = Math.floor(moneyPaid * (cashbackPercent / 100)); 
    let orderCost = 0; let dessertsInOrder = 0; 
    
    updateIngredients(prevIngs => {
      let newIngs = [...prevIngs];
      orderDescription.split(' + ').forEach(name => { 
        const item = menuItems.find(i => i.name === name); 
        if (item) {
          if (item.costPrice) orderCost += item.costPrice; if (item.category === 'Десерты' || item.isDessert) dessertsInOrder += 1;
          if (item.recipe) { Object.keys(item.recipe).forEach(ingId => { const idx = newIngs.findIndex(ing => ing.id === ingId); if (idx !== -1) { newIngs[idx] = { ...newIngs[idx], stock: Math.max(0, newIngs[idx].stock - item.recipe[ingId]) }; } }); }
        }
      });
      return newIngs;
    });

    setBaristaStats(prev => { const current = prev[activeBarista] || { tips: 0, dessertsSold: 0, revenue: 0, ratingSum: 0, ratingCount: 0 }; return { ...prev, [activeBarista]: { ...current, tips: current.tips + tips, dessertsSold: current.dessertsSold + dessertsInOrder, revenue: current.revenue + moneyPaid }}; });
    
    const orderProfit = moneyPaid - orderCost; const now = new Date(); 
    
    const newOrder = { 
      id: newId, time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
      item: orderDescription, total: moneyPaid, status: 'В процессе', 
      color: '#f59e0b', barista: activeBarista, timestamp: Date.now(), orderType 
    };

    try { setDoc(doc(db, 'orders', newId.toString()), newOrder); } catch (err) { console.error("Ошибка:", err); }

    setOrders([newOrder, ...orders]); 

    updateStats(prevStats => prevStats.map(stat => { 
      if (stat.id === 1) return { ...stat, rawValue: stat.rawValue + moneyPaid, value: `${(stat.rawValue + moneyPaid).toLocaleString('ru-RU')} ₽` }; 
      if (stat.id === 2) return { ...stat, rawValue: stat.rawValue + orderDescription.split(' + ').length, value: `${stat.rawValue + orderDescription.split(' + ').length} шт` }; 
      if (stat.id === 4) return { ...stat, rawValue: stat.rawValue + orderProfit, value: `${(stat.rawValue + orderProfit).toLocaleString('ru-RU')} ₽` }; 
      return stat; 
    }));
    if (phone) { setClients(prev => { const oldData = typeof prev[phone] === 'object' ? prev[phone] : { points: prev[phone] || 0, visits: 0, totalSpent: 0 }; return { ...prev, [phone]: { points: oldData.points - pointsSpent + pointsEarned, visits: oldData.visits + 1, totalSpent: oldData.totalSpent + moneyPaid, lastVisit: now.toLocaleDateString('ru-RU') } }; }); }
  };

  const handleCompleteOrder = (orderId) => { 
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: 'Готово', color: '#10b981', duration: Math.floor((Date.now() - o.timestamp) / 1000) } : o);
    setOrders(updatedOrders);
    const finishedOrder = updatedOrders.find(o => o.id === orderId);
    if(finishedOrder) { setDoc(doc(db, 'orders', orderId.toString()), finishedOrder).catch(e => console.error(e)); }
  };

  const handleCancelOrder = (orderId) => { 
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: 'Отменен', color: '#ef4444' } : o);
    setOrders(updatedOrders);
    const canceledOrder = updatedOrders.find(o => o.id === orderId);
    if(canceledOrder) { setDoc(doc(db, 'orders', orderId.toString()), canceledOrder).catch(e => console.error(e)); }
    sendTelegramMessage(`❌ <b>ОТМЕНА ЗАКАЗА</b>\n\nБыл отменен заказ: ${orderId}\nБариста: ${loggedInBarista}\n🕒 ${new Date().toLocaleTimeString('ru-RU')}`);
  };

  const handleOpenDrawer = (baristaName) => triggerSecurityAlert(`Касса открыта без продажи (${baristaName})`); 

  // 🚀 ИСПРАВЛЕНИЕ: ПРАВИЛЬНОЕ ЗАКРЫТИЕ СМЕНЫ С ОБНУЛЕНИЕМ СТАТИСТИКИ
  const handleCloseShift = (shiftData) => { 
    const currentOrdersCount = orders.filter(o => o.status !== 'Отменен').length;
    setShiftArchive([{ 
      id: Date.now(), 
      date: new Date().toLocaleString(), 
      revenue: shiftData.revenue, 
      ordersCount: currentOrdersCount, 
      salary: shiftData.salary, 
      tips: shiftData.tips 
    }, ...shiftArchive]); 
    
    setOrders([]);
    setStats([
      { id: 1, label: 'Выручка за день', value: '0 ₽', rawValue: 0, change: '0%', color: '#2563eb' },
      { id: 2, label: 'Продано товаров', value: '0 шт', rawValue: 0, change: '0%', color: '#10b981' },
      { id: 3, label: 'Средний чек', value: '0 ₽', rawValue: 0, change: '0%', color: '#f59e0b' },
      { id: 4, label: 'Чистая прибыль', value: '0 ₽', rawValue: 0, change: '0%', color: '#8b5cf6' },
    ]);
    setExpenses([]);
    
    addLog(`🗄️ Смена закрыта. Выручка сохранена в архив.`, 'success'); 
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify({ appData, city, stats, orders, stopList, menuItems, clients, salarySettings, baristaStats, shiftArchive, securityAlerts, logs, expenses, schedule, lastActiveDate, promocodes, cashbackPercent, ingredients, baristas, baristaPins }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' }); const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `coffee_backup_${new Date().toISOString().slice(0, 10)}.json`; link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0]; if (!file) return; const reader = new FileReader();
    reader.onload = (event) => {
      try { const parsed = JSON.parse(event.target.result); if (parsed.baristas) setBaristas(parsed.baristas); if (parsed.baristaPins) setBaristaPins(parsed.baristaPins); if (parsed.baristaStats) setBaristaStats(parsed.baristaStats); alert('Данные импортированы!'); } catch (error) { alert('Ошибка импорта'); }
    }; reader.readAsText(file);
  };

  const currentRevenue = (stats.find(s => s.id === 1) || { rawValue: 0 }).rawValue; 
  const currentNetProfit = (stats.find(s => s.id === 4) || { rawValue: 0 }).rawValue; 
  const totalManualExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0); 
  const costOfGoods = Math.max(0, currentRevenue - currentNetProfit - totalManualExpenses); 
  const activeOrdersCount = orders.filter(o => o.status === 'В процессе').length; 
  const allLowStock = ingredients.filter(i => i.stock <= i.min).map(i => ({ name: i.name, inventory: i.stock, unit: i.unit }));
  const sendSmsToClient = (phone) => { alert(`📱 Имитация отправки SMS на номер +7 ${phone}`); addLog(`Отправлен промокод клиенту ${phone}`, 'success'); };

  const dateStr = currentTime.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'short' });
  const timeStr = currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  // 🚀 УМНАЯ СТАТИСТИКА: Считаем средний чек и проценты к прошлой смене
  const displayStats = useMemo(() => {
    const lastShift = shiftArchive.length > 0 ? shiftArchive[0] : null;

    return stats.map(stat => {
      let updatedStat = { ...stat };
      
      // Считаем динамический средний чек
      if (stat.id === 3) {
        const rev = stats.find(s => s.id === 1)?.rawValue || 0;
        const validOrders = orders.filter(o => o.status !== 'Отменен');
        const avg = validOrders.length > 0 ? Math.round(rev / validOrders.length) : 0;
        updatedStat.rawValue = avg;
        updatedStat.value = `${avg.toLocaleString('ru-RU')} ₽`;
      }

      // Считаем проценты роста к прошлой смене
      if (lastShift) {
        let percent = 0;
        if (stat.id === 1) { 
          const lastRev = lastShift.revenue || 1; 
          percent = Math.round(((updatedStat.rawValue - lastRev) / lastRev) * 100);
        } else if (stat.id === 2) { 
          const lastItems = (lastShift.ordersCount || 1) * 1.5; 
          percent = Math.round(((updatedStat.rawValue - lastItems) / lastItems) * 100);
        } else if (stat.id === 3) { 
          const lastAvg = lastShift.ordersCount > 0 ? Math.round((lastShift.revenue || 0) / lastShift.ordersCount) : 1;
          percent = Math.round(((updatedStat.rawValue - lastAvg) / lastAvg) * 100);
        } else if (stat.id === 4) { 
          const lastProfit = (lastShift.revenue || 1) * 0.6;
          percent = Math.round(((updatedStat.rawValue - lastProfit) / lastProfit) * 100);
        }
        
        if (percent > 999) percent = 999; // Защита от гигантских цифр
        updatedStat.change = `${percent > 0 ? '+' : ''}${percent}%`;
      } else {
        updatedStat.change = updatedStat.rawValue > 0 ? '+100%' : '0%';
      }

      return updatedStat;
    });
  }, [stats, orders, shiftArchive]);

  const topSales = useMemo(() => { const counts = {}; (orders || []).forEach(order => { if (order.status === 'Отменен') return; (order.item || '').split(' + ').forEach(itemName => counts[itemName] = (counts[itemName] || 0) + 1); }); return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3); }, [orders]); 
  const categoryStats = useMemo(() => { const statsObj = {}; let totalRevenue = 0; if (!(orders || []).filter(o => o.status !== 'Отменен').length) return { stats: { 'Нет продаж': 0 }, total: 0 }; (orders || []).forEach(order => { if (order.status === 'Отменен') return; (order.item || '').split(' + ').forEach(itemName => { const menuItem = (menuItems || []).find(m => m.name === itemName); const cat = menuItem?.category || (menuItem?.isDessert ? 'Десерты' : 'Кофе'); const price = menuItem?.price || 0; if (statsObj[cat] !== undefined) statsObj[cat] += price; else statsObj[cat] = price; totalRevenue += price; }); }); return { stats: statsObj, total: totalRevenue }; }, [orders, menuItems]);
  const catColors = useMemo(() => { const baseColors = { 'Кофе': '#3b82f6', 'Еда': '#10b981', 'Десерты': '#8b5cf6', 'Зерно': '#f59e0b', 'Выпечка': '#f43f5e', 'Нет продаж': '#cbd5e1' }; Object.keys(categoryStats.stats).forEach((cat, index) => { if (!baseColors[cat]) { const fallbackColors = ['#0ea5e9', '#84cc16', '#eab308', '#d946ef', '#14b8a6']; baseColors[cat] = fallbackColors[index % fallbackColors.length]; } }); return baseColors; }, [categoryStats]);
  
  const baristaEfficiency = useMemo(() => { 
    const bStats = {}; (orders || []).forEach(order => { if (order.status === 'Отменен') return; const b = order.barista || 'Неизвестно'; if (!bStats[b]) bStats[b] = { count: 0, revenue: 0 }; bStats[b].count += 1; bStats[b].revenue += (order.total || 0); }); 
    return Object.entries(bStats).map(([name, data]) => ({ name, ...data, avg: data.count > 0 ? Math.round(data.revenue / data.count) : 0 })).sort((a, b) => b.revenue - a.revenue); 
  }, [orders]);
  
  const hourlyHeatmap = useMemo(() => { 
    const hours = Array.from({length: 16}, (_, i) => i + 8); 
    const counts = {}; hours.forEach(h => counts[h] = 0); 
    (orders || []).forEach(o => { 
      if (o.status !== 'Отменен' && o.time) { 
        let h = parseInt(o.time.split(':')[0]); 
        if (h < 8) h = 23; 
        if (!isNaN(h) && counts[h] !== undefined) counts[h]++; 
      } 
    }); 
    const maxOrders = Math.max(...Object.values(counts), 1); 
    return hours.map(h => ({ hour: `${h}:00`, count: counts[h], intensity: counts[h] / maxOrders })); 
  }, [orders]);

  const avgSpeedText = useMemo(() => { 
    const completed = (orders || []).filter(o => o.status === 'Готово' && o.duration !== undefined); if (completed.length === 0) return 'Нет данных'; 
    const avgSec = Math.floor(completed.reduce((sum, o) => sum + (o.duration || 0), 0) / completed.length); const m = Math.floor(avgSec / 60); const s = avgSec % 60; return `${m > 0 ? m + ' мин ' : ''}${s} сек`; 
  }, [orders]);

  const aiTips = useMemo(() => {
    const tips = [];
    tips.push({ icon: weather.condition, text: `🏙️ Погода в г. ${city}: ${weather.temp}. ${weather.trend}` });
    if (allLowStock.length > 0) { tips.push({ icon: '📦', text: `Критичные остатки: ${allLowStock.map(i=>i.name).join(', ')}. Авто-закупка в панели Управляющего поможет быстро пополнить склад.` }); } else { tips.push({ icon: '✅', text: `Склад в норме. Все ключевые ингредиенты в наличии.` }); }
    if (baristaEfficiency.length > 1 && baristaEfficiency[0] && baristaEfficiency[0].avg > 0) { const top = baristaEfficiency[0]; const second = baristaEfficiency[1]; if (top.avg - second.avg > 30) { tips.push({ icon: '👨‍🍳', text: `${top.name} продает лучше (${top.avg}₽ средний чек против ${second.avg}₽ у ${second.name}). Попросите ${second.name} активнее предлагать десерты!` }); } else { tips.push({ icon: '🤝', text: `Команда работает отлично. Средний чек у бариста почти одинаковый.` }); } }
    if (hourlyHeatmap && hourlyHeatmap.length > 0) { const peak = [...hourlyHeatmap].sort((a,b)=>b.count - a.count)[0]; if (peak && peak.count > 0) { tips.push({ icon: '🔥', text: `Самый загруженный час: ${peak.hour}. Убедитесь, что в это время на смене работает опытный бариста.` }); } }
    return tips;
  }, [allLowStock, baristaEfficiency, hourlyHeatmap, weather, city]);

  return {
    appData, currentRole, setCurrentRole, isDarkMode, setIsDarkMode, fileInputRef,
    pinModal, setPinModal, pinInput, setPinInput, pinError, PIN_CODES,
    currentTime, lastActiveDate, stats: displayStats, orders, expenses, expText, setExpText, expAmount, setExpAmount, expCategory, setExpCategory,
    ingredients, menuItems, stopList, clients, salarySettings, baristas, setBaristas, baristaPins, setBaristaPins, baristaStats, setBaristaStats, loggedInBarista,
    schedule, shiftArchive, securityAlerts, logs, isLoaded, promocodes, setPromocodes, cashbackPercent, setCashbackPercent, weather,
    showTelegramModal, setShowTelegramModal, showProcurementModal, setShowProcurementModal, showArchiveModal, setShowArchiveModal,
    handleHardReset, handleUpdateSchedule, handleAddExpense, topSales, categoryStats, catColors, baristaEfficiency, hourlyHeatmap, avgSpeedText,
    addLog, triggerSecurityAlert, handleRoleRequest, handlePinSubmit, cancelPin, handleAddMenuItem, handleEditMenuItem, handleDeleteMenuItem, handleUpdateInventory, handleToggleStopList,
    handleCreateOrder, handleCompleteOrder, handleCancelOrder, handleOpenDrawer, handleCloseShift, handleBackup, handleImport,
    currentRevenue, currentNetProfit, totalManualExpenses, costOfGoods, activeOrdersCount, allLowStock, sendSmsToClient, dateStr, timeStr, aiTips,
    handleRateBarista, handleSaveInventory, handleWriteOff, handleAddDeliveryRevenue, handleApproveProcurement
  };
};