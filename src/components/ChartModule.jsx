import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const ChartModule = ({ currentRevenue = 0, hourlyHeatmap = [], categoryStats, catColors }) => {
  // === 1. ЛОГИКА ДЛЯ SVG-ГРАФИКА (ДИНАМИКА ВЫРУЧКИ) ===
  const [data, setData] = useState([]);
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [monthName, setMonthName] = useState('');

  useEffect(() => {
    const today = new Date();
    const day = today.getDate(); 
    const monthStr = today.toLocaleString('ru-RU', { month: 'short' }).replace('.', '');
    
    setMonthName(monthStr);
    setCurrentDay(day);

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
          currVal = currentRevenue;
        }
        points.push({ day: i, prev: Math.round(prev), curr: currVal !== null ? Math.round(currVal) : null });
      }
      return points;
    };
    setData(generateData());
  }, [currentRevenue]);

  const chartData = data;
  if (chartData.length === 0) return null;

  const yesterdayData = chartData.find(d => d.day === currentDay - 1);
  const yesterdayRev = yesterdayData && yesterdayData.curr ? yesterdayData.curr : 25000;
  const trendPercent = yesterdayRev > 0 ? ((currentRevenue - yesterdayRev) / yesterdayRev) * 100 : 0;
  const isPositive = trendPercent >= 0;

  const maxVal = Math.max(
    ...chartData.map(d => d.prev),
    ...chartData.filter(d => d.curr !== null).map(d => d.curr),
    35000 
  ) * 1.2;

  const w = 800; 
  const h = 250; 
  const padding = 20;

  const getX = (index) => padding + (index / 29) * (w - padding * 2);
  const getY = (val) => h - padding - (val / maxVal) * (h - padding * 2);

  const prevPoints = chartData.map((d, i) => `${getX(i)},${getY(d.prev)}`).join(' ');
  const currData = chartData.filter(d => d.curr !== null);
  const currPoints = currData.map((d, i) => `${getX(i)},${getY(d.curr)}`).join(' ');


  // === 2. ЛОГИКА ДЛЯ БИЗНЕС-АНАЛИТИКИ (RECHARTS) ===
  const barData = hourlyHeatmap && hourlyHeatmap.length > 0 
    ? hourlyHeatmap 
    : Array.from({ length: 15 }, (_, i) => ({ hour: `${(i + 8).toString().padStart(2, '0')}:00`, count: 0 }));

  const pieData = Object.keys(categoryStats?.stats || {}).map(key => ({
    name: key,
    value: categoryStats.stats[key]
  })).filter(item => item.value > 0);

  const cardStyle = {
    backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', 
    boxShadow: '0 4px 6px -1px var(--shadow-color)', border: '1px solid var(--border-color)',
    display: 'flex', flexDirection: 'column'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
      
      {/* --- ГЛАВНЫЙ ГРАФИК SVG --- */}
      <div style={{ ...cardStyle, paddingBottom: '12px' }}>
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
          
          <div style={{ textAlign: 'right', backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '8px 16px', borderRadius: '12px', border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: isPositive ? '#10b981' : '#ef4444' }}>
              {isPositive ? '+' : ''}{trendPercent.toFixed(1)}%
            </div>
            <div style={{ fontSize: '12px', color: isPositive ? '#047857' : '#b91c1c', fontWeight: '600' }}>
              {isPositive ? 'рост к вчера' : 'падение к вчера'}
            </div>
          </div>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }} className="hide-scroll">
          <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', minWidth: '700px', height: 'auto', display: 'block', overflow: 'visible' }}>
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

            <polyline points={prevPoints} fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
            
            {currPoints && (
              <>
                <polyline points={currPoints} fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {currData.map((d, i) => (
                  <circle key={i} cx={getX(i)} cy={getY(d.curr)} r={d.day === currentDay ? "6" : "3"} fill={d.day === currentDay ? "#3b82f6" : "var(--bg-card)"} stroke="#3b82f6" strokeWidth={d.day === currentDay ? "4" : "2"} />
                ))}
                <g transform={`translate(${getX(currentDay - 1)}, ${getY(currentRevenue) - 24})`}>
                  <rect x="-40" y="-22" width="80" height="28" rx="6" fill="#3b82f6" />
                  <polygon points="-6,6 6,6 0,12" fill="#3b82f6" /> 
                  <text x="0" y="-3" fontSize="13" fill="#fff" textAnchor="middle" fontWeight="bold">
                    {currentRevenue.toLocaleString('ru-RU')} ₽
                  </text>
                </g>
              </>
            )}

            <g transform={`translate(0, ${h})`}>
              {[1, 5, 10, 15, 20, 25, 30].map(day => (
                <text key={day} x={getX(day - 1)} y="5" fontSize="11" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">
                  {day} {monthName}
                </text>
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* --- БИЗНЕС-АНАЛИТИКА RECHARTS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        <div style={{ ...cardStyle, height: '350px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🕒</span> Загруженность по часам (заказы)
          </h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'var(--border-color)', opacity: 0.4 }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '12px' }} itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }} formatter={(value) => [value, 'Заказов']} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ ...cardStyle, height: '350px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🍩</span> Доли категорий
          </h3>
          <div style={{ flex: 1, width: '100%' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" animationDuration={1500}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={catColors?.[entry.name] || '#cbd5e1'} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '12px' }} itemStyle={{ fontWeight: 'bold' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', color: 'var(--text-main)', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                Нет данных для графика. Пробейте первый чек!
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ChartModule;