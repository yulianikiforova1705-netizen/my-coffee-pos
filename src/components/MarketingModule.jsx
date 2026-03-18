import React, { useState } from 'react';

const MarketingModule = ({ promocodes, setPromocodes, cashbackPercent, setCashbackPercent }) => {
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState('percent');
  const [newValue, setNewValue] = useState('');

  const handleAddPromo = () => {
    if (!newCode || !newValue) return;
    const promo = {
      code: newCode.toUpperCase(),
      type: newType,
      value: Number(newValue),
      label: newType === 'percent' ? `-${newValue}%` : `-${newValue} ₽`
    };
    setPromocodes([...promocodes, promo]);
    setNewCode(''); 
    setNewValue('');
  };

  const handleRemovePromo = (code) => {
    setPromocodes(promocodes.filter(p => p.code !== code));
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🎯 Маркетинг и Лояльность
      </h2>
      
      {/* Настройка Кэшбэка */}
      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px dashed var(--border-color)' }}>
        <h3 style={{ fontSize: '15px', color: 'var(--text-main)', marginBottom: '12px' }}>💰 Кэшбэк гостям</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input 
            type="number" 
            value={cashbackPercent} 
            onChange={e => setCashbackPercent(Number(e.target.value))} 
            style={{ width: '80px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }} 
          />
          <span style={{ color: 'var(--text-muted)' }}>% начисляется баллами с каждой покупки</span>
        </div>
      </div>

      {/* Конструктор промокодов */}
      <div>
        <h3 style={{ fontSize: '15px', color: 'var(--text-main)', marginBottom: '12px' }}>🎟️ Управление промокодами</h3>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Код (напр. SUMMER)" 
            value={newCode} 
            onChange={e => setNewCode(e.target.value.toUpperCase().replace(/\s/g, ''))} 
            style={{ flex: 1, minWidth: '120px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', textTransform: 'uppercase' }} 
          />
          <select 
            value={newType} 
            onChange={e => setNewType(e.target.value)} 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            <option value="percent">Скидка (%)</option>
            <option value="fixed">Скидка (Рубли)</option>
          </select>
          <input 
            type="number" 
            placeholder="Размер" 
            value={newValue} 
            onChange={e => setNewValue(e.target.value)} 
            style={{ width: '100px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} 
          />
          <button 
            onClick={handleAddPromo} 
            style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Добавить
          </button>
        </div>

        {/* Список активных кодов */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {promocodes.length === 0 ? <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Нет активных промокодов</div> : 
            promocodes.map(p => (
              <div key={p.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                <div>
                  <span style={{ fontWeight: '900', color: 'var(--text-main)', marginRight: '12px', fontSize: '15px' }}>{p.code}</span>
                  <span style={{ fontSize: '13px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{p.label}</span>
                </div>
                <button onClick={() => handleRemovePromo(p.code)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '20px' }} title="Удалить промокод">×</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default MarketingModule;