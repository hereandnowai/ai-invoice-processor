
import { ExtractedInvoiceData, LineItem } from '../types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const TOLERANCE = 0.01; // For float comparisons

export const validateExtractedData = (data: ExtractedInvoiceData | null): ValidationResult => {
  const errors: string[] = [];
  if (!data) {
    return { isValid: false, errors: ["No data extracted."] };
  }

  // Basic field presence checks (examples)
  if (!data.vendorName) errors.push("Vendor Name is missing.");
  if (!data.invoiceNumber) errors.push("Invoice Number is missing.");
  if (!data.invoiceDate) errors.push("Invoice Date is missing.");
  if (!data.totalAmount && data.totalAmount !== 0) errors.push("Total Amount is missing.");

  // Line item validation
  let calculatedSubTotal = 0;
  if (data.lineItems && data.lineItems.length > 0) {
    data.lineItems.forEach((item: LineItem, index: number) => {
      if (item.quantity !== null && item.unitPrice !== null && item.total !== null) {
        const lineTotal = item.quantity * item.unitPrice;
        if (Math.abs(lineTotal - item.total) > TOLERANCE) {
          errors.push(`Line item ${index + 1} ('${item.description || 'N/A'}'): Calculated total (${lineTotal.toFixed(2)}) does not match stated total (${item.total.toFixed(2)}).`);
        }
        calculatedSubTotal += item.total; // Or lineTotal, depending on source of truth
      } else if (item.total !== null) {
         calculatedSubTotal += item.total;
      } else {
        errors.push(`Line item ${index + 1} ('${item.description || 'N/A'}') has missing quantity, unit price, or total.`);
      }
    });

    if (data.subTotal !== null && Math.abs(calculatedSubTotal - data.subTotal) > TOLERANCE) {
      errors.push(`Calculated subtotal from line items (${calculatedSubTotal.toFixed(2)}) does not match stated subtotal (${data.subTotal.toFixed(2)}).`);
    }
  } else if (data.subTotal !== null && data.subTotal !== 0) {
    // If no line items, subtotal should ideally be 0 or match total if no tax
  }


  // Overall total validation
  if (data.subTotal !== null && data.taxAmount !== null && data.totalAmount !== null) {
    const calculatedTotal = data.subTotal + data.taxAmount;
    if (Math.abs(calculatedTotal - data.totalAmount) > TOLERANCE) {
      errors.push(`Subtotal (${data.subTotal.toFixed(2)}) + Tax (${data.taxAmount.toFixed(2)}) = ${calculatedTotal.toFixed(2)}, which does not match stated Total Amount (${data.totalAmount.toFixed(2)}).`);
    }
  } else if (data.subTotal !== null && data.totalAmount !== null && data.taxAmount === null) {
    // If tax is null, assume it's 0 for this check
     const calculatedTotal = data.subTotal;
     if (Math.abs(calculatedTotal - data.totalAmount) > TOLERANCE) {
      errors.push(`Subtotal (${data.subTotal.toFixed(2)}) does not match stated Total Amount (${data.totalAmount.toFixed(2)}) when tax is not specified.`);
    }
  }


  // Date validation (simple format check)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (data.invoiceDate && !dateRegex.test(data.invoiceDate)) {
    errors.push("Invoice Date format is invalid. Expected YYYY-MM-DD.");
  }
  if (data.dueDate && !dateRegex.test(data.dueDate)) {
    errors.push("Due Date format is invalid. Expected YYYY-MM-DD.");
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};
