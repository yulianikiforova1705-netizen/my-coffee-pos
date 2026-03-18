import React, { useState } from 'react';

const DeliveryWidget = ({ onAddDeliveryToRevenue }) => {
  // Имитация поступающих заказов из разных агрегаторов
  const [activeDeliveries, setActiveDeliveries] = useState([
    { id: 'Y-842', source: 'Яндекс.Еда', color: '#ffcc00', items: 'Капучино (L) + Круассан', price: 440, status: 'Новый', timeTarget: '10 мин' },
    { id: 'W-105', source: 'Wolt', color: '#00c2e8', items: 'Флэт Уайт + Сэндвич', price: 630, status: 'Готовится', timeTarget: '5 мин' }
  ]);

  const handleAccept = (id) => {
    setActiveDeliveries(prev => prev.map(order => 
      order.id === id ? { ...order, status: 'Готовится' } : order
    ));
  };

  const handleReady = (id, price) => {
    // 1. Убираем заказ из активных доставок
    setActiveDeliveries(prev => prev.filter(order => order.id !== id));
    
    // 2. Добавляем деньги в общую кассу кофейни (если передана функция)
    if (onAddDeliveryToRevenue) {
      onAddDeliveryToRevenue(price);
    }
    
    alert(`Заказ ${id} передан курьеру! Выручка пополнена.`);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🛵 Единое окно доставок 
          <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            {activeDeliveries.length}
          </span>
        </h2>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Агрегаторы: Яндекс, Wolt, Bolt</div>
      </div>

      {activeDeliveries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🧘</div>
          <div>Активных доставок пока нет. Ждем новые заказы!</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {activeDeliveries.map(order => (
            <div key={order.id} style={{ backgroundColor: 'var(--bg-main)', borderRadius: '16px', borderLeft: `6px solid ${order.color}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Шапка карточки заказа */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '900', color: 'var(--text-main)' }}>{order.id}</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: order.color, color: '#111', padding: '2px 8px', borderRadius: '4px' }}>
                  {order.source}
                </span>
              </div>
              
              {/* Тело карточки */}
              <div style={{ padding: '16px', flexGrow: 1 }}>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '600', marginBottom: '12px', lineHeight: '1.4' }}>
                  {order.items}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '18px' }}>{order.price} ₽</span>
                  <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⏱ Курьер через {order.timeTarget}
                  </span>
                </div>
              </div>

              {/* Кнопки действий */}
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                {order.status === 'Новый' ? (
                  <button onClick={() => handleAccept(order.id)} style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Принять в работу
                  </button>
                ) : (
                  <button onClick={() => handleReady(order.id, order.price)} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', animation: 'pulse 2s infinite' }}>
                    Отдать курьеру
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryWidget;