// Shared SerpProduct type used by both frontend and backend response
export interface SerpProduct {
  title: string;
  price: string;
  source: string;
  link: string;
  thumbnail: string;
  rating?: number;
  reviews?: number;
  delivery?: string;
  source_icon?: string;  // Store favicon URL from SerpAPI
}
