/**
 * validator.ts
 * Implements Layer 1 (Keyword) and Layer 2 (Regex) out-of-scope detection.
 */

const RELEVANT_KEYWORDS = [
  'eco', 'sustainable', 'vegan', 'organic', 'recyclable', 'eco-friendly', 
  'green', 'biodegradable', 'packaging', 'plastic-free', 'environment',
  'shopping', 'product', 'carbon footprint', 'ethical', 'fair trade'
];

const RELEVANT_PATTERNS = [
  /recommend.*(?:eco|sustainable|green|vegan|organic)/i,
  /is this (?:product|brand|item) sustainable/i,
  /(?:plastic.free|packaging|ingredients|alternative)/i,
  /how to recycle/i,
  /eco.score/i,
  /environmental impact of/i,
  /buying/i,
  /shop/i
];

export function validateScope(query: string): boolean {
  const normalizedQuery = query.toLowerCase();

  // Layer 1: Keyword Filtering
  const hasKeyword = RELEVANT_KEYWORDS.some(keyword => normalizedQuery.includes(keyword));

  // Layer 2: Semantic Regex Matching
  const hasPattern = RELEVANT_PATTERNS.some(pattern => pattern.test(normalizedQuery));

  return hasKeyword || hasPattern;
}
