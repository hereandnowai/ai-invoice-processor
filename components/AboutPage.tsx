import React from 'react';
import { ABOUT_APP_CONTENT, COMPANY_LOGO_URL, COMPANY_NAME } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  const APP_VERSION = "1.2.0"; // Example version

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 transition-colors duration-300">
        <div className="flex flex-col items-center mb-8">
            <img src={COMPANY_LOGO_URL} alt={`${COMPANY_NAME} Logo`} className="h-24 object-contain mb-4" />
        </div>
        <div 
            className="prose dark:prose-invert max-w-none prose-headings:text-primary dark:prose-headings:text-primary-hover prose-strong:text-gray-800 dark:prose-strong:text-gray-100 text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: ABOUT_APP_CONTENT }}
        />
        <div className="mt-10 text-center border-t pt-6 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('aboutVersion')} {APP_VERSION}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('sidebarHNAICopyright')}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
