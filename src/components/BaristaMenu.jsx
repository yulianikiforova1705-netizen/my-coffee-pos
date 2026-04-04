import React, { useState } from 'react';

const BaristaMenu = ({
  isMobile,
  mobileView,
  categories,
  activeCategory,
  setActiveCategory,
  filteredMenu,
  stopList,
  handleAddToCart,
  challengeGoal,
  currentDessertsSold,
  challengeProgress
}) => {

  // 🚀 СОСТОЯНИЯ ДЛЯ МОДИФИКАТОРОВ
  const [modifierModalItem, setModifierModalItem] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState([]);

  // 🚀 БАЗА ДОБАВОК (Можно будет потом вынести в админку)
  const availableModifiers = [
    { id: 's1', name: 'Карамельный сироп', price: 40, icon: '🍯' },
    { id: 's2', name: 'Ванильный сироп', price: 40, icon: '🌼' },
    { id: 's3', name: 'Кокосовый сироп', price: 40, icon: '🥥' },
    { id: 'm1', name: 'Овсяное молоко', price: 80, icon: '🌾' },
    { id: 'm2', name: 'Банановое молоко', price: 80, icon: '🍌' },
    { id: 'e1', name: 'Доп. эспрессо', price: 60, icon: '☕' },
    { id: 'e2', name: 'Декаф', price: 50, icon: '🌿' },
  ];

  // Умные иконки
  const getSmartIconDisplay = (item) => {
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
    if (text.includes('какао') || text.includes('шоколад') || text.includes('латте') || text.includes('капучино') || text.includes('эспрессо') || text.includes('раф')) return '☕';
    if (text.includes('еда') || text.includes('перекус')) return '🥪';
    return '☕'; 
  };

  // 🚀 ОБРАБОТЧИК КЛИКА ПО ТОВАРУ
  const handleItemClick = (item) => {
    if (stopList.includes(item.id)) return;
    
    // Если это кофе - открываем модалку с добавками
    if (item.category === 'Кофе') {
      setModifierModalItem(item);
      setSelectedModifiers([]);
    } else {
      // Еда и десерты летят сразу в корзину
      handleAddToCart(item);
    }
  };

  // Выбор / отмена добавки
  const toggleModifier = (mod) => {
    if (selectedModifiers.find(m => m.id === mod.id)) {
      setSelectedModifiers(prev => prev.filter(m => m.id !== mod.id));
    } else {
      setSelectedModifiers(prev => [...prev, mod]);
    }
  };

  // 🚀 ДОБАВЛЕНИЕ КАСТОМНОГО НАПИТКА В КОРЗИНУ
  const confirmCustomOrder = () => {
    let finalName = modifierModalItem.name;
    let finalPrice = modifierModalItem.price;

    if (selectedModifiers.length > 0) {
      const modNames = selectedModifiers.map(m => m.name.replace(' сироп', '').replace(' молоко', '')).join(', ');
      finalName = `${modifierModalItem.name} (+${modNames})`;
      finalPrice += selectedModifiers.reduce((sum, m) => sum + m.price, 0);
    }

    // Создаем копию товара с новой ценой, названием и уникальным ID для корзины
    const customItem = {
      ...modifierModalItem,
      id: `${modifierModalItem.id}-${Date.now()}`, 
      name: finalName,
      price: finalPrice
    };

    handleAddToCart(customItem);
    setModifierModalItem(null);
    setSelectedModifiers([]);
  };

  return (
    <div style={{ flex: 1.8, display: (!isMobile || mobileView === 'menu') ? 'flex' : 'none', flexDirection: 'column', gap: '16px', width: '100%', position: 'relative' }}>
      
      {/* 🚀 МОДАЛЬНОЕ ОКНО МОДИФИКАТОРОВ */}
      {modifierModalItem && (
        <>
          <div onClick={() => setModifierModalItem(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1000, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s' }}></div>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--bg-main)', borderRadius: '24px', padding: '24px', zIndex: 1001, width: '90%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)', animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-main)' }}>{modifierModalItem.name}</h3>
                <p style={{ margin: '4px 0 0 0', color: '#10b981', fontWeight: 'bold', fontSize: '18px' }}>
                  {modifierModalItem.price + selectedModifiers.reduce((sum, m) => sum + m.price, 0)} ₽
                </p>
              </div>
              <button onClick={() => setModifierModalItem(null)} style={{ background: 'var(--bg-card)', border: 'none', color: 'var(--text-muted)', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '50vh', overflowY: 'auto', paddingBottom: '10px' }} className="hide-scroll">
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Добавки</div>
              
              {availableModifiers.map(mod => {
                const isSelected = selectedModifiers.find(m => m.id === mod.id);
                return (
                  <div 
                    key={mod.id} 
                    onClick={() => toggleModifier(mod)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)', border: `1px solid ${isSelected ? '#3b82f6' : 'var(--border-color)'}`, borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{mod.icon}</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: isSelected ? 'bold' : 'normal', fontSize: '15px' }}>{mod.name}</span>
                    </div>
                    <span style={{ color: isSelected ? '#3b82f6' : 'var(--text-muted)', fontWeight: 'bold' }}>+{mod.price} ₽</span>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={confirmCustomOrder}
              style={{ width: '100%', padding: '16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}
            >
              В корзину
            </button>
          </div>
        </>
      )}

      {/* ЧЕЛЛЕНДЖ */}
      <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '28px' }}>🏆</div>
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '13px' }}>Продай {challengeGoal} десертов!</span>
            <span style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '13px' }}>{currentDessertsSold}/{challengeGoal}</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${challengeProgress}%`, height: '100%', backgroundColor: '#3b82f6', transition: 'width 0.5s ease' }}></div>
          </div>
        </div>
      </div>

      {/* КАТЕГОРИИ МЕНЮ */}
      <div className="hide-scroll" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '14px 20px', backgroundColor: activeCategory === cat ? '#3b82f6' : 'var(--bg-card)', color: activeCategory === cat ? 'white' : 'var(--text-main)', border: activeCategory === cat ? 'none' : '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0, fontSize: '15px' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* КНОПКИ ТОВАРОВ */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(130px, 1fr))' : 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
        {filteredMenu.map(item => {
          const isStopped = stopList.includes(item.id);
          return (
            <div 
              key={item.id} 
              onClick={() => handleItemClick(item)} // 🚀 Используем наш новый обработчик!
              style={{ backgroundColor: isStopped ? 'var(--bg-main)' : 'var(--bg-card)', border: `2px solid ${isStopped ? 'var(--border-color)' : 'transparent'}`, opacity: isStopped ? 0.5 : 1, padding: isMobile ? '12px' : '16px', borderRadius: '16px', cursor: isStopped ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: isStopped ? 'none' : '0 4px 6px -1px var(--shadow-color)', transition: 'transform 0.1s', position: 'relative', minHeight: '120px', justifyContent: 'center' }}
              onMouseDown={(e) => { if(!isStopped) e.currentTarget.style.transform = 'scale(0.95)'; }}
              onMouseUp={(e) => { if(!isStopped) e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseLeave={(e) => { if(!isStopped) e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isStopped && <div style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px', zIndex: 10 }}>СТОП</div>}
              
              <div style={{ fontSize: isMobile ? '40px' : '36px', textAlign: 'center', margin: '4px 0' }}>
                {getSmartIconDisplay(item)}
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.2', marginBottom: '6px' }}>{item.name}</div>
                <div style={{ color: '#10b981', fontWeight: '900', fontSize: '16px' }}>{item.price} ₽</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BaristaMenu;