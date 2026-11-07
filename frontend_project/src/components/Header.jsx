import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';


// Иконка ВКонтакте
const VkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://w3.org">
    <path d="M23.45 5.92c.16-.54 0-.94-.77-.94h-2.55c-.65 0-.94.34-1.1.72 0 0-1.3 3.16-3.14 5.22-.6.6-.87.79-1.2.79-.16 0-.4-.19-.4-.73V5.92c0-.65-.19-.94-.75-.94H9.43c-.4 0-.66.3-.66.58 0 .61.92.75 1.01 2.47v3.71c0 .81-.15.96-.47.96-.87 0-3-.3.17-4.32-4.33-5.06-5.04-5.22-5.69-5.22H.76C.03 5.16-.1 5.5-.1 5.92c0 .7.9 4.2 4.2 8.81 2.2 3.16 5.3 4.87 8.1 4.87 1.7 0 1.9-.38 1.9-1.04v-2.28c0-.73.15-.88.67-.88.38 0 1.03.19 2.55 1.66 1.73 1.73 2.02 2.53 2.99 2.53h2.55c.73 0 1.09-.37.88-1.09-.23-.72-1.06-1.77-2.16-3.02-.6-.71-1.5-1.48-1.78-1.87-.38-.49-.27-.7 0-1.14 0 0 3.09-4.36 3.41-5.84z"/>
  </svg>
);

// Иконка Telegram
const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://w3.org">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 12 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

// Иконка Instagram
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://w3.org">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

// Иконка Мессенджера MAX
const MaxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://w3.org">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.15.68 4.15 1.83 5.8L2.1 21.4c-.2.46.22.94.7.77l3.85-1.37c1.6.8 3.42 1.23 5.35 1.23 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>
  </svg>
);

export const Header = ({ filters, onFilterChange, catalogRef }) => {

  const [settings, setSettings] = useState({ site_name: 'Талика',
    phone: '',
    logo: null,
    instagram: null,
    vkontakte: null,
    telegram: null,
    max_messenger: null });
  const [loading, setLoading] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const filterRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/settings/');
        setSettings({ ...response.data, site_name: 'Талика' });
      } catch (err) {
        console.error("Ошибка при получении настроек сайта:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollToCatalog = (e) => {
    e.preventDefault();
    if (catalogRef && catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Изменение: Передаем ключ 'gender' и выбранное значение в родительский компонент
  const handleGenderSelect = (genderValue) => {
    if (onFilterChange) {
      onFilterChange('gender', genderValue);
    }
    setIsFilterOpen(false);
    setActiveSubmenu(null);
  };

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  // Изменение: Проверяем, активен ли хоть какой-то фильтр в объекте, для показа золотой точки
  const isAnyFilterActive = filters.gender !== 'Все' || filters.material !== 'Все' || filters.size !== 'Все';

  if (loading) return <header style={styles.header}>Загрузка шапки...</header>;

  return (
    <header style={styles.header}>
      <div style={styles.container}>

         {/* СЕКЦИЯ ЛОГОТИПА (Загружается из картинки бэкенда) */}
        <div style={styles.logoSection}>
          {settings.logo ? (
            <img
              src={settings.logo}
              alt={settings.site_name}
              style={styles.logoImage}
            />
          ) : (
            <span style={styles.brandName}>{settings.site_name}</span>
          )}
        </div>

        <nav style={styles.navSection}>
          <a href="#catalog" onClick={handleScrollToCatalog} style={styles.navLink}>
            Браслеты
          </a>

          <div style={styles.filterWrapper} ref={filterRef}>
            <button
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setActiveSubmenu(null);
              }}
              style={{
                ...styles.filterBtn,
                ...(isFilterOpen ? styles.filterBtnActive : {}),
                ...(isAnyFilterActive ? styles.filterBtnSelected : {})
              }}
            >
              Фильтр
              {/* Золотая светящаяся точка горит при наличии любого активного фильтра */}
              {isAnyFilterActive && <span style={styles.filterBadge} />}
            </button>

            {/* МЕНЮ КАТЕГОРИЙ */}
            {isFilterOpen && (
              <div style={styles.dropdown}>

                <button
                  onClick={() => toggleSubmenu('gender')}
                  style={{...styles.dropdownBtn, ...(activeSubmenu === 'gender' ? styles.dropdownBtnActive : {})}}
                >
                  Пол {activeSubmenu === 'gender' ? '▲' : '▼'}
                </button>

                {/* ПОДМЕНЮ ПОЛА (Считывает состояние из переданного объекта filters.gender) */}
                {activeSubmenu === 'gender' && (
                  <div style={styles.submenu}>
                    <button
                      onClick={() => handleGenderSelect('Мужские')}
                      style={{...styles.submenuBtn, ...(filters.gender === 'Мужские' ? styles.submenuBtnActive : {})}}
                    >
                      • Мужские
                    </button>
                    <button
                      onClick={() => handleGenderSelect('Женские')}
                      style={{...styles.submenuBtn, ...(filters.gender === 'Женские' ? styles.submenuBtnActive : {})}}
                    >
                      • Женские
                    </button>
                    <button
                      onClick={() => handleGenderSelect('Все')}
                      style={{...styles.submenuBtn, ...styles.resetBtn}}
                    >
                      • Все (Сброс)
                    </button>
                  </div>
                )}

                {/* Заглушки для будущих расширений */}
                <button style={{...styles.dropdownBtn, opacity: 0.4, cursor: 'not-allowed'}}>Материал ▼</button>
                <button style={{...styles.dropdownBtn, opacity: 0.4, cursor: 'not-allowed'}}>Размер ▼</button>

              </div>
            )}
          </div>
        </nav>

        <div style={styles.contactsSection}>
          {settings.phone && (
            <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} style={styles.phone}>
              {settings.phone}
            </a>
          )}
         <div style={styles.socials}>
  {settings.vkontakte && (
    <a href={settings.vkontakte} target="_blank" rel="noreferrer" style={styles.socialLink} title="ВКонтакте">
      <VkIcon />
    </a>
  )}
  {settings.telegram && (
    <a href={settings.telegram} target="_blank" rel="noreferrer" style={styles.socialLink} title="Telegram">
      <TelegramIcon />
    </a>
  )}
  {settings.max_messenger && (
    <a href={settings.max_messenger} target="_blank" rel="noreferrer" style={styles.socialLink} title="Мессенджер MAX">
      <MaxIcon />
    </a>
  )}
  {settings.instagram && (
    <a href={settings.instagram} target="_blank" rel="noreferrer" style={styles.socialLink} title="Instagram">
      <InstagramIcon />
    </a>
  )}
</div>
        </div>

      </div>
    </header>
  );
};

const styles = {
   header: {
    backgroundColor: '#000000',
    color: '#D4AF37',
    // Изменение: Уменьшаем вертикальные отступы с 15px до 10px для экономии места
    padding: '10px 0',
    borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 9999,
    fontFamily: 'sans-serif',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 15px', // Изменение: Чуть сузили поля по бокам
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',       // Изменение: Уменьшили зазор между секциями, чтобы они аккуратнее вставали в ряды
  },
  logoSection: { flex: '1 1 auto', minWidth: '100px' },
   brandName: {
    // Изменение: Сделали шрифт названия чуть меньше на мобильных по умолчанию (было 24px)
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: '#D4AF37',
    textTransform: 'uppercase'
  },
  navSection: { display: 'flex', alignItems: 'center', gap: '25px', flex: '1 1 auto', justifyContent: 'center' },
  navLink: { color: '#D4AF37', textDecoration: 'none', fontSize: '16px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'opacity 0.2s' },
  filterWrapper: { position: 'relative' },
  filterBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #D4AF37',
    color: '#D4AF37',
    padding: '6px 16px',
    fontSize: '15px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
  },
  filterBtnActive: { backgroundColor: '#D4AF37', color: '#000000', borderColor: '#D4AF37' },
  filterBtnSelected: { borderColor: '#FFD700', color: '#FFD700', boxShadow: '0 0 10px rgba(255, 215, 0, 0.25)' },
  filterBadge: { display: 'inline-block', width: '7px', height: '7px', backgroundColor: '#FFD700', borderRadius: '50%', marginLeft: '8px', boxShadow: '0 0 6px #FFD700' },
  dropdown: { position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#111111', border: '1px solid #D4AF37', borderRadius: '4px', padding: '8px 0', minWidth: '160px', boxShadow: '0px 8px 16px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', zIndex: 10000 },
  dropdownBtn: { background: 'transparent', border: 'none', color: '#ffffff', padding: '10px 16px', textAlign: 'left', fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.2s, color 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dropdownBtnActive: { color: '#D4AF37', backgroundColor: '#1a1a1a' },
  submenu: { backgroundColor: '#1a1a1a', display: 'flex', flexDirection: 'column', padding: '4px 0', borderLeft: '2px solid #D4AF37', margin: '0 8px 4px 8px' },
  submenuBtn: { background: 'transparent', border: 'none', color: '#cccccc', padding: '6px 12px', textAlign: 'left', fontSize: '13px', cursor: 'pointer', transition: 'color 0.2s' },
  submenuBtnActive: { color: '#D4AF37', fontWeight: 'bold' },
  resetBtn: { color: '#888888' },
  contactsSection: { display: 'flex', alignItems: 'center', gap: '20px', flex: '1 1 auto', justifyContent: 'flex-end', flexWrap: 'wrap' },
  phone: { color: '#ffffff', textDecoration: 'none', fontSize: '16px', fontWeight: '500', transition: 'opacity 0.2s' },
  socials: { display: 'flex', gap: '12px' },
socialLink: {
    color: '#ffffff', // Иконки станут благородного золотого цвета
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    opacity: 0.8,
    // Убираем рамки, чтобы иконки выглядели минималистично и премиально
  },
    logoSection: {
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 auto',
    minWidth: '100px'
  },
  logoImage: {
    height: '60px',       // Ограничиваем картинку по высоте, чтобы она не растягивала шапку
    width: 'auto',        // Пропорции ширины сохраняются автоматически
    display: 'block',
    objectFit: 'contain', // Картинка не деформируется
  },

};
