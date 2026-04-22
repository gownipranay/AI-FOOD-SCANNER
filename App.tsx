import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import ScanHistory from './components/ScanHistory';
import { analyzeFoodImage } from './services/geminiService';
import { FoodAnalysis } from './types';
import { ScanSearch, ShieldCheck, ChefHat, Sparkles } from 'lucide-react';

const HISTORY_KEY = 'foodscanner_history';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  const [history, setHistory] = useState<FoodAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const saveToHistory = (result: FoodAnalysis) => {
    const newHistory = [result, ...history].slice(0, 10); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const handleImageSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeFoodImage(file);
      setAnalysisResult(result);
      saveToHistory(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: FoodAnalysis) => {
    setAnalysisResult(item);
    window.scrollTo({ top: document.getElementById('results')?.offsetTop || 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-yellow-500 selection:text-black pb-20">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setAnalysisResult(null); window.scrollTo(0,0)}}>
            <div className="bg-yellow-500 p-2 rounded-lg text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              FoodScanner
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
             <span className="flex items-center gap-1 hover:text-yellow-400 cursor-pointer transition-colors">
               <ScanSearch className="w-4 h-4" /> Visual Analysis
             </span>
             <span className="flex items-center gap-1 hover:text-yellow-400 cursor-pointer transition-colors">
               <ChefHat className="w-4 h-4" /> Culinary Tips
             </span>
             <span className="flex items-center gap-1 hover:text-yellow-400 cursor-pointer transition-colors">
               <Sparkles className="w-4 h-4" /> Smart Insights
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Is your food <span className="text-yellow-400">safe to eat?</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Upload a photo to instantly analyze freshness, detect allergens, get storage tips, and discover recipes.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 flex items-center gap-3 animate-fade-in">
             <div className="p-2 bg-red-900/20 rounded-full shrink-0">
               <ShieldCheck className="w-5 h-5 text-red-500" />
             </div>
             <div>
               <p className="font-semibold">Analysis Failed</p>
               <p className="text-sm text-red-300/80">{error}</p>
             </div>
          </div>
        )}

        {/* Results Section */}
        {analysisResult && (
          <div id="results" className="scroll-mt-24">
            <AnalysisResult data={analysisResult} />
          </div>
        )}
        
        {/* History Section */}
        <ScanHistory 
          history={history} 
          onSelect={handleHistorySelect} 
          onClear={clearHistory}
        />
      </main>

       {/* Footer */}
       <footer className="border-t border-zinc-900 bg-black mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-zinc-600 text-sm">
          <p>&copy; {new Date().getFullYear()} FoodScanner. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;