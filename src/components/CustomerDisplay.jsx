import React, { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.js'; 
import { QRCodeSVG } from 'qrcode.react'; 
import Confetti from 'react-confetti';

export const CustomerDisplay = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false); 
  const prevCartRef = useRef(0); 

  const tipsUrl = "https://cloudtips.ru/"; 

  const fontFamily = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const colors = {
    bgMain: '#0f172a', 
    bgCard: '#1e293b', 
    accent: '#3b82f6', 
    border: '#334155', 
    textMain: '#ffffff', 
    textMuted: '#94a3b8', 
    qrcodeBg: '#ffffff', 
  };

  const animationStyles = `
    @keyframes fadeInSlideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes newItemSlide {
      0% { opacity: 0; transform: translateX(-30px); max-height: 0px; padding-bottom: 0px; margin-bottom: 0px; }
      100% { opacity: 1; transform: translateX(0); max-height: 100px; padding-bottom: 1.25rem; margin-bottom: 0px; }
    }
    
    @keyframes crossFade {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    .animate-card { animation: fadeInSlideIn 0.8s ease-out forwards; }
    .animate-list-item { animation: newItemSlide 0.5s ease-out forwards; }
    .animate-right-panel { animation: crossFade 0.6s ease-in-out forwards; }

    /* 🚀 МАГИЯ АДАПТИВНОСТИ ДЛЯ МОБИЛЬНЫХ ЭКРАНОВ */
    .cd-container {
      display: flex;
      flex-direction: row;
      height: 100vh;
      width: 100%;
      background-color: ${colors.bgMain};
      color: ${colors.textMain};
      font-family: ${fontFamily};
      padding: 2rem;
      box-sizing: border-box;
      gap: 2rem;
      overflow: hidden;
    }

    .cd-left-panel {
      width: 60%;
    }

    .cd-right-panel {
      width: 40%;
    }

    @media (max-width: 768px) {
      .cd-container {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        height: auto;
        min-height: 100vh;
        overflow-y: auto;
      }
      .cd-left-panel, .cd-right-panel {
        width: 100% !important;
        height: auto;
        min-height: 45vh;
      }
      /* На мобильных делаем шрифты чуть компактнее */
      .cd-left-panel h2 { font-size: 1.5rem !important; margin-bottom: 1.5rem !important; }
      .cd-list-item { font-size: 1.2rem !important; }
      .cd-total { font-size: 2rem !important; }
      .cd-right-panel h3 { font-size: 1.5rem !important; }
      .cd-right-panel p { font-size: 1.1rem !important; }
    }
  `;

  useEffect(() => {
    const displayRef = doc(db, 'live_display', 'current_order');
    
    const unsubscribe = onSnapshot(displayRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const newCart = data.cart || [];
        
        setCartItems(newCart);
        setTotal(data.total || 0);

        if (prevCartRef.current > 0 && newCart.length === 0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
        
        prevCartRef.current = newCart.length;
      }
    });

    return () => unsubscribe();
  }, []);

  const cardStyle = {
    backgroundColor: colors.bgCard,
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${colors.border}`,
    opacity: 0, 
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  };

  return (
    <div className="cd-container">
      
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, pointerEvents: 'none' }}>
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight} 
            recycle={false}
            numberOfPieces={400} 
          />
        </div>
      )}

      <style>{animationStyles}</style>

      <div className="animate-card cd-left-panel" style={{ ...cardStyle, justifyContent: 'space-between', animationDelay: '0.2s', zIndex: 1 }}>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2.5rem', marginTop: 0, color: colors.accent, letterSpacing: '-0.5px' }}>Ваш заказ:</h2>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', overflowX: 'hidden', flexGrow: 1 }}>
            {cartItems.map((item, index) => (
              <li 
                key={`${item.id}-${index}`} 
                className="animate-list-item cd-list-item" 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.6rem', borderBottom: `1px dashed ${colors.border}`, boxSizing: 'border-box' }}
              >
                <span style={{ fontWeight: '600' }}>
                  {item.name} 
                  <span style={{ color: colors.textMuted, fontSize: '0.8em', marginLeft: '0.75rem', fontWeight: 'normal' }}>{item.volume || ''}</span>
                </span>
                <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{item.price.toLocaleString('ru-RU')} ₽</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: `2px solid ${colors.border}` }}>
          <div className="cd-total" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '3rem', fontWeight: '900' }}>
            <span style={{ color: colors.textMuted }}>Итого:</span>
            <span style={{ color: colors.accent, transition: 'all 0.3s ease' }}>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>

      <div className="animate-card cd-right-panel" style={{ ...cardStyle, alignItems: 'center', justifyContent: 'center', textAlign: 'center', animationDelay: '0.4s', zIndex: 1 }}>
         <div key={cartItems.length > 0 ? 'tips' : 'promo'} className="animate-right-panel" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
           {cartItems.length > 0 ? (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
               <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', marginTop: 0, color: colors.accent }}>Оставить чаевые баристе</h3>
               <div style={{ width: 'min(18rem, 60vw)', height: 'min(18rem, 60vw)', backgroundColor: colors.qrcodeBg, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.bgMain, fontWeight: 'bold', border: `8px solid ${colors.qrcodeBg}`, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
                 
                 <QRCodeSVG 
                    value={tipsUrl} 
                    size={200} 
                    style={{ width: '90%', height: '90%' }}
                    bgColor={colors.qrcodeBg} 
                    fgColor={colors.bgMain} 
                    level="H" 
                 />

               </div>
               <p style={{ color: colors.textMuted, fontSize: '1.3rem', margin: 0, maxWidth: '80%' }}>Наведите камеру телефона, чтобы поблагодарить баристу.</p>
             </div>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
               <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                 {showConfetti ? '🎉' : '🎁'}
               </div>
               <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', marginTop: 0, color: colors.accent }}>
                 {showConfetti ? 'Спасибо за заказ!' : 'Кэшбэк 10% с каждого кофе!'}
               </h3>
               <p style={{ color: colors.textMuted, fontSize: '1.4rem', margin: 0, maxWidth: '85%', lineHeight: '1.5' }}>
                 {showConfetti ? 'Ждем вас снова в нашей кофейне.' : 'Скачайте наше приложение и получайте баллы за каждую покупку.'}
               </p>
             </div>
           )}
         </div>
      </div>

    </div>
  );
};