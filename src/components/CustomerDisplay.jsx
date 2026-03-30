import React, { useState, useEffect } from 'react';
// Если используешь framer-motion для красивых анимаций появления:
// import { motion } from 'framer-motion'; 

export const CustomerDisplay = ({ orderId }) => {
  // В реальности сюда будут прилетать данные по веб-сокету или из БД
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Здесь будет логика подписки на обновления заказа
    // Например: subscribeToOrder(orderId, (newData) => { ... })
    
    // Временные моковые данные для проверки верстки:
    setCartItems([
      { id: 1, name: 'Капучино', volume: '300 мл', price: 250 },
      { id: 2, name: 'Круассан миндальный', volume: '1 шт', price: 180 }
    ]);
    setTotal(430);
  }, [orderId]);

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white">
      
      {/* ЛЕВАЯ ЧАСТЬ: Состав заказа */}
      <div className="w-1/2 p-8 flex flex-col justify-between border-r border-gray-700">
        <div>
          <h2 className="text-3xl font-bold mb-8">Ваш заказ:</h2>
          
          <ul className="space-y-4">
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between text-2xl">
                <span>{item.name} <span className="text-gray-400 text-lg">{item.volume}</span></span>
                <span>{item.price} ₽</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Итоговая сумма */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex justify-between items-center text-4xl font-bold text-green-400">
            <span>Итого:</span>
            <span>{total} ₽</span>
          </div>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Маркетинг и чаевые */}
      <div className="w-1/2 p-8 flex flex-col items-center justify-center bg-gray-800">
         {cartItems.length > 0 ? (
           <div className="text-center">
             <h3 className="text-2xl font-bold mb-4">Оставить чаевые баристе</h3>
             <div className="w-64 h-64 bg-white rounded-xl mx-auto flex items-center justify-center text-gray-900 font-bold mb-4">
               {/* Сюда потом вставим реальный QR-код */}
               [ QR CODE ]
             </div>
             <p className="text-gray-400 text-lg">Наведите камеру телефона</p>
           </div>
         ) : (
           <div className="text-center">
             <h3 className="text-3xl font-bold mb-4">Скачайте наше приложение!</h3>
             <p className="text-gray-400 text-xl">И получайте 5% кэшбэка с каждого кофе.</p>
           </div>
         )}
      </div>

    </div>
  );
};