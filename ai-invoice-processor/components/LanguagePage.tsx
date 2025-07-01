import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageCode } from '../types';

const LanguagePage: React.FC = () => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as LanguageCode);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('languageSettingsTitle')}</h1>
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 transition-colors duration-300">
        <section>
          <h2 className="text-xl font-semibold text-primary dark:text-primary-hover mb-4">{t('languageSelectDisplay')}</h2>
          <div className="max-w-xs">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('languageCurrentLanguage')}
            </label>
            <select
              id="language"
              name="language"
              value={language}
              onChange={handleLanguageChange}
              className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md transition-colors duration-150"
            >
              {availableLanguages.map(langOption => (
                <option 
                  key={langOption.code} 
                  value={langOption.code} 
                  disabled={langOption.status !== 'implemented'}
                >
                  {langOption.name} {langOption.status === 'coming_soon' ? t('languageComingSoon') : ''}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {t('languageMultiLangDev')}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('languageAiNote')}
          </p>
        </section>
        <div className="mt-10 border-t pt-6 border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">{t('languageWorkingHard')}</p>
        </div>
      </div>
    </div>
  );
};

export default LanguagePage;
