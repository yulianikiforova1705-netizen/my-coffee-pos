import React from 'react';

const BaristaCabinet = ({ isOpen, onClose, baristaName, baristaStats = {}, salarySettings = {} }) => {
  if (!isOpen) return null;

  // Достаем статистику конкретного бариста
  const stats = baristaStats[baristaName] || { tips: 0, dessertsSold: 0, revenue: 0, ratingSum: 0, ratingCount: 0 };
  
  // Считаем примерную зарплату за день
  const baseSalary = salarySettings.base || 1500;
  const percentBonus = Math.round(stats.revenue * ((salarySettings.percent || 5) / 100));
  const estimatedSalary = baseSalary + percentBonus;
  
  const avgRating = stats.ratingCount > 0 ? (stats.ratingSum / stats.ratingCount).toFixed(1) : '—';

  // Цель на день (мотивация)
  const salaryGoal = 3500;
  const progressPercent = Math.min((estimatedSalary / salaryGoal) * 100, 100);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '400px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)', animation: 'slideUp 0.3s ease' }}>
        
        {/* Шапка кабинета */}
        <div style={{ backgroundColor: '#3b82f6', padding: '32px 24px', color: 'white', textAlign: 'center', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}>✕</button>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🧑‍🍳</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Привет, {baristaName}!</h2>
          <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Твои успехи за смену</p>
        </div>

        {/* Основные метрики */}
        <div style={{ padding: '24px' }}>
          
          {/* 🚀 БЛОК ЗАРПЛАТЫ С ЦЕЛЬЮ */}
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
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
            
            {/* Шкала прогресса */}
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

          <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '24px' }}>
             <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '4px' }}>ВЫРУЧКА КАССЫ</div>
             <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)' }}>{stats.revenue.toLocaleString('ru-RU')} ₽</div>
          </div>

          {/* Мотивационный блок */}
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '24px' }}>🧁</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)' }}>Продано десертов: {stats.dessertsSold}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Предлагай круассан к каждому кофе, чтобы повысить средний чек!</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BaristaCabinet;