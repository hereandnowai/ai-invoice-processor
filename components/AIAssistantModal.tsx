import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AIAssistantMessage } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { MicrophoneIcon } from '../constants'; 
import { useLanguage } from '../contexts/LanguageContext';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AIAssistantMessage[];
  onSendMessage: (text: string, isSuggestionClick?: boolean) => Promise<void>;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, messages, onSendMessage }) => {
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null); 
  const { t, language } = useLanguage();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  }, [isOpen, isListening]);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language; // Use current app language for speech recognition

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        // TODO: Show translated error to user
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]); // Re-initialize if language changes

  const handleToggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported by your browser."); // TODO: Translate
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setUserInput(''); 
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleSubmit = async (e: React.FormEvent, suggestionText?: string) => {
    e.preventDefault();
    const textToSend = suggestionText || userInput.trim();
    if (!textToSend || isSending) return;
    
    setIsSending(true);
    try {
      await onSendMessage(textToSend, !!suggestionText);
      setUserInput('');
    } catch (error) {
      console.error("Error sending message to AI assistant:", error);
    } finally {
      setIsSending(false);
      if (isListening) { 
        recognitionRef.current?.stop();
        setIsListening(false);
      }
    }
  };
  
  if (!isOpen) return null;

  const suggestionMessages = messages.filter(msg => msg.isSuggestion);
  const chatMessages = messages.filter(msg => !msg.isSuggestion);

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-assistant-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-primary dark:text-primary-hover" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a.38.38 0 01.265-.112c2.036-.207 3.833-.944 5.126-2.1V9.75M8.25 9.75A2.625 2.625 0 005.625 7.125H3a2.25 2.25 0 00-2.25 2.25v4.125c0 1.584 1.06 2.926 2.519 3.191.163.027.329.05.495.071L6.75 21v-2.707c.623.085 1.25.149 1.875.195H12c1.933 0 3.682-.746 4.986-1.992A4.502 4.502 0 0021 13.125V9.75c0-1.109-.386-2.138-1.03-2.964A4.508 4.508 0 0017.25 6H15c-2.209 0-4 1.791-4 4v.75z" />
            </svg>
            <h3 id="ai-assistant-title" className="text-xl font-semibold text-gray-900 dark:text-white">{t('aiAssistantModalTitle')}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow p-4 sm:p-6 space-y-4 overflow-y-auto">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl shadow ${
                  msg.sender === 'user' 
                  ? 'bg-primary text-primary-text rounded-br-none' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-text/70' : 'text-gray-500 dark:text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isSending && messages[messages.length-1]?.sender === 'user' && (
            <div className="flex justify-start">
                 <div className="max-w-[80%] p-3 rounded-xl shadow bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                    <LoadingSpinner size="sm" color="text-gray-500 dark:text-gray-400" />
                 </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {suggestionMessages.length > 0 && !isSending && (
             <div className="px-4 pb-2 pt-1 flex flex-wrap gap-2 border-t border-gray-200 dark:border-gray-700">
                <p className="w-full text-xs text-gray-500 dark:text-gray-400 mb-1">{t('aiAssistantModalSuggestions')}</p>
                {suggestionMessages.map(sugg => (
                    <button
                        key={sugg.id}
                        onClick={(e) => handleSubmit(e, sugg.text)}
                        className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-primary dark:text-primary-hover rounded-full shadow-sm"
                    >
                        {sugg.text}
                    </button>
                ))}
            </div>
        )}


        <form onSubmit={handleSubmit} className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={isListening ? t('aiAssistantModalListening') : t('aiAssistantModalPlaceholder')}
              disabled={isSending || isListening}
              className="flex-grow p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-colors duration-150"
              aria-label={t('aiAssistantModalPlaceholder')}
            />
            {recognitionRef.current && ( 
              <button
                type="button"
                onClick={handleToggleListening}
                disabled={isSending}
                className={`p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-primary disabled:opacity-50 flex items-center justify-center w-11 h-11 transition-colors
                            ${isListening ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300'}`}
                aria-label={isListening ? t('aiAssistantModalStopListening') : t('aiAssistantModalStartListening')}
              >
                <MicrophoneIcon className="h-5 w-5" />
              </button>
            )}
            <button 
              type="submit" 
              disabled={isSending || (!userInput.trim() && !suggestionMessages.find(s => s.text === userInput.trim()))}
              className="p-2.5 bg-primary hover:bg-primary-hover text-primary-text rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-primary disabled:opacity-50 flex items-center justify-center w-11 h-11 transition-colors"
              aria-label={t('aiAssistantModalSend')}
            >
              {isSending ? (
                <LoadingSpinner size="sm" color="text-white" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11.691l4.47-4.471a1 1 0 00-1.396-1.432l-4.243 4.242V6.571a1 1 0 000-1.018l1.018-5.093zM13.409 17.581L12 17l1.409.581zM11 11.691v4.88L15.409 17.58l-1.48-3.701a.998.998 0 00-1.528-.465L11 14.58V11.69z" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantModal;
