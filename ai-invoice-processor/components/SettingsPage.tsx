import React from 'react';
import { Theme, AccentColor } from '../types';
import { ACCENT_COLORS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsPageProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  currentAccentName: string;
  onAccentChange: (accentName: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    currentTheme, onThemeChange, 
    currentAccentName, onAccentChange 
}) => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('settingsTitle')}</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 space-y-10 transition-colors duration-300">
        
        {/* Appearance Section */}
        <section>
          <h2 className="text-xl font-semibold text-primary dark:text-primary-hover mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">{t('settingsAppearance')}</h2>
          
          {/* Theme Selection */}
          <div className="mb-6">
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settingsTheme')}</label>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              {(Object.values(Theme) as Theme[]).map((themeOption) => (
                <label key={themeOption} className="flex items-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="theme"
                    value={themeOption}
                    checked={currentTheme === themeOption}
                    onChange={() => onThemeChange(themeOption)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:checked:bg-primary dark:focus:ring-offset-gray-800"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {themeOption === Theme.LIGHT && t('settingsThemeLight')}
                    {themeOption === Theme.DARK && t('settingsThemeDark')}
                    {themeOption === Theme.SYSTEM && t('settingsThemeSystem')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div>
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-3">{t('settingsAccentColor')}</label>
            <div className="flex flex-wrap gap-3">
              {ACCENT_COLORS.map((accent) => (
                <button
                  key={accent.name}
                  title={accent.name}
                  onClick={() => onAccentChange(accent.name)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-150
                              ${currentAccentName === accent.name ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 scale-110' : 'hover:scale-105'} `}
                  style={{ 
                    backgroundColor: accent.primary, 
                    borderColor: currentAccentName === accent.name ? accent.primaryHover : accent.primary 
                  }}
                  aria-pressed={currentAccentName === accent.name}
                >
                  <span className="sr-only">{accent.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h2 className="text-xl font-semibold text-primary dark:text-primary-hover mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">{t('settingsNotifications')}</h2>
           <div className="flex items-center">
            <input id="emailNotifications" name="emailNotifications" type="checkbox" disabled className="h-4 w-4 text-primary border-gray-300 rounded cursor-not-allowed opacity-70" />
            <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 opacity-70">
              {t('settingsEnableEmailNotifs')}
            </label>
          </div>
        </section>

        {/* API Configuration Section */}
        <section>
          <h2 className="text-xl font-semibold text-primary dark:text-primary-hover mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">{t('settingsApiConfig')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('settingsApiConfigDesc')}
          </p>
           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('settingsApiConfigGuide')}</p>
        </section>

        <div className="mt-10 border-t pt-6 border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">{t('settingsMoreComingSoon')}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
