import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
// Убедись, что путь до firebase.js правильный (если файл в той же папке, то './firebase.js')
import { db } from './firebase.js'; 

export const CustomerDisplay = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Кастомный шрифт, если твоя платформа использует другой, мы можем поменять
  const fontFamily = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  // Цвета твоей платформы
  const colors = {
    bgMain: '#0f172a', // Очень темный синий (основной фон)
    bgCard: '#1e293b', // Темно-синий (фон правой части)
    accent: '#3b82f6', // Синий акцент (как кнопки на кассе)
    border: '#334155', // Цвет линий
    textMain: '#ffffff', // Основной текст
    textMuted: '#94a3b8', // Приглушенный текст (объем)
    qrcodeBg: '#ffffff', // Фон QR кода
  };

  useEffect(() => {
    const displayRef = doc(db, 'live_display', 'current_order');
    
    const unsubscribe = onSnapshot(displayRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCartItems(data.cart || []);
        setTotal(data.total || 0);
      }
    });

    return () => unsubscribe();
  }, []);

  // Базовый стиль для карточки-контейнера
  const cardStyle = {
    backgroundColor: colors.bgCard,
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${colors.border}`,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: colors.bgMain, color: colors.textMain, fontFamily: fontFamily, padding: '2rem', boxSizing: 'border-box', gap: '2rem' }}>
      
      {/* ЛЕВАЯ ЧАСТЬ: Состав заказа в виде стильной карточки */}
      <div style={{ ...cardStyle, width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2.5rem', marginTop: 0, color: colors.accent, letterSpacing: '-0.5px' }}>Ваш заказ:</h2>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
            {cartItems.map((item, index) => (
              <li key={`${item.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.6rem', paddingBottom: '1.25rem', borderBottom: `1px dashed ${colors.border}` }}>
                <span style={{ fontWeight: '600' }}>
                  {item.name} 
                  <span style={{ color: colors.textMuted, fontSize: '1.2rem', marginLeft: '0.75rem', fontWeight: 'normal' }}>{item.volume || ''}</span>
                </span>
                <span style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>{item.price.toLocaleString('ru-RU')} ₽</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Итоговая сумма (переделана под синий акцент платформы) */}
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: `2px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '3rem', fontWeight: '900' }}>
            <span style={{ color: colors.textMuted }}>Итого:</span>
            <span style={{ color: colors.accent }}>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Маркетинг и чаевые */}
      <div style={{ ...cardStyle, width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
         {cartItems.length > 0 ? (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
             <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', marginTop: 0, color: colors.accent }}>Оставить чаевые баристе</h3>
             <div style={{ width: '18rem', height: '18rem', backgroundColor: colors.qrcodeBg, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.bgMain, fontWeight: 'bold', border: `8px solid ${colors.qrcodeBg}`, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
               {/* Мы сюда потом вставим реальный QR код */}
               <div style={{ fontSize: '1.2rem', padding: '1rem', border: `3px dashed ${colors.bgMain}`, borderRadius: '12px' }}>[ QR CODE ]</div>
             </div>
             <p style={{ color: colors.textMuted, fontSize: '1.3rem', margin: 0, maxWidth: '80%' }}>Наведите камеру телефона, чтобы поблагодарить баристу.</p>
           </div>
         ) : (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎁</div>
             <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', marginTop: 0, color: colors.accent }}>Кэшбэк 10% с каждого кофе!</h3>
             <p style={{ color: colors.textMuted, fontSize: '1.4rem', margin: 0, maxWidth: '85%', lineHeight: '1.5' }}>Скачайте наше приложение и получайте баллы за каждую покупку.</p>
           </div>
         )}
      </div>

    </div>
  );
};