import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FoodAnalysis } from "../types";

const processFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    foodDetected: { type: Type.STRING, description: "Identity of the food item(s)." },
    freshnessStatus: {
      type: Type.STRING,
      enum: ["Fresh and Safe to Eat", "Questionable (Consume with Caution)", "Spoiled or Unsafe to Eat"],
      description: "Classification of freshness status."
    },
    confidenceScore: { type: Type.INTEGER, description: "Confidence score between 0 and 100." },
    visualObservations: { type: Type.STRING, description: "Detailed visual analysis including color, texture, moisture, mold, etc." },
    reasonForClassification: { type: Type.STRING, description: "Explanation for the status classification based on visual cues." },
    healthRiskAnalysis: { type: Type.STRING, description: "Potential health risks if consumed." },
    estimatedShelfLife: { type: Type.STRING, description: "Estimated remaining shelf life." },
    foodSafetyAdvice: { type: Type.STRING, description: "Advice on consumption, storage, or disposal." },
    approximateNutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.STRING },
        carbs: { type: Type.STRING },
        protein: { type: Type.STRING },
        fats: { type: Type.STRING },
      },
      description: "Estimated nutritional content per serving."
    },
    wasteReductionTips: { type: Type.STRING, description: "Tips to reduce waste if partially usable." },
    indianFoodSpecifics: { type: Type.STRING, description: "Region-specific observations if it is an Indian food item." },
    suggestedRecipes: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3 possible recipes or uses for this food item. If spoiled, provide composting ideas." 
    },
    storageRecommendations: { type: Type.STRING, description: "Specific best practices for storing this item (e.g., Fridge vs Counter)." },
    detectedAllergens: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of potential common allergens detected (e.g., Peanuts, Dairy, Gluten) or 'None' if applicable." 
    },
  },
  required: [
    "foodDetected",
    "freshnessStatus",
    "confidenceScore",
    "visualObservations",
    "reasonForClassification",
    "healthRiskAnalysis",
    "estimatedShelfLife",
    "foodSafetyAdvice",
    "approximateNutrition",
    "wasteReductionTips",
    "suggestedRecipes",
    "storageRecommendations",
    "detectedAllergens"
  ],
};

export const analyzeFoodImage = async (file: File): Promise<FoodAnalysis> => {
  // Robust API Key Retrieval
  const getApiKey = () => {
    // Vite statically replaces process.env.API_KEY based on vite.config.ts
    // We use a try-catch and typeof check to be extremely safe in browser environments
    try {
      if (typeof process !== "undefined" && process.env) {
        const envKey = process.env.API_KEY;
        if (envKey && envKey !== "") {
          return envKey;
        }
      }
    } catch (e) {
      // Ignore
    }
    // Fallback to the provided key
    return "AIzaSyBv80z4fek8KoIP5yBjuqS8CvDiKTEeJd8";
  };

  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("API Key not found.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await processFileToBase64(file);

  const prompt = `
    You are an advanced AI Food Safety and Quality Analysis system.
    Analyze the uploaded food image and provide a detailed, structured food quality assessment.
    
    Instructions:
    1. Identify the food item.
    2. Analyze visual appearance (Color, Texture, Moisture, Mold, Discoloration).
    3. Classify freshness based ONLY on visual cues.
    4. Provide a Freshness Confidence Score (0-100).
    5. Explain reasoning.
    6. Identify health risks.
    7. Estimate shelf life.
    8. Provide safety advice.
    9. Estimate nutrition.
    10. Include Indian food specific observations if applicable.
    11. Offer waste reduction tips.
    12. Suggest 3 recipes or culinary uses (if safe).
    13. Provide specific storage recommendations.
    14. Detect potential allergens.

    Important: Do not make absolute medical claims. State this is AI-based visual estimation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a helpful, expert food safety AI assistant.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI.");
    }

    const result = JSON.parse(text) as FoodAnalysis;
    
    // Add client-side metadata
    return {
      ...result,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
  } catch (error: any) {
    console.error("Analysis Error:", error);
    // Return the actual error message to the UI to help debugging
    throw new Error(error.message || "Failed to analyze image. Please try again.");
  }
};