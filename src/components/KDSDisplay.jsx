import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase.js'; 

export const KDSDisplay = () => {
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    // Подключаемся к базе и слушаем только те заказы, которые "В процессе"
    const q = query(
      collection(db, 'orders'),
      where('status', '==', 'В процессе')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = [];
      snapshot.forEach((docSnap) => {
        ordersData.push({ ...docSnap.data(), docId: docSnap.id });
      });
      
      // Сортируем от старых к новым (чтобы старые заказы были первыми в очереди)
      ordersData.sort((a, b) => a.timestamp - b.timestamp);
      setActiveOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkAsDone = async (orderId, timestamp) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      // Обновляем статус заказа в Firebase
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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #334155', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#3b82f6' }}>Экран сборки (KDS)</h1>
        <div style={{ fontSize: '1.5rem', backgroundColor: '#1e293b', padding: '0.5rem 1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
          В очереди: <strong style={{ color: '#f59e0b' }}>{activeOrders.length}</strong>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#94a3b8' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>☕</div>
          <h2 style={{ fontSize: '2rem' }}>Очередь пуста. Ждем заказы!</h2>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {activeOrders.map((order) => {
            // Вычисляем, сколько минут назад поступил заказ
            const minutesAgo = Math.floor((Date.now() - order.timestamp) / 60000);
            let timeColor = '#10b981'; // Зеленый (до 5 мин)
            if (minutesAgo >= 5) timeColor = '#f59e0b'; // Желтый (от 5 до 10 мин)
            if (minutesAgo >= 10) timeColor = '#ef4444'; // Красный (больше 10 мин)

            return (
              <div key={order.docId} style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: `2px solid ${timeColor}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                
                <div style={{ backgroundColor: `${timeColor}22`, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${timeColor}` }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{order.id}</span>
                  <span style={{ fontSize: '1.2rem', color: timeColor, fontWeight: 'bold' }}>
                    {order.time} ({minutesAgo} мин)
                  </span>
                </div>
                
                <div style={{ padding: '1.5rem', flexGrow: 1, fontSize: '1.4rem', lineHeight: '1.6' }}>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {order.item.split(' + ').map((product, idx) => (
                      <li key={idx} style={{ marginBottom: '0.5rem' }}>{product}</li>
                    ))}
                  </ul>
                  <div style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '1.1rem' }}>
                    Бариста: {order.barista} | {order.orderType}
                  </div>
                </div>

                <button 
                  onClick={() => handleMarkAsDone(order.docId, order.timestamp)}
                  style={{ width: '100%', padding: '1.2rem', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
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