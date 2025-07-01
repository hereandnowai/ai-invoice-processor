import React from 'react';
import { AppPage, MenuItemConfig, Theme, AccentColor, LanguageOption, TranslationKey } from './types'; // Added TranslationKey

export const COMPANY_NAME = "HEREANDNOW AI RESEARCH INSTITUTE";
export const COMPANY_LOGO_URL = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png";
export const COMPANY_FAVICON_URL = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Fevicon%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-03.png";

// These will be translated via keys, keeping original for fallback or reference
export const APP_HERO_TITLE_KEY: TranslationKey = "appHeroTitle";
export const APP_HERO_TAGLINE_KEY: TranslationKey = "appHeroTagline";


export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";

export const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const DEFAULT_CURRENCY = "USD";

// --- Icons (Simple SVGs as functions) ---
interface IconProps {
  className?: string;
}

const DashboardIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
  },
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3 10v11h6V10H3zm0-7v5h6V3H3zm9 7v4h9V10h-9zm0-7v5h9V3h-9zM3 21v-8m9-1h.01M12 3v1m0 16v1m8.66-8.66l-.707.707M4.04 4.04l-.707.707M21 12h-1M4 12H3m15.66 15.66l-.707-.707M4.747 19.953l-.707-.707M12 5.5A6.5 6.5 0 005.5 12a6.5 6.5 0 006.5 6.5 6.5 6.5 0 006.5-6.5A6.5 6.5 0 0012 5.5z"
  }))
);

const SettingsIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
  },
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  }),
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  }))
);

const LanguageIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
  },
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
  }))
);

const SparklesIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
  },
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M5 3v4M3 5h4M6.376 18.624L12 12.001l5.624 6.623M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  }))
);

const QuestionMarkCircleIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
  },
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.755 4 3.92C16 13.09 14.828 14 12.69 14c-.845 0-1.73-.201-2.47-.635l.254-.95A3.375 3.375 0 0112.69 12c1.233 0 2.31-.635 2.31-1.92 0-1.185-.956-2.08-2.31-2.08-1.045 0-1.875.56-2.16 1.34L8.228 9z"
  }),
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M10 14v1.01A2.99 2.99 0 0012.69 18h.008c.631 0 1.25-.183 1.764-.537l.254-.95A3.375 3.375 0 0112.69 16c-1.233 0-2.31.635-2.31 1.92 0 .341.06.666.17 1M12 10.072V9"
  }),
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 21a9 9 0 100-18 9 9 0 000 18z"
  }))
);

const ShieldCheckIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
  },
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
  }))
);

const InformationCircleIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
  },
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  }))
);

const ChatBubbleLeftEllipsisIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor"
  },
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a.38.38 0 01.265-.112c2.036-.207 3.833-.944 5.126-2.1V9.75M8.25 9.75A2.625 2.625 0 005.625 7.125H3a2.25 2.25 0 00-2.25 2.25v4.125c0 1.584 1.06 2.926 2.519 3.191.163.027.329.05.495.071L6.75 21v-2.707c.623.085 1.25.149 1.875.195H12c1.933 0 3.682-.746 4.986-1.992A4.502 4.502 0 0021 13.125V9.75c0-1.109-.386-2.138-1.03-2.964A4.508 4.508 0 0017.25 6H15c-2.209 0-4 1.791-4 4v.75z"
  }))
);

export const MicrophoneIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor"
  },
  React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
  }))
);


// --- Menu Configuration ---
export const MENU_ITEMS: MenuItemConfig[] = [
  { id: AppPage.DASHBOARD, labelKey: 'dashboard', icon: DashboardIcon, page: AppPage.DASHBOARD },
  { id: AppPage.SETTINGS, labelKey: 'settings', icon: SettingsIcon, page: AppPage.SETTINGS },
  { id: AppPage.LANGUAGE, labelKey: 'language', icon: LanguageIcon, page: AppPage.LANGUAGE },
  { id: AppPage.EXTRA_FEATURES, labelKey: 'extraFeatures', icon: SparklesIcon, page: AppPage.EXTRA_FEATURES },
  { id: AppPage.HOW_TO_USE, labelKey: 'howToUse', icon: QuestionMarkCircleIcon, page: AppPage.HOW_TO_USE },
  { id: 'AI_ASSISTANT_TOGGLE', labelKey: 'aiAssistant', icon: ChatBubbleLeftEllipsisIcon },
  { id: AppPage.PRIVACY_POLICY, labelKey: 'privacyPolicy', icon: ShieldCheckIcon, page: AppPage.PRIVACY_POLICY },
  { id: AppPage.ABOUT, labelKey: 'about', icon: InformationCircleIcon, page: AppPage.ABOUT },
];

// --- AI Assistant Suggestions ---
export const AI_ASSISTANT_SUGGESTION_KEYS: TranslationKey[] = [
  "howToUse", // General key, might need more specific ones like "howToUpload"
  "fileUploadSupported", // Key for "What file types are supported?"
  "invoiceCardStatusReviewPending", // Key for "Explain 'Review Pending' status."
  // "howDataValidationWorks", // Needs new key
  // "tellMeKeyFeatures" // Needs new key
];


// --- Language Options ---
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English (United States)', status: 'implemented' },
  { code: 'ta', name: 'தமிழ் (Tamil)', status: 'implemented' }, // Marking as implemented for testing
  { code: 'te', name: 'తెలుగు (Telugu)', status: 'coming_soon' },
  { code: 'fr', name: 'Français (French)', status: 'coming_soon' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', status: 'coming_soon' },
  { code: 'de', name: 'Deutsch (German)', status: 'coming_soon' },
  { code: 'es', name: 'Español (Spanish)', status: 'coming_soon' },
];

// --- Theme & Accent Colors ---
export const DEFAULT_THEME = Theme.SYSTEM;

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const generateCssVariables = (color: AccentColor): { [key: string]: string } => {
  const primaryRgb = hexToRgb(color.primary);
  const primaryHoverRgb = hexToRgb(color.primaryHover);
  const secondaryRgb = hexToRgb(color.secondary);
  const secondaryHoverRgb = hexToRgb(color.secondaryHover);
  
  if (!primaryRgb || !primaryHoverRgb || !secondaryRgb || !secondaryHoverRgb) {
      console.error("Invalid hex color for generating CSS variables. Check primary, primaryHover, secondary, or secondaryHover hex codes for color:", color.name);
      return {}; // Return empty or default if any color is invalid
  }

  return {
    '--primary-r': String(primaryRgb.r),
    '--primary-g': String(primaryRgb.g),
    '--primary-b': String(primaryRgb.b),
    '--primary-text-color': color.primaryText,
    '--primary-hover-r': String(primaryHoverRgb.r),
    '--primary-hover-g': String(primaryHoverRgb.g),
    '--primary-hover-b': String(primaryHoverRgb.b),
    '--secondary-r': String(secondaryRgb.r),
    '--secondary-g': String(secondaryRgb.g),
    '--secondary-b': String(secondaryRgb.b),
    '--secondary-text-color': color.secondaryText,
    '--secondary-hover-r': String(secondaryHoverRgb.r),
    '--secondary-hover-g': String(secondaryHoverRgb.g),
    '--secondary-hover-b': String(secondaryHoverRgb.b),
  };
};


export const ACCENT_COLORS: AccentColor[] = [
  { 
    name: 'Default Teal', 
    primary: '#06b6d4', primaryHover: '#0891b2', primaryText: '#ffffff',
    secondary: '#f59e0b', secondaryHover: '#d97706', secondaryText: '#1f2937',
    cssVariables: {} // Will be populated
  },
  { 
    name: 'Ocean Blue', 
    primary: '#0ea5e9', primaryHover: '#0284c7', primaryText: '#ffffff',
    secondary: '#f97316', secondaryHover: '#ea580c', secondaryText: '#ffffff',
    cssVariables: {}
  },
  { 
    name: 'Forest Green', 
    primary: '#10b981', primaryHover: '#059669', primaryText: '#ffffff',
    secondary: '#facc15', secondaryHover: '#eab308', secondaryText: '#1f2937',
    cssVariables: {}
  },
  { 
    name: 'Ruby Red', 
    primary: '#ef4444', primaryHover: '#dc2626', primaryText: '#ffffff',
    secondary: '#6b7280', secondaryHover: '#4b5563', secondaryText: '#ffffff',
    cssVariables: {}
  },
  { 
    name: 'Royal Purple', 
    primary: '#8b5cf6', primaryHover: '#7c3aed', primaryText: '#ffffff',
    secondary: '#ec4899', secondaryHover: '#db2777', secondaryText: '#ffffff',
    cssVariables: {}
  }
].map(color => ({ ...color, cssVariables: generateCssVariables(color) }));


export const DEFAULT_ACCENT_COLOR_NAME = ACCENT_COLORS[0].name;

// --- Placeholder Content for New Pages ---
// These remain in English as HTML strings for now.
// For full i18n, these would need a different strategy (e.g., markdown files per lang or component-based content).

export const HOW_TO_USE_CONTENT = `
<h2 class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">How to Use the AI Invoice Processor</h2>
<div class="space-y-6 text-gray-700 dark:text-gray-300">
  <section>
    <h3 class="text-xl font-semibold mb-2 text-primary dark:text-primary-hover">1. Uploading Invoices</h3>
    <p class="mb-2">To begin, navigate to the <strong class="font-semibold text-gray-900 dark:text-gray-100">Dashboard</strong>. You'll find the "Upload New Invoices" section prominently displayed.</p>
    <ul class="list-disc list-inside space-y-1 pl-4">
      <li>You can either <strong class="font-semibold text-gray-900 dark:text-gray-100">drag and drop</strong> your invoice files (PDF, JPG, PNG) directly onto the designated area.</li>
      <li>Alternatively, <strong class="font-semibold text-gray-900 dark:text-gray-100">click the upload area</strong> to open your file browser and select one or more invoices.</li>
      <li>The system supports a maximum file size of ${MAX_FILE_SIZE_MB}MB per invoice.</li>
    </ul>
    <p class="mt-2">Once uploaded, your invoices will appear in the "Uploaded Invoices" list, and the AI will automatically begin processing them.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold mb-2 text-primary dark:text-primary-hover">2. Monitoring Processing Status</h3>
    <p class="mb-2">Each invoice card in the "Uploaded Invoices" list displays its current status:</p>
    <ul class="list-disc list-inside space-y-1 pl-4">
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">PENDING:</strong> Queued for processing.</li>
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">UPLOADING:</strong> File is being uploaded to the server.</li>
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">EXTRACTING:</strong> The AI is actively reading and extracting data from the invoice.</li>
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">VALIDATING:</strong> Extracted data is being checked for accuracy and consistency.</li>
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">REVIEW PENDING:</strong> The AI has processed the invoice, but some data might require your attention or validation errors were found.</li>
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">COMPLETED:</strong> Data extraction and validation were successful.</li>
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">ERROR:</strong> An error occurred during processing. You may need to review or re-upload.</li>
    </ul>
    <p class="mt-2">The "Processing Overview" section on the Dashboard provides a summary of all invoice statuses.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold mb-2 text-primary dark:text-primary-hover">3. Reviewing and Editing Extracted Data</h3>
    <p class="mb-2">For invoices with status "REVIEW PENDING", "ERROR", or even "COMPLETED" (if you wish to verify), click the <strong class="font-semibold text-gray-900 dark:text-gray-100">"Review & Edit"</strong> (or "View") button on the invoice card.</p>
    <p class="mb-2">This will open the Invoice Review Modal, showing:</p>
    <ul class="list-disc list-inside space-y-1 pl-4">
      <li>A <strong class="font-semibold text-gray-900 dark:text-gray-100">preview of the original invoice document</strong> on one side.</li>
      <li>The <strong class="font-semibold text-gray-900 dark:text-gray-100">AI-extracted data fields</strong> on the other side.</li>
    </ul>
    <p class="mt-2">You can directly edit any field. If validation errors are present, they will be highlighted. After making corrections, click <strong class="font-semibold text-gray-900 dark:text-gray-100">"Save Changes & Mark as Completed"</strong>. This helps the AI learn and improve for future extractions.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold mb-2 text-primary dark:text-primary-hover">4. Deleting Invoices</h3>
    <p>If you need to remove an invoice, click the <strong class="font-semibold text-gray-900 dark:text-gray-100">trash can icon</strong> on its card. You'll be asked to confirm the deletion.</p>
  </section>
  
  <section>
    <h3 class="text-xl font-semibold mb-2 text-primary dark:text-primary-hover">5. Using the AI Assistant</h3>
    <p>If you have questions about using the app or encounter issues, click on <strong class="font-semibold text-gray-900 dark:text-gray-100">"AI Assistant"</strong> in the sidebar. Type your question, use voice input, or select a suggestion. Our AI will do its best to guide you.</p>
  </section>
</div>
`;

export const PRIVACY_POLICY_CONTENT = `
<h2 class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Privacy Policy</h2>
<div class="space-y-4 text-gray-700 dark:text-gray-300">
  <p><strong class="font-semibold text-gray-900 dark:text-gray-100">Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
  <p>${COMPANY_NAME} ("we," "us," or "our") operates the AI Invoice Processor application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">Information Collection and Use</h3>
    <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
    <h4 class="text-lg font-medium mt-2 mb-1 text-gray-800 dark:text-gray-200">Types of Data Collected:</h4>
    <ul class="list-disc list-inside pl-4 space-y-1">
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">Invoice Data:</strong> When you upload invoices, we process the content of these documents, which may include vendor names, addresses, contact details, financial information, and line items. This data is used solely for the purpose of extracting information as requested by you and providing the core functionality of the Service.</li>
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">Usage Data:</strong> We may collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.</li>
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">API Key:</strong> The Service requires a Google Gemini API Key for its AI processing capabilities. This key is stored and used exclusively within your browser's environment (e.g., via \`process.env.API_KEY\`) and is NOT transmitted to or stored on our servers. You are responsible for the security and management of your API Key.</li>
      <li><strong class="font-semibold text-gray-900 dark:text-gray-100">AI Assistant Interactions:</strong> Queries you make to the AI Assistant (text or voice converted to text) are sent to the Google Gemini API for processing. We do not store these interactions on our servers.</li>
    </ul>
  </section>

  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">Use of Data</h3>
    <p>${COMPANY_NAME} uses the collected data for various purposes:</p>
    <ul class="list-disc list-inside pl-4 space-y-1">
      <li>To provide and maintain our Service</li>
      <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
      <li>To provide customer support through the AI Assistant and other channels</li>
      <li>To gather analysis or valuable information so that we can improve our Service</li>
      <li>To monitor the usage of our Service</li>
      <li>To detect, prevent, and address technical issues</li>
    </ul>
    <p class="mt-2">Your invoice data and AI assistant queries are processed locally in your browser when interacting with the Gemini API. We do not store your invoice files, extracted data, or AI Assistant chat logs on our servers beyond what is necessary for the immediate processing request you initiate, or what you explicitly save in your browser's local storage.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">Data Storage and Security</h3>
    <p>The security of your data is important to us. Processed invoice data and related information are stored in your browser's local storage. While we strive to use commercially acceptable means to protect your data within the browser, remember that no method of transmission over the Internet or method of electronic storage is 100% secure. You are responsible for securing the device and browser you use to access the Service.</p>
    <p>Data sent to the Google Gemini API (invoice content for extraction, AI Assistant queries) is subject to Google's privacy policies and terms of service.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">Service Providers</h3>
    <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used. These third parties (e.g., Google Gemini API) have access to your data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">Changes to This Privacy Policy</h3>
    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">Contact Us</h3>
    <p>If you have any questions about this Privacy Policy, please contact us (details to be provided by ${COMPANY_NAME}).</p>
  </section>
</div>
`;

export const ABOUT_APP_CONTENT = `
<h2 class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">About the AI Invoice Processor</h2>
<div class="space-y-4 text-gray-700 dark:text-gray-300">
  <p>The AI Invoice Processor, a flagship project by <strong class="font-semibold text-gray-900 dark:text-gray-100">${COMPANY_NAME}</strong>, is engineered to transform your accounts payable workflow. By harnessing the capabilities of Google's Gemini AI, we offer a smart, automated solution for the entire invoice lifecycle.</p>
  
  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">Our Vision</h3>
    <p>We envision a future where manual data entry is obsolete, errors are minimized, and invoice processing is swift and seamless. Our goal is to empower businesses with efficient, accurate, and insightful financial operations, freeing up your team to focus on strategic growth.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">Core Capabilities: At Your Fingertips</h3>
    <p>This application is designed for intuitive use. Here’s how you can leverage its main features:</p>
    <ul class="list-decimal list-outside space-y-3 pl-5">
      <li>
        <strong class="font-semibold text-gray-900 dark:text-gray-100">Effortless Invoice Upload:</strong> 
        Navigate to the Dashboard and use the drag-and-drop area or file selector to upload your invoices (PDF, JPG, PNG). The AI begins processing immediately.
      </li>
      <li>
        <strong class="font-semibold text-gray-900 dark:text-gray-100">Intelligent Data Extraction:</strong> 
        Our AI automatically identifies and extracts crucial data like vendor details, invoice numbers, dates, line items, and totals from diverse invoice layouts.
      </li>
      <li>
        <strong class="font-semibold text-gray-900 dark:text-gray-100">Real-time Status Monitoring:</strong> 
        Track the progress of each invoice on the Dashboard, from "Pending" through "Extracting" and "Validating" to "Completed" or "Review Pending."
      </li>
      <li>
        <strong class="font-semibold text-gray-900 dark:text-gray-100">Interactive Review & Correction:</strong> 
        For invoices needing review, the "Review & Edit" modal provides a clear side-by-side comparison of the original document and the extracted data. Correct any field with ease.
      </li>
      <li>
        <strong class="font-semibold text-gray-900 dark:text-gray-100">Built-in Data Validation:</strong> 
        The system performs automatic checks for mathematical accuracy and data consistency, flagging potential issues for your attention.
      </li>
       <li>
        <strong class="font-semibold text-gray-900 dark:text-gray-100">AI-Powered Assistance:</strong> 
        Use the "AI Assistant" (accessible from the sidebar) for instant help. Ask questions about app features, troubleshooting, or invoice processing best practices via text or voice.
      </li>
      <li>
        <strong class="font-semibold text-gray-900 dark:text-gray-100">Personalized Experience:</strong> 
        Customize the app's appearance through the "Settings" page, choosing your preferred theme and accent color.
      </li>
    </ul>
    <p class="mt-3">Detailed step-by-step instructions are also available on the <strong class="font-semibold text-gray-900 dark:text-gray-100">"How to Use"</strong> page.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">Technology & Security</h3>
    <p>The application leverages Google's Gemini AI models for its core extraction and assistance capabilities. It operates primarily within your browser, ensuring your sensitive invoice data and API keys are handled with a focus on security. Interactions with the Gemini API are subject to Google's terms and privacy policies.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">Driven by ${COMPANY_NAME}</h3>
    <p>${COMPANY_NAME} is dedicated to pioneering AI solutions that address real-world challenges and foster innovation. Our expertise in machine learning and software engineering fuels our commitment to building impactful tools.</p>
  </section>

  <section>
    <h3 class="text-xl font-semibold my-3 text-primary dark:text-primary-hover">We Value Your Feedback</h3>
    <p>The AI Invoice Processor is continually evolving. Your insights and suggestions are crucial to its improvement. Please share your feedback through the AI Assistant or by contacting ${COMPANY_NAME}.</p>
  </section>
</div>
`;
