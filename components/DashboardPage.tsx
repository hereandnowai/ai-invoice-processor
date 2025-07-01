import React from 'react';
import FileUpload from './FileUpload';
import InvoiceList from './InvoiceList';
import StatsCard from './StatsCard';
import { ProcessedInvoice, InvoiceStatus } from '../types';
import { COMPANY_FAVICON_URL, APP_HERO_TITLE_KEY, APP_HERO_TAGLINE_KEY } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardPageProps {
  invoices: ProcessedInvoice[];
  onFilesSelected: (files: File[]) => void;
  onReviewInvoice: (invoiceId: string) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  isUploading: boolean;
  processingInvoiceIds: Set<string>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  invoices,
  onFilesSelected,
  onReviewInvoice,
  onDeleteInvoice,
  isUploading,
  processingInvoiceIds
}) => {
  const { t } = useLanguage();

  const stats = {
    total: invoices.length,
    pendingReview: invoices.filter(inv => inv.status === InvoiceStatus.REVIEW_PENDING || inv.status === InvoiceStatus.ERROR).length,
    completed: invoices.filter(inv => inv.status === InvoiceStatus.COMPLETED).length,
    processing: processingInvoiceIds.size + (isUploading ? 1 : 0) 
  };

  const TotalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h2l2-2h4l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2z" /></svg>;
  const PendingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  const CompletedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  const ProcessingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357 2m0 0H15" /></svg>;


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <section className="text-center py-10 md:py-12 bg-white dark:bg-gray-800 shadow-xl rounded-xl transition-colors duration-300">
        <div className="container mx-auto px-6">
          <img src={COMPANY_FAVICON_URL} alt="App Logo" className="h-16 w-16 mx-auto mb-5" />
          <h1 className="text-3xl sm:text-4xl font-bold text-company-teal dark:text-primary-hover mb-4">
            {t(APP_HERO_TITLE_KEY)}
          </h1>
          <p className="text-md sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t(APP_HERO_TAGLINE_KEY)}
          </p>
        </div>
      </section>
      
      {/* File Upload Section */}
      <section id="file-upload-section">
         <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center sm:text-left">{t('uploadNewInvoices')}</h2>
        <FileUpload onFilesSelected={onFilesSelected} isLoading={isUploading || processingInvoiceIds.size > 0} />
      </section>

      {/* Stats Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center sm:text-left">{t('processingOverview')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title={t('totalInvoices')} value={stats.total} icon={<TotalIcon />} colorClass="bg-blue-500 dark:bg-blue-700" />
          <StatsCard title={t('pendingError')} value={stats.pendingReview} icon={<PendingIcon />} colorClass="bg-yellow-500 dark:bg-yellow-600" />
          <StatsCard title={t('completed')} value={stats.completed} icon={<CompletedIcon />} colorClass="bg-green-500 dark:bg-green-700" />
          <StatsCard title={t('currentlyProcessing')} value={stats.processing} icon={<ProcessingIcon />} colorClass="bg-indigo-500 dark:bg-indigo-700" />
        </div>
      </section>

      {/* Invoice List Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{t('uploadedInvoices')}</h2>
        </div>
        <InvoiceList 
            invoices={invoices} 
            onReviewInvoice={onReviewInvoice} 
            onDeleteInvoice={onDeleteInvoice}
            processingInvoiceIds={processingInvoiceIds}
        />
      </section>
    </div>
  );
};

export default DashboardPage;
