import { motion } from "motion/react";
import { ShoppingBag, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import type { SerpProduct } from "../services/serpProductService";

interface Props {
  products: SerpProduct[];
  isLoading: boolean;
}

export default function ProductGrid({ products, isLoading }: Props) {
  if (!isLoading && products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="ml-11 mb-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-eco-green/15 text-eco-green">
          <ShoppingBag size={15} />
        </div>
        <span className="text-xs font-bold tracking-wider uppercase text-white/60">
          Shop These Products
        </span>
        <div className="flex-1 h-px bg-white/5" />
        {!isLoading && (
          <span className="text-[10px] text-white/30 italic">
            Real results from Google Shopping
          </span>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <Loader2 size={12} className="animate-spin text-eco-green" />
            <span>Searching Google Shopping for real eco products…</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 animate-pulse">
                <div className="h-40 bg-white/5 rounded-t-2xl" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-full" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                  <div className="h-8 bg-white/10 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Cards */}
      {!isLoading && products.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map((product, i) => (
              <ProductCard key={i} product={product} index={i} />
            ))}
          </div>
          <p className="mt-3 text-[10px] text-white/25 text-center">
            🌿 Live results from Google Shopping · Prices may vary · Verify eco certifications before buying
          </p>
        </>
      )}
    </motion.div>
  );
}
