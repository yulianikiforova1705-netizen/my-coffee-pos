import React, { useState, useRef } from 'react';
import { useCoffeeLogic } from './useCoffeeLogic';

const QRMenu = () => {
  const { menuItems, stopList } = useCoffeeLogic();
  const [activeCategory, setActiveCategory] = useState('Все');
  
  // 🚀 СОСТОЯНИЕ ДЛЯ КРАСИВОГО УВЕДОМЛЕНИЯ
  const [toastVisible, setToastVisible] = useState(false);
  const timerRef = useRef(null);

  const showToast = () => {
    setToastVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const getSmartIcon = (item) => {
    if (item.icon) return item.icon;
    const text = ((item.name || '') + ' ' + (item.category || '')).toLowerCase();
    if (text.includes('круассан')) return '🥐';
    if (text.includes('ролл') || text.includes('шаурма') || text.includes('wrap')) return '🌯';
    if (text.includes('сэндвич') || text.includes('сендвич') || text.includes('тост')) return '🥪';
    if (text.includes('сырник') || text.includes('блин') || text.includes('каша')) return '🍳';
    if (text.includes('печенье') || text.includes('кукис') || text.includes('макарон')) return '🍪';
    if (text.includes('чизкейк') || text.includes('торт') || text.includes('десерт')) return '🍰';
    if (text.includes('салат')) return '🥗';
    if (text.includes('матча') || text.includes('чай')) return '🍵';
    if (text.includes('лимонад') || text.includes('айс') || text.includes('сок')) return '🥤';
    if (text.includes('какао') || text.includes('шоколад') || text.includes('латте') || text.includes('капучино') || text.includes('эспрессо') || text.includes('раф')) return '☕';
    return '☕';
  };

  const getSmartAnimationClass = (item) => {
    const text = ((item.name || '') + ' ' + (item.category || '')).toLowerCase();
    if (text.includes('какао') || text.includes('шоколад') || text.includes('латте') || text.includes('капучино') || text.includes('эспрессо') || text.includes('раф') || text.includes('матча') || text.includes('чай') || text.includes('лимонад') || text.includes('сок') || text.includes('колд')) {
      return 'coffee-icon-steaming';
    }
    return 'food-icon-active'; 
  };

  const categories = ['Все', ...new Set(menuItems.map(item => item.category).filter(Boolean))];
  const filteredMenu = activeCategory === 'Все' ? menuItems : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="qr-menu-wrapper">
      
      {/* ЯРКАЯ АТМОСФЕРНАЯ ПОДСВЕТКА (НЕОН) */}
      <div className="neon-orb orb-blue"></div>
      <div className="neon-orb orb-green"></div>
      <div className="neon-orb orb-purple"></div>
      <div className="neon-orb orb-pink"></div>

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
              onClick={() => {
                if (!isStopped) showToast(); // 🚀 ВЫЗЫВАЕМ КРАСИВОЕ УВЕДОМЛЕНИЕ
              }}
            >
              {isStopped && (
                <div className="stop-overlay">
                  <div className="stop-badge">СКОРО БУДЕТ</div>
                </div>
              )}
              
              <div className={`icon-container ${getSmartAnimationClass(item)}`}>
                {getSmartIcon(item)}
              </div>
              
              <div className="card-content">
                <div className="item-name">{item.name}</div>
                {item.desc && <div className="item-desc">{item.desc}</div>}
              </div>
              
              <div className="card-footer">
                <span className="item-price">{item.price} ₽</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 🚀 КАСТОМНОЕ УВЕДОМЛЕНИЕ (ТОСТ) */}
      <div className={`custom-toast ${toastVisible ? 'show' : ''}`}>
        Заказ можно оформить только у баристы на кассе. Ждем вас! ☕
      </div>

      <style>{`
        .qr-menu-wrapper {
          background-color: #050b14;
          min-height: 100vh;
          width: 100vw;
          font-family: system-ui, -apple-system, sans-serif;
          color: #f8fafc;
          padding: 20px;
          box-sizing: border-box;
          position: relative;
          overflow-x: hidden;
        }

        /* --- КАСТОМНЫЙ ТОСТ --- */
        .custom-toast {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 9999;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s;
          opacity: 0;
          pointer-events: none;
          text-align: center;
          font-weight: bold;
          font-size: 15px;
          width: max-content;
          max-width: 90vw;
          line-height: 1.4;
        }
        .custom-toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }

        /* --- ЯРКИЕ НЕОНОВЫЕ СФЕРЫ --- */
        .neon-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px); 
          z-index: 0;
          pointer-events: none;
        }
        .orb-blue {
          top: -5%; left: -5%; width: 400px; height: 400px;
          background: rgba(59, 130, 246, 0.4); 
          animation: floatOrb 10s infinite alternate ease-in-out;
        }
        .orb-green {
          top: 40%; right: -10%; width: 350px; height: 350px;
          background: rgba(16, 185, 129, 0.25); 
          animation: floatOrb 12s infinite alternate-reverse ease-in-out;
        }
        .orb-purple {
          bottom: -10%; left: 10%; width: 300px; height: 300px;
          background: rgba(139, 92, 246, 0.3); 
          animation: floatOrb 14s infinite alternate ease-in-out;
        }
        .orb-pink {
          top: 10%; right: -5%; width: 350px; height: 350px;
          background: rgba(236, 72, 153, 0.35); 
          animation: floatOrb 11s infinite alternate-reverse ease-in-out;
        }

        /* --- ШАПКА --- */
        .menu-header { text-align: center; margin-bottom: 30px; margin-top: 20px; position: relative; z-index: 1; }
        .floating-cup { font-size: 56px; margin-bottom: 10px; animation: floatCup 3s ease-in-out infinite; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.4)); position: relative; }
        .menu-title { margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 1px; background: linear-gradient(to right, #ffffff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .menu-subtitle { color: #94a3b8; margin: 5px 0 0 0; font-size: 15px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; }

        /* --- КАТЕГОРИИ --- */
        .category-container { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 24px; position: relative; z-index: 1; }
        .category-btn { padding: 12px 24px; border-radius: 24px; white-space: nowrap; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; font-weight: 800; font-size: 15px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        .category-btn.active { background-color: rgba(59, 130, 246, 0.8); color: white; border-color: rgba(59, 130, 246, 1); box-shadow: 0 0 25px rgba(59, 130, 246, 0.4); }

        /* --- КАРТОЧКИ --- */
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; padding-bottom: 100px; position: relative; z-index: 1; }
        .menu-card { background: rgba(255, 255, 255, 0.04); border-radius: 24px; padding: 18px; border: 1px solid rgba(255, 255, 255, 0.08); border-top: 1px solid rgba(255, 255, 255, 0.18); border-left: 1px solid rgba(255, 255, 255, 0.18); opacity: 0; display: flex; flexDirection: column; gap: 14px; animation: fadeInCascade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.35); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s; cursor: pointer; }
        .menu-card:active { transform: scale(0.95); background: rgba(255, 255, 255, 0.07); }
        .menu-card.stopped { cursor: default; }
        
        .stop-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.65); border-radius: 24px; z-index: 5; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
        .stop-badge { background-color: #ef4444; color: white; font-size: 13px; font-weight: 900; padding: 8px 14px; border-radius: 12px; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); transform: rotate(-5deg); }

        .icon-container { height: 120px; background-color: rgba(255, 255, 255, 0.02); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 64px; position: relative; }

        .coffee-icon-steaming::after { content: '〰〰〰'; position: absolute; top: 12px; left: 50%; transform: translateX(-50%); font-size: 14px; color: rgba(255, 255, 255, 0.4); filter: blur(1px); font-weight: bold; animation: floatSteam 2.5s infinite ease-in-out; }
        .food-icon-active::after { content: '✨'; position: absolute; top: 16px; right: 25px; font-size: 18px; opacity: 0.6; animation: sparkleFood 2s infinite alternate ease-in-out; }
        .menu-card:hover .food-icon-active { animation: pulseFood 0.8s ease-out; }

        .card-content { flex-grow: 1; display: flex; flex-direction: column; }
        .item-name { font-weight: 800; font-size: 17px; line-height: 1.2; margin-bottom: 6px; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .item-desc { font-size: 13px; color: #94a3b8; line-height: 1.4; }
        .card-footer { margin-top: auto; display: flex; align-items: center; justify-content: center; }
        .item-price { font-weight: 900; color: #34d399; font-size: 24px; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }

        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeInCascade { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes floatCup { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
        @keyframes floatOrb { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(40px, 30px) scale(1.1); } }
        @keyframes floatSteam { 0%, 100% { opacity: 0; transform: translateX(-50%) translateY(0) scale(1); } 50% { opacity: 1; transform: translateX(-50%) translateY(-6px) scale(1.05); } 80% { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(1); } }
        @keyframes sparkleFood { 0% { opacity: 0.2; transform: scale(0.8) rotate(0deg); } 100% { opacity: 0.8; transform: scale(1.2) rotate(15deg); } }
        @keyframes pulseFood { 0% { transform: scale(1); } 30% { transform: scale(1.1); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default QRMenu;