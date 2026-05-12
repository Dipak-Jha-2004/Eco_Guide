import { GoogleGenAI } from "@google/genai";

export interface ProductData {
  product_name?: string;
  ingredients_text?: string;
  labels?: string;
  packaging?: string;
  nutriments?: any;
  eco_score_data?: any;
  image_url?: string;
}

export interface EcoScoreResult {
  score: number;
  breakdown: string[];
}

export interface EcoProduct {
  name: string;
  brand: string;
  eco_features: string[];
  price_range: string;
  description: string;
  amazon_url: string;
  google_url: string;
  etsy_url: string;
  brand_url: string;
  category: string;
}

/**
 * Generates an AI response for eco-shopping advice (FRONTEND VERSION)
 */
export async function generateEcoResponse(query: string, productContext?: ProductData | null, scoreContext?: EcoScoreResult | null) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
    return "Please set your `GEMINI_API_KEY` in the **Settings > Secrets** panel to enable the AI assistant. 🌿";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `You are an AI Eco-Friendly Shopping Assistant.

STRICT RULES:
* ONLY answer eco-friendly shopping and sustainability-related questions.
* Reject unrelated topics like coding, politics, math, etc.
* Focus on sustainability, fair trade, and environmental impact.
* Recommend greener alternatives when possible.
* Mention packaging and environmental impact.
* Keep answers concise, helpful, and friendly.
* If a product is mentioned, analyze its eco-friendliness based on the provided data.

CONTEXT:
${productContext ? `Product Found: ${productContext.product_name}
Ingredients: ${productContext.ingredients_text || 'N/A'}
Labels: ${productContext.labels || 'N/A'}
Packaging: ${productContext.packaging || 'N/A'}
Eco Score: ${scoreContext?.score}/10` : 'No specific product data was fetched for this query.'}
`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: [{ parts: [{ text: query }] }],
      config: { systemInstruction: systemPrompt }
    });

    return result.text || "I couldn't generate a response. Please try again with a different eco-friendly topic! 🌿";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error?.message?.includes("API key not valid")) {
      return "The Gemini API key is invalid. Please check your **Settings > Secrets** panel. 🌿";
    }
    return "I'm having trouble connecting to my environment intelligence right now. 🌿";
  }
}

/**
 * Generates real-world eco-friendly product suggestions with buy links
 */
export async function generateProductSuggestions(query: string): Promise<EcoProduct[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") return [];

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an eco-friendly product expert. Based on this query: "${query}"

Return a JSON object with exactly 4 real, purchasable eco-friendly products. Use ONLY real brands that actually exist and sell these products online.

Return ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "products": [
    {
      "name": "Exact product name sold by the brand",
      "brand": "Real brand name",
      "eco_features": ["GOTS Certified", "Organic Cotton", "Fair Trade"],
      "price_range": "$35-$55",
      "description": "One compelling sentence about why this product is eco-friendly.",
      "amazon_url": "https://www.amazon.com/s?k=brand+product+keywords",
      "google_url": "https://shopping.google.com/search?q=brand+product+keywords",
      "etsy_url": "https://www.etsy.com/search?q=eco+product+keywords",
      "brand_url": "https://www.brandwebsite.com",
      "category": "clothing"
    }
  ]
}

Rules:
- Use real, well-known sustainable brands (e.g. Patagonia, Tentree, Allbirds, Pact, prAna, Eileen Fisher, Package Free Shop, The Earthling Co., Pela Case, Ethique).
- Vary the brands — don't repeat the same brand twice.
- Build search URLs with real, URL-encoded keywords that will find the product.
- eco_features must contain exactly 3 short tags (e.g. "GOTS Certified", "Recycled Materials", "Carbon Neutral").
- category must be one of: clothing, personal_care, food, home, accessories, footwear.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const jsonText = result.text || "{}";
    const parsed = JSON.parse(jsonText);
    return Array.isArray(parsed.products) ? parsed.products.slice(0, 4) : [];
  } catch (error) {
    console.error("Product suggestion error:", error);
    return [];
  }
}
