import React from 'react';

const BaristaCart = ({
  cart,
  removeFromCart,
  isSuccessFlash,
  foundClient,
  clientPhone,
  setClientPhone,
  handleFindClient,
  handleSimulateQRScan,
  setFoundClient,
  setPointsToSpend,
  pointsToSpend,
  cartTotal,
  floatingRevenue,
  finalCharge,
  handleCheckoutClick,
  isMobile
}) => {

  // 🚀 ЛОГИКА УРОВНЕЙ ЛОЯЛЬНОСТИ
  const getClientStatus = (totalSpent) => {
    if (!totalSpent) return { level: 'Бронза', icon: '🥉', color: '#cd7f32', nextThreshold: 5000, nextLevel: 'Серебро' };
    if (totalSpent >= 15000) return { level: 'Золото', icon: '🥇', color: '#fbbf24', nextThreshold: null, nextLevel: null };
    if (totalSpent >= 5000) return { level: 'Серебро', icon: '🥈', color: '#9ca3af', nextThreshold: 15000, nextLevel: 'Золото' };
    return { level: 'Бронза', icon: '🥉', color: '#cd7f32', nextThreshold: 5000, nextLevel: 'Серебро' };
  };

  const clientStatus = foundClient ? getClientStatus(foundClient.totalSpent) : null;
  const amountToNextLevel = clientStatus && clientStatus.nextThreshold ? clientStatus.nextThreshold - (foundClient.totalSpent || 0) : 0;

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '24px', boxShadow: '0 10px 25px -5px var(--shadow-color)', display: 'flex', flexDirection: 'column', flexGrow: 1, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)', fontWeight: '900' }}>Текущий чек</h2>
      </div>
      
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px', overflowX: 'hidden' }}>
        {cart.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛒</div>
            <div>Выберите товары из меню</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.5s ease', transform: isSuccessFlash ? 'translateY(-50px)' : 'translateY(0)', opacity: isSuccessFlash ? 0 : 1 }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px dashed var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => removeFromCart(idx)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>✖</button>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '15px' }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '15px' }}>{item.price} ₽</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* БЛОК CRM И ЛОЯЛЬНОСТИ */}
      <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)' }}>
        {!foundClient ? (
          <div style={{ display: 'flex', gap: '8px', flexDirection: isMobile ? 'column' : 'row' }}>
            <input 
              type="text" 
              placeholder="Номер телефона гостя" 
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: '16px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleFindClient} style={{ flex: 1, padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                🔍 Найти
              </button>
              <button onClick={handleSimulateQRScan} style={{ padding: '14px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }} title="Сканировать QR-код карты">
                📷 QR
              </button>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: `1px solid ${clientStatus.color}`, borderRadius: '16px', padding: '16px', position: 'relative' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '16px', display: 'block', marginBottom: '4px' }}>+7 {foundClient.phone}</span>
                <span style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px', 
                  backgroundColor: `${clientStatus.color}22`, color: clientStatus.color, 
                  padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' 
                }}>
                  {clientStatus.icon} {clientStatus.level} статус
                </span>
              </div>
              <button onClick={() => { setFoundClient(null); setPointsToSpend(0); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', padding: '4px' }}>✖ Отмена</button>
            </div>

            {/* Подсказка для апсейла */}
            {clientStatus.nextLevel && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', backgroundColor: 'var(--bg-main)', padding: '8px', borderRadius: '8px' }}>
                До статуса <strong>{clientStatus.nextLevel}</strong> осталось {amountToNextLevel.toLocaleString('ru-RU')} ₽ покупок. 
                <br/><em>💡 Предложите гостю десерт или пачку кофе с собой!</em>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
              <span style={{ color: '#10b981', fontWeight: '900', fontSize: '16px' }}>Баланс: {foundClient.points} Б</span>
              {foundClient.points > 0 && cartTotal > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Списать:</span>
                  <input 
                    type="number" 
                    max={Math.min(foundClient.points, cartTotal)} 
                    min="0"
                    value={pointsToSpend}
                    onChange={(e) => setPointsToSpend(Math.min(Number(e.target.value), foundClient.points, cartTotal))}
                    style={{ width: '70px', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* БЛОК ОПЛАТЫ */}
      <div style={{ padding: '20px', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Сумма:</span>
          <span style={{ color: 'var(--text-main)', fontSize: '18px', fontWeight: 'bold' }}>{cartTotal} ₽</span>
        </div>
        {pointsToSpend > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', color: '#ef4444' }}>
            <span style={{ fontSize: '15px' }}>Списано баллов:</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>-{pointsToSpend} ₽</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '20px' }}>К оплате:</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {floatingRevenue !== null && (
              <span className="classic-money-fly" style={{ position: 'absolute', right: '0', bottom: '0', color: '#10b981', fontSize: '36px', fontWeight: '900', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 50 }}>
                +{floatingRevenue} ₽
              </span>
            )}
            <span style={{ color: '#10b981', fontSize: '36px', fontWeight: '900' }}>{finalCharge} ₽</span>
          </div>
        </div>
        <button onClick={handleCheckoutClick} style={{ width: '100%', padding: '20px', backgroundColor: cart.length > 0 ? '#3b82f6' : 'var(--border-color)', color: cart.length > 0 ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: '16px', fontSize: '22px', fontWeight: '900', cursor: cart.length > 0 ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s', boxShadow: cart.length > 0 ? '0 10px 20px rgba(59, 130, 246, 0.3)' : 'none' }}>
          ОПЛАТИТЬ
        </button>
      </div>
    </div>
  );
};

export default BaristaCart;