import React from 'react';

const TableModule = ({ orders, onCompleteOrder, onCancelOrder, allowExport }) => {
  
  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Время,Заказ,Сумма,Статус\n";
    orders.forEach(row => {
      csvContent += `${row.id},${row.time},${row.item},${row.total},${row.status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', transition: 'background-color 0.3s ease', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>📋 Последние заказы <span style={{fontSize: '14px', color: 'var(--text-muted)', fontWeight: 'normal'}}>({orders.length})</span></h2>
        {allowExport && (
          <button onClick={handleExport} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            Скачать Excel
          </button>
        )}
      </div>
      
      <div style={{ maxHeight: '350px', overflowY: 'auto', overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', position: 'relative' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)', zIndex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <tr style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>ID</th>
              <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Создан</th>
              <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Заказ</th>
              <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Сумма</th>
              <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Статус</th>
              <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Нет активных заказов</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s ease', backgroundColor: order.status === 'Отменен' ? 'rgba(239, 68, 68, 0.05)' : (order.isPreorder && order.status === 'В процессе' ? 'rgba(139, 92, 246, 0.05)' : 'transparent') }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{order.id}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '14px' }}>{order.time}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-main)', fontSize: '14px' }}>
                    {order.item}
                    {/* 🚀 НОВОЕ: Ярлык предзаказа со временем */}
                    {order.isPreorder && (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: '#8b5cf6', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>
                        ⏰ К выдаче: {order.pickupTime}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{order.total} ₽</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: `${order.color}20`, color: order.color, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                    {order.status === 'В процессе' && (
                      <>
                        <button onClick={() => onCompleteOrder(order.id)} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Выдать</button>
                        <button onClick={() => onCancelOrder(order.id)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }} title="Отменить чек">❌</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableModule;