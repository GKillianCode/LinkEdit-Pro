import React, { useRef, useState, useEffect } from 'react';
import { styles, cleanFormat } from '../utils/transformations';
import { PostPreview } from './PostPreview';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  onCopy: (text: string) => void;
}

export const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, onCopy }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [showCarousel, setShowCarousel] = useState(false);

  // Scroll Synchronization Logic
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!previewRef.current || !textareaRef.current) return;
    
    const textarea = e.currentTarget;
    const preview = previewRef.current;

    // Calculate percentage of scroll
    const scrollPercentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
    
    // Apply to preview
    if (!isNaN(scrollPercentage)) {
        preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
    }
  };

  // Apply a transform to the SELECTED text in the textarea
  const applyStyle = (transformId: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    if (start === end) return; // No selection

    const selectedText = currentText.substring(start, end);
    const style = styles.find(s => s.id === transformId);
    
    if (!style) return;

    let textToTransform = selectedText;

    // CRITICAL FIX: If switching fonts (not decoration), clean the text first.
    // This allows jumping from "Bold" to "Script" without getting garbage output.
    if (style.category !== 'decoration') {
        textToTransform = cleanFormat(selectedText);
    }

    const transformed = style.transform(textToTransform);

    // Insert new text
    const newText = currentText.substring(0, start) + transformed + currentText.substring(end);
    
    // Update state
    onChange(newText);

    // Restore selection (optional, but good UX)
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + transformed.length);
    });
  };

  const handleCleanAll = () => {
    if (window.confirm('Voulez-vous vraiment effacer tout le formatage ?')) {
        const cleaned = cleanFormat(value);
        onChange(cleaned);
    }
  };

  const handleCleanSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    if (start === end) return;

    const selectedText = currentText.substring(start, end);
    const cleanedSelection = cleanFormat(selectedText);
    const newText = currentText.substring(0, start) + cleanedSelection + currentText.substring(end);
    
    onChange(newText);

    requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + cleanedSelection.length);
    });
  };

  // Helper to insert prefix (list bullet/indent) at start of lines for selection
  const applyListOrIndent = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    // Find start of the line where selection begins
    let lineStart = currentText.lastIndexOf('\n', start - 1) + 1;
    if (lineStart < 0) lineStart = 0;

    // Find end of the line where selection ends
    let lineEnd = currentText.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = currentText.length;

    // Extract the affected block of text
    const textBlock = currentText.substring(lineStart, lineEnd);
    
    // Apply prefix to each line
    const lines = textBlock.split('\n');
    const newLines = lines.map(line => prefix + line);
    const newTextBlock = newLines.join('\n');

    const newText = currentText.substring(0, lineStart) + newTextBlock + currentText.substring(lineEnd);
    
    onChange(newText);
    
    // Restore selection covering the modified block
    requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(lineStart, lineStart + newTextBlock.length);
    });
  };

  // Handle Tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      // If multiline selection, use block indent
      if (start !== end && val.substring(start, end).includes('\n')) {
          applyListOrIndent('\u2003');
          return;
      }

      // Simple insertion of Em Space
      const indent = '\u2003';
      const newValue = val.substring(0, start) + indent + val.substring(end);
      
      onChange(newValue);
      
      // Move cursor
      requestAnimationFrame(() => {
          if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + indent.length;
          }
      });
    }
  };

  // Carousel Logic (Split by double newline)
  const slides = value.split(/\n\s*\n/).filter(s => s.trim().length > 0);

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-full">
      {/* Editor Column: Expanded to 8 cols and added min-w-0 to prevent overflow */}
      <div className="lg:col-span-8 flex flex-col gap-6 min-w-0 relative">
        
        {/* Floating Toolbar */}
        <div className="sticky top-6 z-50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-slate-900/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-2.5 flex flex-wrap gap-1.5 items-center justify-between">
                
                {/* Clean Tools Group */}
                <div className="flex items-center gap-1.5 pr-3 border-r border-slate-700/50 mr-1.5">
                     <button 
                        onClick={handleCleanSelection}
                        className="w-10 h-10 flex items-center justify-center text-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition-all duration-200 border border-slate-700 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20 active:scale-95 group"
                        title="Nettoyer la sélection"
                    >
                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </button>
                    <button 
                        onClick={handleCleanAll}
                        className="w-10 h-10 flex items-center justify-center text-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-all duration-200 border border-slate-700 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 active:scale-95 group"
                        title="Tout effacer"
                    >
                        <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-wrap gap-1.5 flex-1 justify-start">
                    {/* Style Tools */}
                    {[
                        { id: 'bold_sans', icon: '𝐁', label: 'Gras' },
                        { id: 'italic_sans', icon: '𝐼', label: 'Italique' },
                        { id: 'bold_italic_sans', icon: '𝐁𝐼', label: 'Gras Ital' },
                        { id: 'underline', icon: 'U̲', label: 'Souligné' },
                        { id: 'square_black', icon: '🅰', label: 'Carré' },
                        { id: 'script', icon: '𝓢', label: 'Script' },
                        { id: 'monospace', icon: 'M', label: 'Mono' },
                    ].map((tool) => (
                        <button
                        key={tool.id}
                        onMouseDown={(e) => { e.preventDefault(); applyStyle(tool.id); }}
                        className="w-10 h-10 flex items-center justify-center text-xl bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white rounded-xl transition-all duration-200 border border-slate-700 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/20 active:scale-95"
                        title={tool.label}
                        >
                        {tool.icon}
                        </button>
                    ))}

                    <div className="w-px h-8 bg-slate-700/50 mx-1.5"></div>

                    {/* List & Indent Tools */}
                    {[
                        { id: 'list_bullet', icon: '•', label: 'Liste Puces', action: () => applyListOrIndent('• ') },
                        { id: 'list_arrow', icon: '➜', label: 'Liste Flèches', action: () => applyListOrIndent('➜ ') },
                        { id: 'list_check', icon: '✔', label: 'Liste Check', action: () => applyListOrIndent('✔ ') },
                        { id: 'indent', icon: '⇥', label: 'Indentation', action: () => applyListOrIndent('\u2003') }, 
                    ].map((tool) => (
                        <button
                        key={tool.id}
                        onMouseDown={(e) => { e.preventDefault(); tool.action(); }}
                        className="w-10 h-10 flex items-center justify-center text-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl transition-all duration-200 border border-slate-700 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                        title={tool.label}
                        >
                        {tool.icon}
                        </button>
                    ))}
                </div>
                
                <div className="pl-3 border-l border-slate-700/50 ml-1.5 hidden md:block">
                    <button
                        onClick={() => onCopy(value)}
                        className="bg-brand-600 hover:bg-brand-500 text-white p-2.5 rounded-xl font-medium transition-all hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] active:scale-95 flex items-center justify-center"
                        title="Copier tout le texte"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    </button>
                </div>
            </div>
        </div>

        {/* Textarea */}
        <div className="relative group flex-grow">
           <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
           <textarea
            ref={textareaRef}
            value={value}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            onChange={(e) => onChange(e.target.value)}
            className="relative w-full min-h-[600px] h-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 resize-none text-lg leading-relaxed font-sans shadow-xl dark:shadow-slate-950/50"
            placeholder="Commencez à rédiger votre chef-d'œuvre LinkedIn ici..."
          />
        </div>
      </div>

      {/* Preview Column: Reduced to 4 cols, added min-w-0 */}
      <div className="lg:col-span-4 flex flex-col gap-6 min-w-0 h-full">
        
        {/* Tabs for Preview Mode */}
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg self-start shrink-0">
            <button 
                onClick={() => setShowCarousel(false)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!showCarousel ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
                Aperçu Mobile
            </button>
            <button 
                onClick={() => setShowCarousel(true)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${showCarousel ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
                Générateur Carrousel
            </button>
        </div>

        {showCarousel ? (
           <div className="space-y-4 animate-fade-in flex-grow overflow-hidden flex flex-col">
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-4 rounded-lg text-sm border border-amber-200 dark:border-amber-800/50 shrink-0">
                  💡 Séparez vos paragraphes par une ligne vide pour créer de nouvelles diapositives.
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {slides.map((slide, idx) => (
                    <div key={idx} className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-xl flex items-center justify-center text-white shadow-lg relative group">
                        <span className="absolute top-4 left-4 text-white/50 text-xs font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                        <p className="text-xl md:text-2xl font-bold text-center whitespace-pre-wrap break-words">{slide}</p>
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => onCopy(slide)} className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-3 py-1 rounded text-xs">Copier texte</button>
                        </div>
                    </div>
                ))}
                {slides.length === 0 && (
                    <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700">
                        Écrivez du texte pour voir les diapositives
                    </div>
                )}
              </div>
           </div>
        ) : (
            <div className="flex-grow flex flex-col overflow-hidden">
                <div className="mb-2 flex justify-between items-end shrink-0">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Simulation LinkedIn</h3>
                </div>
                <div className="flex-grow min-h-0">
                     <PostPreview text={value} containerRef={previewRef} />
                </div>
                <div className="mt-4 text-xs text-slate-400 text-center shrink-0">
                    Ceci est une simulation visuelle pour vérifier les coupures de texte.
                </div>
            </div>
        )}

      </div>
    </div>
  );
};