import './App.css'; 
import CoreModule from './components/CoreModule';
import { CustomerDisplay } from './components/CustomerDisplay';
import { KDSDisplay } from './components/KDSDisplay'; 
import QRMenu from './components/QRMenu'; // 🚀 ДОБАВИЛИ ИМПОРТ НОВОГО МЕНЮ

function App() {
  const currentPath = window.location.pathname;

  // Экран гостя
  if (currentPath === '/customer-display') {
    return (
      <div style={{ margin: 0, padding: 0 }}>
        <CustomerDisplay />
      </div>
    );
  }

  // Экран сборки заказов (KDS)
  if (currentPath === '/kds') {
    return (
      <div style={{ margin: 0, padding: 0 }}>
        <KDSDisplay />
      </div>
    );
  }

  // 🚀 НОВАЯ СТРАНИЦА: QR-МЕНЮ ДЛЯ СТОЛИКОВ
  if (currentPath === '/menu') {
    return (
      <div style={{ margin: 0, padding: 0 }}>
        <QRMenu />
      </div>
    );
  }

  // Главная касса (по умолчанию)
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <CoreModule />
    </div>
  );
}

export default App;