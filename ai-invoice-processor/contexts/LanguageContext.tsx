import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { translations, DEFAULT_LANGUAGE } from '../translations';
import { LanguageCode, TranslationKey, LanguageOption } from '../types';
import { LANGUAGE_OPTIONS } from '../constants'; // Import LANGUAGE_OPTIONS to check status

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey, ...args: (string | number)[]) => string;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const storedLang = localStorage.getItem('appLanguage');
    if (storedLang && translations[storedLang as LanguageCode]) {
      return storedLang as LanguageCode;
    }
    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((langCode: LanguageCode) => {
    const langOption = LANGUAGE_OPTIONS.find(opt => opt.code === langCode);
    if (langOption && langOption.status === 'implemented' && translations[langCode]) {
      setLanguageState(langCode);
    } else if (translations[langCode]) { // Allow setting if translations exist, even if marked coming_soon for UI
       setLanguageState(langCode);
    }
     else {
      console.warn(`Language ${langCode} is not fully implemented or translations are missing. Falling back to default.`);
      setLanguageState(DEFAULT_LANGUAGE);
    }
  }, []);

  const t = useCallback((key: TranslationKey, ...args: (string | number)[]): string => {
    const langTranslations = translations[language] || translations[DEFAULT_LANGUAGE];
    let translation = langTranslations[key] || translations[DEFAULT_LANGUAGE][key] || key;
    
    if (args.length > 0) {
      args.forEach((arg, index) => {
        const placeholder = new RegExp(`\\{${index}\\}`, 'g');
        translation = translation.replace(placeholder, String(arg));
      });
    }
    return translation;
  }, [language]);

  const availableLanguages = LANGUAGE_OPTIONS;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
