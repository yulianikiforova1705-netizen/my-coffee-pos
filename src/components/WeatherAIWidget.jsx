import React, { useState, useEffect } from 'react';

// Этот компонент полностью независим. Он сам запрашивает настоящую погоду
// и выдает советы, не перегружая основную логику приложения.

const WeatherAIWidget = ({ allLowStock = [], baristaEfficiency = [], hourlyHeatmap = [] }) => {
  // 🏙️ Город для прогноза (можешь поменять на 'Санкт-Петербург', 'Лондон' и т.д.)
  const [city, setCity] = useState('Москва');
  
  // 🌤️ Состояние для реальной погоды из API
  const [weather, setWeather] = useState({ temp: '...', condition: '⏳', trend: 'Поиск спутника...' });
  const [tips, setTips] = useState([]);

  // 📡 Эффект для скачивания погоды из интернета
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 1. Ищем координаты по названию города
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru`);
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
          setWeather({ temp: '?', condition: '🌍', trend: `Город "${city}" не найден` });
          return;
        }
        
        const { latitude, longitude, name } = geoData.results[0];

        // 2. Скачиваем погоду по координатам
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherResponse.json();
        const current = weatherData.current_weather;

        let conditionIcon = '🌤️';
        let trendText = 'Отличная погода для кофе';

        // Расшифровываем коды погоды
        if (current.weathercode >= 51 && current.weathercode <= 67) {
          conditionIcon = '🌧️'; trendText = 'Дождь — спрос на выпечку +20%';
        } else if (current.weathercode >= 71) {
          conditionIcon = '❄️'; trendText = 'Снег — время горячего капучино';
        } else if (current.temperature > 25) {
          conditionIcon = '☀️'; trendText = 'Жара — предлагаем айс-латте!';
        }

        setWeather({
          temp: `${current.temperature > 0 ? '+' : ''}${Math.round(current.temperature)}°C`,
          condition: conditionIcon,
          trend: trendText
        });
      } catch (error) {
        console.error("Ошибка загрузки погоды:", error);
        setWeather({ temp: '+?°C', condition: '☁️', trend: 'Нет связи с метеостанцией' });
      }
    };

    fetchWeather();
    // Автообновление раз в час
    const weatherTimer = setInterval(fetchWeather, 3600000);
    return () => clearInterval(weatherTimer);
  }, [city]); // Перезапустит поиск, если ты изменишь город в коде

  // 🧠 Генерация умных советов
  useEffect(() => {
    const generatedTips = [];
    
    // Совет 1: Погода (теперь с реальными данными!)
    generatedTips.push({ 
      icon: weather.condition, 
      text: `🏙️ Погода в г. ${city}: ${weather.temp}. ${weather.trend}` 
    });
    
    // Совет 2: Склад
    if (allLowStock.length > 0) { 
      generatedTips.push({ icon: '📦', text: `Критичные остатки: ${allLowStock.map(i=>i.name).join(', ')}. Авто-закупка в панели Управляющего поможет быстро пополнить склад.` }); 
    } else { 
      generatedTips.push({ icon: '✅', text: `Склад в норме. Все ключевые ингредиенты в наличии.` }); 
    }
    
    // Совет 3: Команда
    if (baristaEfficiency.length > 1 && baristaEfficiency[0] && baristaEfficiency[0].avg > 0) { 
      const top = baristaEfficiency[0]; 
      const second = baristaEfficiency[1]; 
      if (top.avg - second.avg > 30) { 
        generatedTips.push({ icon: '👨‍🍳', text: `${top.name} продает лучше (${top.avg}₽ средний чек против ${second.avg}₽ у ${second.name}). Попросите ${second.name} активнее предлагать десерты!` }); 
      } else { 
        generatedTips.push({ icon: '🤝', text: `Команда работает отлично. Средний чек у бариста почти одинаковый.` }); 
      } 
    }
    
    // Совет 4: Загрузка
    if (hourlyHeatmap && hourlyHeatmap.length > 0) { 
      const peak = [...hourlyHeatmap].sort((a,b)=>b.count - a.count)[0]; 
      if (peak && peak.count > 0) { 
        generatedTips.push({ icon: '🔥', text: `Самый загруженный час: ${peak.hour}. Убедитесь, что в это время на смене работает опытный бариста.` }); 
      } 
    }

    setTips(generatedTips);
  }, [allLowStock, baristaEfficiency, hourlyHeatmap, weather, city]);

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)', marginBottom: '24px', border: '1px solid #3b82f6', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: '0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px', animation: 'float 3s infinite' }}>🤖</span> ИИ-Советник PRO
          <span style={{ fontSize: '10px', backgroundColor: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Beta</span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-main)', padding: '6px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)' }}>
          <span>{weather.condition}</span>
          <span style={{ color: '#3b82f6' }}>{weather.temp}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {tips.map((tip, idx) => (
          <div key={idx} style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '20px' }}>{tip.icon}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.4' }}>{tip.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAIWidget;