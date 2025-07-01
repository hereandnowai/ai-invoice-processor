import React from 'react';
import { COMPANY_LOGO_URL, COMPANY_NAME } from '../constants';
import { Theme } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, currentTheme, onThemeChange }) => {
  const { t } = useLanguage();

  const toggleDarkMode = () => {
    let newTheme: Theme;
    const isCurrentlyDark = document.documentElement.classList.contains('dark');

    if (currentTheme === Theme.LIGHT) {
      newTheme = Theme.DARK;
    } else if (currentTheme === Theme.DARK) {
      newTheme = Theme.LIGHT;
    } else { 
      newTheme = isCurrentlyDark ? Theme.LIGHT : Theme.DARK; 
    }
    onThemeChange(newTheme);
  };
  
  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.707.707M4.04 4.04l-.707.707M21 12h-1M4 12H3m15.66 15.66l-.707-.707M4.747 19.953l-.707-.707M12 5.5A6.5 6.5 0 005.5 12a6.5 6.5 0 006.5 6.5 6.5 6.5 0 006.5-6.5A6.5 6.5 0 0012 5.5z" />
    </svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );

  const isDarkRendered = document.documentElement.classList.contains('dark');


  return (
    <header className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md sticky top-0 z-40 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-hover hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary mr-2"
              aria-label={t('openSidebarTooltip')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
           <div className="flex items-center lg:hidden"> {/* Only show on small screens */}
            <img src={COMPANY_LOGO_URL} alt={`${COMPANY_NAME} Logo`} className="h-8 mr-2 object-contain" />
            <span className="font-semibold text-sm sm:text-md text-gray-800 dark:text-gray-100">{COMPANY_NAME.split(" ")[0]} AI</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-hover transition-colors"
              aria-label={t('toggleDarkModeTooltip')}
            >
              {isDarkRendered ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
