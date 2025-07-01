import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FeatureCardProps { 
  title: string; 
  description: string; 
  status: 'Implemented' | 'In Development' | 'Planned';
  titleKey?: string; // Optional: for future translation
  descriptionKey?: string; // Optional: for future translation
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, status }) => {
  // const { t } = useLanguage(); // If titleKey/descriptionKey were used
  const statusColors = {
    Implemented: 'bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300',
    'In Development': 'bg-yellow-100 dark:bg-yellow-600/30 text-yellow-700 dark:text-yellow-300',
    Planned: 'bg-blue-100 dark:bg-blue-600/30 text-blue-700 dark:text-blue-300',
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-lg font-semibold text-primary dark:text-primary-hover mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 h-20 overflow-y-auto">{description}</p> {/* Fixed height for consistency */}
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>{status}</span>
    </div>
  );
};


const ExtraFeaturesPage: React.FC = () => {
  const { t } = useLanguage();
  // Feature titles and descriptions are kept in English for now.
  // For full i18n, these would need to be keys in translations.ts.
  const features = [
    { title: "Invoice Data Extraction (OCR & AI)", description: "Core feature: Extracts data from PDFs and images using Gemini.", status: "Implemented" as const },
    { title: "Data Validation & Verification", description: "Basic mathematical and format validation for extracted fields.", status: "Implemented" as const },
    { title: "Manual Review Interface", description: "Side-by-side view of invoice and extracted data for corrections.", status: "Implemented" as const },
    { title: "AI Assistant (Gemini Powered)", description: "Full conversational AI support for app usage, troubleshooting, and invoice-related queries.", status: "Implemented" as const },
    { title: "Theme & Accent Customization", description: "Personalize the app's look and feel with theme and accent color options.", status: "Implemented" as const },
    { title: "Basic Multilingual UI", description: "User interface text translated into multiple languages.", status: "In Development" as const },
    { title: "Business Rules Engine", description: "Apply company-specific approval workflows and compliance checks.", status: "Planned" as const },
    { title: "Integration Capabilities (CSV/JSON Export)", description: "Export processed data to standard formats.", status: "Planned" as const },
    { title: "Accounting System Connectors", description: "Direct integration with QuickBooks, Xero, SAP, etc.", status: "Planned" as const },
    { title: "Batch Processing Enhancements", description: "Improved UI and performance for very high-volume batch uploads.", status: "In Development" as const },
    { title: "Duplicate Invoice Detection", description: "Advanced checks for duplicate invoices based on multiple criteria.", status: "Planned" as const },
    { title: "Machine Learning Feedback Loop", description: "System learns from user corrections to improve extraction accuracy over time.", status: "Planned" as const },
    { title: "Reporting & Analytics Dashboard", description: "Visualize processing trends, accuracy rates, and cost savings.", status: "Planned" as const },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('extraFeaturesTitle')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {t('extraFeaturesDesc')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(feature => (
          <FeatureCard key={feature.title} title={feature.title} description={feature.description} status={feature.status} />
        ))}
      </div>
       <div className="mt-12 text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-700 dark:text-gray-300">{t('extraFeaturesRoadmapFeedback')}</p>
      </div>
    </div>
  );
};

export default ExtraFeaturesPage;
