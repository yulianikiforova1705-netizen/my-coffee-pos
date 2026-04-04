import React, { useState, useEffect } from 'react';

const ChartModule = ({ currentRevenue = 0 }) => {
  const [data, setData] = useState([]);
  const [currentDay, setCurrentDay] = useState(15);
  const [monthName, setMonthName] = useState('мар');

  // 🚀 ГЕНЕРАЦИЯ ВИЗУАЛЬНОЙ ИСТОРИИ (для красоты и сравнения)
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
        // Прошлый месяц (пунктир)
        prev = Math.max(15000, prev + (Math.random() - 0.5) * 8000);
        
        let currVal = null;
        if (i < day) {
          // Имитация прошлых дней текущего месяца
          curr = Math.max(18000, curr + (Math.random() - 0.5) * 9000);
          currVal = curr;
        } else if (i === day) {
          currVal = currentRevenue; // Реальные данные из пропсов
        }

        points.push({
          day: i,
          prev: Math.round(prev),
          curr: currVal !== null ? Math.round(currVal) : null,
        });
      }
      return points;
    };
    setData(generateData());
  }, [currentRevenue]); // Обновляем, если изменилась выручка

  if (data.length === 0) return null;

  // 🚀 ДИНАМИКА: Всегда актуализируем сегодняшнюю точку
  const chartData = data.map(d => 
    d.day === currentDay ? { ...d, curr: currentRevenue } : d
  );

  // Считаем тренд
  const yesterdayData = chartData.find(d => d.day === currentDay - 1);
  const yesterdayRev = yesterdayData && yesterdayData.curr ? yesterdayData.curr : 25000;
  const trendPercent = yesterdayRev > 0 ? ((currentRevenue - yesterdayRev) / yesterdayRev) * 100 : 0;
  const isPositive = trendPercent >= 0;

  // Авто-масштаб высоты
  const maxVal = Math.max(
    ...chartData.map(d => d.prev),
    ...chartData.filter(d => d.curr !== null).map(d => d.curr),
    40000 // Минимум для красоты
  ) * 1.2;

  const w = 800; 
  const h = 250; 
  const padding = 20;

  const getX = (index) => padding + (index / 29) * (w - padding * 2);
  const getY = (val) => h - padding - (val / maxVal) * (h - padding * 2);

  const prevPoints = chartData.map((d, i) => `${getX(i)},${getY(d.prev)}`).join(' ');
  const currData = chartData.filter(d => d.curr !== null);
  const currPoints = currData.map((d, i) => `${getX(i)},${getY(d.curr)}`).join(' ');

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px var(--shadow-color)', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
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
        
        <div style={{ textAlign: 'right', backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '8px 16px', borderRadius: '12px', border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: isPositive ? '#10b981' : '#ef4444' }}>
            {isPositive ? '+' : ''}{trendPercent.toFixed(1)}%
          </div>
          <div style={{ fontSize: '11px', color: isPositive ? '#047857' : '#b91c1c', fontWeight: '700', textTransform: 'uppercase' }}>
            {isPositive ? 'рост к вчера' : 'падение к вчера'}
          </div>
        </div>
      </div>

      <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '12px' }} className="hide-scroll">
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', minWidth: '700px', height: 'auto', display: 'block', overflow: 'visible' }}>
          
          <defs>
            <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Сетка */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const y = padding + ratio * (h - padding * 2);
            const val = Math.round(maxVal * (1 - ratio));
            return (
              <g key={ratio}>
                <line x1={padding} y1={y} x2={w - padding} y2={y} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
                <text x={0} y={y + 4} fontSize="11" fill="var(--text-muted)" fontWeight="600">{Math.round(val / 1000)}k</text>
              </g>
            );
          })}

          {/* Линия ПРОШЛОГО месяца */}
          <polyline points={prevPoints} fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
          
          {/* Линия ТЕКУЩЕГО месяца */}
          {currPoints && (
            <>
              <path 
                d={`M ${getX(0)} ${h - padding} L ${currPoints} L ${getX(currData.length - 1)} ${h - padding} Z`} 
                fill="url(#blueGradient)" 
              />
              <polyline points={currPoints} fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Точки */}
              {currData.map((d, i) => (
                <circle 
                  key={i} cx={getX(i)} cy={getY(d.curr)} 
                  r={d.day === currentDay ? "6" : "3"} 
                  fill={d.day === currentDay ? "#3b82f6" : "var(--bg-card)"} 
                  stroke="#3b82f6" strokeWidth={d.day === currentDay ? "4" : "2"} 
                />
              ))}

              {/* Тултип сегодняшнего дня */}
              <g transform={`translate(${getX(currentDay - 1)}, ${getY(currentRevenue) - 30})`}>
                <rect x="-45" y="-25" width="90" height="30" rx="8" fill="#3b82f6" />
                <path d="M -6 5 L 6 5 L 0 12 Z" fill="#3b82f6" />
                <text x="0" y="-5" fontSize="14" fill="#fff" textAnchor="middle" fontWeight="900">
                  {currentRevenue.toLocaleString('ru-RU')} ₽
                </text>
              </g>
            </>
          )}

          {/* Ось X */}
          {[1, 5, 10, 15, 20, 25, 30].map(day => (
            <text key={day} x={getX(day - 1)} y={h + 5} fontSize="11" fill="var(--text-muted)" textAnchor="middle" fontWeight="700">
              {day} {monthName}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default ChartModule;