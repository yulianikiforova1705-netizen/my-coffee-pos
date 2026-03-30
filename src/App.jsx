import './App.css'; // <-- ВОТ ЭТА СТРОЧКА ВЕРНЕТ НАМ КРАСОТУ!
import CoreModule from './components/CoreModule';
import { CustomerDisplay } from './components/CustomerDisplay';

function App() {
  const currentPath = window.location.pathname;

  if (currentPath === '/customer-display') {
    return (
      <div style={{ margin: 0, padding: 0 }}>
        <CustomerDisplay />
      </div>
    );
  }

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <CoreModule />
    </div>
  );
}

export default App;