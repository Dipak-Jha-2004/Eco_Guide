import axios from 'axios';

export interface SerpProduct {
  title: string;
  price: string;
  source: string;        // Store name e.g. "Patagonia", "Amazon"
  link: string;          // Google Shopping product page URL
  thumbnail: string;     // Product image URL
  rating?: number;
  reviews?: number;
  delivery?: string;
  source_icon?: string;  // Store favicon URL
}

/**
 * Searches Google Shopping via SerpAPI and returns eco-relevant products.
 * NOTE: SerpAPI shopping results use `product_link` (not `link`) and
 *       optionally `serpapi_thumbnail` as a hi-res image fallback.
 */
export async function searchGoogleShopping(query: string): Promise<SerpProduct[]> {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    console.warn('SERPAPI_KEY not set — skipping product search');
    return [];
  }

  try {
    // Ensure the query is eco-focused
    const ecoQuery =
      query.toLowerCase().includes('eco') ||
      query.toLowerCase().includes('sustainable') ||
      query.toLowerCase().includes('organic')
        ? query
        : `eco friendly ${query}`;

    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_shopping',
        q: ecoQuery,
        api_key: apiKey,
        num: 10,   // fetch 10, return best 4
        gl: 'us',
        hl: 'en',
      },
      timeout: 12000,
    });

    const results: any[] = response.data?.shopping_results || [];
    console.log(`SerpAPI returned ${results.length} shopping results for: "${ecoQuery}"`);

    // Filter: must have a title and a product link; prefer results with thumbnails
    return results
      .filter(r => r.title && r.product_link)
      .slice(0, 4)
      .map(r => ({
        title: r.title,
        price: r.price || 'Price varies',
        source: r.source || 'Online Store',
        link: r.product_link,                           // ✅ correct field
        thumbnail: r.thumbnail || r.serpapi_thumbnail || '', // ✅ correct field
        rating: r.rating,
        reviews: r.reviews,
        delivery: r.delivery,
        source_icon: r.source_icon,
      }));
  } catch (error: any) {
    console.error('SerpAPI error:', error?.response?.data || error.message);
    return [];
  }
}
