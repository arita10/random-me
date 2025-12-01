import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>
        EN
      </button>
      <button onClick={() => changeLanguage('tr')} disabled={i18n.language === 'tr'}>
        TR
      </button>
      <button onClick={() => changeLanguage('th')} disabled={i18n.language === 'th'}>
        TH
      </button>
      <button onClick={() => changeLanguage('fr')} disabled={i18n.language === 'fr'}>
        FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
