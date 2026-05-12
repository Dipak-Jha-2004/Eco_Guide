import express from 'express';
import type { Request, Response } from 'express';
const { Router } = express;
import { validateScope } from '../utils/validator.ts';
import { fetchProductInfo } from '../services/productApi.ts';
import { calculateEcoScore } from '../services/ecoScore.ts';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  const { query, preferences } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Layer 3: Validation Check (before any API call)
  const isWithinScope = validateScope(query);
  if (!isWithinScope) {
    return res.json({ 
      response: "I only answer eco-friendly shopping and sustainability-related questions 🌿",
      outOfScope: true
    });
  }

  try {
    // 1. Fetch Product Data (Optional, if query implies a product)
    const productData = await fetchProductInfo(query);

    // 2. Calculate Eco Score
    const ecoScore = productData ? calculateEcoScore(productData, preferences) : null;

    // Return just the data to the frontend, which will then call Gemini
    res.json({
      product: productData,
      ecoScore: ecoScore,
      outOfScope: false
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
