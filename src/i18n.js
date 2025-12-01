import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import trTranslation from './locales/tr/translation.json';
import thTranslation from './locales/th/translation.json';

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      tr: {
        translation: trTranslation,
      },
      th: {
        translation: thTranslation,
      },
    },
    fallbackLng: 'en', // fallback to English if user's language is not available
    debug: false,
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      // Cache user language selection in localStorage
      caches: ['localStorage'],
      // Language codes to look up
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
