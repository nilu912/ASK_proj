import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'mr' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { name: t('navigation.home'), path: '/' },
    { name: t('navigation.gallery'), path: '/gallery' },
    { name: t('navigation.events'), path: '/events' },
    { name: t('navigation.donation'), path: '/donate' },
    { name: t('navigation.inquiry'), path: '/inquiry' },
  ];

  return (
    <header>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Apang Seva Kendra</span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
                style={{ textDecoration: 'none', color: location.pathname === link.path ? '#FFD700' : '#333', fontWeight: '500' }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Language Toggle and Admin Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={toggleLanguage}
              style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '500', color: '#333', cursor: 'pointer' }}
            >
              {i18n.language === 'en' ? 'मराठी' : 'English'}
            </button>
            <Link
              to="/admin/login"
              style={{ padding: '0.5rem 1rem', backgroundColor: '#1a202c', color: 'white', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}
            >
              {t('navigation.admin')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg style={{ height: '1.5rem', width: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div style={{ marginTop: '1rem', paddingBottom: '1rem' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={location.pathname === link.path ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ textDecoration: 'none', color: location.pathname === link.path ? '#FFD700' : '#333' }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid #eee' }}>
              <button
                onClick={toggleLanguage}
                style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '500', color: '#333', cursor: 'pointer' }}
              >
                {i18n.language === 'en' ? 'मराठी' : 'English'}
              </button>
              <Link
                to="/admin/login"
                style={{ padding: '0.5rem 1rem', backgroundColor: '#1a202c', color: 'white', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.admin')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;