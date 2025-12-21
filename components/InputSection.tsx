import React from 'react';

interface InputSectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ value, onChange, onClear }) => {
  const charCount = value.length;
  // LinkedIn see more limits approx: Mobile ~140-210, Desktop ~210-300 depending on line breaks
  const seeMoreLimit = 210;
  const isOverLimit = charCount > seeMoreLimit;

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
      <div className="relative bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors duration-300 flex flex-col">
        <div className="bg-white/50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center backdrop-blur-sm">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Éditeur</span>
        </div>
        
        <textarea
          value={value}
          onChange={onChange}
          placeholder="Tapez votre texte ici pour le transformer..."
          className="w-full h-64 bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 p-6 focus:outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 text-lg md:text-xl leading-relaxed transition-colors duration-300 flex-grow"
          autoFocus
        />
        
        <div className="flex items-center justify-between px-4 py-3 bg-white/30 dark:bg-slate-950/30 border-t border-slate-200 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-2 py-1 rounded-md ${isOverLimit ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {charCount} chars
            </span>
            {isOverLimit && (
              <span className="text-[10px] text-amber-500 uppercase font-bold tracking-wider">
                Zone "Voir plus" atteinte
              </span>
            )}
          </div>

          {value && (
            <button 
              onClick={onClear}
              className="text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-full transition-colors border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
            >
              Effacer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};