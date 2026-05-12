import { motion } from "motion/react";
import { ExternalLink, ShoppingCart, Star, Truck } from "lucide-react";
import { useState } from "react";
import type { SerpProduct } from "../services/serpProductService";

interface Props {
  product: SerpProduct;
  index: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={10}
          className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-white/20 fill-white/10"}
        />
      ))}
      <span className="text-[10px] text-white/40 ml-0.5">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product, index }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-eco-green/40 hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-eco-green/10"
    >
      {/* Product Image */}
      <div className="relative h-40 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 flex items-center justify-center overflow-hidden">
        {product.thumbnail && !imgError ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-5xl opacity-40">🌿</span>
        )}

        {/* Store badge — shows real store favicon from SerpAPI */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 max-w-[72%]">
          {product.source_icon && !imgError ? (
            <img
              src={product.source_icon}
              alt={product.source}
              className="w-3.5 h-3.5 rounded-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <span className="text-[9px] font-bold text-eco-green/80 uppercase">{product.source.charAt(0)}</span>
          )}
          <span className="text-[10px] font-bold text-white/70 truncate">{product.source}</span>
        </div>

        {/* Price badge */}
        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-eco-green/20 backdrop-blur-sm text-[11px] font-bold text-eco-green border border-eco-green/30 whitespace-nowrap">
          {product.price}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Title */}
        <h3 className="font-semibold text-[13px] text-white leading-snug line-clamp-2 group-hover:text-eco-green transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating && product.rating > 0 ? (
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} />
            {product.reviews && (
              <span className="text-[10px] text-white/30">({product.reviews.toLocaleString()})</span>
            )}
          </div>
        ) : null}

        {/* Delivery */}
        {product.delivery && (
          <div className="flex items-center gap-1 text-[10px] text-white/40">
            <Truck size={10} />
            <span className="line-clamp-1">{product.delivery}</span>
          </div>
        )}

        {/* Buy Button */}
        <div className="mt-auto pt-1">
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-eco-green text-eco-dark font-bold text-xs hover:bg-emerald-400 transition-colors w-full group/btn"
          >
            <ShoppingCart size={13} />
            Buy Now
            <ExternalLink size={11} className="opacity-60 group-hover/btn:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
