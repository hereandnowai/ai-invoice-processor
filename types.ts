export enum InvoiceStatus {
  PENDING = 'PENDING',
  UPLOADING = 'UPLOADING',
  EXTRACTING = 'EXTRACTING',
  VALIDATING = 'VALIDATING',
  REVIEW_PENDING = 'REVIEW_PENDING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface LineItem {
  id: string;
  description: string | null;
  quantity: number | null;
  unitPrice: number | null;
  total: number | null;
}

export interface ExtractedInvoiceData {
  vendorName: string | null;
  invoiceNumber: string | null;
  invoiceDate: string | null; // YYYY-MM-DD
  dueDate: string | null; // YYYY-MM-DD
  lineItems: LineItem[];
  subTotal: number | null;
  taxAmount: number | null;
  totalAmount: number | null;
  currency: string | null;
  paymentTerms: string | null;
  poNumber: string | null;
  notes?: string | null;
}

// For Gemini Service
export interface GeminiExtractionPromptField {
  fieldName: keyof ExtractedInvoiceData | "lineItemDescription" | "lineItemQuantity" | "lineItemUnitPrice" | "lineItemTotal";
  description: string;
  type: "string" | "date" | "number" | "array" | "object";
  example?: string;
  required?: boolean;
}

export interface ProcessedInvoice {
  id: string;
  file?: File; // Optional because it's removed for localStorage
  fileName: string;
  fileType: string;
  previewUrl: string | null;
  status: InvoiceStatus;
  extractedData: ExtractedInvoiceData | null;
  validationErrors: string[];
  errorMessage: string | null;
  uploadTimestamp: Date;
  processingTimestamp?: Date | null;
}

export enum AppPage {
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
  LANGUAGE = 'LANGUAGE',
  EXTRA_FEATURES = 'EXTRA_FEATURES',
  HOW_TO_USE = 'HOW_TO_USE',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  ABOUT = 'ABOUT',
}

export type TranslationKey = 
  | 'dashboard' | 'settings' | 'language' | 'extraFeatures' | 'howToUse' | 'aiAssistant' | 'privacyPolicy' | 'about'
  | 'appHeroTitle' | 'appHeroTagline'
  | 'uploadNewInvoices' | 'processingOverview' | 'uploadedInvoices'
  | 'totalInvoices' | 'pendingError' | 'completed' | 'currentlyProcessing'
  | 'noInvoicesUploaded' | 'getStartedUploading'
  | 'fileUploadDragDrop' | 'fileUploadSupported' | 'fileUploadMaxMB'
  | 'invoiceCardVendor' | 'invoiceCardInvNum' | 'invoiceCardTotal' | 'invoiceCardInvDate' | 'invoiceCardUploaded'
  | 'invoiceCardView' | 'invoiceCardReviewEdit' | 'invoiceCardReprocess' | 'invoiceCardDelete' | 'invoiceCardError'
  | 'invoiceCardStatusPending' | 'invoiceCardStatusUploading' | 'invoiceCardStatusExtracting' | 'invoiceCardStatusValidating' | 'invoiceCardStatusReviewPending' | 'invoiceCardStatusCompleted' | 'invoiceCardStatusError'
  | 'reviewModalTitle' | 'reviewModalInvoiceDocument' | 'reviewModalExtractedData' | 'reviewModalValidationIssues'
  | 'reviewModalVendorName' | 'reviewModalInvoiceNumber' | 'reviewModalInvoiceDate' | 'reviewModalDueDate' | 'reviewModalCurrency' | 'reviewModalPONumber'
  | 'reviewModalLineItems' | 'reviewModalLineItemDesc' | 'reviewModalLineItemQty' | 'reviewModalLineItemUnitPrice' | 'reviewModalLineItemTotal' | 'reviewModalAddLineItem'
  | 'reviewModalSummary' | 'reviewModalSubtotal' | 'reviewModalTaxAmount' | 'reviewModalTotalAmount' | 'reviewModalPaymentTerms' | 'reviewModalNotes'
  | 'reviewModalCancel' | 'reviewModalSaveChanges' | 'reviewModalNoPreview'
  | 'settingsTitle' | 'settingsAppearance' | 'settingsTheme' | 'settingsThemeLight' | 'settingsThemeDark' | 'settingsThemeSystem' | 'settingsAccentColor'
  | 'settingsNotifications' | 'settingsEnableEmailNotifs' | 'settingsApiConfig' | 'settingsApiConfigDesc' | 'settingsApiConfigGuide' | 'settingsMoreComingSoon'
  | 'languageSettingsTitle' | 'languageSelectDisplay' | 'languageCurrentLanguage' | 'languageMultiLangDev' | 'languageAiNote' | 'languageWorkingHard' | 'languageComingSoon'
  | 'extraFeaturesTitle' | 'extraFeaturesDesc' | 'extraFeaturesRoadmapFeedback'
  | 'howToUseTitle'
  | 'privacyPolicyTitle'
  | 'aboutTitle' | 'aboutVersion'
  | 'aiAssistantModalTitle' | 'aiAssistantModalPlaceholder' | 'aiAssistantModalSend' | 'aiAssistantModalListening' | 'aiAssistantModalSuggestions' | 'aiAssistantModalHelp' | 'aiAssistantModalStopListening' | 'aiAssistantModalStartListening'
  | 'loading' | 'confirmDeleteInvoice' | 'sidebarInvoiceProcessor' | 'sidebarHNAICopyright'
  | 'deleteTooltip' | 'reprocessTooltip' | 'toggleDarkModeTooltip' | 'openSidebarTooltip' | 'closeSidebarTooltip';

export interface MenuItemConfig {
  id: AppPage | 'AI_ASSISTANT_TOGGLE'; 
  labelKey: TranslationKey; // Changed from label to labelKey
  icon: (props: { className?: string }) => JSX.Element;
  page?: AppPage; 
}

export interface AIAssistantMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'suggestion';
  timestamp: Date;
  isSuggestion?: boolean; // To render suggestion chips differently if needed
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface AccentColor {
  name: string;
  primary: string; // hex for main primary
  primaryHover: string; // hex for primary hover
  primaryText: string; // hex for text on primary
  secondary: string; // hex for main secondary
  secondaryHover: string; // hex for secondary hover
  secondaryText: string; // hex for text on secondary
  cssVariables: {
    [key: string]: string; // e.g. '--primary-r': '0', '--primary-g': '128'
  };
}

// For Gemini Chat
export interface ChatMessageCore {
    role: "user" | "model";
    parts: { text: string }[];
}

export type LanguageCode = 'en' | 'ta' | 'te' | 'fr' | 'ml' | 'de' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  status: 'implemented' | 'coming_soon';
}
