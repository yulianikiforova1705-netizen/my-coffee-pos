import React from 'react';

const ReceiptModal = ({ order, onClose, appData }) => {
  if (!order) return null;

  // Разбиваем строку заказа на отдельные позиции
  const items = order.item ? order.item.split(' + ') : [];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 100000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
      
      {/* 🚀 CSS МАГИЯ ДЛЯ ПЕЧАТИ: скрывает фон и оставляет только ленту */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-receipt, #printable-receipt * { visibility: visible !important; }
          #printable-receipt { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 80mm; /* Стандартная ширина чековой ленты */
            margin: 0; 
            padding: 0; 
            box-shadow: none; 
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* 🧾 САМ ЧЕК (стилизован под термоленту) */}
      <div id="printable-receipt" style={{ backgroundColor: '#ffffff', width: '320px', padding: '24px', fontFamily: '"Courier New", Courier, monospace', color: '#000000', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', position: 'relative' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-1px' }}>
            {appData?.appName || 'GOURMET COFFEE'}
          </h2>
          <div style={{ fontSize: '13px', color: '#333' }}>Добро пожаловать!</div>
        </div>

        <div style={{ borderBottom: '2px dashed #000', margin: '12px 0' }}></div>

        <div style={{ fontSize: '13px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Чек №:</span>
            <strong>{order.id || Math.floor(Math.random() * 10000)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Дата:</span>
            <span>{new Date().toLocaleDateString('ru-RU')} {order.time || new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Кассир:</span>
            <span>{order.barista || 'Бариста'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Тип:</span>
            <span>{order.orderType || 'С собой'}</span>
          </div>
        </div>

        <div style={{ borderBottom: '2px dashed #000', margin: '12px 0' }}></div>

        {/* СПИСОК ТОВАРОВ */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            <span>НАИМЕНОВАНИЕ</span>
            <span>КОЛ</span>
          </div>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px', fontWeight: '600' }}>
              <span style={{ maxWidth: '220px', wordWrap: 'break-word' }}>{item}</span>
              <span>1</span>
            </div>
          ))}
        </div>

        <div style={{ borderBottom: '2px dashed #000', margin: '12px 0' }}></div>

        {/* ИТОГОВАЯ СУММА */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: '900', margin: '20px 0' }}>
          <span>ИТОГО:</span>
          <span>{order.total} ₽</span>
        </div>

        <div style={{ borderBottom: '2px dashed #000', margin: '12px 0' }}></div>

        {/* QR-КОД ДЛЯ ЧАЕВЫХ ИЛИ ПРИЛОЖЕНИЯ */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>Чаевые баристе</div>
          {/* 🚀 ИСПОЛЬЗУЕМ НАДЕЖНЫЙ API ВМЕСТО СТОРОННЕЙ БИБЛИОТЕКИ */}
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://cloudtips.ru/&margin=0" alt="QR Чаевые" width="120" height="120" style={{ margin: '0 auto' }} />
          <div style={{ fontSize: '13px', marginTop: '15px', fontWeight: 'bold' }}>Спасибо за визит!</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>Ждем вас снова.</div>
        </div>
        
        {/* Декоративный зубчатый край чека снизу */}
        <div style={{ position: 'absolute', bottom: '-10px', left: 0, right: 0, height: '10px', backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle at 10px 0, rgba(0,0,0,0) 10px, #ffffff 11px)' }}></div>
      </div>

      {/* КНОПКИ (Скрываются при физической печати) */}
      <div className="no-print" style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
        <button 
          onClick={() => window.print()}
          style={{ padding: '14px 28px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          🖨️ ПЕЧАТЬ / PDF
        </button>
        <button 
          onClick={onClose}
          style={{ padding: '14px 28px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.4)', transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          ЗАКРЫТЬ
        </button>
      </div>
    </div>
  );
};

export default ReceiptModal;