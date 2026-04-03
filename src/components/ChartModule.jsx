import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const ChartModule = ({ hourlyHeatmap, categoryStats, catColors }) => {
  // Подготавливаем данные для кольцевой диаграммы (убираем категории с 0 продаж)
  const pieData = Object.keys(categoryStats?.stats || {}).map(key => ({
    name: key,
    value: categoryStats.stats[key]
  })).filter(item => item.value > 0);

  // Данные для столбчатой диаграммы (часы)
  const barData = hourlyHeatmap || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>

      {/* 📊 График 1: Загруженность по часам */}
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px var(--shadow-color)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-main)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🕒</span> Загруженность по часам (заказы)
        </h3>
        <div style={{ height: '250px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'var(--border-color)', opacity: 0.4 }}
                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                formatter={(value) => [value, 'Заказов']}
                labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🍩 График 2: Выручка по категориям */}
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px var(--shadow-color)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-main)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🍩</span> Выручка по категориям
        </h3>
        <div style={{ height: '250px', width: '100%' }}>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={catColors?.[entry.name] || '#cbd5e1'} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '13px', color: 'var(--text-main)', paddingTop: '10px' }}
                />
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
  );
};

export default ChartModule;