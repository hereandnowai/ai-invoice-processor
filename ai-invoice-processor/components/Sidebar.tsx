import React from 'react';
import { AppPage, MenuItemConfig } from '../types';
import { MENU_ITEMS, COMPANY_FAVICON_URL, COMPANY_NAME } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onToggleAIAssistant: () => void;
  isMobileOpen: boolean;
  onCloseMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onToggleAIAssistant, isMobileOpen, onCloseMobileSidebar }) => {
  const { t } = useLanguage();

  const handleItemClick = (item: MenuItemConfig) => {
    if (item.id === 'AI_ASSISTANT_TOGGLE') {
      onToggleAIAssistant();
    } else if (item.page) {
      onNavigate(item.page);
    }
    if (isMobileOpen) {
        onCloseMobileSidebar();
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="p-4 flex items-center border-b border-gray-200 dark:border-gray-700">
        <img src={COMPANY_FAVICON_URL} alt={`${COMPANY_NAME} Logo`} className="h-10 w-10 mr-3 rounded-full object-contain bg-white p-1" />
        <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">{COMPANY_NAME.split(" ")[0]}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('sidebarInvoiceProcessor')}</p>
        </div>
      </div>
      <nav className="flex-grow p-3 space-y-1.5 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const isActive = item.page === currentPage && item.id !== 'AI_ASSISTANT_TOGGLE';
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out group
                ${isActive
                  ? 'bg-primary text-primary-text shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-text' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'}`} />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{t('sidebarHNAICopyright')}</p>
      </div>
    </div>
  );


  return (
    <>
      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden 
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                    bg-white dark:bg-gray-800 w-72 shadow-xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        {sidebarContent}
         <button 
            onClick={onCloseMobileSidebar} 
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-hover p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={t('closeSidebarTooltip')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
      {isMobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onCloseMobileSidebar} aria-hidden="true"></div>}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen border-r border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
        {/* Sidebar content is rendered directly here, not passed as children. The container takes bg color. */}
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
