import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/DashboardPage';
import SettingsPage from './components/SettingsPage';
import LanguagePage from './components/LanguagePage';
import ExtraFeaturesPage from './components/ExtraFeaturesPage';
import HowToUsePage from './components/HowToUsePage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import AboutPage from './components/AboutPage';
import AIAssistantModal from './components/AIAssistantModal';
import InvoiceReviewModal from './components/InvoiceReviewModal';
import { ProcessedInvoice, InvoiceStatus, ExtractedInvoiceData, AppPage, AIAssistantMessage, Theme, AccentColor, ChatMessageCore } from './types';
import { extractInvoiceData, getAIAssistantResponse, GEMINI_TEXT_MODEL } from './services/geminiService';
import { validateExtractedData } from './services/validationService';
import { MAX_FILE_SIZE_BYTES, SUPPORTED_FILE_TYPES, DEFAULT_THEME, ACCENT_COLORS, DEFAULT_ACCENT_COLOR_NAME, AI_ASSISTANT_SUGGESTION_KEYS } from './constants';
import { GoogleGenAI, Chat } from '@google/genai';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';


const AppContent: React.FC = () => {
  const [invoices, setInvoices] = useState<ProcessedInvoice[]>([]);
  const [selectedInvoiceForReview, setSelectedInvoiceForReview] = useState<ProcessedInvoice | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [processingInvoiceIds, setProcessingInvoiceIds] = useState<Set<string>>(new Set());

  // Theme and Accent Color State
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => (localStorage.getItem('appTheme') as Theme) || DEFAULT_THEME);
  const [currentAccentName, setCurrentAccentName] = useState<string>(() => localStorage.getItem('appAccentColor') || DEFAULT_ACCENT_COLOR_NAME);
  
  // Navigation and Modals State
  const [currentPage, setCurrentPage] = useState<AppPage>(AppPage.DASHBOARD);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isAIAssistantModalOpen, setIsAIAssistantModalOpen] = useState<boolean>(false);
  const [aiAssistantMessages, setAiAssistantMessages] = useState<AIAssistantMessage[]>([]);
  const aiChatInstanceRef = useRef<Chat | null>(null);
  const { t, language } = useLanguage(); // Get t function and current language


  // Initialize AI Chat Instance
  useEffect(() => {
    if (process.env.API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // System instruction could potentially be translated or adapted based on `language` state if Gemini supports it well.
      // For now, keeping it in English.
      aiChatInstanceRef.current = ai.chats.create({
        model: GEMINI_TEXT_MODEL, 
        config: {
          systemInstruction: `You are a friendly and helpful AI assistant for an application called "AI Invoice Processor" by HEREANDNOW AI RESEARCH INSTITUTE.
          Your primary goal is to assist users with using the application. Be concise and clear.
          The user is currently using the app in ${language} language. Try to respond in ${language} if you are confident, otherwise respond in English.
          Key features of the app:
          - Invoice data extraction (Vendor, Invoice #, Dates, Line Items, Totals) from PDF, JPG, PNG.
          - Automated data validation.
          - Manual review and editing of extracted data.
          - Dashboard for overview and invoice management.
          - Customizable settings for theme and accent color.
          - AI Assistant (yourself) for help.
          If asked about functionality not listed or "Planned", state it's planned for future updates.
          Do not provide financial advice. Stick to app functionality.
          If a user asks a general question not related to the app, politely steer them back or state you can only help with the app.
          Keep responses relatively short and easy to understand. Use markdown for light formatting if it helps readability (like lists).`,
        },
      });
    } else {
      console.warn("API_KEY not found. AI Assistant will have limited functionality.");
    }
  }, [language]); // Re-initialize if language changes, to update system prompt.


  // --- Theme & Accent Application ---
  useEffect(() => {
    localStorage.setItem('appTheme', currentTheme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (currentTheme === Theme.SYSTEM) {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      } else {
        document.documentElement.classList.toggle('dark', currentTheme === Theme.DARK);
      }
    };

    applyTheme(); // Apply theme immediately

    // Listen for changes if system theme is selected
    if (currentTheme === Theme.SYSTEM) {
      mediaQuery.addEventListener('change', applyTheme);
    }

    return () => {
      mediaQuery.removeEventListener('change', applyTheme);
    };
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('appAccentColor', currentAccentName);
    const selectedAccent = ACCENT_COLORS.find(ac => ac.name === currentAccentName) || ACCENT_COLORS[0];
    Object.entries(selectedAccent.cssVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [currentAccentName]);


  // --- Invoice Data Persistence ---
  useEffect(() => {
    try {
      const storedInvoices = localStorage.getItem('invoices');
      if (storedInvoices) {
        const parsedInvoices: ProcessedInvoice[] = JSON.parse(storedInvoices).map((inv: ProcessedInvoice) => ({
          ...inv,
          file: new File([], inv.fileName, { type: inv.fileType }), // Create dummy file
          uploadTimestamp: new Date(inv.uploadTimestamp),
          processingTimestamp: inv.processingTimestamp ? new Date(inv.processingTimestamp) : null,
        }));
        setInvoices(parsedInvoices);
      }
    } catch (error) {
        console.error("Failed to load invoices from localStorage:", error);
        localStorage.removeItem('invoices');
    }
  }, []);

  useEffect(() => {
    try {
        const serializableInvoices = invoices.map(inv => {
            const { file, ...rest } = inv; // Exclude file from serialization
            return rest;
        });
        localStorage.setItem('invoices', JSON.stringify(serializableInvoices));
    } catch (error) {
        console.error("Failed to save invoices to localStorage:", error);
    }
  }, [invoices]);
  

  const processSingleInvoice = useCallback(async (invoiceId: string, fileToProcess: File) => {
    setProcessingInvoiceIds(prev => new Set(prev).add(invoiceId));
    setInvoices(prevInvoices =>
      prevInvoices.map(inv =>
        inv.id === invoiceId ? { ...inv, status: InvoiceStatus.EXTRACTING, errorMessage: null } : inv
      )
    );
    
    if (!fileToProcess || fileToProcess.size === 0) {
        console.error(`File for invoice ID ${invoiceId} is invalid.`);
         setInvoices(prevInvoices =>
            prevInvoices.map(inv =>
            inv.id === invoiceId ? { ...inv, status: InvoiceStatus.ERROR, errorMessage: 'File not found or empty for processing.' } : inv
            )
        );
        setProcessingInvoiceIds(prev => { const next = new Set(prev); next.delete(invoiceId); return next; });
        return;
    }
    
    try {
      const extractedData: ExtractedInvoiceData = await extractInvoiceData(fileToProcess);
      setInvoices(prevInvoices =>
        prevInvoices.map(inv =>
          inv.id === invoiceId ? { ...inv, extractedData, status: InvoiceStatus.VALIDATING } : inv
        )
      );

      const validationResult = validateExtractedData(extractedData);
      setInvoices(prevInvoices =>
        prevInvoices.map(inv =>
          inv.id === invoiceId
            ? {
                ...inv,
                status: validationResult.isValid ? InvoiceStatus.COMPLETED : InvoiceStatus.REVIEW_PENDING,
                validationErrors: validationResult.errors,
                processingTimestamp: new Date(),
              }
            : inv
        )
      );
    } catch (error: any) {
      console.error(`Error processing invoice ${invoiceId}:`, error);
      setInvoices(prevInvoices =>
        prevInvoices.map(inv =>
          inv.id === invoiceId
            ? { ...inv, status: InvoiceStatus.ERROR, errorMessage: error.message || 'Unknown processing error', processingTimestamp: new Date() }
            : inv
        )
      );
    } finally {
        setProcessingInvoiceIds(prev => { const next = new Set(prev); next.delete(invoiceId); return next; });
    }
  }, []); 

  const handleFilesSelected = async (files: File[]) => {
    setIsUploading(true);
    const newInvoicesToProcess: { invoice: ProcessedInvoice, file: File }[] = [];

    for (const file of files) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            alert(`File ${file.name} is too large (max ${MAX_FILE_SIZE_BYTES / (1024*1024)}MB).`); // TODO: Translate
            continue;
        }
        if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
            alert(`File ${file.name} has an unsupported type. Supported: ${SUPPORTED_FILE_TYPES.join(', ')}.`); // TODO: Translate
            continue;
        }

        const previewUrl = (file.type.startsWith('image/') || file.type === 'application/pdf') ? URL.createObjectURL(file) : null;
        const newInvoice: ProcessedInvoice = {
            id: crypto.randomUUID(),
            file: file, 
            fileName: file.name,
            fileType: file.type,
            previewUrl,
            status: InvoiceStatus.PENDING,
            extractedData: null,
            validationErrors: [],
            errorMessage: null,
            uploadTimestamp: new Date(),
        };
        newInvoicesToProcess.push({ invoice: newInvoice, file: file });
    }
    
    if (newInvoicesToProcess.length > 0) {
        setInvoices(prev => [...newInvoicesToProcess.map(item => item.invoice), ...prev]);
        for (const item of newInvoicesToProcess) {
            await processSingleInvoice(item.invoice.id, item.file);
        }
    }
    setIsUploading(false);
  };

  const handleOpenReviewModal = (invoiceId: string) => {
    const invoiceToReview = invoices.find(inv => inv.id === invoiceId);
    if (invoiceToReview) {
      setSelectedInvoiceForReview(invoiceToReview);
    }
  };

  const handleCloseReviewModal = () => {
    setSelectedInvoiceForReview(null);
  };

  const handleSaveReviewedInvoice = (updatedInvoice: ProcessedInvoice) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(inv => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    );
    setSelectedInvoiceForReview(null); 
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm(t('confirmDeleteInvoice'))) {
        const invoiceToDelete = invoices.find(inv => inv.id === invoiceId);
        if (invoiceToDelete?.previewUrl) {
            URL.revokeObjectURL(invoiceToDelete.previewUrl);
        }
        setInvoices(prevInvoices => prevInvoices.filter(inv => inv.id !== invoiceId));
    }
  };

  // --- Navigation and Modal handlers ---
  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    setIsMobileSidebarOpen(false); 
  };

  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  const handleToggleAIAssistantModal = () => {
    setIsAIAssistantModalOpen(prev => !prev);
    if (!isAIAssistantModalOpen && aiAssistantMessages.length === 0) {
        const suggestions: AIAssistantMessage[] = AI_ASSISTANT_SUGGESTION_KEYS.map(key => ({
            id: crypto.randomUUID(),
            text: t(key), // Translate suggestion keys
            sender: 'suggestion',
            timestamp: new Date(),
            isSuggestion: true,
        }));
        // Add a general greeting message from AI
        const greetingMessage: AIAssistantMessage = {
            id: crypto.randomUUID(),
            text: t('aiAssistantModalHelp'),
            sender: 'ai',
            timestamp: new Date()
        };
        setAiAssistantMessages([greetingMessage, ...suggestions]);
    }
    setIsMobileSidebarOpen(false);
  };
  
  const handleSendAIAssistantMessage = async (text: string, isSuggestionClick: boolean = false) => {
    const userMessage: AIAssistantMessage = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    if (isSuggestionClick) {
        setAiAssistantMessages(prev => [prev.find(m => m.sender === 'ai') || {id: crypto.randomUUID(), text: t('aiAssistantModalHelp'), sender: 'ai', timestamp: new Date()}, userMessage].filter(Boolean) as AIAssistantMessage[]);
    } else {
        setAiAssistantMessages(prev => prev.filter(m => !m.isSuggestion).concat(userMessage));
    }

    if (!aiChatInstanceRef.current) {
        const aiErrorResponse: AIAssistantMessage = {
          id: crypto.randomUUID(),
          text: "Sorry, the AI Assistant is currently unavailable. API Key might be missing.", // TODO: Translate
          sender: 'ai',
          timestamp: new Date(),
        };
        setAiAssistantMessages(prev => [...prev, aiErrorResponse]);
        return;
    }

    try {
      const responseText = await getAIAssistantResponse(aiChatInstanceRef.current, text);
      const aiResponse: AIAssistantMessage = {
        id: crypto.randomUUID(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setAiAssistantMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error("Error getting AI assistant response:", error);
      const aiErrorResponse: AIAssistantMessage = {
        id: crypto.randomUUID(),
        text: `Sorry, I encountered an error: ${error.message || 'Unknown error'}`, // TODO: Translate
        sender: 'ai',
        timestamp: new Date(),
      };
      setAiAssistantMessages(prev => [...prev, aiErrorResponse]);
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      invoices.forEach(invoice => {
        if (invoice.previewUrl) {
          URL.revokeObjectURL(invoice.previewUrl);
        }
      });
    };
  }, [invoices]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case AppPage.DASHBOARD:
        return (
          <DashboardPage
            invoices={invoices}
            onFilesSelected={handleFilesSelected}
            onReviewInvoice={handleOpenReviewModal}
            onDeleteInvoice={handleDeleteInvoice}
            isUploading={isUploading}
            processingInvoiceIds={processingInvoiceIds}
          />
        );
      case AppPage.SETTINGS:
        return <SettingsPage 
                  currentTheme={currentTheme}
                  onThemeChange={setCurrentTheme}
                  currentAccentName={currentAccentName}
                  onAccentChange={setCurrentAccentName} 
                />;
      case AppPage.LANGUAGE:
        return <LanguagePage />;
      case AppPage.EXTRA_FEATURES:
        return <ExtraFeaturesPage />;
      case AppPage.HOW_TO_USE:
        return <HowToUsePage />;
      case AppPage.PRIVACY_POLICY:
        return <PrivacyPolicyPage />;
      case AppPage.ABOUT:
        return <AboutPage />;
      default:
        return <DashboardPage invoices={invoices} onFilesSelected={handleFilesSelected} onReviewInvoice={handleOpenReviewModal} onDeleteInvoice={handleDeleteInvoice} isUploading={isUploading} processingInvoiceIds={processingInvoiceIds}/>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      <Sidebar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onToggleAIAssistant={handleToggleAIAssistantModal}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col max-h-screen"> {/* Ensure header and main content are within this flex container */}
        <Header 
            onToggleMobileSidebar={handleToggleMobileSidebar} 
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
        />
        <main className="flex-grow overflow-y-auto"> {/* Removed p-0 as pages should handle their own padding */}
          {renderCurrentPage()}
        </main>
      </div>
      
      <InvoiceReviewModal
        invoice={selectedInvoiceForReview}
        isOpen={!!selectedInvoiceForReview}
        onClose={handleCloseReviewModal}
        onSave={handleSaveReviewedInvoice}
      />
      <AIAssistantModal
        isOpen={isAIAssistantModalOpen}
        onClose={handleToggleAIAssistantModal}
        messages={aiAssistantMessages}
        onSendMessage={handleSendAIAssistantMessage}
      />
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;