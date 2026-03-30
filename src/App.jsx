import CoreModule from './components/CoreModule';
import { CustomerDisplay } from './components/CustomerDisplay'; // Импортируем наш новый экран

function App() {
  // Получаем текущий путь из адресной строки браузера
  const currentPath = window.location.pathname;

  // Если открыта ссылка экрана гостя, рендерим только его
  if (currentPath === '/customer-display') {
    return (
      <div style={{ margin: 0, padding: 0 }}>
        <CustomerDisplay />
      </div>
    );
  }

  // Во всех остальных случаях (главная страница и т.д.) загружаем основной модуль
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <CoreModule />
    </div>
  );
}

export default App;