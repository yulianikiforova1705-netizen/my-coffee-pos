import React, { useState } from 'react';
import { useCoffeeLogic } from '../useCoffeeLogic';

const QRMenu = () => {
  // 🚀 Берем актуальное меню и стоп-лист прямо из ядра кассы!
  const { menuItems, stopList } = useCoffeeLogic();
  const [activeCategory, setActiveCategory] = useState('Все');

  const getSmartIcon = (item) => {
    if (item.icon) return item.icon;
    const text = ((item.name || '') + ' ' + (item.category || '')).toLowerCase();
    if (text.includes('круассан')) return '🥐';
    if (text.includes('ролл') || text.includes('шаурма') || text.includes('wrap')) return '🌯';
    if (text.includes('сэндвич') || text.includes('сендвич') || text.includes('тост')) return '🥪';
    if (text.includes('сырник') || text.includes('блин') || text.includes('каша')) return '🍳';
    if (text.includes('печенье') || text.includes('макарон')) return '🍪';
    if (text.includes('чизкейк') || text.includes('торт') || text.includes('десерт')) return '🍰';
    if (text.includes('салат')) return '🥗';
    if (text.includes('матча') || text.includes('чай')) return '🍵';
    if (text.includes('лимонад') || text.includes('айс') || text.includes('сок')) return '🥤';
    if (text.includes('какао') || text.includes('шоколад') || text.includes('латте') || text.includes('капучино') || text.includes('эспрессо') || text.includes('раф')) return '☕';
    return '☕';
  };

  const categories = ['Все', ...new Set(menuItems.map(item => item.category).filter(Boolean))];
  const filteredMenu = activeCategory === 'Все' ? menuItems : menuItems.filter(item => item.category === activeCategory);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100vw', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#f8fafc', padding: '20px', boxSizing: 'border-box' }}>
      
      {/* ШАПКА МЕНЮ */}
      <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '10px', animation: 'fadeIn 1s ease' }}>☕</div>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '900', letterSpacing: '1px' }}>GOURMET COFFEE</h1>
        <p style={{ color: '#94a3b8', margin: '5px 0 0 0', fontSize: '15px' }}>Электронное меню</p>
      </div>

      {/* КАТЕГОРИИ */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            style={{ 
              padding: '12px 24px', 
              borderRadius: '24px', 
              border: 'none', 
              whiteSpace: 'nowrap',
              backgroundColor: activeCategory === cat ? '#3b82f6' : '#1e293b',
              color: activeCategory === cat ? 'white' : '#94a3b8',
              fontWeight: 'bold', 
              fontSize: '15px', 
              transition: 'all 0.3s ease',
              boxShadow: activeCategory === cat ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* КАРТОЧКИ ТОВАРОВ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', paddingBottom: '40px' }}>
        {filteredMenu.map(item => {
          const isStopped = stopList.includes(item.id);
          return (
            <div key={item.id} style={{ 
              backgroundColor: '#1e293b', 
              borderRadius: '24px', 
              padding: '16px', 
              border: '1px solid rgba(255,255,255,0.05)',
              opacity: isStopped ? 0.5 : 1,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              animation: 'fadeInSlideIn 0.4s ease-out forwards'
            }}>
              {isStopped && <div style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '6px 10px', borderRadius: '10px', zIndex: 10, boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)' }}>СКОРО БУДЕТ</div>}
              
              <div style={{ height: '120px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>
                {getSmartIcon(item)}
              </div>
              
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontWeight: '800', fontSize: '16px', lineHeight: '1.2', marginBottom: '6px' }}>{item.name}</div>
                {item.desc && <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.4' }}>{item.desc}</div>}
              </div>
              
              <div style={{ fontWeight: '900', color: '#10b981', fontSize: '20px', marginTop: 'auto' }}>
                {item.price} ₽
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeInSlideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

    </div>
  );
};

export default QRMenu;