import React, { useState, useEffect, useCallback } from 'react';
import { ProcessedInvoice, ExtractedInvoiceData, LineItem, InvoiceStatus } from '../types';
import { validateExtractedData } from '../services/validationService';
import { DEFAULT_CURRENCY }  from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface InvoiceReviewModalProps {
  invoice: ProcessedInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedInvoice: ProcessedInvoice) => void;
}

const initialEmptyData: ExtractedInvoiceData = {
  vendorName: '', invoiceNumber: '', invoiceDate: '', dueDate: '', currency: DEFAULT_CURRENCY,
  lineItems: [], subTotal: 0, taxAmount: 0, totalAmount: 0,
  paymentTerms: '', poNumber: '', notes: ''
};

const InputField: React.FC<{label: string; id: string; value: string | number | null; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; required?: boolean; error?: string; readOnly?: boolean; placeholder?: string; rows?: number }> = 
  ({ label, id, value, onChange, type = "text", required = false, error, readOnly = false, placeholder, rows }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    { type === 'textarea' ? (
        <textarea
            id={id}
            name={id}
            rows={rows || 3}
            value={value === null ? '' : String(value)}
            onChange={onChange}
            readOnly={readOnly}
            placeholder={placeholder}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} ${readOnly ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
        />
    ) : (
        <input
            type={type}
            id={id}
            name={id}
            value={value === null ? '' : String(value)}
            onChange={onChange}
            required={required}
            readOnly={readOnly}
            placeholder={placeholder}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} ${readOnly ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
        />
    )}
    {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
  </div>
);


const InvoiceReviewModal: React.FC<InvoiceReviewModalProps> = ({ invoice, isOpen, onClose, onSave }) => {
  const [editedData, setEditedData] = useState<ExtractedInvoiceData>(initialEmptyData);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showContent, setShowContent] = useState(false);
  const { t } = useLanguage();
  
  useEffect(() => {
    if (invoice?.extractedData) {
      const dataCopy = JSON.parse(JSON.stringify(invoice.extractedData));
      if (!dataCopy.lineItems) dataCopy.lineItems = [];
      dataCopy.lineItems = dataCopy.lineItems.map((item: LineItem) => ({
        ...item,
        id: item.id || `line-${Date.now()}-${Math.random()}` 
      }));
      setEditedData(dataCopy);
      const validation = validateExtractedData(dataCopy);
      setValidationErrors(validation.errors);
    } else if (invoice) { 
        const emptyWithFallbackCurrency = {...initialEmptyData, currency: invoice.extractedData?.currency || DEFAULT_CURRENCY};
        setEditedData(emptyWithFallbackCurrency);
        setValidationErrors([]);
    } else {
      setEditedData(initialEmptyData);
      setValidationErrors([]);
    }
  }, [invoice]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 10); 
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number | null = value;
    if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
      processedValue = value === '' ? null : parseFloat(value);
    }
    setEditedData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number | null) => {
    const updatedLineItems = [...editedData.lineItems];
    let processedValue = value;
    if (field === 'quantity' || field === 'unitPrice' || field === 'total') {
        processedValue = value === '' || value === null ? null : parseFloat(String(value));
    }
    (updatedLineItems[index] as any)[field] = processedValue;

    const currentItem = updatedLineItems[index];
    if (field === 'quantity' || field === 'unitPrice') {
        if (currentItem.quantity !== null && currentItem.unitPrice !== null) {
            currentItem.total = parseFloat((currentItem.quantity * currentItem.unitPrice).toFixed(2));
        } else {
            currentItem.total = null;
        }
    }
    setEditedData(prev => ({ ...prev, lineItems: updatedLineItems }));
  };
  
  const addLineItem = () => {
    setEditedData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: `line-${Date.now()}-${Math.random()}`, description: '', quantity: null, unitPrice: null, total: null }]
    }));
  };

  const removeLineItem = (id: string) => {
    setEditedData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  const recalculateTotals = useCallback(() => {
    setEditedData(prevData => {
        let subTotal = 0;
        prevData.lineItems.forEach(item => {
            if (item.total !== null) {
                subTotal += item.total;
            } else if (item.quantity !== null && item.unitPrice !== null) {
                subTotal += item.quantity * item.unitPrice;
            }
        });

        const taxAmount = prevData.taxAmount === null ? 0 : prevData.taxAmount;
        const totalAmount = subTotal + taxAmount;
        return { 
            ...prevData, 
            subTotal: parseFloat(subTotal.toFixed(2)), 
            totalAmount: parseFloat(totalAmount.toFixed(2)) 
        };
    });
  }, []);

  useEffect(() => {
    recalculateTotals();
  }, [editedData.lineItems, editedData.taxAmount, recalculateTotals]);


  const handleSubmit = () => {
    if (!invoice) return;
    const validation = validateExtractedData(editedData);
    setValidationErrors(validation.errors);
    if (validation.isValid) {
      onSave({ ...invoice, extractedData: editedData, status: InvoiceStatus.COMPLETED, validationErrors: [], errorMessage: null });
      onClose();
    } else {
      alert("Please correct the validation errors before saving."); // TODO: Translate
    }
  };

  if (!isOpen || !invoice) return null;

  const getFieldError = (fieldName: keyof ExtractedInvoiceData | "lineItemDescription" | "lineItemQuantity" | "lineItemUnitPrice" | "lineItemTotal") => {
    const error = validationErrors.find(err => {
      const lowerCaseErr = err.toLowerCase();
      const lowerCaseFieldName = String(fieldName).toLowerCase();
      // More specific matching for field names
      return lowerCaseErr.includes(lowerCaseFieldName) || 
             (lowerCaseFieldName.startsWith('lineitem') && lowerCaseErr.includes(lowerCaseFieldName.replace('lineitem', 'line item ')));
    });
    return error;
  };


  return (
    <div 
        className={`fixed inset-0 bg-gray-600 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-[cubic-bezier(0.165,0.84,0.44,1)] 
        ${showContent ? 'bg-opacity-75 dark:bg-opacity-80 opacity-100' : 'bg-opacity-0 dark:bg-opacity-0 opacity-0 pointer-events-none'}`}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-[cubic-bezier(0.165,0.84,0.44,1)] 
        ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('reviewModalTitle')} <span className="text-primary dark:text-primary-hover">{invoice.fileName}</span></h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* Invoice Preview Pane */}
          <div className="w-full md:w-1/2 p-5 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">{t('reviewModalInvoiceDocument')}</h4>
            {invoice.previewUrl ? (
              invoice.fileType === 'application/pdf' ? (
                <embed src={invoice.previewUrl} type="application/pdf" className="w-full h-[calc(80vh-150px)] min-h-[400px] rounded border border-gray-300 dark:border-gray-600" />
              ) : (
                <img src={invoice.previewUrl} alt="Invoice Preview" className="w-full h-auto max-h-[calc(80vh-150px)] object-contain rounded border border-gray-300 dark:border-gray-600" />
              )
            ) : (
              <div className="w-full h-[calc(80vh-150px)] min-h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400">{t('reviewModalNoPreview')}</p>
              </div>
            )}
          </div>

          {/* Extracted Data Form Pane */}
          <div className="w-full md:w-1/2 p-5 overflow-y-auto">
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{t('reviewModalExtractedData')}</h4>
            {validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-600 rounded-md">
                <h5 className="font-semibold text-red-700 dark:text-red-300">{t('reviewModalValidationIssues')}</h5>
                <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <InputField label={t('reviewModalVendorName')} id="vendorName" value={editedData.vendorName} onChange={handleInputChange} error={getFieldError('vendorName')} />
              <InputField label={t('reviewModalInvoiceNumber')} id="invoiceNumber" value={editedData.invoiceNumber} onChange={handleInputChange} error={getFieldError('invoiceNumber')} />
              <InputField label={t('reviewModalInvoiceDate')} id="invoiceDate" type="date" value={editedData.invoiceDate} onChange={handleInputChange} error={getFieldError('invoiceDate')} />
              <InputField label={t('reviewModalDueDate')} id="dueDate" type="date" value={editedData.dueDate} onChange={handleInputChange} error={getFieldError('dueDate')} />
              <InputField label={t('reviewModalCurrency')} id="currency" value={editedData.currency} onChange={handleInputChange} placeholder="e.g. USD, EUR" />
              <InputField label={t('reviewModalPONumber')} id="poNumber" value={editedData.poNumber} onChange={handleInputChange} />
            </div>
            
            <h5 className="text-md font-semibold mt-6 mb-3 text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-600">{t('reviewModalLineItems')}</h5>
            {editedData.lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 mb-3 p-3 border border-gray-200 dark:border-gray-600 rounded-md relative">
                <button type="button" onClick={() => removeLineItem(item.id)} className="absolute top-1 right-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="col-span-12">
                  <InputField label={`${t('reviewModalLineItemDesc')} ${index + 1}`} id={`desc-${index}`} value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField label={t('reviewModalLineItemQty')} id={`qty-${index}`} type="number" value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)} />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <InputField label={t('reviewModalLineItemUnitPrice')} id={`price-${index}`} type="number" value={item.unitPrice} onChange={(e) => handleLineItemChange(index, 'unitPrice', e.target.value)} />
                </div>
                <div className="col-span-12 sm:col-span-5">
                   <InputField label={t('reviewModalLineItemTotal')} id={`total-${index}`} type="number" value={item.total} onChange={(e) => handleLineItemChange(index, 'total', e.target.value)} readOnly={false} placeholder="Auto/Manual"/>
                </div>
              </div>
            ))}
            <button type="button" onClick={addLineItem} className="mt-2 text-sm text-primary dark:text-primary-hover hover:text-primary-hover dark:hover:text-primary font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
              {t('reviewModalAddLineItem')}
            </button>

            <h5 className="text-md font-semibold mt-6 mb-3 text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-600">{t('reviewModalSummary')}</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
              <InputField label={t('reviewModalSubtotal')} id="subTotal" type="number" value={editedData.subTotal} onChange={handleInputChange} readOnly={editedData.lineItems.length > 0} error={getFieldError('subTotal')} />
              <InputField label={t('reviewModalTaxAmount')} id="taxAmount" type="number" value={editedData.taxAmount} onChange={handleInputChange} error={getFieldError('taxAmount')} />
              <InputField label={t('reviewModalTotalAmount')} id="totalAmount" type="number" value={editedData.totalAmount} onChange={handleInputChange} readOnly={editedData.lineItems.length > 0 || editedData.taxAmount !== null} error={getFieldError('totalAmount')} />
            </div>
            
            <InputField label={t('reviewModalPaymentTerms')} id="paymentTerms" value={editedData.paymentTerms} onChange={handleInputChange} />
            <InputField label={t('reviewModalNotes')} id="notes" type="textarea" value={editedData.notes} onChange={handleInputChange} />
          </div>
        </div>

        <div className="flex items-center justify-end p-5 border-t border-gray-200 dark:border-gray-700 space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors"
          >
            {t('reviewModalCancel')}
          </button>
          <button 
            type="button" 
            onClick={handleSubmit} 
            className="px-6 py-2.5 text-sm font-medium text-white dark:text-primary-text bg-primary hover:bg-primary-hover rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            {t('reviewModalSaveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReviewModal;
