import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.js';

export const CustomerDisplay = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

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

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: '#111827', color: 'white', fontFamily: 'sans-serif' }}>
      
      <div style={{ width: '50%', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #374151' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', marginTop: 0 }}>Ваш заказ:</h2>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map((item, index) => (
              <li key={`${item.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem' }}>
                <span>{item.name} <span style={{ color: '#9CA3AF', fontSize: '1.125rem', marginLeft: '0.5rem' }}>{item.volume || ''}</span></span>
                <span>{item.price} ₽</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #374151' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '2.25rem', fontWeight: 'bold', color: '#4ADE80' }}>
            <span>Итого:</span>
            <span>{total} ₽</span>
          </div>
        </div>
      </div>

      <div style={{ width: '50%', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1F2937' }}>
         {cartItems.length > 0 ? (
           <div style={{ textAlign: 'center' }}>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: 0 }}>Оставить чаевые баристе</h3>
             <div style={{ width: '16rem', height: '16rem', backgroundColor: 'white', borderRadius: '0.75rem', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111827', fontWeight: 'bold' }}>
               [ ВАШ QR CODE ]
             </div>
             <p style={{ color: '#9CA3AF', fontSize: '1.125rem', margin: 0 }}>Наведите камеру телефона</p>
           </div>
         ) : (
           <div style={{ textAlign: 'center' }}>
             <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: 0 }}>Скачайте наше приложение!</h3>
             <p style={{ color: '#9CA3AF', fontSize: '1.25rem', margin: 0 }}>И получайте 5% кэшбэка с каждого кофе.</p>
           </div>
         )}
      </div>

    </div>
  );
};