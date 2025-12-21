import React from 'react';

interface PostPreviewProps {
  text: string;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const PostPreview: React.FC<PostPreviewProps> = ({ text, containerRef }) => {
  // LinkedIn cut-off logic (approximate)
  const LIMIT = 210;
  
  // Use array spread to safely handle surrogate pairs (fancy fonts/emojis)
  // This prevents splitting a 2-byte character in half
  const chars = [...text];
  const beforeLimit = chars.slice(0, LIMIT).join('');
  const afterLimit = chars.slice(LIMIT).join('');
  const hasOverflow = chars.length > LIMIT;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full max-h-[600px]">
      {/* Header (Fixed) */}
      <div className="p-4 flex gap-3 shrink-0 bg-white dark:bg-slate-800 z-10 relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-400 to-indigo-500 shrink-0"></div>
        <div className="flex flex-col justify-center">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-1.5"></div>
          <div className="h-3 w-24 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="px-4 pb-4 overflow-y-auto custom-scrollbar flex-grow scroll-smooth"
      >
        <div className="relative text-sm leading-relaxed whitespace-pre-wrap break-words text-slate-800 dark:text-slate-200 font-sans pl-1">
          <span>{beforeLimit}</span>
          
          {hasOverflow && (
            <span 
              className="absolute left-[-12px] w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)] cursor-help hover:scale-125 transition-transform z-10"
              style={{ marginTop: '0.5em' }}
              title="Limite 'Voir plus' : Le texte après ce point sera masqué par défaut sur LinkedIn"
            />
          )}

          <span>
            {afterLimit}
          </span>
        </div>
      </div>

      {/* Footer Stats (Fixed) */}
      <div className="shrink-0 bg-white dark:bg-slate-800 z-10 border-t border-slate-100 dark:border-slate-700/50">
        <div className="px-4 py-2 flex items-center gap-1">
            <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 border border-white"></div>
            <div className="w-4 h-4 rounded-full bg-red-500 border border-white"></div>
            <div className="w-4 h-4 rounded-full bg-green-500 border border-white"></div>
            </div>
            <span className="text-xs text-slate-500 ml-1">142</span>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-between">
            <div className="h-8 w-16 bg-slate-100 dark:bg-slate-700/30 rounded"></div>
            <div className="h-8 w-16 bg-slate-100 dark:bg-slate-700/30 rounded"></div>
            <div className="h-8 w-16 bg-slate-100 dark:bg-slate-700/30 rounded"></div>
            <div className="h-8 w-16 bg-slate-100 dark:bg-slate-700/30 rounded"></div>
        </div>
      </div>
    </div>
  );
};