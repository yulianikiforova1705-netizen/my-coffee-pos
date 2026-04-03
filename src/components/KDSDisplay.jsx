import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase.js'; 

export const KDSDisplay = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const prevOrdersRef = useRef([]);

  // 🚀 Анимации для KDS
  const kdsAnimations = `
    @keyframes slideInUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulseAlert {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .kds-card { animation: slideInUp 0.5s ease-out forwards; }
    .kds-alert { animation: pulseAlert 2s infinite; border-color: #ef4444 !important; }
  `;

  // 🕒 Живой таймер, чтобы минуты тикали автоматически
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 15000); // Обновляем каждые 15 сек
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'orders'), where('status', '==', 'В процессе'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = [];
      snapshot.forEach((docSnap) => {
        ordersData.push({ ...docSnap.data(), docId: docSnap.id });
      });
      
      ordersData.sort((a, b) => a.timestamp - b.timestamp);
      setActiveOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  // 🔔 Звуковое уведомление при появлении НОВОГО заказа
  useEffect(() => {
    // Ищем заказы, которых не было в предыдущем состоянии
    const hasNewOrders = activeOrders.some(order => 
      !prevOrdersRef.current.find(prevOrder => prevOrder.docId === order.docId)
    );

    if (hasNewOrders && prevOrdersRef.current.length > 0) {
      try {
        // Приятный кассовый/уведомительный звук (можно поменять URL)
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
        audio.play().catch(e => console.log('Автоплей звука заблокирован до первого клика по экрану', e));
      } catch (err) {}
    }

    prevOrdersRef.current = activeOrders;
  }, [activeOrders]);

  const handleMarkAsDone = async (orderId, timestamp) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'Готово',
        color: '#10b981',
        duration: Math.floor((Date.now() - timestamp) / 1000)
      });
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', padding: '2rem', fontFamily: 'sans-serif' }}>
      <style>{kdsAnimations}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #334155', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#3b82f6' }}>Экран сборки (KDS)</h1>
        <div style={{ fontSize: '1.5rem', backgroundColor: '#1e293b', padding: '0.5rem 1.5rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
          В очереди: 
          <strong style={{ color: activeOrders.length > 5 ? '#ef4444' : '#f59e0b', fontSize: '2rem' }}>
            {activeOrders.length}
          </strong>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#94a3b8' }}>
          <div style={{ fontSize: '6rem', marginBottom: '1rem', opacity: 0.5 }}>☕</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'normal' }}>Очередь пуста. Ждем заказы!</h2>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {activeOrders.map((order) => {
            // Вычисляем время ожидания на основе живого таймера
            const minutesAgo = Math.floor((currentTime - order.timestamp) / 60000);
            
            let timeColor = '#10b981'; // Зеленый (до 5 мин)
            let isAlert = false;

            if (minutesAgo >= 5) timeColor = '#f59e0b'; // Желтый (от 5 до 10 мин)
            if (minutesAgo >= 10) {
              timeColor = '#ef4444'; // Красный (больше 10 мин)
              isAlert = true; // Включаем пульсацию
            }

            return (
              <div 
                key={order.docId} 
                className={`kds-card ${isAlert ? 'kds-alert' : ''}`}
                style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: `2px solid ${timeColor}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.5s' }}
              >
                <div style={{ backgroundColor: `${timeColor}22`, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${timeColor}`, transition: 'background-color 0.5s' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{order.id}</span>
                  <span style={{ fontSize: '1.3rem', color: timeColor, fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isAlert && '🔥'} {minutesAgo} мин
                  </span>
                </div>
                
                <div style={{ padding: '1.5rem', flexGrow: 1, fontSize: '1.4rem', lineHeight: '1.6' }}>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {order.item.split(' + ').map((product, idx) => (
                      <li key={idx} style={{ marginBottom: '0.5rem', fontWeight: '500' }}>{product}</li>
                    ))}
                  </ul>
                  <div style={{ marginTop: '1.5rem', color: '#94a3b8', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>🧑‍🍳 {order.barista}</span>
                    <span style={{ backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '6px' }}>{order.orderType}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleMarkAsDone(order.docId, order.timestamp)}
                  style={{ width: '100%', padding: '1.2rem', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#2563eb'; e.target.style.transform = 'scale(1.02)'; }}
                  onMouseOut={(e) => { e.target.style.backgroundColor = '#3b82f6'; e.target.style.transform = 'scale(1)'; }}
                >
                  ГОТОВО ✔
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};