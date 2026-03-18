import React, { useState } from 'react';

const AdvancedInventory = ({ ingredients = [], onWriteOff }) => {
  const [selectedIng, setSelectedIng] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('Настройка помола');

  const handleSave = () => {
    if (!selectedIng) return alert('Выберите ингредиент!');
    if (!amount || Number(amount) <= 0) return alert('Введите корректное количество!');
    
    // Вызываем функцию списания из наших "мозгов"
    onWriteOff(selectedIng, Number(amount), reason);
    
    // Очищаем поле после успеха
    setAmount('');
    alert('Списание успешно зафиксировано!');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🗑️ Учет брака и списаний (Техкарты)
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
        Фиксируйте технические потери, чтобы склад всегда сходился. Сумма убытка спишется автоматически.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select 
          value={selectedIng} 
          onChange={(e) => setSelectedIng(e.target.value)}
          style={{ flex: 1, minWidth: '150px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', cursor: 'pointer' }}
        >
          <option value="" disabled>Выберите ингредиент...</option>
          {ingredients.map(ing => (
            <option key={ing.id} value={ing.id}>{ing.name} (остаток: {ing.stock} {ing.unit})</option>
          ))}
        </select>

        <input 
          type="number" 
          placeholder="Количество" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: '120px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
        />

        <select 
          value={reason} 
          onChange={(e) => setReason(e.target.value)}
          style={{ flex: 1, minWidth: '150px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', cursor: 'pointer' }}
        >
          <option value="Настройка помола">Настройка помола</option>
          <option value="Пролито / Испорчено">Пролито / Испорчено</option>
          <option value="Брак поставщика">Брак поставщика</option>
          <option value="Проработка меню">Проработка меню</option>
        </select>

        <button 
          onClick={handleSave} 
          style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
        >
          Списать со склада
        </button>
      </div>
    </div>
  );
};

export default AdvancedInventory;