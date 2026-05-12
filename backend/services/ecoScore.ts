import type { ProductData } from './productApi.ts';

export interface EcoScoreResult {
  score: number;
  breakdown: string[];
}

/**
 * Eco-score calculation logic
 */
export function calculateEcoScore(product: ProductData, preferences: { vegan?: boolean, avoidPlastic?: boolean } = {}): EcoScoreResult {
  let score = 5;
  const breakdown: string[] = ["Base score: 5"];

  if (!product) return { score, breakdown: ["No product data available"] };

  const packaging = product.packaging ? product.packaging.toLowerCase() : '';
  const labels = product.labels ? product.labels.toLowerCase() : '';
  const ingredients = product.ingredients_text ? product.ingredients_text.toLowerCase() : '';

  // Packaging Rules
  if (packaging.includes('plastic')) {
    score -= 2;
    breakdown.push("Plastic packaging detected: -2");
  } else if (packaging.includes('glass') || packaging.includes('cardboard') || packaging.includes('paper')) {
    score += 1;
    breakdown.push("Recyclable/Eco packaging detected: +1");
  }

  if (packaging && !packaging.includes('recycle')) {
    // This is a rough estimation
    if (packaging.includes('film') || packaging.includes('pouch')) {
      score -= 1;
      breakdown.push("Non-recyclable elements detected: -1");
    }
  }

  // Label Rules
  if (labels.includes('organic') || labels.includes('bio')) {
    score += 2;
    breakdown.push("Organic label detected: +2");
  }
  
  if (labels.includes('eco') || labels.includes('fair trade')) {
    score += 2;
    breakdown.push("Eco/Ethical label detected: +2");
  }

  // Preferences
  if (preferences.vegan && (ingredients.includes('milk') || ingredients.includes('egg') || ingredients.includes('meat'))) {
    score -= 3;
    breakdown.push("Vegan preference active + animal ingredients found: -3");
  }

  if (preferences.avoidPlastic && packaging.includes('plastic')) {
    score -= 2;
    // Note: This is additional penalization for preference mismatch
    breakdown.push("Avoid plastic preference active + plastic packaging: -2");
  }

  // Clamp score
  const finalScore = Math.max(0, Math.min(10, score));

  return { score: finalScore, breakdown };
}
