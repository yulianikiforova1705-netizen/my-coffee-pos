import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';

const ChartModule = ({ hourlyHeatmap = [], categoryStats, catColors }) => {
  
  // 🚀 ГЕНЕРИРУЕМ ПОЛНЫЙ ДЕНЬ (чтобы график не был пустым после Z-отчета)
  const fullDayData = Array.from({ length: 15 }, (_, i) => {
    const hour = (i + 8).toString().padStart(2, '0') + ':00';
    const existingEntry = hourlyHeatmap.find(d => d.hour === hour);
    return {
      hour: hour,
      count: existingEntry ? (existingEntry.count || 0) : 0,
      revenue: existingEntry ? (existingEntry.revenue || 0) : 0
    };
  });

  const pieData = Object.keys(categoryStats?.stats || {}).map(key => ({
    name: key,
    value: categoryStats.stats[key]
  })).filter(item => item.value > 0);

  // Стили для карточек графиков
  const cardStyle = {
    backgroundColor: 'var(--bg-card)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 4px 6px -1px var(--shadow-color)',
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyle = {
    marginTop: 0,
    marginBottom: '20px',
    color: 'var(--text-main)',
    fontSize: '15px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
      
      {/* 🚀 ГЛАВНЫЙ ГРАФИК: ВЫРУЧКА LIVE */}
      <div style={{ ...cardStyle, height: '350px' }}>
        <h3 style={titleStyle}>
          <span style={{ color: '#10b981' }}>📈</span> Динамика выручки (Live)
        </h3>
        <div style={{ flex: 1, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fullDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} unit="₽" />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }}
                formatter={(value) => [`${value} ₽`, 'Выручка']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* 📊 ГРАФИК: ЗАГРУЗКА В ЗАКАЗАХ */}
        <div style={{ ...cardStyle, height: '300px' }}>
          <h3 style={titleStyle}>
            <span style={{ color: '#3b82f6' }}>🕒</span> Загруженность (заказы)
          </h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fullDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'var(--border-color)', opacity: 0.2 }}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🍩 ГРАФИК: КАТЕГОРИИ */}
        <div style={{ ...cardStyle, height: '300px' }}>
          <h3 style={titleStyle}>
            <span style={{ color: '#f59e0b' }}>🍩</span> Доли категорий
          </h3>
          <div style={{ flex: 1, width: '100%' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={catColors?.[entry.name] || '#3b82f6'} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} ₽`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                Пока нет продаж.<br/>Диаграмма появится после первого чека.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChartModule;