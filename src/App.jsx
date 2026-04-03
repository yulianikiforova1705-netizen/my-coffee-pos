import './App.css'; // <-- ВОТ ЭТА СТРОЧКА ВЕРНЕТ НАМ КРАСОТУ!
import CoreModule from './components/CoreModule';
import { CustomerDisplay } from './components/CustomerDisplay';
import { KDSDisplay } from './components/KDSDisplay'; // <-- ДОБАВИЛИ ИМПОРТ KDS

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

  // Главная касса (по умолчанию)
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <CoreModule />
    </div>
  );
}

export default App;