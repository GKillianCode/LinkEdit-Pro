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

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!previewRef.current || !textareaRef.current) return;
    const textarea = e.currentTarget;
    const preview = previewRef.current;
    const scrollPercentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
    if (!isNaN(scrollPercentage)) {
        preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
    }
  };

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const newText = currentText.substring(0, start) + textToInsert + currentText.substring(end);
    onChange(newText);
    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = start + textToInsert.length;
      textarea.setSelectionRange(newPos, newPos);
    });
  };

  const applyStyle = (transformId: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    if (start === end) return;

    const selectedText = currentText.substring(start, end);
    const style = styles.find(s => s.id === transformId);
    if (!style) return;

    const cleaned = cleanFormat(selectedText);
    const transformed = style.transform(cleaned);
    const newText = currentText.substring(0, start) + transformed + currentText.substring(end);
    onChange(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + transformed.length);
    });
  };

  const applyListOrIndent = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    let lineStart = currentText.lastIndexOf('\n', start - 1) + 1;
    if (lineStart < 0) lineStart = 0;
    let lineEnd = currentText.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = currentText.length;
    const textBlock = currentText.substring(lineStart, lineEnd);
    const lines = textBlock.split('\n');
    const newLines = lines.map(line => prefix + line);
    const newTextBlock = newLines.join('\n');
    const newText = currentText.substring(0, lineStart) + newTextBlock + currentText.substring(lineEnd);
    onChange(newText);
    requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(lineStart, lineStart + newTextBlock.length);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const isMultiline = val.substring(start, end).includes('\n');
      const isAtStartOfLine = start === 0 || val[start - 1] === '\n';
      if (isMultiline || isAtStartOfLine) applyListOrIndent('\u2003');
      else insertTextAtCursor('\u2003');
    }
  };

  const slides = value.split(/\n\s*\n/).filter(s => s.trim().length > 0);

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-8 flex flex-col gap-6 min-w-0 relative">
        <div className="sticky top-6 z-50 transition-all duration-300">
            <div className="bg-slate-900/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-2.5 flex flex-wrap gap-1.5 items-center">
                
                <div className="flex items-center gap-1.5 pr-3 border-r border-slate-700/50">
                     <button onClick={() => {
                        const start = textareaRef.current?.selectionStart;
                        const end = textareaRef.current?.selectionEnd;
                        if (start !== undefined && end !== undefined && start !== end) {
                            const cleaned = cleanFormat(value.substring(start, end));
                            onChange(value.substring(0, start) + cleaned + value.substring(end));
                        }
                     }} className="w-10 h-10 flex items-center justify-center text-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700 active:scale-95" title="Nettoyer sélection">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>

                <div className="flex flex-wrap gap-1.5 flex-1 justify-start ml-1.5">
                    <div className="flex gap-1 items-center bg-slate-800/50 px-1.5 py-1 rounded-xl border border-slate-700/50">
                      {[
                          { id: 'bold_sans', icon: '𝐁', label: 'Gras' },
                          { id: 'italic_sans', icon: '𝐼', label: 'Italique' },
                          { id: 'bold_italic_sans', icon: '𝐁𝐼', label: 'Gras Ital' },
                          { id: 'underline', icon: 'U̲', label: 'Souligné' },
                          { id: 'script', icon: '𝓢', label: 'Manuscrit' },
                      ].map((tool) => (
                          <button key={tool.id} onMouseDown={(e) => { e.preventDefault(); applyStyle(tool.id); }} className="w-9 h-9 flex items-center justify-center text-lg hover:bg-brand-600 text-slate-300 hover:text-white rounded-lg transition-all active:scale-95" title={tool.label}>{tool.icon}</button>
                      ))}
                    </div>

                    <div className="flex gap-1 items-center bg-slate-800/50 px-1.5 py-1 rounded-xl border border-slate-700/50">
                       <div className="flex flex-col items-center justify-center px-1 border-r border-slate-700/50 mr-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase select-none leading-none">Taille</span>
                       </div>
                       {[
                          { id: 'small_caps', icon: 'ᴀʙᴄ', label: 'Petit', color: 'hover:bg-amber-600' },
                          { id: 'bold_sans', icon: 'TITRE', label: 'Titre (Gras)', color: 'hover:bg-brand-600' },
                          { id: 'superscript', icon: 'ᵃᵇᶜ', label: 'Exposant', color: 'hover:bg-indigo-600' },
                       ].map((tool) => (
                          <button key={tool.id} onMouseDown={(e) => { e.preventDefault(); applyStyle(tool.id); }} className={`px-2 h-9 flex items-center justify-center text-xs font-bold ${tool.color} text-slate-300 hover:text-white rounded-lg transition-all active:scale-95`} title={tool.label}>{tool.icon}</button>
                       ))}
                    </div>

                    <div className="flex gap-1 items-center bg-slate-800/50 px-1.5 py-1 rounded-xl border border-slate-700/50">
                        <button onMouseDown={(e) => { e.preventDefault(); applyListOrIndent('• '); }} className="w-9 h-9 flex items-center justify-center text-lg hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all" title="Liste">•</button>
                        <button onMouseDown={(e) => { e.preventDefault(); applyListOrIndent('\u2003'); }} className="w-9 h-9 flex items-center justify-center text-lg hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all" title="Indentation">⇥</button>
                    </div>
                </div>
                
                <button onClick={() => onCopy(value)} className="bg-brand-600 hover:bg-brand-500 text-white p-2.5 rounded-xl font-medium ml-auto"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg></button>
            </div>
        </div>

        <div className="relative group flex-grow">
           <textarea ref={textareaRef} value={value} onScroll={handleScroll} onKeyDown={handleKeyDown} onChange={(e) => onChange(e.target.value)} className="w-full min-h-[600px] h-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-500/50 resize-none text-lg shadow-xl" placeholder="Rédigez ici..." />
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6 h-full">
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg self-start">
            <button onClick={() => setShowCarousel(false)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!showCarousel ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Aperçu</button>
            <button onClick={() => setShowCarousel(true)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${showCarousel ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Carrousel</button>
        </div>

        {showCarousel ? (
           <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {slides.map((slide, idx) => (
                    <div key={idx} className="aspect-square bg-gradient-to-br from-brand-600 to-brand-800 p-8 rounded-xl flex items-center justify-center text-white shadow-lg relative shrink-0">
                        <p className="text-xl font-bold text-center whitespace-pre-wrap">{slide}</p>
                    </div>
                ))}
           </div>
        ) : (
            <PostPreview text={value} containerRef={previewRef} />
        )}
      </div>
    </div>
  );
};