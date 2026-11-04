import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

export const Header = ({ filters, onFilterChange, catalogRef }) => {

  const [settings, setSettings] = useState({ site_name: 'Талика', phone: '', logo: null });
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

        <div style={styles.logoSection}>
          <span style={styles.brandName}>{settings.site_name}</span>
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
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={styles.socialLink}>IG</a>
            <a href="https://telegram.org" target="_blank" rel="noreferrer" style={styles.socialLink}>TG</a>
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
  phone: { color: '#D4AF37', textDecoration: 'none', fontSize: '16px', fontWeight: '500', transition: 'opacity 0.2s' },
  socials: { display: 'flex', gap: '12px' },
  socialLink: { color: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', textDecoration: 'none', transition: 'all 0.2s ease' }
};
