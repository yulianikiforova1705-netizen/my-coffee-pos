import React from 'react';

const GoalModule = ({ currentRevenue, targetRevenue }) => {
  const progress = Math.min((currentRevenue / targetRevenue) * 100, 100);
  const isGoalReached = currentRevenue >= targetRevenue;

  const successColor = '#20c997'; 
  // 🚀 ИСПРАВЛЕНИЕ: Заменили бледный сиреневый на ваш фирменный ярко-синий!
  const progressColor = '#3b82f6'; 
  
  const barColor = isGoalReached ? successColor : progressColor;

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px', transition: 'all 0.3s ease' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-main)' }}>План продаж на сегодня</h2>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: isGoalReached ? 'bold' : 'normal', color: isGoalReached ? successColor : 'var(--text-muted)', transition: 'color 0.3s' }}>
            {isGoalReached ? '🎉 План выполнен! Вы супер-команда!' : 'Осталось совсем немного до цели!'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: isGoalReached ? successColor : 'var(--text-main)', transition: 'color 0.3s' }}>
            {currentRevenue.toLocaleString('ru-RU')} ₽
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px', marginLeft: '6px', fontWeight: '500' }}>
            из {targetRevenue.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>
      
      <div style={{ position: 'relative', marginTop: '55px' }}>
        
        <div style={{
          position: 'absolute',
          top: '-48px',
          left: `${progress}%`,
          zIndex: 10,
          transition: 'left 1s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'floatCup 2.5s ease-in-out infinite'
        }}>
          
          <div style={{
            position: 'absolute',
            right: '-10px',
            top: '6px',
            width: '12px',
            height: '18px',
            border: '3px solid var(--text-main)',
            borderLeft: 'none',
            borderRadius: '0 10px 10px 0',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s'
          }}></div>
          
          <div style={{
            position: 'relative',
            width: '30px',
            height: '36px',
            backgroundColor: 'var(--bg-card)',
            border: '3px solid var(--text-main)',
            borderRadius: '3px 3px 12px 12px',
            overflow: 'hidden',
            boxSizing: 'border-box',
            boxShadow: '0 4px 6px var(--shadow-color)',
            transition: 'all 0.3s'
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: `${progress}%`,
              backgroundColor: '#8b4513', 
              transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
          </div>

          {!isGoalReached && progress > 5 && (
            <>
              <div style={{position: 'absolute', top: '-10px', left: '8px', width: '4px', height: '4px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'steam 2s infinite ease-out', opacity: 0}}></div>
              <div style={{position: 'absolute', top: '-6px', left: '18px', width: '5px', height: '5px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'steam 2s infinite ease-out 1s', opacity: 0}}></div>
            </>
          )}
        </div>

        <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--btn-bg)', borderRadius: '999px', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ 
            height: '100%', 
            width: `${progress}%`, 
            backgroundColor: barColor, 
            borderRadius: '999px',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: isGoalReached ? 'none' : 'shimmer 2s infinite' }}></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes floatCup {
          0%, 100% { transform: translateX(-50%) translateY(0px) rotate(0deg); }
          50% { transform: translateX(-50%) translateY(-6px) rotate(5deg); } 
        }
        @keyframes steam {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.2; }
          100% { transform: translateY(-15px) scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default GoalModule;