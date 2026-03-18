import React, { useState, useEffect } from 'react';

const PWAModule = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Слушаем специальное событие браузера, которое говорит "Меня можно установить!"
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Останавливаем стандартный скучный показ от браузера
      setDeferredPrompt(e); // Сохраняем событие на потом
      setIsInstallable(true); // Показываем наш красивый баннер
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Показываем системное окно установки
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Пользователь установил приложение!');
        setIsInstallable(false); // Прячем баннер после установки
      }
      setDeferredPrompt(null);
    }
  };

  // Если приложение уже установлено или браузер пока не разрешает - ничего не показываем
  if (!isInstallable) return null;

  return (
    <div style={{ 
      backgroundColor: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', 
      background: '#8b5cf6',
      color: 'white', 
      padding: '16px 24px', 
      borderRadius: '16px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '24px', 
      boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '32px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}>📱</div>
        <div>
          <div style={{ fontWeight: '900', fontSize: '18px', marginBottom: '4px' }}>Установите наше приложение</div>
          <div style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.4' }}>Добавьте GOURMET COFFEE на главный экран для быстрого доступа. Без скачивания из сторов!</div>
        </div>
      </div>
      <button 
        onClick={handleInstallClick} 
        style={{ backgroundColor: 'white', color: '#8b5cf6', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '900', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        УСТАНОВИТЬ
      </button>
    </div>
  );
};

export default PWAModule;