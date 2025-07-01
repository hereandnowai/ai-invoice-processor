import React from 'react';
import { ProcessedInvoice } from '../types';
import InvoiceCard from './InvoiceCard';
import { useLanguage } from '../contexts/LanguageContext';

interface InvoiceListProps {
  invoices: ProcessedInvoice[];
  onReviewInvoice: (invoiceId: string) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  processingInvoiceIds: Set<string>; // IDs of invoices currently being processed by AI
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onReviewInvoice, onDeleteInvoice, processingInvoiceIds }) => {
  const { t } = useLanguage();

  if (invoices.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t('noInvoicesUploaded')}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('getStartedUploading')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {invoices.map((invoice) => (
        <InvoiceCard 
            key={invoice.id} 
            invoice={invoice} 
            onReview={onReviewInvoice}
            onDelete={onDeleteInvoice}
            isProcessing={processingInvoiceIds.has(invoice.id)}
        />
      ))}
    </div>
  );
};

export default InvoiceList;
