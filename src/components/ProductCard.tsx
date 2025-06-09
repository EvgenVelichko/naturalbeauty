import React from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "../lib/supabase";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src =
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center&auto=format&q=80";
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={
            product.image_url ||
            `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center&auto=format&q=80`
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />

        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddToCart?.(product)}
              className="bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition-colors flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">Add to Cart</span>
            </button>
          </div>
        </div>

        {product.featured && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.price}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
