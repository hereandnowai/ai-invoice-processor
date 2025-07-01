import React from 'react';
import { COMPANY_NAME } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-6 text-center transition-colors duration-300">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {COMPANY_NAME}. {t('sidebarHNAICopyright').split(' ').slice(2).join(' ')} {/* Attempt to get 'All rights reserved' part */}
        </p>
        {/* <p className="text-xs mt-1">
          Streamlining your invoice processing with AI. // This can be a new translation key if needed
        </p> */}
      </div>
    </footer>
  );
};

export default Footer;
