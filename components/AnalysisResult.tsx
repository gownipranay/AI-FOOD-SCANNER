import React from 'react';
import { FoodAnalysis } from '../types';
import { AlertTriangle, CheckCircle, XCircle, Activity, Clock, Info, Recycle, Utensils, BookOpen, ThermometerSnowflake, ShieldAlert } from 'lucide-react';

interface AnalysisResultProps {
  data: FoodAnalysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fresh and Safe to Eat": return "bg-green-950/40 text-green-400 border-green-800/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]";
      case "Questionable (Consume with Caution)": return "bg-yellow-950/40 text-yellow-400 border-yellow-800/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]";
      case "Spoiled or Unsafe to Eat": return "bg-red-950/40 text-red-400 border-red-800/50 shadow-[0_0_20px_rgba(248,113,113,0.1)]";
      default: return "bg-zinc-900 text-zinc-300 border-zinc-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Fresh and Safe to Eat": return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "Questionable (Consume with Caution)": return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case "Spoiled or Unsafe to Eat": return <XCircle className="w-8 h-8 text-red-500" />;
      default: return <Info className="w-8 h-8 text-zinc-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Header Card */}
      <div className={`p-6 rounded-2xl border-2 flex items-center gap-4 shadow-sm ${getStatusColor(data.freshnessStatus)}`}>
        <div className="shrink-0">{getStatusIcon(data.freshnessStatus)}</div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{data.foodDetected}</h2>
          <p className="font-medium text-lg opacity-90">{data.freshnessStatus}</p>
        </div>
        <div className="text-center bg-black/40 p-3 rounded-xl backdrop-blur-sm border border-white/5">
          <div className="text-sm font-semibold uppercase tracking-wider opacity-70">Confidence</div>
          <div className="text-2xl font-bold">{data.confidenceScore}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Observations */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100 mb-3">
            <Activity className="w-5 h-5 text-blue-400" />
            Visual Analysis
          </h3>
          <p className="text-zinc-400 leading-relaxed">{data.visualObservations}</p>
        </div>

        {/* Reasoning */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100 mb-3">
            <Info className="w-5 h-5 text-indigo-400" />
            Reasoning
          </h3>
          <p className="text-zinc-400 leading-relaxed">{data.reasonForClassification}</p>
        </div>

        {/* Health Risk */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Health Risks
          </h3>
          <p className="text-zinc-400 leading-relaxed">{data.healthRiskAnalysis}</p>
        </div>

        {/* Shelf Life & Advice */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100 mb-2">
              <Clock className="w-5 h-5 text-teal-400" />
              Estimated Shelf Life
            </h3>
            <p className="text-zinc-400">{data.estimatedShelfLife}</p>
          </div>
          <div className="pt-4 border-t border-zinc-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Safety Advice
            </h3>
            <p className="text-zinc-400">{data.foodSafetyAdvice}</p>
          </div>
        </div>
      </div>
      
       {/* Allergens & Storage */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100 mb-3">
              <ThermometerSnowflake className="w-5 h-5 text-sky-400" />
              Storage Guide
            </h3>
            <p className="text-zinc-400">{data.storageRecommendations}</p>
        </div>
        
        <div className={`p-6 rounded-2xl border ${data.detectedAllergens.length > 0 && !data.detectedAllergens.includes("None") ? 'bg-orange-950/20 border-orange-900/50' : 'bg-zinc-900/50 border-zinc-800'}`}>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100 mb-3">
              <ShieldAlert className={`w-5 h-5 ${data.detectedAllergens.length > 0 && !data.detectedAllergens.includes("None") ? 'text-orange-400' : 'text-zinc-500'}`} />
              Allergen Info
            </h3>
            {data.detectedAllergens.length > 0 && !data.detectedAllergens.includes("None") ? (
               <div className="flex flex-wrap gap-2">
                 {data.detectedAllergens.map((allergen, idx) => (
                   <span key={idx} className="px-3 py-1 bg-orange-900/30 text-orange-200 border border-orange-900/50 rounded-full text-sm font-medium">
                     {allergen}
                   </span>
                 ))}
               </div>
            ) : (
              <p className="text-zinc-500 italic">No common allergens visually detected.</p>
            )}
        </div>
       </div>


      {/* Nutrition & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-yellow-400">
            <Utensils className="w-5 h-5" />
            Approximate Nutrition
            <span className="text-xs font-normal text-zinc-500 ml-auto bg-zinc-800 px-2 py-1 rounded">Visual Est.</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800 p-3 rounded-xl">
              <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Calories</div>
              <div className="text-lg font-semibold text-white">{data.approximateNutrition.calories}</div>
            </div>
            <div className="bg-zinc-800 p-3 rounded-xl">
              <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Protein</div>
              <div className="text-lg font-semibold text-white">{data.approximateNutrition.protein}</div>
            </div>
            <div className="bg-zinc-800 p-3 rounded-xl">
              <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Carbs</div>
              <div className="text-lg font-semibold text-white">{data.approximateNutrition.carbs}</div>
            </div>
            <div className="bg-zinc-800 p-3 rounded-xl">
              <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Fats</div>
              <div className="text-lg font-semibold text-white">{data.approximateNutrition.fats}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-900 p-6 rounded-2xl border border-zinc-700 h-full relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 bg-yellow-500/5 blur-3xl rounded-full pointer-events-none"></div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100 mb-3 relative z-10">
              <Recycle className="w-5 h-5 text-yellow-500" />
              Reduction Tips
            </h3>
            <p className="text-zinc-400 leading-relaxed italic mb-4 relative z-10">
              "{data.wasteReductionTips}"
            </p>
            {data.indianFoodSpecifics && (
              <div className="pt-4 border-t border-zinc-800 relative z-10">
                <h4 className="font-semibold text-yellow-500 mb-1 text-sm">Specifics (Indian Food)</h4>
                <p className="text-zinc-400 text-sm">{data.indianFoodSpecifics}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Culinary Suggestions */}
      {data.suggestedRecipes && data.suggestedRecipes.length > 0 && (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
           <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100 mb-4">
              <BookOpen className="w-5 h-5 text-yellow-500" />
              Culinary Suggestions
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.suggestedRecipes.map((recipe, idx) => (
                <li key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-zinc-300 font-medium flex items-center gap-3 shadow-sm">
                  <span className="flex items-center justify-center w-6 h-6 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-bold border border-yellow-500/20">
                    {idx + 1}
                  </span>
                  {recipe}
                </li>
              ))}
            </ul>
        </div>
      )}
      
      <div className="text-center text-xs text-zinc-600 mt-8 pb-4">
        Disclaimer: This analysis is an AI-based visual estimation and should not replace professional medical or food safety advice.
      </div>
    </div>
  );
};

export default AnalysisResult;