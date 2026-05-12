import axios from 'axios';

export interface ProductData {
  product_name?: string;
  ingredients_text?: string;
  labels?: string;
  packaging?: string;
  nutriments?: any;
  eco_score_data?: any;
  image_url?: string;
}

/**
 * Fetches product info from Open Food Facts API
 * @param query Product name or barcode
 */
export async function fetchProductInfo(query: string): Promise<ProductData | null> {
  try {
    // Search for the product
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'EcoAssistant - Web - 1.0'
      }
    });

    if (response.data.products && response.data.products.length > 0) {
      const product = response.data.products[0];
      return {
        product_name: product.product_name,
        ingredients_text: product.ingredients_text,
        labels: product.labels,
        packaging: product.packaging,
        nutriments: product.nutriments,
        eco_score_data: product.ecoscore_data,
        image_url: product.image_url
      };
    }
    return null;
  } catch (error: any) {
    if (error.response && error.response.status === 503) {
      console.warn('Open Food Facts API is currently unavailable (503).');
    } else {
      console.error('Error fetching from Open Food Facts:', error.message);
    }
    return null;
  }
}
