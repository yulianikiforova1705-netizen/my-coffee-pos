import React from 'react';

// === ЭКРАН ГОСТЯ ===
export const CustomerDisplayModal = ({
  showCustomerDisplay, showConfetti, checkoutStep, setCheckoutStep,
  cart = [], isHappyHour, finalCharge, handlePaymentSuccess, closeCustomerDisplay,
  ratingSubmitted, loggedInBarista, hoveredStar, setHoveredStar, handleRatingSubmit,
  selectedRating, showFeedbackReasons, feedbackSubmitted, handleFeedbackReasonSubmit
}) => {
  if (!showCustomerDisplay) return null;

  const feedbackReasons = [
    { icon: '🧊', text: 'Холодный кофе' },
    { icon: '🐌', text: 'Долгое ожидание' },
    { icon: '😠', text: 'Невкусно' },
    { icon: '🧹', text: 'Грязно в зале' },
    { icon: '😒', text: 'Грубый бариста' },
    { icon: '🤷', text: 'Другое' }
  ];

  // 🚀 ГЕНЕРАЦИЯ ССЫЛКИ ДЛЯ QR-КОДА СБП
  const sbpPaymentUrl = `https://qr.nspk.ru/test?amount=${finalCharge}`; 
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(sbpPaymentUrl)}&margin=10`;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.98)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s ease', overflow: 'hidden' }}>
      
      {showConfetti && Array.from({ length: 50 }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${Math.random() * 100}%`, top: `-10%`, fontSize: `${Math.random() * 20 + 20}px`, animation: `confettiFall ${Math.random() * 3 + 2}s ease-in forwards`, zIndex: 10000 }}>
          {['🎉', '✨', '💖', '☕', '🌟', '🧁', '🍰'][Math.floor(Math.random() * 7)]}
        </div>
      ))}

      <div style={{ backgroundColor: '#1e293b', width: '95%', maxWidth: '900px', borderRadius: '32px', padding: '50px', display: 'flex', gap: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)', animation: 'scaleIn 0.3s ease', border: '1px solid #334155' }}>
        
        {/* ЧЕК */}
        {checkoutStep === 'summary' && (
          <>
            <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', borderRight: '2px dashed #334155', paddingRight: '40px' }}>
              <h2 style={{ color: '#f8fafc', fontSize: '32px', margin: '0 0 32px 0' }}>Ваш заказ</h2>
              <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', color: '#cbd5e1' }}>
                    <span>{item.name}</span>
                    <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>
                      {isHappyHour && (item.category === 'Десерты' || item.category === 'Еда' || item.isDessert) ? Math.round(item.price * 0.7) : item.price} ₽
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontSize: '24px' }}>Итого:</span>
                  <span style={{ color: '#10b981', fontSize: '48px', fontWeight: '900' }}>{finalCharge} ₽</span>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h3 style={{ color: '#f8fafc', margin: '0 0 24px 0', fontSize: '26px' }}>Оплата</h3>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button onClick={handlePaymentSuccess} style={{ padding: '24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '16px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>💳 Карта</button>
                <button onClick={() => setCheckoutStep('qr')} style={{ padding: '24px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '16px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>📱 СБП (QR)</button>
                <button onClick={handlePaymentSuccess} style={{ padding: '24px', backgroundColor: 'transparent', color: '#10b981', border: '2px solid #10b981', borderRadius: '16px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>💵 Наличные</button>
              </div>
              <button onClick={closeCustomerDisplay} style={{ marginTop: '32px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>Отмена</button>
            </div>
          </>
        )}

        {/* 🚀 ИСТИННЫЙ QR-КОД */}
        {checkoutStep === 'qr' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: '#f8fafc', margin: '0 0 40px 0', fontSize: '32px' }}>Отсканируйте для оплаты</h2>
            
            <div style={{ position: 'relative', padding: '20px', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 0 60px rgba(139, 92, 246, 0.5)' }}>
              
              <img 
                src={qrCodeImageUrl} 
                alt="QR Код для СБП" 
                width="280" 
                height="280" 
                style={{ borderRadius: '16px', display: 'block' }}
              />

              <div className="qr-laser" style={{ height: '4px', backgroundColor: '#ef4444', position: 'absolute', top: '10%', left: '10%', width: '80%', zIndex: 10 }}></div>
            </div>
            
            <div style={{ color: '#10b981', marginTop: '40px', fontSize: '48px', fontWeight: '900' }}>{finalCharge} ₽</div>
            <div style={{ marginTop: '40px', display: 'flex', gap: '20px', width: '100%', maxWidth: '500px' }}>
              <button onClick={() => setCheckoutStep('summary')} style={{ flex: 1, padding: '20px', backgroundColor: 'transparent', color: '#ef4444', border: '2px solid #ef4444', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Назад</button>
              <button onClick={handlePaymentSuccess} style={{ flex: 2, padding: '20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '16px', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.5)' }}>✅ Оплата прошла</button>
            </div>
          </div>
        )}

        {/* ОЦЕНКА И ПРИЧИНЫ */}
        {checkoutStep === 'rating' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* ШАГ 1: Ждем оценку */}
            {!ratingSubmitted && (
              <>
                <div style={{ fontSize: '100px', marginBottom: '32px' }}>☕</div>
                <h2 style={{ color: '#f8fafc', margin: '0 0 24px 0', fontSize: '36px', textAlign: 'center', maxWidth: '600px' }}>
                  Как вам работа бариста {loggedInBarista}?
                </h2>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '50px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div 
                      key={star}
                      className="star-btn"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => handleRatingSubmit(star)}
                      style={{ fontSize: '80px', color: (hoveredStar >= star) ? '#f59e0b' : '#334155', cursor: 'pointer', transition: 'transform 0.2s, color 0.2s' }}
                    >
                      ★
                    </div>
                  ))}
                </div>
                <button onClick={closeCustomerDisplay} style={{ padding: '16px 32px', backgroundColor: '#334155', color: '#94a3b8', border: 'none', borderRadius: '12px', fontSize: '20px', cursor: 'pointer' }}>Пропустить</button>
              </>
            )}

            {/* ШАГ 2: Хорошая оценка (4-5 звезд) */}
            {ratingSubmitted && selectedRating > 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
                <div style={{ fontSize: '80px', marginBottom: '0' }}>🤩</div>
                <h2 style={{ color: '#f8fafc', margin: '0', fontSize: '32px', textAlign: 'center' }}>
                  Прекрасно! Ваша оценка сохранена.
                </h2>

                {/* 🚀 БОНУС ДЛЯ 5 ЗВЕЗД: QR-КОД ЯНДЕКС КАРТ */}
                {selectedRating === 5 && (
                  <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '12px', boxShadow: '0 0 40px rgba(255, 204, 0, 0.3)', maxWidth: '450px', animation: 'scaleIn 0.5s ease' }}>
                    <div style={{ color: '#111827', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.4' }}>
                      🎁 Оставьте отзыв на Яндекс.Картах и получите капучино в подарок при следующем визите!
                    </div>
                    
                    <div style={{ position: 'relative', width: '160px', height: '160px', padding: '10px', border: '2px dashed #cbd5e1', borderRadius: '16px' }}>
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://yandex.ru/maps/&margin=5" 
                        alt="Яндекс Карты" 
                        width="100%" 
                        height="100%" 
                        style={{ borderRadius: '8px' }}
                      />
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '900', color: '#ef4444', border: '2px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Я</div>
                    </div>
                  </div>
                )}

                {selectedRating === 4 && (
                  <p style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>Желаем вам отличного дня!</p>
                )}

                <button 
                  onClick={closeCustomerDisplay} 
                  style={{ padding: '20px 60px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '20px', fontSize: '24px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5)', marginTop: '24px', animation: 'pulse 2s infinite' }}
                >
                  НОВЫЙ ЗАКАЗ ☕
                </button>
              </div>
            )}

            {/* ШАГ 3: Плохая оценка (1-3 звезды) - Спрашиваем причину */}
            {ratingSubmitted && selectedRating <= 3 && showFeedbackReasons && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'scaleIn 0.3s ease', width: '100%' }}>
                <div style={{ fontSize: '80px', marginBottom: '16px' }}>🤔</div>
                <h2 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '32px', textAlign: 'center' }}>
                  Нам жаль, что вы поставили {selectedRating} ⭐
                </h2>
                <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '18px' }}>Пожалуйста, подскажите, что пошло не так?</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
                  {feedbackReasons.map((reason, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleFeedbackReasonSubmit(reason.text)}
                      style={{ padding: '20px', backgroundColor: '#334155', color: '#f8fafc', border: '1px solid #475569', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.2s' }}
                    >
                      <span style={{ fontSize: '24px' }}>{reason.icon}</span> {reason.text}
                    </button>
                  ))}
                </div>
                <button onClick={closeCustomerDisplay} style={{ padding: '16px 32px', backgroundColor: 'transparent', color: '#64748b', border: 'none', fontSize: '18px', cursor: 'pointer', textDecoration: 'underline' }}>Не хочу отвечать</button>
              </div>
            )}

            {/* ШАГ 4: Гость выбрал причину - благодарим */}
            {ratingSubmitted && selectedRating <= 3 && feedbackSubmitted && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'scaleIn 0.3s ease' }}>
                <div style={{ fontSize: '80px', marginBottom: '24px' }}>🙏</div>
                <h2 style={{ color: '#f8fafc', margin: '0 0 16px 0', fontSize: '36px', textAlign: 'center' }}>
                  Спасибо за ваш ответ!
                </h2>
                <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '20px', textAlign: 'center', maxWidth: '500px' }}>
                  Мы передадим эту информацию управляющему и обязательно станем лучше.
                </p>
                <button 
                  onClick={closeCustomerDisplay} 
                  style={{ padding: '24px 60px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '20px', fontSize: '24px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5)', animation: 'pulse 2s infinite' }}
                >
                  НОВЫЙ ЗАКАЗ ☕
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

// === Z-ОТЧЕТ ===
export const ZReportModal = ({ 
  showZReport, formatTime, shiftTime, shiftRevenue, baristas = [], baristaStats = {}, salarySettings = { base: 1500, percent: 5 }, finishZReport 
}) => {
  if (!showZReport) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: '#fff', color: '#111', width: '360px', padding: '32px 24px', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', fontFamily: '"Courier New", Courier, monospace' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 8px 0', fontSize: '20px', textTransform: 'uppercase' }}>Z-Отчет</h2>
        <div style={{ borderBottom: '2px dashed #ccc', marginBottom: '16px' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}><span>Время смены:</span><span>{formatTime ? formatTime(shiftTime) : '00:00'}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#f3f4f6', padding: '8px' }}><span>ОБЩАЯ ВЫРУЧКА:</span><span>{(shiftRevenue || 0).toLocaleString('ru-RU')} ₽</span></div>
        <div style={{ borderBottom: '2px dashed #ccc', marginBottom: '16px' }}></div>
        
        {baristas.map(b => {
          const rev = (baristaStats[b] && baristaStats[b].revenue) ? baristaStats[b].revenue : 0;
          const sal = Math.round((salarySettings.base || 1500) + (rev * ((salarySettings.percent || 5) / 100)));
          const tips = (baristaStats[b] && baristaStats[b].tips) ? baristaStats[b].tips : 0;
          
          return (
            <div key={b} style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{b}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#10b981' }}><span>Зарплата:</span><span>{sal} ₽</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#3b82f6' }}><span>Чаевые:</span><span>{tips} ₽</span></div>
            </div>
          );
        })}

        <div style={{ borderBottom: '2px dashed #ccc', marginBottom: '16px', marginTop: '8px' }}></div>
        <button onClick={finishZReport} style={{ width: '100%', padding: '12px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>ЗАКРЫТЬ И СОХРАНИТЬ</button>
      </div>
    </div>
  );
};