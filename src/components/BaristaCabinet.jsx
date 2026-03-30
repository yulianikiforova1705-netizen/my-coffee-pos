import React from 'react';

const BaristaCabinet = ({ isOpen, onClose, baristaName, baristaStats = {}, salarySettings = {} }) => {
  if (!isOpen) return null;

  const stats = baristaStats[baristaName] || { tips: 0, dessertsSold: 0, revenue: 0, ratingSum: 0, ratingCount: 0 };
  
  const baseSalary = salarySettings.base || 1500;
  const percentBonus = Math.round(stats.revenue * ((salarySettings.percent || 5) / 100));
  const estimatedSalary = baseSalary + percentBonus;
  
  const avgRating = stats.ratingCount > 0 ? (stats.ratingSum / stats.ratingCount).toFixed(1) : '—';
  const numericRating = stats.ratingCount > 0 ? (stats.ratingSum / stats.ratingCount) : 0;

  const salaryGoal = 3500;
  const progressPercent = Math.min((estimatedSalary / salaryGoal) * 100, 100);

  // 🚀 ЛОГИКА ДОСТИЖЕНИЙ
  const achievements = [
    {
      id: 'desserts',
      icon: '🧁',
      title: 'Король десертов',
      desc: 'Продать >10 десертов',
      isUnlocked: stats.dessertsSold >= 10,
      progress: `${stats.dessertsSold}/10`
    },
    {
      id: 'revenue',
      icon: '💰',
      title: 'Волк с Уолл-стрит',
      desc: 'Выручка >10к ₽',
      isUnlocked: stats.revenue >= 10000,
      progress: `${Math.floor(stats.revenue/1000)}k/10k`
    },
    {
      id: 'rating',
      icon: '⭐',
      title: 'Любимец публики',
      desc: 'Рейтинг 5.0 (от 3 шт)',
      isUnlocked: numericRating === 5 && stats.ratingCount >= 3,
      progress: `${stats.ratingCount} отз.`
    }
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease' }}>
      <div className="hide-scroll" style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)', animation: 'slideUp 0.3s ease' }}>
        
        {/* Шапка кабинета */}
        <div style={{ backgroundColor: '#3b82f6', padding: '32px 24px', color: 'white', textAlign: 'center', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}>✕</button>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🧑‍🍳</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Привет, {baristaName}!</h2>
          <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Твои успехи за смену</p>
        </div>

        <div style={{ padding: '24px' }}>
          
          {/* БЛОК ЗАРПЛАТЫ */}
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '4px' }}>ЗАРПЛАТА СЕГОДНЯ</div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#10b981', lineHeight: '1' }}>{estimatedSalary} ₽</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>ЦЕЛЬ</div>
                <div style={{ fontSize: '16px', color: 'var(--text-main)', fontWeight: 'bold' }}>{salaryGoal} ₽</div>
              </div>
            </div>
            
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: progressPercent >= 100 ? '#f59e0b' : '#10b981', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Оклад: {baseSalary}₽</span>
              <span>Бонус ({salarySettings.percent}%): +{percentBonus}₽</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '4px' }}>ЧАЕВЫЕ</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#3b82f6' }}>{stats.tips} ₽</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '4px' }}>РЕЙТИНГ</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b' }}>⭐ {avgRating}</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '32px' }}>
             <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '4px' }}>ВЫРУЧКА КАССЫ</div>
             <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)' }}>{stats.revenue.toLocaleString('ru-RU')} ₽</div>
          </div>

          {/* 🚀 НОВЫЙ БЛОК: СТЕНА ДОСТИЖЕНИЙ */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏆 Стена достижений
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {achievements.map(ach => (
                <div key={ach.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  padding: '12px', 
                  backgroundColor: ach.isUnlocked ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-main)', 
                  border: `1px solid ${ach.isUnlocked ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-color)'}`, 
                  borderRadius: '16px',
                  opacity: ach.isUnlocked ? 1 : 0.6,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backgroundColor: ach.isUnlocked ? '#fef3c7' : 'var(--bg-card)', 
                    borderRadius: '50%', 
                    fontSize: '24px',
                    boxShadow: ach.isUnlocked ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'none',
                    filter: ach.isUnlocked ? 'none' : 'grayscale(100%)'
                  }}>
                    {ach.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: ach.isUnlocked ? '#d97706' : 'var(--text-main)' }}>
                      {ach.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ach.desc}</div>
                  </div>
                  
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: ach.isUnlocked ? '#10b981' : 'var(--text-muted)' }}>
                    {ach.isUnlocked ? '✅ Открыто' : ach.progress}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BaristaCabinet;