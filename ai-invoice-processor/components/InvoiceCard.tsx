import React from 'react';
import { ProcessedInvoice, InvoiceStatus, TranslationKey } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

interface InvoiceCardProps {
  invoice: ProcessedInvoice;
  onReview: (invoiceId: string) => void;
  onDelete: (invoiceId: string) => void;
  isProcessing?: boolean; // If this specific card is undergoing AI processing
}

const getStatusColor = (status: InvoiceStatus): string => {
  switch (status) {
    case InvoiceStatus.PENDING: return 'bg-gray-400 dark:bg-gray-600';
    case InvoiceStatus.UPLOADING: return 'bg-blue-500 dark:bg-blue-700';
    case InvoiceStatus.EXTRACTING:
    case InvoiceStatus.VALIDATING: 
      return 'bg-indigo-500 dark:bg-indigo-700 animate-pulse';
    case InvoiceStatus.REVIEW_PENDING: return 'bg-yellow-500 dark:bg-yellow-600';
    case InvoiceStatus.COMPLETED: return 'bg-green-500 dark:bg-green-700';
    case InvoiceStatus.ERROR: return 'bg-red-500 dark:bg-red-700';
    default: return 'bg-gray-500 dark:bg-gray-700';
  }
};

const getStatusTranslationKey = (status: InvoiceStatus): TranslationKey => {
  switch (status) {
    case InvoiceStatus.PENDING: return 'invoiceCardStatusPending';
    case InvoiceStatus.UPLOADING: return 'invoiceCardStatusUploading';
    case InvoiceStatus.EXTRACTING: return 'invoiceCardStatusExtracting';
    case InvoiceStatus.VALIDATING: return 'invoiceCardStatusValidating';
    case InvoiceStatus.REVIEW_PENDING: return 'invoiceCardStatusReviewPending';
    case InvoiceStatus.COMPLETED: return 'invoiceCardStatusCompleted';
    case InvoiceStatus.ERROR: return 'invoiceCardStatusError';
    default: return 'invoiceCardStatusError'; // Fallback
  }
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onReview, onDelete, isProcessing }) => {
  const { id, fileName, fileType, status, extractedData, errorMessage, previewUrl, uploadTimestamp } = invoice;
  const { t } = useLanguage();

  const displayStatus = isProcessing ? InvoiceStatus.EXTRACTING : status;
  const statusColor = getStatusColor(displayStatus);
  const statusText = t(getStatusTranslationKey(displayStatus));


  const FileIcon: React.FC<{type: string}> = ({type}) => {
    if (type.startsWith('image/')) {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
    }
    if (type === 'application/pdf') {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0011.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative transform hover:-translate-y-1">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
          <LoadingSpinner text={t('loading')} />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0">
             {previewUrl && fileType.startsWith('image/') ? (
                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md flex-shrink-0 border border-gray-200 dark:border-gray-700" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                  <FileIcon type={fileType} />
                </div>
              )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary dark:text-primary-hover truncate" title={fileName}>{fileName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{fileType}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('invoiceCardUploaded')} {new Date(uploadTimestamp).toLocaleDateString()}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${statusColor} whitespace-nowrap`}>
            {statusText}
          </span>
        </div>

        {extractedData && (status === InvoiceStatus.COMPLETED || status === InvoiceStatus.REVIEW_PENDING) && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div className="col-span-2 sm:col-span-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">{t('invoiceCardVendor')}</dt>
                <dd className="text-gray-900 dark:text-gray-100 truncate" title={extractedData.vendorName || 'N/A'}>{extractedData.vendorName || 'N/A'}</dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">{t('invoiceCardInvNum')}</dt>
                <dd className="text-gray-900 dark:text-gray-100 truncate" title={extractedData.invoiceNumber || 'N/A'}>{extractedData.invoiceNumber || 'N/A'}</dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">{t('invoiceCardTotal')}</dt>
                <dd className="text-gray-900 dark:text-gray-100">{extractedData.totalAmount !== null ? `${extractedData.currency || ''} ${extractedData.totalAmount.toFixed(2)}` : 'N/A'}</dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">{t('invoiceCardInvDate')}</dt>
                <dd className="text-gray-900 dark:text-gray-100">{extractedData.invoiceDate || 'N/A'}</dd>
              </div>
            </dl>
          </div>
        )}

        {errorMessage && status === InvoiceStatus.ERROR && (
          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md">
            <p className="text-xs text-red-600 dark:text-red-300 break-words">{t('invoiceCardError')}: {errorMessage}</p>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-2">
        {(status === InvoiceStatus.REVIEW_PENDING || status === InvoiceStatus.ERROR || status === InvoiceStatus.COMPLETED) && (
          <button
            onClick={() => onReview(id)}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium text-white bg-secondary hover:bg-secondary-hover rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-colors"
          >
            {status === InvoiceStatus.COMPLETED ? t('invoiceCardView') : t('invoiceCardReviewEdit')}
          </button>
        )}
         {(status === InvoiceStatus.PENDING || status === InvoiceStatus.ERROR) && (
           <button
            onClick={() => { alert('Re-processing not implemented yet. Please re-upload.'); }} // TODO: Translate alert
            disabled={isProcessing}
            title={t('reprocessTooltip')}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 transition-colors"
          >
            {t('invoiceCardReprocess')}
          </button>
         )}
        <button
            onClick={() => onDelete(id)}
            disabled={isProcessing}
            className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 transition-colors"
            title={t('deleteTooltip')}
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
      </div>
    </div>
  );
};

export default InvoiceCard;
