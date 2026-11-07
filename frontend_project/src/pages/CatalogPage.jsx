import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';

export const CatalogPage = ({ filters, catalogRef }) => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ catalog_banner: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // НОВОЕ: Стейт для отслеживания ширины экрана смартфона
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Слушатель изменения размеров экрана, чтобы адаптивно менять отступ
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

     const fetchData = async () => {
      try {
        setLoading(true);

        // Загружаем данные параллельно
        const [productsResponse, settingsResponse] = await Promise.all([
          axios.get('/api/products/'),
          axios.get('/api/settings/')
        ]);

        // ИСПРАВЛЕНО: используем правильные переменные из Promise.all
        setProducts(productsResponse.data);
        setSettings(settingsResponse.data);
        setError(null);
      } catch (err) {
        console.error("Ошибка при получении данных витрины:", err);
        setError("Не удалось загрузить данные. Проверьте, запущен ли бэкенд.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayedProducts = products.filter(product => {
    const matchGender = filters.gender === 'Все' || product.gender === filters.gender;
    const matchMaterial = filters.material === 'Все' || product.material === filters.material;
    const matchSize = filters.size === 'Все' || product.size === filters.size;
    return matchGender && matchMaterial && matchSize;
  });

  if (loading) return <div style={styles.center}>Загрузка витрины украшений...</div>;
  if (error) return <div style={{ ...styles.center, color: 'red' }}>{error}</div>;

  return (
    <div
      style={{
        ...styles.container,
        // ИЗМЕНЕНИЕ: Если это телефон, делаем большой отступ (120px), чтобы текст НЕ уходил под шапку.
        // На компьютерах оставляем аккуратные 40px.
        paddingTop: isMobile ? '130px' : '40px'
      }}
      ref={catalogRef}
    >
        {/* Вывод картинки-баннера из админки (рендерится только если она загружена) */}
        {settings.catalog_banner && (
        <div style={styles.bannerWrapper}>
          <img
            src={settings.catalog_banner}
            alt="Промо баннер коллекции"
            style={{
              ...styles.bannerImage,
              // ИСПРАВЛЕНО: На телефоне жестко держим высоту 200px,
              // бока будут автоматически срезаться при сужении экрана, показывая ЦЕНТР.
              height: isMobile ? '250px' : '600px',
            }}
          />
        </div>
      )}

      {/* Показываем плашку с активным фильтром над сеткой */}
      {filters.gender !== 'Все' && (
        <div style={styles.activeFilterTag}>
          Категория: <span style={styles.tagName}>{filters.gender}</span>
        </div>
      )}

      {displayedProducts.length === 0 ? (
        <p style={styles.center}>В данной категории товаров не найдено</p>
      ) : (
        <div style={styles.grid}>
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1600px',
    margin: '0 auto',
    paddingLeft: '15px',
    paddingRight: '15px',
    boxSizing: 'border-box',
  },
  bannerWrapper: {
    width: '100%',
    marginBottom: '25px',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  bannerImage: {
    width: '100%',
    // objectFit и objectPosition заставят картинку вести себя как background-image:
    // она зафиксируется по центру, а края будут уходить за экран при уменьшении ширины
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))',
    gap: '20px',
  },
  center: {
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '18px',
    fontFamily: 'sans-serif',
    color: '#D4AF37',
  },
  activeFilterTag: {
    textAlign: 'center',
    color: '#888888',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '35px',
  },
  tagName: {
    color: '#D4AF37',
    fontWeight: 'bold',
    borderBottom: '1px dashed #D4AF37',
    paddingBottom: '2px',
  }
};
