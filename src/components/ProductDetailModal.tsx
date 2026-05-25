import React, { useState } from 'react';
import { X, Star, ShoppingCart, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Product, Review } from '../types';
import { MOCK_REVIEWS } from '../data';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, quantity: number) => void;
  isPiMode?: boolean;
}

export default function ProductDetailModal({ product, onClose, onAddToCart, isPiMode = false }: ProductDetailModalProps) {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<'features' | 'specs' | 'reviews'>('features');

  // Interactive review list with custom state
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS[product.id] || []);
  const [addReviewName, setAddReviewName] = useState('');
  const [addReviewRating, setAddReviewRating] = useState(5);
  const [addReviewComment, setAddReviewComment] = useState('');
  const [reviewPostedSuccess, setReviewPostedSuccess] = useState(false);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addReviewName.trim() || !addReviewComment.trim()) return;

    const newReview: Review = {
      id: `r-user-${Date.now()}`,
      userName: addReviewName.trim(),
      rating: addReviewRating,
      comment: addReviewComment.trim(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    setReviews([newReview, ...reviews]);
    setAddReviewName('');
    setAddReviewComment('');
    setAddReviewRating(5);
    setReviewPostedSuccess(true);
    setTimeout(() => setReviewPostedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/65 p-4 backdrop-blur-sm">
      <div 
        id={`detail-modal-${product.id}`}
        className="relative flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:h-auto"
      >
        {/* CLOSE BUTTON */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-950 shadow transition"
          title="Close details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* DETAILS LAYOUT */}
        <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-2 md:overflow-visible">
          
          {/* LEFT PHOTO COLUMN (STAYS FIXED ON MEDIUM SCREEN+) */}
          <div className="bg-gray-50 p-6 flex flex-col justify-center items-center md:sticky md:top-0">
            <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl border border-gray-150/50 bg-white shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* QUICK WARRANTY SPEC BLOCK */}
            <div className="mt-6 w-full max-w-sm grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white p-2 border border-gray-50">
                <p className="font-mono text-[9px] uppercase tracking-wider text-gray-400">Warranty</p>
                <p className="font-sans text-xs font-bold text-gray-800">2 Years</p>
              </div>
              <div className="rounded-xl bg-white p-2 border border-gray-50">
                <p className="font-mono text-[9px] uppercase tracking-wider text-gray-400">Free Ship</p>
                <p className="font-sans text-xs font-bold text-gray-800">Global</p>
              </div>
              <div className="rounded-xl bg-white p-2 border border-gray-50">
                <p className="font-mono text-[9px] uppercase tracking-wider text-gray-400">Carbon</p>
                <p className="font-sans text-xs font-bold text-gray-800">Neutral</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMNS - SPECS, FEATURES, REVIEWS */}
          <div className="flex flex-col p-6 sm:p-8 overflow-y-auto">
            
            <div className="mb-4">
              <span className="rounded bg-gray-100 px-2.5 py-1 text-[10px] font-mono font-bold text-gray-800">
                {product.category}
              </span>
            </div>

            <h2 className="font-sans text-2xl font-black text-gray-950 leading-snug sm:text-3xl">
              {product.name}
            </h2>

            <div className="mt-2 flex items-center space-x-2">
              <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs font-bold text-gray-700">{product.rating}</span>
              <span className="font-sans text-xs text-gray-400">({reviews.length} total reviews)</span>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-4 font-sans text-sm leading-relaxed text-gray-600">
              {product.longDescription}
            </p>

            {isPiMode ? (
              <div className="mt-5 flex items-baseline space-x-0.5">
                <span className="font-sans text-sm text-amber-600 font-bold">π</span>
                <span className="font-sans text-2xl font-black text-amber-600">{(product.price / 40.0).toFixed(3)}</span>
                <span className="font-mono text-xs text-gray-450 ml-1">Pi Coin</span>
              </div>
            ) : (
              <div className="mt-5 flex items-baseline space-x-0.5">
                <span className="font-sans text-sm text-gray-400 font-semibold">$</span>
                <span className="font-sans text-2xl font-black text-gray-950">{product.price}</span>
                <span className="font-mono text-xs text-gray-400 ml-1">USD</span>
              </div>
            )}

            {/* COLORWAYS */}
            <div className="mt-6">
              <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-widest">Select Finish</h4>
              <div className="mt-2.5 flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    id={`modal-color-${product.id}-${color.name.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center space-x-2 rounded-xl border px-3 py-1.5 text-xs font-medium font-sans transition-all ${
                      selectedColor === color.name
                        ? 'border-gray-900 bg-gray-950 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full border border-white/20" style={{ backgroundColor: color.hex }}></span>
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY CONTROL & ADD ACTION */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-b border-gray-100 py-4">
              <div className="flex flex-col">
                <span className="font-sans text-[10px] uppercase font-bold text-gray-400 mb-1">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    id="qty-decrement-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-500 hover:bg-gray-150 transition"
                  >
                    -
                  </button>
                  <span className="px-3 font-mono text-sm font-semibold text-gray-800 select-none">{quantity}</span>
                  <button
                    id="qty-increment-btn"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-gray-500 hover:bg-gray-150 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex-1 min-w-[150px]">
                <span className="font-sans text-[10px] uppercase font-bold text-gray-400 mb-1 block">Purchase Option</span>
                <button
                  id="modal-add-to-cart-btn"
                  onClick={() => {
                    onAddToCart(product, selectedColor, quantity);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-md active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add {(quantity > 1) ? `${quantity} items` : 'to Cart'}</span>
                </button>
              </div>
            </div>

            {/* SEPARATING TABS BAR */}
            <div className="mt-6 border-b border-gray-100 flex space-x-4">
              {(['features', 'specs', 'reviews'] as const).map((tabId) => (
                <button
                  key={tabId}
                  id={`tab-btn-${tabId}`}
                  onClick={() => setTab(tabId)}
                  className={`pb-2.5 font-sans text-xs font-bold uppercase tracking-widest transition ${
                    tab === tabId
                      ? 'border-b-2 border-gray-950 text-gray-950'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tabId}
                </button>
              ))}
            </div>

            {/* TAB CONTENT PANEL */}
            <div className="mt-4 flex-1">
              {tab === 'features' && (
                <ul className="space-y-2.5 list-disc pl-4 text-xs font-sans text-gray-600 leading-relaxed">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              )}

              {tab === 'specs' && (
                <div className="space-y-2 border border-gray-100 rounded-xl bg-gray-50/50 p-4">
                  {Object.entries(product.specs).map(([label, value]) => (
                    <div key={label} className="flex justify-between text-xs font-sans">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'reviews' && (
                <div className="space-y-5">
                  {/* POST A REVIEW SECTION */}
                  <form onSubmit={handlePostReview} className="rounded-xl border border-gray-150 bg-gray-50/40 p-3.5">
                    <h5 className="font-sans text-xs font-bold text-gray-900 mb-3">Share your experience</h5>

                    {reviewPostedSuccess && (
                      <div className="mb-3 flex items-center space-x-1 border border-emerald-100 bg-emerald-50 rounded-lg p-2 text-emerald-800 text-xs">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Review posted successfully. Thank you!</span>
                      </div>
                    )}

                    <div className="gap-3 flex mb-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Your Name"
                          required
                          value={addReviewName}
                          onChange={(e) => setAddReviewName(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs focus:ring-1 focus:ring-gray-950"
                        />
                      </div>
                      <div>
                        {/* STAR RATING CHANGER */}
                        <select
                          value={addReviewRating}
                          onChange={(e) => setAddReviewRating(Number(e.target.value))}
                          className="rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs font-mono font-bold"
                        >
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="2">2 Stars</option>
                          <option value="1">1 Star</option>
                        </select>
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        placeholder="What do you think of this premium layout element? How is its look & feel?"
                        rows={2}
                        required
                        value={addReviewComment}
                        onChange={(e) => setAddReviewComment(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs focus:ring-1 focus:ring-gray-950 pr-10"
                      />
                      <button
                        type="submit"
                        className="absolute right-2.5 bottom-2.5 text-gray-950 hover:text-amber-600 transition"
                        title="Submit review"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </form>

                  {/* REVIEW LISTING */}
                  <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                    {reviews.length === 0 ? (
                      <p className="font-sans text-xs text-gray-400 italic">No reviews yet. Be the first to share thoughts!</p>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev.id} className="border-b border-gray-100 pb-3">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-xs font-bold text-gray-800">{rev.userName}</span>
                            <span className="font-mono text-[10px] text-gray-400">{rev.date}</span>
                          </div>
                          <div className="flex items-center space-x-0.5 mt-1">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="mt-1.5 font-sans text-xs text-gray-500 leading-relaxed italic">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
