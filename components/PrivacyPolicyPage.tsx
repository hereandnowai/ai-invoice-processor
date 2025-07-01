import React from 'react';
import { PRIVACY_POLICY_CONTENT } from '../constants';
import { useLanguage } from '../contexts/LanguageContext'; // For page title

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* The title is part of the HTML content */}
      <div 
        className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY_CONTENT }}
      />
    </div>
  );
};

export default PrivacyPolicyPage;
