// Server-side dictionary loader
import 'server-only'

const dictionaries = {
  // Use JSON import assertions to keep Turbopack's module type stable
  en: () => import('../dictionaries/en.json', { assert: { type: 'json' } }).then((module) => module.default),
  es: () => import('../dictionaries/es.json', { assert: { type: 'json' } }).then((module) => module.default),
}

export const getDictionary = async (locale) => {
  if (!dictionaries[locale]) {
    return dictionaries.en(); // fallback to English
  }
  return dictionaries[locale]();
}

export const locales = ['en', 'es'];
export const defaultLocale = 'en';

export const localeNames = {
  en: 'English',
  es: 'Español'
};

export const localeFlags = {
  en: '🇺🇸',
  es: '🇪🇸'
};
