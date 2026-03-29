import { useState, useEffect } from 'react';
import initialData from './data.json';

export const useCoffeeLogic = () => {
  const [appData, setAppData] = useState(initialData);

  // === ВСЕ СОСТОЯНИЯ ===
  const [currentRole, setCurrentRole] = useState(null);
  const [pinModal, setPinModal] = useState({ isOpen: false, targetRole: null, targetBarista: null });
  const [pinInput, setPinInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [clients, setClients] = useState({});
  const [baristas, setBaristas] = useState([]);
  const [baristaPins, setBaristaPins] = useState({});
  const [baristaStats, setBaristaStats] = useState({});
  const [baristaEfficiency, setBaristaEfficiency] = useState([]);
  const [salarySettings, setSalarySettings] = useState({ hourlyRate: 200, revenuePercent: 5 });
  const [promocodes, setPromocodes] = useState([]);
  const [cashbackPercent, setCashbackPercent] = useState(5);
  const [stopList, setStopList] = useState([]);
  const [shiftArchive, setShiftArchive] = useState([]);
  
  const [expText, setExpText] = useState('');
  const [expCategory, setExpCategory] = useState('Закупка');
  const [expAmount, setExpAmount] = useState('');
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showProcurementModal, setShowProcurementModal] = useState(false);
  const [loggedInBarista, setLoggedInBarista] = useState(null);

  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

// === 🚀 МАГИЯ: Умный подборщик иконок (Диктаторский режим) ===
  const getSmartIcon = (name, category) => {
    const text = ((name || '') + ' ' + (category || '')).toLowerCase();

    // Сначала ищем конкретные названия продуктов
    if (text.includes('круассан')) return '🥐';
    if (text.includes('ролл') || text.includes('рол ') || text.includes('шаурма') || text.includes('wrap') || text.includes('врап')) return '🌯';
    if (text.includes('сэндвич') || text.includes('сендвич') || text.includes('панини') || text.includes('тост')) return '🥪';
    if (text.includes('сырник') || text.includes('блин') || text.includes('завтрак') || text.includes('омлет') || text.includes('яичниц') || text.includes('каша')) return '🍳';
    if (text.includes('печенье') || text.includes('кукис') || text.includes('макарон')) return '🍪';
    if (text.includes('чизкейк') || text.includes('торт') || text.includes('пирож') || text.includes('эклер') || text.includes('десерт') || text.includes('сладк')) return '🍰';
    if (text.includes('булоч') || text.includes('хлеб') || text.includes('выпеч')) return '🥐';
    if (text.includes('салат') || text.includes('боул')) return '🥗';
    if (text.includes('суп')) return '🥣';
    
    // Затем напитки
    if (text.includes('матча') || text.includes('чай')) return '🍵';
    if (text.includes('лимонад') || text.includes('айс') || text.includes('сок') || text.includes('фреш') || text.includes('смузи') || text.includes('вода') || text.includes('колд')) return '🥤';
    if (text.includes('какао') || text.includes('шоколад')) return '☕';

    // Общие категории, если ничего не подошло
    if (text.includes('еда') || text.includes('перекус')) return '🥪';
    
    return '☕'; 
  };

  useEffect(() => {
    const saved = localStorage.getItem('coffeeAppData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAppData(parsed);
      } catch (e) {
        console.error("Ошибка загрузки данных", e);
      }
    } else {
      setAppData(initialData);
    }
  }, []);

  useEffect(() => {
    setMenuItems(appData.menuItems || []);
    setOrders(appData.orders || []);
    setIngredients(appData.ingredients || []);
    setExpenses(appData.expenses || []);
    setLogs(appData.logs || []);
    setSchedule(appData.schedule || {});
    setClients(appData.clients || {});
    setBaristas(appData.baristas || []);
    setBaristaPins(appData.baristaPins || {});
    setBaristaStats(appData.baristaStats || {});
    setBaristaEfficiency(appData.baristaEfficiency || []);
    setSalarySettings(appData.salarySettings || { hourlyRate: 200, revenuePercent: 5 });
    setPromocodes(appData.promocodes || []);
    setCashbackPercent(appData.cashbackPercent || 5);
    setStopList(appData.stopList || []);
    setShiftArchive(appData.shiftArchive || []);
  }, [appData]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setDateStr(now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }));
      setTimeStr(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (msg) => {
    const newLog = { id: Date.now(), time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), msg };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  const handleBackup = () => {
    const stateToSave = {
      ...appData,
      menuItems, orders, ingredients, expenses, logs, schedule, clients,
      baristas, baristaPins, baristaStats, baristaEfficiency,
      salarySettings, promocodes, cashbackPercent, stopList, shiftArchive
    };
    localStorage.setItem('coffeeAppData', JSON.stringify(stateToSave));
    setAppData(stateToSave);
    addLog(`Система: Создан бэкап данных`);
    alert('Бэкап успешно сохранен!');
  };

  const handleHardReset = () => {
    if (window.confirm("ВНИМАНИЕ! Это удалит ВСЕ данные (кроме заводских) из браузера. Вы уверены?")) {
      if (window.prompt("Введите 0000 для подтверждения сброса") === "0000") {
        localStorage.removeItem('coffeeAppData');
        setAppData(initialData);
        window.location.reload();
      }
    }
  };

  const handleRoleRequest = (role) => {
    if (role === 'Владелец') { setPinModal({ isOpen: true, targetRole: role, targetBarista: null }); setPinInput(''); }
    else if (role === 'Управляющий') { setPinModal({ isOpen: true, targetRole: role, targetBarista: null }); setPinInput(''); }
    else if (role === 'Бариста') {
      if (!baristas || baristas.length === 0) { alert('Нет активных бариста. Создайте их в панели Владельца.'); return; }
      setPinModal({ isOpen: true, targetRole: 'Выбор Бариста', targetBarista: null }); 
      setPinInput('');
    }
  };

  const handlePinSubmit = () => {
    if (pinModal.targetRole === 'Владелец' && pinInput === '0000') {
      setCurrentRole('Владелец'); setPinModal({ isOpen: false }); addLog(`Вход: Владелец`);
    } else if (pinModal.targetRole === 'Управляющий' && pinInput === '1111') {
      setCurrentRole('Управляющий'); setPinModal({ isOpen: false }); addLog(`Вход: Управляющий`);
    } else if (pinModal.targetRole === 'Смена Бариста' || pinModal.targetRole === 'Выбор Бариста') {
      const bName = pinModal.targetBarista || (baristas.length > 0 ? baristas[0] : null);
      if (bName && baristaPins[bName] && baristaPins[bName] === pinInput) {
        setCurrentRole('Бариста'); setLoggedInBarista(bName); setPinModal({ isOpen: false }); addLog(`Вход: Бариста ${bName}`);
      } else {
        alert('Неверный PIN для бариста!'); setPinInput('');
      }
    } else {
      alert('Неверный PIN!'); setPinInput('');
    }
  };

  const cancelPin = () => { setPinModal({ isOpen: false, targetRole: null, targetBarista: null }); setPinInput(''); };

  // === 🚀 ИСПОЛЬЗУЕМ УМНЫЕ ИКОНКИ ПРИ СОЗДАНИИ/РЕДАКТИРОВАНИИ ТОВАРОВ ===
  const handleAddMenuItem = (newItem) => {
    const itemWithIcon = {
      ...newItem,
      icon: getSmartIcon(newItem.name, newItem.category, newItem.icon)
    };
    setMenuItems([...menuItems, itemWithIcon]);
    addLog(`Меню: Добавлен ${itemWithIcon.name}`);
  };

  const handleEditMenuItem = (updatedItem) => {
    const itemWithIcon = {
      ...updatedItem,
      icon: getSmartIcon(updatedItem.name, updatedItem.category, updatedItem.icon)
    };
    setMenuItems(menuItems.map(item => item.id === itemWithIcon.id ? itemWithIcon : item));
    addLog(`Меню: Обновлен ${itemWithIcon.name}`);
  };

  const handleDeleteMenuItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    addLog(`Меню: Удален товар`);
  };

  const handleUpdateInventory = (id, newRecipe) => {
    setMenuItems(menuItems.map(item => item.id === id ? { ...item, recipe: newRecipe } : item));
  };

  const handleToggleStopList = (id) => {
    setStopList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSaveInventory = (newInv) => {
    setIngredients(newInv); addLog(`Склад: Инвентаризация сохранена`);
  };

  const handleWriteOff = (writeOffList) => {
    let updatedInv = [...ingredients];
    let totalCost = 0;
    writeOffList.forEach(w => {
      const idx = updatedInv.findIndex(i => i.id === w.ingredientId);
      if (idx > -1) {
        updatedInv[idx] = { ...updatedInv[idx], qty: Math.max(0, updatedInv[idx].qty - w.amount) };
        const costPerUnit = updatedInv[idx].price / updatedInv[idx].qty; 
        totalCost += (costPerUnit * w.amount) || 0;
      }
    });
    setIngredients(updatedInv);
    if (totalCost > 0) {
      setExpenses(prev => [{ id: Date.now(), text: 'Списание сырья', category: 'Списание', amount: totalCost, date: new Date().toISOString() }, ...prev]);
    }
    addLog(`Склад: Списание проведено`);
  };

  const handleCreateOrder = (order) => {
    setOrders([{ ...order, id: Date.now(), time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), barista: loggedInBarista }, ...orders]);
    
    let updatedInv = [...ingredients];
    order.items.forEach(item => {
      if (item.recipe) {
        item.recipe.forEach(req => {
          const idx = updatedInv.findIndex(ing => String(ing.id) === String(req.ingredientId));
          if (idx > -1) {
            updatedInv[idx] = { ...updatedInv[idx], qty: Math.max(0, updatedInv[idx].qty - (req.amount * item.qty)) };
          }
        });
      }
    });
    setIngredients(updatedInv);

    const bStats = { ...baristaStats };
    if (!bStats[loggedInBarista]) bStats[loggedInBarista] = { orders: 0, revenue: 0, rating: 5, reviews: 0 };
    bStats[loggedInBarista].orders += 1;
    bStats[loggedInBarista].revenue += order.total;
    setBaristaStats(bStats);

    const phone = order.clientPhone;
    if (phone) {
      const currentClients = { ...clients };
      if (!currentClients[phone]) {
        currentClients[phone] = { name: order.clientName || 'Гость', points: 0, orders: 0, totalSpent: 0 };
      }
      currentClients[phone].orders += 1;
      currentClients[phone].totalSpent += order.total;
      if (order.pointsEarned) currentClients[phone].points += order.pointsEarned;
      if (order.pointsSpent) currentClients[phone].points = Math.max(0, currentClients[phone].points - order.pointsSpent);
      setClients(currentClients);
    }
    addLog(`Касса: Заказ на ${order.total}₽ (${loggedInBarista})`);
  };

  const handleCompleteOrder = (id) => { setOrders(orders.map(o => o.id === id ? { ...o, status: 'Готов' } : o)); };
  const handleCancelOrder = (id) => { setOrders(orders.map(o => o.id === id ? { ...o, status: 'Отменен' } : o)); };

  const handleOpenDrawer = () => { addLog(`Касса: Денежный ящик открыт (${loggedInBarista})`); };
  const handleAddExpense = (e) => { e.preventDefault(); if (expText && expAmount) { setExpenses([{ id: Date.now(), text: expText, category: expCategory, amount: Number(expAmount), date: new Date().toISOString() }, ...expenses]); setExpText(''); setExpAmount(''); addLog(`Финансы: Расход ${expAmount}₽ (${expCategory})`); } };
  
  const handleAddDeliveryRevenue = (amount, service) => {
    setOrders([{ id: Date.now(), items: [{ name: `Заказ ${service}`, price: amount, qty: 1 }], total: amount, status: 'Готов', time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), barista: loggedInBarista || 'Система', source: service }, ...orders]);
    addLog(`Доставка: Принят заказ ${service} на ${amount}₽`);
  };

  const handleUpdateSchedule = (newSched) => { setSchedule(newSched); addLog(`Команда: Обновлен график`); };

  const handleCloseShift = (data) => {
    if (window.confirm('Закрыть смену? Это обнулит текущие заказы и сохранит выручку в архив.')) {
      const shiftData = { id: Date.now(), date: new Date().toLocaleDateString(), barista: loggedInBarista, cash: data.cash, card: data.card, total: data.total, discrepancy: data.diff };
      setShiftArchive([shiftData, ...shiftArchive]);
      setOrders([]);
      setCurrentRole(null);
      setLoggedInBarista(null);
      addLog(`Смена: Закрыта (${shiftData.total}₽)`);
      alert(`Смена закрыта. Выручка: ${shiftData.total}₽. Расхождение: ${shiftData.discrepancy}₽`);
    }
  };

  const sendSmsToClient = (phone, msg) => {
    alert(`SMS отправлено на ${phone}:\n"${msg}"`);
    addLog(`CRM: SMS для ${phone}`);
  };

  const handleRateBarista = (baristaName, rating) => {
    const bStats = { ...baristaStats };
    if (!bStats[baristaName]) bStats[baristaName] = { orders: 0, revenue: 0, rating: 5, reviews: 0 };
    const currentTotal = bStats[baristaName].rating * bStats[baristaName].reviews;
    bStats[baristaName].reviews += 1;
    bStats[baristaName].rating = ((currentTotal + rating) / bStats[baristaName].reviews).toFixed(1);
    setBaristaStats(bStats);
  };

  const handleApproveProcurement = (item, orderQty, cost) => {
    let updatedInv = [...ingredients];
    const idx = updatedInv.findIndex(i => i.id === item.id);
    if (idx > -1) {
      updatedInv[idx] = { ...updatedInv[idx], qty: updatedInv[idx].qty + orderQty };
    }
    setIngredients(updatedInv);
    setExpenses([{ id: Date.now(), text: `Закупка: ${item.name}`, category: 'Закупка', amount: cost, date: new Date().toISOString() }, ...expenses]);
    addLog(`Склад: Авто-закупка ${item.name}`);
  };

  const validOrders = orders.filter(o => o.status !== 'Отменен');
  const currentRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const totalManualExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  let costOfGoods = 0;
  validOrders.forEach(o => {
    o.items.forEach(item => {
      if (item.recipe) {
        item.recipe.forEach(req => {
          const ing = ingredients.find(i => String(i.id) === String(req.ingredientId));
          if (ing && ing.qty > 0) { costOfGoods += (ing.price / ing.qty) * req.amount * item.qty; }
        });
      }
    });
  });
  
  const currentNetProfit = currentRevenue - costOfGoods - totalManualExpenses;

  const categoryStats = validOrders.reduce((acc, o) => {
    o.items.forEach(item => { const cat = item.category || 'Другое'; acc[cat] = (acc[cat] || 0) + (item.price * item.qty); });
    return acc;
  }, {});

  const catColors = { 'Кофе': '#3b82f6', 'Чай': '#10b981', 'Еда': '#f59e0b', 'Десерты': '#ec4899', 'Другое': '#94a3b8' };

  const topSales = Object.entries(validOrders.reduce((acc, o) => {
    o.items.forEach(item => { acc[item.name] = (acc[item.name] || 0) + item.qty; });
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const allLowStock = ingredients.filter(item => item.qty <= item.minQty);

  const hourlyHeatmap = Array(12).fill(0);
  validOrders.forEach(o => {
    const hour = parseInt(o.time.split(':')[0]);
    if (hour >= 8 && hour <= 19) hourlyHeatmap[hour - 8]++;
  });

  const stats = [
    { label: 'Выручка сегодня', value: `${currentRevenue} ₽`, trend: '+12%', color: '#10b981' },
    { label: 'Заказов', value: validOrders.length, trend: '+5%', color: '#3b82f6' },
    { label: 'Средний чек', value: validOrders.length ? `${Math.round(currentRevenue / validOrders.length)} ₽` : '0 ₽', trend: '+2%', color: '#f59e0b' },
    { label: 'Гостей в базе', value: Object.keys(clients).length, trend: '+1', color: '#ec4899' }
  ];

  return {
    appData, isDarkMode, setIsDarkMode, currentRole, setCurrentRole,
    pinModal, setPinModal, pinInput, setPinInput,
    menuItems, orders, ingredients, expenses, logs, schedule, clients, baristas, setBaristas,
    baristaPins, setBaristaPins, baristaStats, setBaristaStats, baristaEfficiency,
    salarySettings, promocodes, setPromocodes, cashbackPercent, setCashbackPercent, stopList, shiftArchive,
    expText, setExpText, expCategory, setExpCategory, expAmount, setExpAmount,
    showTelegramModal, setShowTelegramModal, showArchiveModal, setShowArchiveModal, showProcurementModal, setShowProcurementModal,
    loggedInBarista, dateStr, timeStr,
    handleBackup, handleHardReset, handleRoleRequest, handlePinSubmit, cancelPin,
    handleAddMenuItem, handleEditMenuItem, handleDeleteMenuItem, handleUpdateInventory, handleToggleStopList,
    handleSaveInventory, handleWriteOff, handleCreateOrder, handleCompleteOrder, handleCancelOrder,
    handleOpenDrawer, handleAddExpense, handleAddDeliveryRevenue, handleUpdateSchedule, handleCloseShift,
    sendSmsToClient, handleRateBarista, handleApproveProcurement,
    currentRevenue, totalManualExpenses, costOfGoods, currentNetProfit, categoryStats, catColors, topSales, allLowStock, hourlyHeatmap, stats
  };
};