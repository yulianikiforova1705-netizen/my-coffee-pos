import React, { useState } from 'react';

const MenuSettingsModule = ({ menuItems, onAddMenuItem, onEditMenuItem, onDeleteMenuItem, onUpdateInventory }) => {
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCost, setNewCost] = useState(''); 
  const [newInventory, setNewInventory] = useState('10'); 
  const [newColor, setNewColor] = useState('#10b981');
  const [category, setCategory] = useState('Кофе');
  
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = () => {
    if (!newName || !newPrice || !newCost || !newInventory) return;
    
    const itemData = {
      name: newName,
      price: Number(newPrice),
      costPrice: Number(newCost), 
      color: newColor,
      inventory: Number(newInventory),
      category: category 
    };

    if (editingId) {
      onEditMenuItem({ ...itemData, id: editingId });
      setEditingId(null); 
    } else {
      onAddMenuItem(itemData);
    }
    
    setNewName(''); setNewPrice(''); setNewCost(''); setNewInventory('10'); setCategory('Кофе'); setNewColor('#10b981');
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setNewName(item.name);
    setNewPrice(item.price);
    setNewCost(item.costPrice || 0);
    setNewInventory(item.inventory !== undefined ? item.inventory : 10);
    setNewColor(item.color || '#10b981');
    setCategory(item.category || (item.isDessert ? 'Десерты' : 'Кофе'));
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewName(''); setNewPrice(''); setNewCost(''); setNewInventory('10'); setCategory('Кофе'); setNewColor('#10b981');
  };

  const handleEditStock = (item) => {
    const currentVal = item.inventory !== undefined ? item.inventory : 0;
    const newVal = window.prompt(`📦 Введите новый остаток для товара "${item.name}":`, currentVal);
    if (newVal !== null && newVal.trim() !== '' && !isNaN(newVal)) {
      onUpdateInventory(item.id, Number(newVal));
    }
  };

  // 🚀 МАГИЯ: Учим админку понимать те же умные иконки, что и клиенты
  const getSmartIconDisplay = (item) => {
    if (item.icon) return item.icon; // Если иконка сохранена в базе, используем её
    
    // Если по какой-то причине её нет в базе (старые товары), подбираем на лету
    const text = ((item.name || '') + ' ' + (item.category || '')).toLowerCase();
    if (text.includes('круассан')) return '🥐';
    if (text.includes('ролл') || text.includes('рол ') || text.includes('шаурма') || text.includes('wrap') || text.includes('врап')) return '🌯';
    if (text.includes('сэндвич') || text.includes('сендвич') || text.includes('панини') || text.includes('тост')) return '🥪';
    if (text.includes('сырник') || text.includes('блин') || text.includes('завтрак') || text.includes('омлет') || text.includes('яичниц') || text.includes('каша')) return '🍳';
    if (text.includes('печенье') || text.includes('кукис') || text.includes('макарон')) return '🍪';
    if (text.includes('чизкейк') || text.includes('торт') || text.includes('пирож') || text.includes('эклер') || text.includes('десерт') || text.includes('сладк')) return '🍰';
    if (text.includes('булоч') || text.includes('хлеб') || text.includes('выпеч')) return '🥐';
    if (text.includes('салат') || text.includes('боул')) return '🥗';
    if (text.includes('суп')) return '🥣';
    
    if (text.includes('матча') || text.includes('чай')) return '🍵';
    if (text.includes('лимонад') || text.includes('айс') || text.includes('сок') || text.includes('фреш') || text.includes('смузи') || text.includes('вода') || text.includes('колд')) return '🥤';
    if (text.includes('какао') || text.includes('шоколад')) return '☕';

    if (text.includes('еда') || text.includes('перекус')) return '🥪';
    
    return '☕'; 
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px', transition: 'all 0.3s ease' }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'var(--text-main)' }}>
        {editingId ? '✏️ Редактирование позиции' : '⚙️ Управление меню и складом'}
      </h2>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: editingId ? 'rgba(59, 130, 246, 0.05)' : 'transparent', padding: editingId ? '16px' : '0', borderRadius: '12px', border: editingId ? '1px dashed #3b82f6' : 'none' }}>
        <input type="text" placeholder="Название" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ flex: 2, minWidth: '120px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', cursor: 'pointer' }}>
          <option value="Кофе">☕ Кофе</option>
          <option value="Еда">🥪 Еда</option>
          <option value="Десерты">🍰 Десерты</option>
          <option value="Зерно">🫘 Зерно</option>
        </select>

        <input type="number" placeholder="Цена (₽)" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ flex: 1, minWidth: '70px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
        <input type="number" placeholder="Себест." value={newCost} onChange={(e) => setNewCost(e.target.value)} style={{ flex: 1, minWidth: '70px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
        <input type="number" placeholder="Остаток" value={newInventory} onChange={(e) => setNewInventory(e.target.value)} style={{ flex: 1, minWidth: '70px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
        <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} style={{ width: '46px', height: '46px', padding: '2px', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', backgroundColor: 'var(--bg-main)' }} />
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSubmit} style={{ padding: '12px 24px', backgroundColor: editingId ? '#10b981' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editingId ? '💾 Сохранить' : '+ Добавить'}
          </button>
          {editingId && (
            <button onClick={handleCancelEdit} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Отмена
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {menuItems.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', borderLeft: `4px solid ${item.color}`, opacity: editingId === item.id ? 0.5 : 1 }}>
            <div>
              <div style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.name} 
                {/* 🚀 ВЫВОДИМ УМНУЮ ИКОНКУ ВМЕСТО СТАРОЙ ЛОГИКИ */}
                <span title={item.category || 'Неизвестно'}>{getSmartIconDisplay(item)}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span title="Выручка">💰 {item.price} ₽</span>
                  <span title="Себестоимость" style={{ color: '#f59e0b' }}>📉 {item.costPrice || 0} ₽</span>
                </div>
                <span style={{ color: item.inventory <= 2 ? '#ef4444' : '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  📦 {item.inventory !== undefined ? item.inventory : '∞'} шт
                  <button onClick={() => handleEditStock(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '0 4px', filter: 'grayscale(0.5)' }} title="Быстро изменить остаток">⚡</button>
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => handleStartEdit(item)} disabled={editingId === item.id} style={{ backgroundColor: 'transparent', border: 'none', color: '#3b82f6', cursor: editingId === item.id ? 'default' : 'pointer', fontSize: '16px', padding: '4px' }} title="Редактировать товар">✏️</button>
              <button onClick={() => onDeleteMenuItem(item.id)} disabled={editingId === item.id} style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: editingId === item.id ? 'default' : 'pointer', fontSize: '16px', padding: '4px' }} title="Удалить товар">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSettingsModule;