import React from 'react';

const DashboardModals = ({
  showTelegramModal, setShowTelegramModal, currentRevenue, totalManualExpenses, currentNetProfit, topSales,
  showProcurementModal, setShowProcurementModal, ingredients, menuItems,
  showArchiveModal, setShowArchiveModal, shiftArchive,
  onApproveProcurement // 🚀 ВОТ НАШ НОВЫЙ ПРОВОД К БАЗЕ ДАННЫХ
}) => {
  return (
    <>
      {/* Отчет Telegram */}
      {showTelegramModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ width: '340px', height: '650px', backgroundColor: '#000', borderRadius: '40px', padding: '8px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative', animation: 'slideUp 0.4s ease-out' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#0f172a', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #334155' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤖</div>
                <div><div style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>Coffee Analytics Bot</div><div style={{ color: '#3b82f6', fontSize: '12px' }}>bot</div></div>
                <button onClick={() => setShowTelegramModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundSize: '100px' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '16px', borderBottomLeftRadius: '4px', maxWidth: '90%', color: '#f8fafc', fontSize: '14px', lineHeight: '1.5', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>📊 Отчет за {new Date().toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'})}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>💰 Выручка:</span><strong style={{color: '#10b981'}}>{(currentRevenue || 0).toLocaleString('ru-RU')} ₽</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>🔻 Расходы:</span><strong style={{color: '#ef4444'}}>-{(totalManualExpenses || 0).toLocaleString('ru-RU')} ₽</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span>💵 В карман:</span><strong style={{color: '#3b82f6'}}>{(currentNetProfit || 0).toLocaleString('ru-RU')} ₽</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderTop: '1px solid #334155', paddingTop: '8px' }}><span>🏆 Хит:</span><strong style={{color: '#f59e0b'}}>{topSales && topSales.length > 0 && topSales[0] ? topSales[0][0] : 'Нет продаж'}</strong></div>
                  <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b', marginTop: '8px' }}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Лист Авто-закупки */}
      {showProcurementModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '16px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', animation: 'slideUp 0.3s ease', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>🛒 Лист авто-закупки</h3>
              <button onClick={() => setShowProcurementModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>

            {(() => {
              const ingToOrder = (ingredients || []).filter(i => i.stock <= i.min).map(i => ({ name: i.name, current: `${i.stock} ${i.unit}`, toOrder: `+${i.orderStep} ${i.unit}`, orderCost: i.costPerStep }));
              const itemsToOrder = (menuItems || []).filter(i => i.inventory !== undefined && i.inventory <= 5).map(i => ({ name: i.name, current: `${i.inventory} шт`, toOrder: `+20 шт`, orderCost: 20 * (i.costPrice || 0) }));
              const listToOrder = [...ingToOrder, ...itemsToOrder];
              const totalCost = listToOrder.reduce((sum, item) => sum + item.orderCost, 0);

              if (listToOrder.length === 0) return <div style={{ color: '#10b981', textAlign: 'center', padding: '20px', fontWeight: 'bold', fontSize: '16px' }}>Склады полны! Заказывать ничего не нужно. 🎉</div>;

              return (
                <>
                  <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {listToOrder.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '14px' }}>{item.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Остаток: {item.current}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '900', color: '#8b5cf6', fontSize: '14px' }}>{item.toOrder}</div>
                          <div style={{ fontSize: '11px', color: '#f59e0b' }}>~ {(item.orderCost || 0).toLocaleString('ru-RU')} ₽</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border-color)', paddingTop: '16px', marginBottom: '24px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Примерная сумма:</span>
                    <span style={{ fontWeight: '900', color: '#ef4444', fontSize: '18px' }}>{(totalCost || 0).toLocaleString('ru-RU')} ₽</span>
                  </div>
                  
                  {/* 🚀 ПОДКЛЮЧАЕМ КНОПКУ К ФУНКЦИИ */}
                  <button onClick={() => { 
                      if (onApproveProcurement) {
                        onApproveProcurement();
                      } else {
                        alert('Склад не пополнен: Функция закупки еще не подключена к базе!');
                        setShowProcurementModal(false);
                      }
                    }} 
                    style={{ width: '100%', padding: '14px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background 0.2s' }}
                  >
                    📦 Оплатить и пополнить склад
                  </button>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Архив Смен */}
      {showArchiveModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '16px', width: '80%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', animation: 'slideUp 0.3s ease', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>🗄️ Архив закрытых смен</h3>
              <button onClick={() => setShowArchiveModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            {(!shiftArchive || shiftArchive.length === 0) ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Архив пуст. Записи появятся после автоматического закрытия смен в 00:00 или после ручного закрытия бариста.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {shiftArchive.map(shift => (
                  <div key={shift.id} style={{ backgroundColor: 'var(--bg-main)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 'bold' }}>{shift.date}</div>
                    <div style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Выручка:</span><strong style={{ color: '#10b981' }}>{(shift.revenue || 0).toLocaleString('ru-RU')} ₽</strong>
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Чеков:</span><strong>{shift.ordersCount} шт</strong>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '8px' }}>
                      <div style={{ marginBottom: '6px' }}><strong>Зарплата:</strong> {shift.salary}</div>
                      <div><strong>Чаевые:</strong> {shift.tips}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardModals;