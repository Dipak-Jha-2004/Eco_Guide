import express from 'express';
import type { Request, Response } from 'express';
import { searchGoogleShopping } from '../services/serpApiService.ts';

const { Router } = express;
const router = Router();

router.post('/products', async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const products = await searchGoogleShopping(query);
    res.json({ products });
  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ products: [] });
  }
});

export default router;
