import React, { useState } from 'react';

interface StyleCardProps {
  label: string;
  originalText: string;
  transformedText: string;
  onCopy: (text: string) => void;
}

export const StyleCard: React.FC<StyleCardProps> = ({ label, originalText, transformedText, onCopy }) => {
  const [isHovered, setIsHovered] = useState(false);

  // If input is empty, show a placeholder in the transformed style
  const displayContent = originalText.trim() === '' ? 'Votre texte ici...' : transformedText;
  const isPlaceholder = originalText.trim() === '';

  const handleCopyClick = () => {
    if (isPlaceholder) return;
    onCopy(transformedText);
  };

  return (
    <div 
      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all duration-300 hover:border-brand-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 select-none">
            {label}
          </h3>
          <p className={`text-lg md:text-xl break-words leading-relaxed transition-colors duration-300 ${isPlaceholder ? 'text-slate-400 dark:text-slate-600 italic' : 'text-slate-800 dark:text-slate-200'}`}>
            {displayContent}
          </p>
        </div>
        
        <button
          onClick={handleCopyClick}
          disabled={isPlaceholder}
          className={`
            flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
            ${isPlaceholder 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
              : 'bg-brand-600 text-white shadow-lg shadow-brand-900/20 hover:bg-brand-500 active:scale-95'
            }
          `}
          aria-label={`Copier le texte style ${label}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span className="hidden md:inline">Copier</span>
        </button>
      </div>
    </div>
  );
};