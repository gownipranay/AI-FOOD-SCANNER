export interface NutritionInfo {
  calories: string;
  carbs: string;
  protein: string;
  fats: string;
}

export interface FoodAnalysis {
  id?: string; // Unique ID for history
  timestamp?: number; // Time of analysis
  foodDetected: string;
  freshnessStatus: "Fresh and Safe to Eat" | "Questionable (Consume with Caution)" | "Spoiled or Unsafe to Eat";
  confidenceScore: number;
  visualObservations: string;
  reasonForClassification: string;
  healthRiskAnalysis: string;
  estimatedShelfLife: string;
  foodSafetyAdvice: string;
  approximateNutrition: NutritionInfo;
  wasteReductionTips: string;
  indianFoodSpecifics?: string;
  suggestedRecipes: string[];
  storageRecommendations: string;
  detectedAllergens: string[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: FoodAnalysis | null;
}