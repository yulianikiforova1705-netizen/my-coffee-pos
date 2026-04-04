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
    <div className="qr-menu-wrapper">
      
      {/* ЯРКАЯ АТМОСФЕРНАЯ ПОДСВЕТКА (НЕОН) */}
      <div className="neon-orb orb-blue"></div>
      <div className="neon-orb orb-green"></div>
      <div className="neon-orb orb-purple"></div>

      {/* ШАПКА МЕНЮ */}
      <div className="menu-header">
        <div className="floating-cup">☕</div>
        <h1 className="menu-title">GOURMET COFFEE</h1>
        <p className="menu-subtitle">Меню</p>
      </div>

      {/* КАТЕГОРИИ */}
      <div className="hide-scroll category-container">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* КАРТОЧКИ ТОВАРОВ */}
      <div className="menu-grid">
        {filteredMenu.map((item, index) => {
          const isStopped = stopList.includes(item.id);
          return (
            <div 
              className={`menu-card ${isStopped ? 'stopped' : ''}`} 
              key={item.id} 
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {isStopped && (
                <div className="stop-overlay">
                  <div className="stop-badge">СКОРО БУДЕТ</div>
                </div>
              )}
              
              <div className="icon-container">
                {getSmartIcon(item)}
              </div>
              
              <div className="card-content">
                <div className="item-name">{item.name}</div>
                {item.desc && <div className="item-desc">{item.desc}</div>}
              </div>
              
              <div className="card-footer">
                <span className="item-price">{item.price} ₽</span>
                <div className="add-btn">+</div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .qr-menu-wrapper {
          background-color: #050b14; /* Максимально темный фон для яркого неона */
          min-height: 100vh;
          width: 100vw;
          font-family: system-ui, -apple-system, sans-serif;
          color: #f8fafc;
          padding: 20px;
          box-sizing: border-box;
          position: relative;
          overflow-x: hidden;
        }

        /* --- ЯРКИЕ НЕОНОВЫЕ СФЕРЫ --- */
        .neon-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px); /* Размытие для эффекта свечения */
          z-index: 0;
          pointer-events: none;
        }
        .orb-blue {
          top: -10%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: rgba(59, 130, 246, 0.4); /* Яркий синий */
          animation: floatOrb 10s infinite alternate ease-in-out;
        }
        .orb-green {
          top: 50%;
          right: -20%;
          width: 350px;
          height: 350px;
          background: rgba(16, 185, 129, 0.25); /* Изумрудный */
          animation: floatOrb 12s infinite alternate-reverse ease-in-out;
        }
        .orb-purple {
          bottom: -10%;
          left: 20%;
          width: 300px;
          height: 300px;
          background: rgba(139, 92, 246, 0.3); /* Фиолетовый */
          animation: floatOrb 14s infinite alternate ease-in-out;
        }

        /* --- ШАПКА --- */
        .menu-header {
          text-align: center;
          margin-bottom: 30px;
          margin-top: 20px;
          position: relative;
          z-index: 1;
        }
        .floating-cup {
          font-size: 56px;
          margin-bottom: 10px;
          animation: floatCup 3s ease-in-out infinite;
          filter: drop-shadow(0 10px 10px rgba(0,0,0,0.4));
        }
        .menu-title {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 1px;
          background: linear-gradient(to right, #ffffff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .menu-subtitle {
          color: #94a3b8;
          margin: 5px 0 0 0;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: bold;
        }

        /* --- КАТЕГОРИИ --- */
        .category-container {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 15px;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }
        .category-btn {
          padding: 12px 24px;
          border-radius: 24px;
          white-space: nowrap;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-weight: 800;
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px); /* Для Apple */
        }
        .category-btn.active {
          background-color: rgba(59, 130, 246, 0.8);
          color: white;
          border-color: rgba(59, 130, 246, 1);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }

        /* --- КАРТОЧКИ (НАСТОЯЩЕЕ СТЕКЛО) --- */
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          padding-bottom: 40px;
          position: relative;
          z-index: 1;
        }
        .menu-card {
          background: rgba(255, 255, 255, 0.03); /* Почти полная прозрачность */
          border-radius: 24px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-top: 1px solid rgba(255, 255, 255, 0.15); /* Блик сверху */
          border-left: 1px solid rgba(255, 255, 255, 0.15); /* Блик слева */
          opacity: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: fadeInCascade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(16px); /* Основной эффект стекла */
          -webkit-backdrop-filter: blur(16px);
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s;
          cursor: pointer;
        }
        .menu-card:active {
          transform: scale(0.95);
          background: rgba(255, 255, 255, 0.06);
        }
        .menu-card.stopped {
          cursor: default;
        }
        
        .stop-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(15, 23, 42, 0.6);
          border-radius: 24px;
          z-index: 5;
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stop-badge {
          background-color: #ef4444;
          color: white;
          font-size: 13px;
          font-weight: 900;
          padding: 8px 14px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
          transform: rotate(-5deg);
        }

        .icon-container {
          height: 120px;
          background-color: rgba(255, 255, 255, 0.02);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          transition: transform 0.3s;
        }
        .menu-card:hover .icon-container {
          transform: scale(1.1) rotate(2deg);
        }

        .card-content { flex-grow: 1; }
        .item-name {
          font-weight: 800;
          font-size: 17px;
          line-height: 1.2;
          margin-bottom: 6px;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .item-desc {
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.4;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .item-price {
          font-weight: 900;
          color: #34d399; /* Яркий изумрудный для ценника */
          font-size: 22px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .add-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
        }

        /* --- СКРОЛЛ И АНИМАЦИИ --- */
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeInCascade { 
          from { opacity: 0; transform: translateY(30px) scale(0.95); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
        @keyframes floatCup { 
          0%, 100% { transform: translateY(0) rotate(0deg); } 
          50% { transform: translateY(-8px) rotate(3deg); } 
        }
        @keyframes floatOrb { 
          0% { transform: translate(0, 0) scale(1); } 
          100% { transform: translate(40px, 30px) scale(1.1); } 
        }
      `}</style>
    </div>
  );
};

export default QRMenu;