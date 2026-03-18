import React from 'react';

const CalendarModule = ({ schedule, onUpdateSchedule, baristas }) => {
  // Генерируем массив из 7 ближайших дней
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  // 🚀 НОВОЕ: Функция для добавления/удаления бариста из смены (множественный выбор)
  const toggleBarista = (dateKey, baristaName, currentWorkers) => {
    let newWorkers = [...currentWorkers];
    if (newWorkers.includes(baristaName)) {
      // Если уже работает - делаем выходной (удаляем из массива)
      newWorkers = newWorkers.filter(name => name !== baristaName);
    } else {
      // Если выходной - ставим смену (добавляем в массив)
      newWorkers.push(baristaName);
    }
    onUpdateSchedule(dateKey, newWorkers);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📅 График смен (Ближайшие 7 дней)
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', padding: '4px 8px', borderRadius: '8px' }}>
          Смахни ленту 👉
        </span>
      </div>

      {/* Горизонтальная скролл-лента */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        
        {weekDays.map((date, index) => {
          const dateKey = date.toLocaleDateString('ru-RU');
          const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase();
          const dayNum = date.getDate();
          const isToday = index === 0;
          
          // 🚀 НОВОЕ: Теперь мы храним не строку, а массив работников. 
          // Если в старой базе осталась строка, аккуратно превращаем ее в массив.
          let currentWorkers = schedule[dateKey] || [];
          if (typeof currentWorkers === 'string') currentWorkers = [currentWorkers];

          return (
            <div key={dateKey} style={{
              minWidth: '120px',
              flex: '0 0 auto',
              backgroundColor: isToday ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-main)',
              border: isToday ? '2px solid #3b82f6' : '2px solid transparent',
              borderRadius: '16px',
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              transition: 'transform 0.2s',
            }}>
              {/* Дата */}
              <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                <div style={{ color: isToday ? '#3b82f6' : 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {isToday ? 'СЕГОДНЯ' : dayName}
                </div>
                <div style={{ color: 'var(--text-main)', fontSize: '28px', fontWeight: '900' }}>
                  {dayNum}
                </div>
              </div>

              {/* 🚀 НОВОЕ: Выводим кнопки-переключатели для КАЖДОГО бариста */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                {baristas.map(b => {
                  const isActive = currentWorkers.includes(b);
                  return (
                    <button 
                      key={b}
                      onClick={() => toggleBarista(dateKey, b, currentWorkers)}
                      style={{
                        width: '100%',
                        padding: '8px 0',
                        borderRadius: '8px',
                        border: isActive ? 'none' : '1px dashed var(--border-color)',
                        backgroundColor: isActive ? '#10b981' : 'transparent',
                        color: isActive ? 'white' : 'var(--text-muted)',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isActive ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                      }}
                    >
                      {isActive ? '✅ ' : ''}{b}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarModule;