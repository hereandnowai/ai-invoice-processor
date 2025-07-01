import { GoogleGenAI, GenerateContentResponse, Part, Chat, GenerateContentStreamResponse } from "@google/genai";
import { ExtractedInvoiceData, LineItem, GeminiExtractionPromptField, ChatMessageCore } from '../types';
import { GEMINI_TEXT_MODEL, DEFAULT_CURRENCY } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable is not set. Please ensure it is configured for full functionality.");
}

// This instance is for one-off generations like invoice extraction
const aiForExtraction = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      mimeType: file.type,
      data: base64EncodedData,
    },
  };
};

const getExtractionPrompt = (): string => {
  const fields: GeminiExtractionPromptField[] = [
    { fieldName: "vendorName", description: "The name of the vendor or supplier.", type: "string", example: "Acme Corp" },
    { fieldName: "invoiceNumber", description: "The unique identifier for the invoice.", type: "string", example: "INV-2023-001" },
    { fieldName: "invoiceDate", description: "The date the invoice was issued.", type: "date", example: "2023-10-26" },
    { fieldName: "dueDate", description: "The date the payment is due.", type: "date", example: "2023-11-25" },
    { fieldName: "currency", description: "The currency of the invoice amounts (e.g., USD, EUR, GBP).", type: "string", example: "USD" },
    { 
      fieldName: "lineItems", 
      description: "An array of items or services listed on the invoice. Each item should be an object.", 
      type: "array",
    },
    { fieldName: "lineItemDescription", description: "Description of the line item.", type: "string", example: "Product A" },
    { fieldName: "lineItemQuantity", description: "Quantity of the line item.", type: "number", example: "2" },
    { fieldName: "lineItemUnitPrice", description: "Unit price of the line item.", type: "number", example: "50.00" },
    { fieldName: "lineItemTotal", description: "Total price for the line item (quantity * unit price).", type: "number", example: "100.00" },
    { fieldName: "subTotal", description: "The total amount before taxes.", type: "number", example: "250.00" },
    { fieldName: "taxAmount", description: "The total tax amount.", type: "number", example: "25.00" },
    { fieldName: "totalAmount", description: "The final total amount including all taxes and charges.", type: "number", example: "275.00" },
    { fieldName: "paymentTerms", description: "Payment terms for the invoice (e.g., Net 30, Due on Receipt).", type: "string", example: "Net 30" },
    { fieldName: "poNumber", description: "Purchase Order number, if available.", type: "string", example: "PO-12345" },
    { fieldName: "notes", description: "Any additional notes or comments on the invoice.", type: "string", example: "Thank you for your business."}
  ];

  let prompt = `You are an expert AI Invoice Processing System. Your task is to extract information from the provided invoice document (image or PDF page).
Analyze the document carefully and extract the following fields. Respond ONLY with a valid JSON object containing these fields.
The JSON object should conform to this structure:
{
  "vendorName": "string | null",
  "invoiceNumber": "string | null",
  "invoiceDate": "YYYY-MM-DD string | null",
  "dueDate": "YYYY-MM-DD string | null",
  "currency": "string (e.g. USD, EUR) | null",
  "lineItems": [
    { "id": "unique_string_identifier_for_item", "description": "string | null", "quantity": "number | null", "unitPrice": "number | null", "total": "number | null" }
  ],
  "subTotal": "number | null",
  "taxAmount": "number | null",
  "totalAmount": "number | null",
  "paymentTerms": "string | null",
  "poNumber": "string | null",
  "notes": "string | null"
}

Field descriptions:
`;
  fields.forEach(f => {
    prompt += `- ${f.fieldName}: ${f.description} (Type: ${f.type}${f.example ? `, Example: '${f.example}'` : ''})\n`;
  });
  prompt += `
Important Rules:
- If a field is not found or not applicable, use null for its value. For lineItems, if none are found, provide an empty array [].
- Dates should be in YYYY-MM-DD format. If the year is ambiguous, assume the current year or the most recent sensible year.
- For line items, each item MUST have a unique 'id' field (you can generate a simple UUID or counter for this).
- Numbers should be parsed as numeric types, not strings. Ensure amounts are numbers (e.g., 123.45, not "$123.45").
- If currency is not explicitly stated, try to infer it or use "${DEFAULT_CURRENCY}" as a default if amounts are present. If no amounts, use null for currency.
- Extract all line items visible. If a line item is missing a quantity, unit price, or total, use null for that specific sub-field. Try to calculate total if quantity and unit price are present.
- Ensure the entire response is a single, valid JSON object. Do not include any text before or after the JSON object.
`;
  return prompt;
};


export const extractInvoiceData = async (file: File): Promise<ExtractedInvoiceData> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured for invoice extraction.");
  }
  
  const imagePart = await fileToGenerativePart(file);
  const textPart = { text: getExtractionPrompt() };

  try {
    const response: GenerateContentResponse = await aiForExtraction.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        temperature: 0.2 
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as ExtractedInvoiceData;

    if (parsedData.lineItems && Array.isArray(parsedData.lineItems)) {
      parsedData.lineItems = parsedData.lineItems.map((item, index) => ({
        ...item,
        id: item.id || `temp-id-${index}-${Date.now()}` 
      }));
    } else {
      parsedData.lineItems = [];
    }
    
    return parsedData;

  } catch (error) {
    console.error("Error extracting invoice data from Gemini:", error);
    let errorMessage = "Failed to extract data. The AI model returned an unexpected response.";
    if (error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};

export const getAIAssistantResponse = async (chatInstance: Chat, messageText: string): Promise<string> => {
  if (!API_KEY) {
    return "AI Assistant is offline: API Key not configured.";
  }
  if (!chatInstance) {
    return "AI Assistant is offline: Chat session not initialized.";
  }

  try {
    // Note: The history is managed by the Chat instance itself.
    // We just send the new message.
    const response: GenerateContentResponse = await chatInstance.sendMessage({ message: messageText });
    return response.text;
  } catch (error) {
    console.error("Error getting AI assistant response from Gemini:", error);
    let errorMessage = "Sorry, I couldn't process your request.";
    if (error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    // Check for specific Gemini API error types if available
    return errorMessage;
  }
};

export { GEMINI_TEXT_MODEL }; // Export model name if needed elsewhere
