import React, { useState, useEffect, useCallback } from 'react';
import { styles } from './utils/transformations';
import { StyleCard } from './components/StyleCard';
import { InputSection } from './components/InputSection';
import { RichEditor } from './components/RichEditor';
import { ToastMessage, ViewMode } from './types';

function App() {
  const [inputText, setInputText] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('generator');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  // Local Storage for Drafts
  useEffect(() => {
    const saved = localStorage.getItem('linkedit_draft');
    if (saved) setInputText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('linkedit_draft', inputText);
  }, [inputText]);

  // Handle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Category filtering for Generator Mode
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'basic', label: 'Basique' },
    { id: 'serif', label: 'Serif' },
    { id: 'script', label: 'Manuscrit' },
    { id: 'decoration', label: 'Déco' },
    { id: 'fancy', label: 'Fantaisie' },
  ];

  const handleCopy = useCallback((text: string) => {
    // Transform tabs to Em Spaces (\u2003) because standard tabs are stripped by LinkedIn/Browsers
    const optimizedText = text.replace(/\t/g, '\u2003');

    navigator.clipboard.writeText(optimizedText).then(() => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message: 'Texte copié !', type: 'success' }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 2000);
    }).catch(() => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message: 'Erreur lors de la copie', type: 'error' }]);
    });
  }, []);

  const filteredStyles = selectedCategory === 'all' 
    ? styles 
    : styles.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-brand-500/30 transition-colors duration-300 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className={`relative z-10 container mx-auto px-4 py-8 md:py-10 transition-[max-width] duration-500 ${viewMode === 'editor' ? 'max-w-[1600px]' : 'max-w-7xl'}`}>
        
        {/* Header with Theme Toggle */}
        <header className="mb-8 flex flex-col items-center justify-center relative">
          <div className="absolute right-0 top-0 hidden md:block">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              aria-label="Basculer le thème"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">
            LinkEdit <span className="text-brand-500 dark:text-brand-400">Pro</span>
          </h1>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex shadow-sm">
                <button
                    onClick={() => setViewMode('generator')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                        viewMode === 'generator' 
                        ? 'bg-brand-500 text-white shadow-md' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Générateur Rapide
                </button>
                <button
                    onClick={() => setViewMode('editor')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                        viewMode === 'editor' 
                        ? 'bg-brand-500 text-white shadow-md' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Éditeur Studio
                </button>
            </div>
        </div>

        {/* MAIN CONTENT AREA */}
        {viewMode === 'generator' ? (
             <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 animate-fade-in">
                {/* Left Column: Sticky Input */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="sticky top-8 space-y-6">
                    <InputSection 
                        value={inputText} 
                        onChange={(e) => setInputText(e.target.value)} 
                        onClear={() => setInputText('')}
                    />
                    
                    <div className="hidden lg:block bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800/50 backdrop-blur-sm shadow-sm dark:shadow-none">
                        <h3 className="text-brand-600 dark:text-brand-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Astuce Pro
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        Le mode Générateur est idéal pour créer des <strong>titres accrocheurs</strong>. Pour rédiger un post complet avec un formatage précis, passez au mode <strong>Studio</strong>.
                        </p>
                    </div>
                    </div>
                </div>

                {/* Right Column: Output List */}
                <div className="lg:col-span-7 xl:col-span-8">
                    <div className="flex overflow-x-auto pb-4 mb-4 gap-2 no-scrollbar md:flex-wrap">
                    {categories.map(cat => (
                        <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border
                            ${selectedCategory === cat.id 
                            ? 'bg-brand-500/10 border-brand-500/50 text-brand-700 dark:text-brand-300 shadow-[0_0_10px_rgba(20,184,166,0.1)]' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                            }
                        `}
                        >
                        {cat.label}
                        </button>
                    ))}
                    </div>

                    <div className="space-y-4">
                    {filteredStyles.map((style) => (
                        <StyleCard
                        key={style.id}
                        label={style.label}
                        originalText={inputText}
                        transformedText={style.transform(inputText)}
                        onCopy={handleCopy}
                        />
                    ))}
                    </div>
                    
                    {filteredStyles.length === 0 && (
                    <div className="text-center py-20 bg-slate-100 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                        <p className="text-slate-500">Aucun style trouvé dans cette catégorie.</p>
                    </div>
                    )}
                </div>
            </div>
        ) : (
            /* EDITOR MODE */
            <div className="animate-fade-in lg:h-[calc(100vh-250px)] min-h-[600px]">
                <RichEditor 
                    value={inputText}
                    onChange={setInputText}
                    onCopy={handleCopy}
                />
            </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border animate-slide-up
              ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200' : 'bg-red-500/10 border-red-500/20 text-red-800 dark:text-red-200'}
            `}
          >
            {toast.type === 'success' && (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-slate-200 dark:border-slate-900 bg-white/50 dark:bg-slate-950/50 backdrop-blur">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-600 text-sm">
            © {new Date().getFullYear()} LinkEdit Pro. Conçu pour les créateurs.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;