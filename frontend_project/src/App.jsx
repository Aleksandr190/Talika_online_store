import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage'; 
import './App.css';

function App() {
  const catalogRef = useRef(null);

  // Изменение: Единый масштабируемый объект для всех фильтров магазина
  const [filters, setFilters] = useState({
    gender: 'Все',
    material: 'Все', // Задел на будущее расширение
    size: 'Все'      // Задел на будущее расширение
  });

  // Изменение: Универсальная функция, которая меняет значение по любому переданному ключу
  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value // Динамически обновляем нужный фильтр (например, 'gender': 'Мужские')
    }));
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', paddingBottom: '40px', paddingTop: '75px' }}>
      {/* Передаем объект и функцию-модификатор в Шапку */}
      <Header filters={filters} onFilterChange={handleFilterChange} catalogRef={catalogRef} />
      
      {/* Передаем объект в Каталог */}
      <CatalogPage filters={filters} catalogRef={catalogRef} />
    </div>
  );
}

export default App;
