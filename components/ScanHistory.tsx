import React from 'react';
import { FoodAnalysis } from '../types';
import { Clock, ChevronRight, History } from 'lucide-react';

interface ScanHistoryProps {
  history: FoodAnalysis[];
  onSelect: (item: FoodAnalysis) => void;
  onClear: () => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const getStatusColor = (status: string) => {
     switch (status) {
      case "Fresh and Safe to Eat": return "text-green-400 bg-green-950/30 border border-green-900/50";
      case "Questionable (Consume with Caution)": return "text-yellow-400 bg-yellow-950/30 border border-yellow-900/50";
      case "Spoiled or Unsafe to Eat": return "text-red-400 bg-red-950/30 border border-red-900/50";
      default: return "text-zinc-400 bg-zinc-800";
    }
  };

  return (
    <div className="mt-12 border-t border-zinc-800 pt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-yellow-500" />
          Recent Scans
        </h3>
        <button 
          onClick={onClear}
          className="text-sm text-zinc-500 hover:text-red-400 transition-colors"
        >
          Clear History
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <button
            key={item.id || item.timestamp}
            onClick={() => onSelect(item)}
            className="text-left group bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-yellow-500/40 hover:bg-zinc-800 transition-all duration-200 flex flex-col gap-2 hover:shadow-[0_0_15px_rgba(234,179,8,0.1)]"
          >
            <div className="flex justify-between items-start w-full">
              <span className="font-bold text-zinc-200 truncate pr-2 group-hover:text-white transition-colors">{item.foodDetected}</span>
              <span className="text-xs text-zinc-500 whitespace-nowrap flex items-center gap-1">
                 <Clock className="w-3 h-3" />
                 {item.timestamp ? formatDate(item.timestamp) : 'Unknown'}
              </span>
            </div>
            
            <div className={`text-xs px-2 py-1 rounded-md self-start font-medium ${getStatusColor(item.freshnessStatus)}`}>
              {item.freshnessStatus}
            </div>
            
            <div className="mt-auto pt-2 flex items-center text-yellow-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScanHistory;