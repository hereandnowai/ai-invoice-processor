import React from 'react';
import { HOW_TO_USE_CONTENT } from '../constants';
import { useLanguage } from '../contexts/LanguageContext'; // For page title

const HowToUsePage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* The title is part of the HTML content, so no separate t() here unless refactored */}
      <div 
        className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 text-gray-700 dark:text-gray-300" // Added explicit text colors
        dangerouslySetInnerHTML={{ __html: HOW_TO_USE_CONTENT }}
      />
    </div>
  );
};

export default HowToUsePage;
