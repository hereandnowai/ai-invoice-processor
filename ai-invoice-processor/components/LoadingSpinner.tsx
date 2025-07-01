import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g., 'text-blue-500'
  text?: string;
  textKey?: string; // For translatable text
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-primary dark:text-primary-hover', text, textKey }) => {
  const { t } = useLanguage();
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-[6px]',
  };

  const displayText = textKey ? t(textKey as any) : text;

  return (
    <div className="flex flex-col items-center justify-center space-y-2" role="alert" aria-live="assertive">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent ${color} border-solid`}
      >
        <span className="sr-only">{t('loading')}</span>
      </div>
      {displayText && <p className={`text-sm ${color}`}>{displayText}</p>}
    </div>
  );
};

export default LoadingSpinner;
