import React from 'react';

const BaristaQueue = ({ activeOrders, onCompleteOrder, onCancelOrder, isMobile }) => {
  return (
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
              <div style={{ display: 'flex', gap: '8px', flexDirection: isMobile ? 'column' : 'row' }}>
                <button onClick={() => onCompleteOrder(order.id)} style={{ flex: 1, padding: '14px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>✅ ВЫДАТЬ</button>
                <button onClick={() => onCancelOrder(order.id)} style={{ flex: isMobile ? 1 : 0, padding: '14px 20px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Отмена</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BaristaQueue;