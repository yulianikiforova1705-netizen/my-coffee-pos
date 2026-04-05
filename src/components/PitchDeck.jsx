import React, { useState, useEffect } from 'react';

const PitchDeck = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'title',
      title: 'GOURMET COFFEE POS',
      subtitle: 'Экосистема нового поколения для управления кофейным бизнесом',
      content: <div style={{ fontSize: '72px', animation: 'float 3s ease-in-out infinite' }}>☕</div>,
      accent: '#3b82f6'
    },
    {
      id: 'problem',
      title: 'Проблема индустрии',
      subtitle: 'Почему кофейни теряют деньги?',
      content: (
        <ul className="pitch-list">
          <li>📉 <b>Разрозненные системы:</b> касса, склад и лояльность не связаны.</li>
          <li>🕰 <b>Отсутствие контроля:</b> реальная прибыль видна только в конце месяца.</li>
          <li>🐌 <b>Медленное обслуживание:</b> бариста тратит время на лишние клики.</li>
          <li>🚫 <b>«Слепые» продажи:</b> заказ позиций из стоп-листа ведет к негативу.</li>
        </ul>
      ),
      accent: '#ef4444'
    },
    {
      id: 'solution',
      title: 'Наше решение',
      subtitle: 'Единая цифровая кровеносная система',
      content: (
        <div className="glass-panel">
          <p>Мы объединяем владельца, баристу и гостя в одном облачном пространстве. Данные обновляются мгновенно, процессы автоматизированы, а интерфейс интуитивно понятен.</p>
          <div className="module-grid">
            <span className="badge badge-blue">Дашборд Владельца</span>
            <span className="badge badge-green">Умная касса Баристы</span>
            <span className="badge badge-orange">KDS (Экран кухни)</span>
            <span className="badge badge-purple">PWA-приложение гостя</span>
          </div>
        </div>
      ),
      accent: '#10b981'
    },
    {
      id: 'owner',
      title: 'Инструмент Владельца',
      subtitle: 'Бизнес как на ладони',
      content: (
        <ul className="pitch-list">
          <li>📊 <b>P&L Аналитика:</b> Авторасчет грязной выручки, фуд-коста (COGS) и чистой прибыли.</li>
          <li>🎯 <b>ABC-анализ:</b> Наглядное отображение самых маржинальных позиций.</li>
          <li>🏆 <b>Рейтинг точек:</b> Сводка по сети для мотивации и контроля.</li>
        </ul>
      ),
      accent: '#f59e0b'
    },
    {
      id: 'barista',
      title: 'Рабочее место Баристы',
      subtitle: 'Скорость и защита от ошибок',
      content: (
        <ul className="pitch-list">
          <li>⚡️ <b>Оформление заказа</b> за 3 клика с удобным визуальным меню.</li>
          <li>🔒 <b>Умный стоп-лист:</b> Автоматическая блокировка продаж при нулевых остатках.</li>
          <li>🤝 <b>Быстрый поиск гостей</b> по номеру телефона для начисления баллов.</li>
        </ul>
      ),
      accent: '#10b981'
    },
    {
      id: 'guest',
      title: 'Опыт Гостя',
      subtitle: 'Лояльность без пластиковых карт',
      content: (
        <ul className="pitch-list">
          <li>📱 <b>PWA-приложение:</b> Карта лояльности и любимые напитки в смартфоне гостя.</li>
          <li>💎 <b>Динамические статусы:</b> Бронза, Серебро, Золото с растущим кэшбэком.</li>
          <li>🤳 <b>Интерактивное QR-меню:</b> Синхронизация стоп-листа в реальном времени.</li>
        </ul>
      ),
      accent: '#8b5cf6'
    },
    {
      id: 'tech',
      title: 'Под капотом',
      subtitle: 'Современный технологический стек',
      content: (
        <div className="glass-panel">
          <p>Архитектура разделена на логические независимые модули для легкого масштабирования.</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
            <span className="tech-tag">React.js</span>
            <span className="tech-tag">SPA</span>
            <span className="tech-tag">Glassmorphism</span>
            <span className="tech-tag">LocalStorage</span>
            <span className="tech-tag">ES6+</span>
          </div>
        </div>
      ),
      accent: '#0ea5e9'
    },
    {
      id: 'business-model',
      title: 'Бизнес-модель',
      subtitle: 'Прозрачная и масштабируемая монетизация',
      content: (
        <ul className="pitch-list">
          <li>🔁 <b>B2B SaaS Подписка:</b> Ежемесячная плата за базовый доступ (Касса + Дашборд Владельца).</li>
          <li>🌟 <b>Premium Модули:</b> Дополнительная монетизация за PWA-приложение гостя и QR-меню.</li>
          <li>📈 <b>Масштабирование:</b> Снижение стоимости привлечения клиента (CAC) за счет рекомендаций внутри комьюнити кофеен.</li>
        </ul>
      ),
      accent: '#ec4899'
    },
    {
      id: 'competition',
      title: 'Наши преимущества',
      subtitle: 'Ответ неповоротливым корпорациям',
      content: (
        <ul className="pitch-list">
          <li>🚀 <b>Легкость (Cloud-native):</b> Никаких локальных серверов, работает прямо в браузере любого планшета.</li>
          <li>🎁 <b>Гость «из коробки»:</b> Программа лояльности уже встроена в ядро, а не продается как дорогой аддон.</li>
          <li>🎯 <b>Узкий фокус:</b> Мы не делаем софт для огромных ресторанов, мы идеальны для specialty-кофеен и to-go формата.</li>
        </ul>
      ),
      accent: '#06b6d4'
    },
    {
      id: 'ask',
      title: 'Roadmap & Инвестиции',
      subtitle: 'Текущий статус и следующие шаги',
      content: (
        <div className="glass-panel" style={{ borderColor: 'rgba(234, 179, 8, 0.4)' }}>
          <p style={{ margin: '0 0 20px 0' }}>✅ <b>MVP готов:</b> Ядро кассы, складской учет, P&L аналитика и PWA-модули успешно протестированы.</p>
          <p style={{ margin: '0 0 10px 0', color: '#eab308', fontWeight: 'bold' }}>Цель раунда:</p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '18px' }}>
            <li>Перенос архитектуры на облачные БД (Firebase/Supabase).</li>
            <li>Интеграция с фискальными регистраторами и эквайрингом.</li>
            <li>Маркетинг для привлечения первых 50 B2B-клиентов.</li>
          </ul>
        </div>
      ),
      accent: '#eab308'
    },
    {
      id: 'cta',
      title: 'Готовы к запуску',
      subtitle: 'Gourmet Coffee POS',
      content: (
        <div style={{ textAlign: 'center' }}>
          <button className="demo-btn" onClick={onClose}>
            Посмотреть демо продукта ➝
          </button>
        </div>
      ),
      accent: '#3b82f6'
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="pitch-deck-container" onClick={nextSlide}>
      <style>{`
        .pitch-deck-container {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif;
          z-index: 99999; display: flex; flex-direction: column; justify-content: center; align-items: center;
          overflow: hidden; cursor: pointer; user-select: none;
        }

        .pitch-orb {
          position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.4; z-index: 0;
          transition: all 1s ease-in-out;
        }

        .slide-content-wrapper {
          position: relative; z-index: 10; max-width: 900px; width: 90%;
          animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .pitch-title {
          font-size: 56px; font-weight: 900; margin: 0 0 16px 0; letter-spacing: -1px;
          background: linear-gradient(to right, #ffffff, #94a3b8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .pitch-subtitle {
          font-size: 24px; color: var(--accent); font-weight: 700; margin: 0 0 40px 0;
          text-transform: uppercase; letter-spacing: 2px;
        }

        .pitch-list {
          list-style: none; padding: 0; margin: 0; font-size: 22px; line-height: 1.8; color: #cbd5e1;
        }
        .pitch-list li { margin-bottom: 20px; display: flex; gap: 15px; align-items: flex-start; }
        .pitch-list b { color: #fff; }

        .glass-panel {
          background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px;
          padding: 40px; font-size: 22px; line-height: 1.6; color: #e2e8f0;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .module-grid { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 30px; }
        .badge { padding: 10px 20px; border-radius: 12px; font-size: 16px; font-weight: 700; }
        .badge-blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
        .badge-green { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
        .badge-orange { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
        .badge-purple { background: rgba(139, 92, 246, 0.2); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.4); }

        .tech-tag {
          background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 8px;
          font-family: monospace; font-size: 16px; color: #fff;
        }

        .demo-btn {
          background: var(--accent); color: #fff; border: none; padding: 20px 40px;
          border-radius: 100px; font-size: 24px; font-weight: 900; cursor: pointer;
          transition: all 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .demo-btn:hover { transform: scale(1.05); }

        .pitch-progress {
          position: absolute; bottom: 40px; display: flex; gap: 12px; z-index: 20;
        }
        .progress-dot {
          width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.2);
          transition: all 0.3s; cursor: pointer;
        }
        .progress-dot.active { background: var(--accent); transform: scale(1.5); }

        .slide-counter { position: absolute; top: 40px; right: 40px; font-family: monospace; font-size: 18px; color: rgba(255,255,255,0.3); z-index: 20; }
        .close-btn { position: absolute; top: 40px; left: 40px; background: transparent; border: none; color: rgba(255,255,255,0.5); font-size: 20px; cursor: pointer; z-index: 20; transition: 0.3s; }
        .close-btn:hover { color: #fff; }

        @keyframes slideUpFade { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
      `}</style>

      {/* Динамические светящиеся сферы на фоне */}
      <div className="pitch-orb" style={{ background: slide.accent, width: '600px', height: '600px', top: '-10%', right: '-10%' }} />
      <div className="pitch-orb" style={{ background: '#1e293b', width: '500px', height: '500px', bottom: '-20%', left: '-10%' }} />

      {onClose && <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕ Закрыть</button>}
      <div className="slide-counter">{currentSlide + 1} / {slides.length}</div>

      <div className="slide-content-wrapper" key={slide.id} style={{ '--accent': slide.accent }}>
        {slide.title && <h1 className="pitch-title">{slide.title}</h1>}
        {slide.subtitle && <h2 className="pitch-subtitle">{slide.subtitle}</h2>}
        <div className="pitch-content">{slide.content}</div>
      </div>

      <div className="pitch-progress">
        {slides.map((_, idx) => (
          <div 
            key={idx} 
            className={`progress-dot ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundColor: idx === currentSlide ? slide.accent : '' }}
            onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
          />
        ))}
      </div>
    </div>
  );
};

export default PitchDeck;