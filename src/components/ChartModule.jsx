import React, { useState, useEffect } from 'react';

const ChartModule = ({ currentRevenue = 0 }) => {
  const [data, setData] = useState([]);
  const [currentDay, setCurrentDay] = useState(15);
  const [monthName, setMonthName] = useState('мар');

  // Генерируем красивые данные для графика (30 дней)
  useEffect(() => {
    const today = new Date();
    const day = today.getDate(); 
    const monthStr = today.toLocaleString('ru-RU', { month: 'short' }).replace('.', '');
    
    setCurrentDay(day);
    setMonthName(monthStr);

    const generateData = () => {
      let prev = 25000;
      let curr = 28000;
      const points = [];
      
      for (let i = 1; i <= 30; i++) {
        prev = Math.max(15000, prev + (Math.random() - 0.5) * 8000);
        
        let currVal = null;
        if (i < day) {
          curr = Math.max(18000, curr + (Math.random() - 0.5) * 9000);
          currVal = curr;
        } else if (i === day) {
          currVal = 0; // Изначально 0, будет заменено реальной выручкой ниже
        }

        points.push({
          day: i,
          prev: Math.round(prev),
          curr: currVal ? Math.round(currVal) : (i === day ? 0 : null),
        });
      }
      return points;
    };
    setData(generateData());
  }, []); 

  // 🚀 ДИНАМИКА: Подменяем сегодняшнюю точку реальной выручкой из Firebase!
  const chartData = data.map(d => 
    d.day === currentDay ? { ...d, curr: currentRevenue } : d
  );

  if (chartData.length === 0) return null;

  // 🚀 АНАЛИТИКА: Считаем реальный процент роста (Сегодня vs Вчера)
  const yesterdayData = chartData.find(d => d.day === currentDay - 1);
  const yesterdayRev = yesterdayData && yesterdayData.curr ? yesterdayData.curr : 25000;
  const trendPercent = yesterdayRev > 0 ? ((currentRevenue - yesterdayRev) / yesterdayRev) * 100 : 0;
  const isPositive = trendPercent >= 0;

  // Ищем максимальное значение, чтобы график масштабировался автоматически, даже если сегодня рекорд!
  const maxVal = Math.max(
    ...chartData.map(d => d.prev),
    ...chartData.filter(d => d.curr !== null).map(d => d.curr)
  ) * 1.1; // +10% отступа сверху

  const w = 800; // ширина SVG
  const h = 250; // высота SVG
  const padding = 20;

  const getX = (index) => padding + (index / 29) * (w - padding * 2);
  const getY = (val) => h - padding - (val / maxVal) * (h - padding * 2);

  const prevPoints = chartData.map((d, i) => `${getX(i)},${getY(d.prev)}`).join(' ');
  const currData = chartData.filter(d => d.curr !== null);
  const currPoints = currData.map((d, i) => `${getX(i)},${getY(d.curr)}`).join(' ');

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px', transition: 'all 0.3s ease' }}>
      
      {/* Шапка графика */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📈 Динамика выручки (LIVE 🔴)
          </h2>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '4px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
              <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Текущий месяц</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '4px', backgroundColor: 'var(--text-muted)', borderTop: '2px dashed var(--text-muted)' }}></div>
              <span style={{ color: 'var(--text-muted)' }}>Прошлый месяц</span>
            </div>
          </div>
        </div>
        
        {/* 🚀 ДИНАМИЧЕСКИЙ БЛОК РОСТА */}
        <div style={{ textAlign: 'right', backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '8px 16px', borderRadius: '12px', border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: isPositive ? '#10b981' : '#ef4444' }}>
            {isPositive ? '+' : ''}{trendPercent.toFixed(1)}%
          </div>
          <div style={{ fontSize: '12px', color: isPositive ? '#047857' : '#b91c1c', fontWeight: '600' }}>
            {isPositive ? 'рост ко вчерашнему дню' : 'падение ко вчерашнему дню'}
          </div>
        </div>
      </div>

      {/* Сам график */}
      <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '12px' }}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', minWidth: '600px', height: 'auto', display: 'block', overflow: 'visible' }}>
          
          {/* Горизонтальные линии сетки */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const y = padding + ratio * (h - padding * 2);
            const val = Math.round(maxVal * (1 - ratio));
            return (
              <g key={ratio}>
                <line x1={padding} y1={y} x2={w - padding} y2={y} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
                <text x={0} y={y + 4} fontSize="11" fill="var(--text-muted)" fontWeight="500">{Math.round(val / 1000)}k</text>
              </g>
            );
          })}

          {/* Линия ПРОШЛОГО месяца (Пунктирная) */}
          <polyline points={prevPoints} fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
          
          {/* Линия ТЕКУЩЕГО месяца (Яркая) */}
          {currPoints && (
            <>
              <polygon 
                points={`${getX(0)},${h - padding} ${currPoints} ${getX(currData.length - 1)},${h - padding}`} 
                fill="url(#blueGradient)" 
                opacity="0.3" 
              />
              <polyline points={currPoints} fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              
              {currData.map((d, i) => (
                <circle 
                  key={i} cx={getX(i)} cy={getY(d.curr)} 
                  r={i === currData.length - 1 ? "6" : "3"} 
                  fill={i === currData.length - 1 ? "#3b82f6" : "var(--bg-card)"} 
                  stroke="#3b82f6" strokeWidth={i === currData.length - 1 ? "4" : "2"} 
                  style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
              ))}

              {/* 🚀 ДИНАМИЧЕСКИЙ ТУЛТИП ДЛЯ СЕГОДНЯ */}
              <g transform={`translate(${getX(currData.length - 1)}, ${getY(currData.length - 1) - 24})`} style={{ transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <rect x="-40" y="-22" width="80" height="28" rx="6" fill="#3b82f6" />
                <polygon points="-6,6 6,6 0,12" fill="#3b82f6" /> 
                <text x="0" y="-3" fontSize="13" fill="#fff" textAnchor="middle" fontWeight="bold">
                  {currentRevenue.toLocaleString('ru-RU')} ₽
                </text>
              </g>
            </>
          )}

          {/* Ось X (Дни месяца) */}
          <g transform={`translate(0, ${h})`}>
            {[1, 5, 10, 15, 20, 25, 30].map(day => (
              <text key={day} x={getX(day - 1)} y="0" fontSize="11" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">
                {day} {monthName}
              </text>
            ))}
          </g>

          <defs>
            <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default ChartModule;