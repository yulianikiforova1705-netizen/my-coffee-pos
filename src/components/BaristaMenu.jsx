import React from 'react';

const BaristaMenu = ({
  isMobile,
  mobileView,
  categories,
  activeCategory,
  setActiveCategory,
  filteredMenu,
  stopList,
  handleAddToCart,
  getProductIcon,
  challengeGoal,
  currentDessertsSold,
  challengeProgress
}) => {
  return (
    <div style={{ flex: 1.8, display: (!isMobile || mobileView === 'menu') ? 'flex' : 'none', flexDirection: 'column', gap: '16px', width: '100%' }}>
      
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
              onClick={() => handleAddToCart(item)}
              style={{ backgroundColor: isStopped ? 'var(--bg-main)' : 'var(--bg-card)', border: `2px solid ${isStopped ? 'var(--border-color)' : 'transparent'}`, opacity: isStopped ? 0.5 : 1, padding: isMobile ? '12px' : '16px', borderRadius: '16px', cursor: isStopped ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: isStopped ? 'none' : '0 4px 6px -1px var(--shadow-color)', transition: 'transform 0.1s', position: 'relative', minHeight: '120px', justifyContent: 'center' }}
              onMouseDown={(e) => { if(!isStopped) e.currentTarget.style.transform = 'scale(0.95)'; }}
              onMouseUp={(e) => { if(!isStopped) e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseLeave={(e) => { if(!isStopped) e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isStopped && <div style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px', zIndex: 10 }}>СТОП</div>}
              <div style={{ fontSize: isMobile ? '40px' : '36px', textAlign: 'center', margin: '4px 0' }}>{getProductIcon(item.name)}</div>
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