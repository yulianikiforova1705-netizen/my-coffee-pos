import React, { useState } from 'react';

const TelegramWidget = ({ onNewOrder, loggedInBarista }) => {
  // Имитация поступающих предзаказов из бота
  const [tgOrders, setTgOrders] = useState([
    { id: 'TG-001', guest: 'Алексей', items: 'Капучино (L)', price: 250, time: 'Через 3 мин', avatar: '👨' },
    { id: 'TG-002', guest: 'Мария', items: 'Раф Ванильный + Круассан', price: 510, time: 'Через 7 мин', avatar: '👩' }
  ]);

  const handleComplete = (order) => {
    // Убираем заказ из очереди ожидания
    setTgOrders(prev => prev.filter(o => o.id !== order.id));
    
    // Пробиваем заказ напрямую в нашу общую базу (как будто гость оплатил картой в боте)
    if (onNewOrder) {
      onNewOrder(
        order.items, 
        order.price, 
        '', // телефон
        0,  // списанные баллы
        0,  // чаевые
        loggedInBarista, 
        'Telegram-предзаказ' // Помечаем источник заказа
      );
    }
    alert(`Заказ выдан гостю ${order.guest}! Выручка зачислена в кассу.`);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px', border: '1px solid #0088cc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#0088cc', fontSize: '24px' }}>✈️</span> Предзаказы из Telegram
          {tgOrders.length > 0 && (
            <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>
              {tgOrders.length}
            </span>
          )}
        </h2>
      </div>

      {tgOrders.length === 0 ? (
         <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
             <div style={{ fontSize: '30px', marginBottom: '8px' }}>✨</div>
             Очередь предзаказов пуста
         </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tgOrders.map(order => (
            <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', borderLeft: '4px solid #0088cc' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '32px', backgroundColor: 'var(--bg-card)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px var(--shadow-color)' }}>
                  {order.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '15px' }}>
                    {order.guest} <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'normal' }}>({order.id})</span>
                  </div>
                  <div style={{ color: 'var(--text-main)', fontSize: '14px', marginTop: '4px', fontWeight: '500' }}>{order.items}</div>
                  <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>🏃 Гость будет {order.time}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{ fontWeight: '900', color: '#10b981', fontSize: '16px' }}>{order.price} ₽</span>
                <button onClick={() => handleComplete(order)} style={{ padding: '8px 16px', backgroundColor: '#0088cc', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
                  Выдать гостю
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TelegramWidget;