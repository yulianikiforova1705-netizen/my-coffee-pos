import React, { useState, useEffect } from 'react';

export const ExpenseWidget = ({ expText, setExpText, expCategory, setExpCategory, expAmount, setExpAmount, handleAddExpense, expenses = [] }) => (
  <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
    <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>💸 Внести операционный расход</h2>
    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
      <input type="text" placeholder="На что потратили? (напр. Вода)" value={expText} onChange={e => setExpText(e.target.value)} style={{ flex: 2, minWidth: '150px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
      <select value={expCategory} onChange={e => setExpCategory(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', cursor: 'pointer' }}>
        <option value="Закупка">Закупка / Хозтовары</option><option value="Аренда">Аренда / ЖКУ</option><option value="Маркетинг">Маркетинг / Реклама</option><option value="Прочее">Прочее</option>
      </select>
      <input type="number" placeholder="Сумма (₽)" value={expAmount} onChange={e => setExpAmount(e.target.value)} style={{ flex: 1, minWidth: '100px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
      <button onClick={handleAddExpense} style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Списать</button>
    </div>
    <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {(!expenses || expenses.length === 0) ? <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Расходов пока нет</span> : 
        expenses.map(e => (
          <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', borderLeft: '4px solid #ef4444', fontSize: '14px' }}>
            <div><span style={{ color: 'var(--text-muted)', marginRight: '12px' }}>{e.time}</span><span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{e.text}</span> <span style={{fontSize:'11px', color:'var(--text-muted)'}}>({e.category})</span></div><strong style={{ color: '#ef4444' }}>-{e.amount} ₽</strong>
          </div>
        ))}
    </div>
  </div>
);

export const PnLWidget = ({ currentRevenue = 0, costOfGoods = 0, totalManualExpenses = 0, currentNetProfit = 0 }) => {
  const revW = 100; const cogsW = currentRevenue === 0 ? 0 : Math.round((costOfGoods / currentRevenue) * 100); const expW = currentRevenue === 0 ? 0 : Math.round((totalManualExpenses / currentRevenue) * 100); const profitW = currentRevenue === 0 ? 0 : Math.round((currentNetProfit / currentRevenue) * 100);
  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>📉 P&L Аналитика (Прибыли и Убытки)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}><span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>💰 Грязная выручка</span><span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{currentRevenue.toLocaleString('ru-RU')} ₽</span></div><div style={{ width: '100%', height: '24px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', overflow: 'hidden' }}><div style={{ width: `${revW}%`, height: '100%', backgroundColor: '#3b82f6' }}></div></div></div>
        <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}><span style={{ color: 'var(--text-muted)' }}>🔻 Себестоимость продуктов (COGS)</span><span style={{ color: '#f59e0b' }}>-{costOfGoods.toLocaleString('ru-RU')} ₽ ({cogsW}%)</span></div><div style={{ width: '100%', height: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${cogsW}%`, height: '100%', backgroundColor: '#f59e0b' }}></div></div></div>
        <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}><span style={{ color: 'var(--text-muted)' }}>🔻 Операционные расходы (Касса)</span><span style={{ color: '#ef4444' }}>-{totalManualExpenses.toLocaleString('ru-RU')} ₽ ({expW}%)</span></div><div style={{ width: '100%', height: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${expW}%`, height: '100%', backgroundColor: '#ef4444' }}></div></div></div>
        <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '2px dashed var(--border-color)' }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '8px' }}><span style={{ color: 'var(--text-main)', fontWeight: '900' }}>💵 Чистая прибыль (В карман)</span><span style={{ fontWeight: '900', color: '#10b981' }}>{currentNetProfit.toLocaleString('ru-RU')} ₽ ({profitW}%)</span></div><div style={{ width: '100%', height: '24px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', overflow: 'hidden', backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }}><div style={{ width: `${profitW}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.5s ease' }}></div></div></div>
      </div>
    </div>
  );
};

export const CrmWidget = ({ clients = {}, sendSmsToClient }) => {
  const clientsList = Object.entries(clients).map(([phone, data]) => { 
    const info = typeof data === 'object' ? { points: data.points || 0, visits: data.visits || 1, totalSpent: data.totalSpent || 0, lastVisit: data.lastVisit || 'Неизвестно' } : { points: data || 0, visits: 1, totalSpent: 0, lastVisit: 'Неизвестно' }; 
    let status = '☕ Постоянный'; let color = '#3b82f6'; 
    if (info.totalSpent > 10000) { status = '👑 VIP'; color = '#f59e0b'; } else if (info.visits === 1) { status = '💤 Спящий'; color = '#94a3b8'; } 
    return { phone, ...info, status, color }; 
  }).sort((a, b) => b.totalSpent - a.totalSpent); 

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>🧑‍🤝‍🧑 База гостей (CRM)</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead><tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}><th style={{ padding: '12px' }}>Телефон</th><th style={{ padding: '12px' }}>Статус</th><th style={{ padding: '12px' }}>Визиты</th><th style={{ padding: '12px' }}>Потратил</th><th style={{ padding: '12px' }}>Баллы</th><th style={{ padding: '12px' }}>Маркетинг</th></tr></thead>
          <tbody>
            {clientsList.length === 0 ? (<tr><td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>База пуста</td></tr>) : (
              clientsList.map((client) => (
                <tr key={client.phone} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-main)' }}>+7 {client.phone}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: client.color }}>{client.status}</td>
                  <td style={{ padding: '12px', color: 'var(--text-main)' }}>{client.visits}</td>
                  <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{(client.totalSpent || 0).toLocaleString('ru-RU')} ₽</td>
                  <td style={{ padding: '12px', color: 'var(--text-main)' }}>{client.points}</td>
                  <td style={{ padding: '12px' }}><button onClick={() => sendSmsToClient(client.phone)} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🎁 SMS Промо</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const EfficiencyWidget = ({ avgSpeedText, hourlyHeatmap = [] }) => (
  <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
    <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>⏱️ Эффективность и Загрузка (KDS)</h2>
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '220px', padding: '20px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>СРЕДНЯЯ СКОРОСТЬ ОТДАЧИ</div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: '#10b981' }}>{avgSpeedText}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>От кассы до готового напитка</div>
      </div>
      <div style={{ flex: 2, minWidth: '300px', padding: '20px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}><span>ЗАГРУЗКА ПО ЧАСАМ (HEATMAP)</span><span style={{ fontSize: '11px', fontWeight: 'normal' }}>Чем темнее, тем больше чеков</span></div>
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', alignItems: 'flex-end', height: '60px', paddingBottom: '4px' }}>
          {hourlyHeatmap.map(data => (
            <div key={data.hour} style={{ flex: 1, minWidth: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '100%', height: '40px', borderRadius: '4px', backgroundColor: data.count > 0 ? `rgba(59, 130, 246, ${Math.max(0.2, data.intensity)})` : 'var(--border-color)', border: '1px solid rgba(0,0,0,0.05)', transition: 'all 0.3s' }} title={`${data.count} чеков в ${data.hour}`}></div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>{data.hour.split(':')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const NetworkRatingWidget = ({ currentRevenue = 0 }) => {
  const branches = [
    { name: '📍 Наша точка (Текущая)', revenue: currentRevenue, max: Math.max(currentRevenue, 65000), color: '#3b82f6' }, 
    { name: '📍 ТЦ "Аура" (Франшиза)', revenue: 42500, max: Math.max(currentRevenue, 65000), color: '#8b5cf6' }, 
    { name: '📍 ул. Ленина, 10', revenue: 65000, max: Math.max(currentRevenue, 65000), color: '#10b981' }
  ].sort((a, b) => b.revenue - a.revenue);

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>🌍 Рейтинг точек сети</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {branches.map((branch, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)' }}><span>{index === 0 ? '👑' : ''} {branch.name}</span><span>{branch.revenue.toLocaleString('ru-RU')} ₽</span></div>
            <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${(branch.revenue / branch.max) * 100}%`, height: '100%', backgroundColor: branch.color, borderRadius: '6px', transition: 'width 1s ease-in-out' }}></div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BaristaEfficiencyTableWidget = ({ baristaEfficiency = [], baristaStats = {} }) => (
  <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
    <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>🧑‍🍳 Эффективность и Рейтинг</h2>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>
            <th style={{ padding: '12px' }}>Бариста</th>
            <th style={{ padding: '12px' }}>Выручка</th>
            <th style={{ padding: '12px' }}>Рейтинг</th>
            <th style={{ padding: '12px' }}>Средний чек</th>
          </tr>
        </thead>
        <tbody>
          {baristaEfficiency.map((b, idx) => {
            const stats = baristaStats[b.name] || { ratingCount: 0, ratingSum: 0 };
            const avgRating = stats.ratingCount > 0 ? (stats.ratingSum / stats.ratingCount).toFixed(1) : '—';
            
            return (
              <tr key={b.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-main)' }}>{idx === 0 ? '🥇 ' : ''}{b.name}</td>
                <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{(b.revenue || 0).toLocaleString('ru-RU')} ₽</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {avgRating}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>({stats.ratingCount || 0})</span>
                </td>
                <td style={{ padding: '12px', color: '#f59e0b', fontWeight: 'bold' }}>{(b.avg || 0).toLocaleString('ru-RU')} ₽</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export const SalesAnalyticsWidget = ({ categoryStats = { stats: {}, total: 0 }, catColors = {}, topSales = [] }) => {
  let currentOffset = 0;
  return (
    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'stretch' }}>
      <div style={{ flex: 1.5, minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>🍩 Доли продаж (ABC-анализ)</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexGrow: 1 }}>
          <div style={{ width: '120px', height: '120px', position: 'relative' }}>
            <svg viewBox="0 0 42 42" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="var(--btn-bg)" strokeWidth="6" />
              {Object.entries(categoryStats.stats || {}).map(([cat, val]) => {
                const percent = categoryStats.total === 0 ? 0 : ((val || 0) / categoryStats.total) * 100;
                if (percent === 0) return null; const dashArray = `${percent} ${100 - percent}`; const offset = 100 - currentOffset; currentOffset += percent;
                return (<circle key={cat} cx="21" cy="21" r="15.9155" fill="transparent" stroke={catColors[cat] || '#000'} strokeWidth="6" strokeDasharray={dashArray} strokeDashoffset={offset} style={{ transition: 'stroke-dasharray 0.5s ease' }} />)
              })}
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px' }}>📊</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
            {Object.entries(categoryStats.stats || {}).sort((a,b) => b[1] - a[1]).map(([cat, val]) => {
              const percent = categoryStats.total === 0 ? 0 : Math.round(((val || 0) / categoryStats.total) * 100);
              return (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: catColors[cat] || '#000' }}></div><span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{cat}</span></div>
                  <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'var(--text-muted)' }}>{(val || 0).toLocaleString('ru-RU')} ₽</span><span style={{ color: 'var(--text-main)', fontWeight: 'bold', width: '30px', textAlign: 'right' }}>{percent}%</span></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, minWidth: '220px', backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>🏆 Топ продаж</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1, justifyContent: 'center' }}>
          {(!topSales || topSales.length === 0) ? <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Нет данных</div> : 
            topSales.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: idx !== topSales.length - 1 ? '1px dashed var(--border-color)' : 'none' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '15px' }}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {item[0]}</span><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '15px' }}>{item[1]} шт</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

// 🚀 ПОЛНОСТЬЮ ОБНОВЛЕННЫЙ ВИДЖЕТ ПЕРСОНАЛА С РЕДАКТИРОВАНИЕМ ПИН-КОДОВ
export const StaffWidget = ({ baristas = [], setBaristas, baristaPins = {}, setBaristaPins, baristaStats = {}, setBaristaStats }) => {
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [editingPinFor, setEditingPinFor] = useState(null); // Кто сейчас редактирует ПИН
  const [tempPin, setTempPin] = useState('');

  const handleAddStaff = () => {
    if (!newName || !newPin || baristas.includes(newName)) return;
    setBaristas([...baristas, newName]);
    setBaristaPins({ ...baristaPins, [newName]: newPin });
    setBaristaStats({ ...baristaStats, [newName]: { tips: 0, dessertsSold: 0, revenue: 0, ratingSum: 0, ratingCount: 0 } });
    setNewName('');
    setNewPin('');
  };

  const handleRemoveStaff = (name) => {
    if (baristas.length <= 1) { alert('Нельзя удалить последнего бариста!'); return; }
    if (window.confirm(`Вы уверены, что хотите уволить сотрудника: ${name}?`)) {
      setBaristas(baristas.filter(b => b !== name));
      const newPins = { ...baristaPins }; delete newPins[name]; setBaristaPins(newPins);
    }
  };

  const startEditingPin = (name) => {
    setEditingPinFor(name);
    setTempPin(baristaPins[name] || '');
  };

  const saveEditedPin = (name) => {
    if (tempPin.length < 4) { alert('ПИН должен состоять из 4 цифр!'); return; }
    setBaristaPins({ ...baristaPins, [name]: tempPin });
    setEditingPinFor(null);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>👥 Управление персоналом</h2>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Имя бариста" value={newName} onChange={e => setNewName(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
        <input type="text" placeholder="ПИН (4 цифры)" maxLength="4" value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))} style={{ width: '130px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', textAlign: 'center' }} />
        <button onClick={handleAddStaff} style={{ padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Добавить</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {baristas.map(b => (
          <div key={b} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{b}</span>
              
              {/* Логика редактирования ПИН-кода */}
              {editingPinFor === b ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="password" 
                    maxLength="4" 
                    value={tempPin} 
                    onChange={e => setTempPin(e.target.value.replace(/\D/g, ''))} 
                    style={{ width: '60px', padding: '4px', borderRadius: '4px', border: '1px solid #3b82f6', textAlign: 'center', letterSpacing: '4px' }} 
                    autoFocus
                  />
                  <button onClick={() => saveEditedPin(b)} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>💾</button>
                  <button onClick={() => setEditingPinFor(null)} style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}>✖</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ПИН: ****</span>
                  <button onClick={() => startEditingPin(b)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }} title="Изменить ПИН">👁️</button>
                </div>
              )}
            </div>

            <button onClick={() => handleRemoveStaff(b)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>Уволить</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InventoryWidget = ({ ingredients = [], onSaveInventory }) => {
  const [actualStock, setActualStock] = useState({});

  useEffect(() => {
    const initial = {};
    ingredients.forEach(i => initial[i.id] = i.stock);
    setActualStock(initial);
  }, [ingredients]);

  const handleInputChange = (id, value) => {
    setActualStock(prev => ({ ...prev, [id]: Number(value) }));
  };

  const calculateDiff = () => {
    let totalLoss = 0;
    const diffs = ingredients.map(ing => {
      const actual = actualStock[ing.id] !== undefined ? actualStock[ing.id] : ing.stock;
      const difference = actual - ing.stock;
      
      let loss = 0;
      if (difference < 0) {
        const costPerUnit = ing.costPerStep / ing.orderStep;
        loss = Math.abs(difference) * costPerUnit;
        totalLoss += loss;
      }
      return { ...ing, actual, difference, loss };
    });
    return { diffs, totalLoss };
  };

  const { diffs, totalLoss } = calculateDiff();

  const handleSave = () => {
    if (window.confirm(`Вы уверены? Будет зафиксирована недостача на сумму ${Math.round(totalLoss)} ₽. Эта сумма уйдет в расходы.`)) {
      onSaveInventory(actualStock, totalLoss);
      alert('Инвентаризация успешно проведена!');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>📦 Инвентаризация склада (Ревизия)</h2>
      
      <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px' }}>Ингредиент</th>
              <th style={{ padding: '12px' }}>По программе</th>
              <th style={{ padding: '12px', width: '120px' }}>По факту</th>
              <th style={{ padding: '12px' }}>Разница</th>
              <th style={{ padding: '12px' }}>Убыток</th>
            </tr>
          </thead>
          <tbody>
            {diffs.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-main)' }}>{item.name}</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{item.stock} {item.unit}</td>
                <td style={{ padding: '12px' }}>
                  <input 
                    type="number" 
                    value={item.actual} 
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    style={{ width: '80px', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', textAlign: 'center' }}
                  />
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: item.difference < 0 ? '#ef4444' : item.difference > 0 ? '#10b981' : 'var(--text-main)' }}>
                  {item.difference > 0 ? '+' : ''}{item.difference} {item.unit}
                </td>
                <td style={{ padding: '12px', color: item.loss > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                  {item.loss > 0 ? `-${Math.round(item.loss)} ₽` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '12px' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Общая сумма недостачи: </span>
          <strong style={{ color: '#ef4444', fontSize: '20px' }}>{Math.round(totalLoss).toLocaleString('ru-RU')} ₽</strong>
        </div>
        <button onClick={handleSave} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Провести ревизию
        </button>
      </div>
    </div>
  );
};