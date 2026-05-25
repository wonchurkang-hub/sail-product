import React, { useState } from 'react';
import { Star, ShoppingCart, Info, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor: string) => void;
  isPiMode?: boolean;
}

export default function ProductCard({ product, onOpenDetails, onAddToCart, isPiMode = false }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-gray-200"
    >
      {/* CARD IMAGE WRAPPER */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* STOCK BADGE */}
        {product.stock <= 5 ? (
          <span className="absolute top-3 left-3 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600 border border-rose-100 uppercase font-mono tracking-wider animate-pulse">
            Only {product.stock} Left
          </span>
        ) : (
          <span className="absolute top-3 left-3 rounded-full bg-gray-900/10 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-gray-800 font-mono">
            {product.category}
          </span>
        )}

        {/* HOVER OVERLAY WITH MORE DETAILS / SPEC HIGHLIGHTS */}
        <div className="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <button
            id={`view-specs-btn-${product.id}`}
            onClick={() => onOpenDetails(product)}
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-900 flex items-center space-x-1 shadow-md hover:bg-gray-100 transition"
          >
            <Eye className="h-3 w-3" />
            <span>View Specs</span>
          </button>
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-widest">{product.category}</p>
          <div className="flex items-center space-x-1" title={`${product.rating} stars`}>
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-mono text-xs font-bold text-gray-700">{product.rating}</span>
            <span className="font-mono text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-sans text-base font-bold text-gray-950 group-hover:text-amber-600 transition duration-150 line-clamp-1">
          {product.name}
        </h3>

        <p className="mt-1 flex-1 font-sans text-xs leading-relaxed text-gray-500 line-clamp-2">
          {product.description}
        </p>

        {/* PHYSICAL COLOR SWATCH SELECTION */}
        <div id={`color-selectors-${product.id}`} className="mt-4 flex items-center justify-between">
          <div className="flex space-x-1.5">
            {product.colors.map((color) => (
              <button
                key={color.name}
                id={`color-swatch-${product.id}-${color.name.toLowerCase().replace(' ', '-')}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color.name);
                }}
                className={`h-4 w-4 rounded-full border ring-offset-2 transition-all ${
                  selectedColor === color.name
                    ? 'ring-2 ring-gray-950 scale-110'
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
          <span className="font-sans text-xs text-gray-400 font-mono italic">
            Col: {selectedColor}
          </span>
        </div>

        {/* PRICE & ACTION AREA */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
          {isPiMode ? (
            <div className="flex items-baseline space-x-0.5">
              <span className="font-sans text-sm font-bold text-amber-600">π</span>
              <span className="font-sans text-xl font-black text-amber-600 tracking-tight">{(product.price / 40.0).toFixed(3)}</span>
              <span className="font-mono text-[10px] text-gray-400 ml-1">Pi</span>
            </div>
          ) : (
            <div className="flex items-baseline space-x-0.5">
              <span className="font-sans text-sm font-semibold text-gray-400">$</span>
              <span className="font-sans text-xl font-black text-gray-950 tracking-tight">{product.price}</span>
              <span className="font-mono text-[10px] text-gray-400 ml-1">USD</span>
            </div>
          )}

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, selectedColor);
            }}
            className="flex items-center space-x-1.5 rounded-xl bg-gray-950 px-3.5 py-2.5 text-xs font-semibold font-sans text-white hover:bg-gray-800 transition shadow-sm active:scale-95"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
