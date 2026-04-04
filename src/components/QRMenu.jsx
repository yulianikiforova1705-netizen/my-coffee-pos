import React, { useState } from 'react';
import { useCoffeeLogic } from './useCoffeeLogic';

const QRMenu = () => {
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
    <div style={{ 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      width: '100vw', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      color: '#f8fafc', 
      padding: '20px', 
      boxSizing: 'border-box',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* АТМОСФЕРНАЯ ПОДСВЕТКА НА ФОНЕ */}
      <div style={{ position: 'absolute', top: '-10%', left: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%', animation: 'float 8s infinite alternate', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '40%', right: '-20%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%', animation: 'float 12s infinite alternate-reverse', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* ШАПКА МЕНЮ */}
      <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '56px', marginBottom: '10px', animation: 'floatCup 3s ease-in-out infinite', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' }}>☕</div>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', letterSpacing: '1px', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GOURMET COFFEE</h1>
        <p style={{ color: '#94a3b8', margin: '5px 0 0 0', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Меню</p>
      </div>

      {/* КАТЕГОРИИ */}
      <div className="hide-scroll" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            style={{ 
              padding: '12px 24px', 
              borderRadius: '24px', 
              border: activeCategory === cat ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.05)', 
              whiteSpace: 'nowrap',
              backgroundColor: activeCategory === cat ? '#3b82f6' : 'rgba(30, 41, 59, 0.7)',
              color: activeCategory === cat ? 'white' : '#94a3b8',
              fontWeight: '800', 
              fontSize: '15px', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeCategory === cat ? '0 8px 20px -5px rgba(59, 130, 246, 0.5)' : 'none',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* КАРТОЧКИ ТОВАРОВ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', paddingBottom: '40px', position: 'relative', zIndex: 1 }}>
        {filteredMenu.map((item, index) => {
          const isStopped = stopList.includes(item.id);
          return (
            <div className="menu-card" key={item.id} style={{ 
              background: 'linear-gradient(145deg, rgba(30,41,59,0.9), rgba(15,23,42,0.8))',
              borderRadius: '24px', 
              padding: '18px', 
              border: '1px solid rgba(255,255,255,0.05)',
              opacity: 0, 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              animation: `fadeInCascade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
              animationDelay: `${index * 0.08}s`, // 🚀 Та самая каскадная задержка!
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(12px)',
              cursor: isStopped ? 'default' : 'pointer'
            }}>
              {isStopped && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: '24px', zIndex: 5, backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '13px', fontWeight: '900', padding: '8px 14px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)', transform: 'rotate(-5deg)' }}>СКОРО БУДЕТ</div>
                </div>
              )}
              
              <div style={{ height: '120px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', transition: 'transform 0.3s' }} className="icon-container">
                {getSmartIcon(item)}
              </div>
              
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontWeight: '800', fontSize: '17px', lineHeight: '1.2', marginBottom: '6px', color: '#f8fafc' }}>{item.name}</div>
                {item.desc && <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>{item.desc}</div>}
              </div>
              
              <div style={{ fontWeight: '900', color: '#10b981', fontSize: '22px', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {item.price} ₽
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>+</div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        
        .menu-card {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
        }
        .menu-card:active {
          transform: scale(0.94);
        }
        .menu-card:hover .icon-container {
          transform: scale(1.1);
        }

        @keyframes fadeInCascade { 
          from { opacity: 0; transform: translateY(30px) scale(0.95); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
        @keyframes floatCup { 
          0%, 100% { transform: translateY(0) rotate(0deg); } 
          50% { transform: translateY(-8px) rotate(3deg); } 
        }
        @keyframes float { 
          0% { transform: translate(0, 0); } 
          100% { transform: translate(30px, 20px); } 
        }
      `}</style>

    </div>
  );
};

export default QRMenu;