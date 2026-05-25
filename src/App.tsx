import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import SupportPanel from './components/SupportPanel';
import PiDecisionSystem from './components/PiDecisionSystem';
import { PRODUCTS } from './data';
import { Product, CartItem, PiUser } from './types';
import { Award, Compass, Heart, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart management with persistent local storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('object_space_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state overlays
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  // Pi Decision System States
  const [isPiMode, setIsPiMode] = useState(false);
  const [piUser, setPiUser] = useState<PiUser | null>(null);

  // Newsletter subscription simulation
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);

  // Sync cart state with LocalStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('object_space_cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Cart storage error", e);
    }
  }, [cart]);

  // Apply promo code WELCOME10
  const handleApplyPromoCode = (code: string) => {
    if (code.trim().toUpperCase() === 'WELCOME10') {
      setPromoApplied(true);
    }
  };

  // Add items with designated quantity and color
  const handleAddToCart = (product: Product, selectedColor: string, qtyToAdd: number = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: Math.min(product.stock, updated[existingIdx].quantity + qtyToAdd),
        };
        return updated;
      }

      return [...prev, { product, quantity: qtyToAdd, selectedColor }];
    });

    // Automatically pop open the shopping cart to give user instant feedback
    setIsCartOpen(true);
  };

  // Adjust cart quantities live
  const handleUpdateCartQuantity = (productId: string, selectedColor: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId, selectedColor);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  // Detach items from the basket
  const handleRemoveCartItem = (productId: string, selectedColor: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedColor === selectedColor))
    );
  };

  // Triggered when simulated payment authorizes
  const handleCompleteOrder = () => {
    setCart([]); // Reset basket
    setPromoApplied(false); // Reset discount
  };

  // Safe window scroll to catalog container
  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter strategy: Matches active categories and/or matches user search queries
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased selection:bg-amber-150">
      
      {/* 1. COMPREHENSIVE HEADER */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* 2. TEXT & GRAPHIC HERO BAR */}
      <Hero
        onScrollToCatalog={handleScrollToCatalog}
        onApplyPromoCode={handleApplyPromoCode}
        promoCodeApplied={promoApplied}
      />

      {/* 3. CORE INTERACTIVE RETAIL SHOWCASE */}
      <main id="catalog-section" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER BLOCK */}
        <div className="mb-12 flex flex-col justify-between items-start md:flex-row md:items-end border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-600 font-extrabold">// CURATED SUITE</span>
            <h3 className="font-sans text-2xl font-black text-gray-950 sm:text-3xl leading-none">
              Featured Workspace Objects
            </h3>
            <p className="font-sans text-xs text-gray-500">
              Filtered items: <span className="font-semibold text-gray-700">{filteredProducts.length}</span>
            </p>
          </div>

          <div className="mt-4 flex items-center space-x-2 md:mt-0">
            {searchQuery && (
              <span className="rounded-lg bg-gray-50 border border-gray-150 py-1.5 px-3 font-sans text-xs text-gray-600">
                Searching for: "<span className="font-semibold text-gray-800">{searchQuery}</span>"
                <button onClick={() => setSearchQuery('')} className="ml-2 text-gray-400 hover:text-gray-700">×</button>
              </span>
            )}
            <span className="hidden md:inline font-sans text-xs text-gray-400 font-semibold uppercase tracking-wider">
              {activeCategory} elements
            </span>
          </div>
        </div>

        {/* PRODUCTS DOCK GRID */}
        {filteredProducts.length === 0 ? (
          <div id="no-products-view" className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="font-sans text-sm text-gray-500 italic">No products match your custom criteria or search keywords.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="mt-4 rounded-xl bg-gray-950 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div id="products-catalog-grid" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenDetails={(selected) => setSelectedProduct(selected)}
                onAddToCart={(prod, col) => handleAddToCart(prod, col, 1)}
                isPiMode={isPiMode}
              />
            ))}
          </div>
        )}

        {/* ACCENTUATED HIGHLIGHT BENCHMARKS */}
        <div className="mt-20 grid grid-cols-1 gap-8 border-t border-gray-150 pt-16 sm:grid-cols-3">
          <div className="flex items-start space-x-4">
            <div className="rounded-xl bg-gray-50 p-3 text-gray-900 border border-gray-100">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-sans text-sm font-bold text-gray-900">Premium Swiss Acoustics</h4>
              <p className="mt-1.5 font-sans text-xs text-gray-500 leading-relaxed">
                We craft each custom plate switch with dual-layer sound isolation for a premium acoustic signature.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="rounded-xl bg-gray-50 p-3 text-gray-900 border border-gray-100">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-sans text-sm font-bold text-gray-900">Sustainable Origin</h4>
              <p className="mt-1.5 font-sans text-xs text-gray-500 leading-relaxed">
                All Merino wool is ethically certified and paired with a renewable cork underlay for workspace longevity.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="rounded-xl bg-gray-50 p-3 text-gray-900 border border-gray-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-sans text-sm font-bold text-gray-900">Secure Sandboxed Escrows</h4>
              <p className="mt-1.5 font-sans text-xs text-gray-500 leading-relaxed">
                Our purchase simulators authorize mock cards instantly, granting beautiful sandbox tracking details.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* 4. DESIGN BRAND STORY SECTION */}
      <section id="story-segment" className="bg-gray-950 py-16 md:py-20 text-white select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="font-mono text-[10px] tracking-widest text-amber-500 font-extrabold uppercase uppercase">
              // Aesthetic Integrity
            </span>
            <h3 className="font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
              We focus on objects that frame your focus.
            </h3>
            <p className="font-sans text-sm leading-relaxed text-gray-400">
              Object & Space was created by a small group of typographers, software engineers, and furniture designers. 
              We believe the sensory feedback of your desk setup determines the quality of your focus. 
              By reducing digital clutter and emphasizing physical textures (anodized metals, custom lubed linear keys, 
              and merino felt wool), each product serves to anchor you in deep creative states.
            </p>
            <div className="pt-4 flex items-center space-x-2 text-amber-400 font-mono text-xs font-semibold">
              <span>View Design Codebase manifesto</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER SIGN-UP SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-amber-500 p-8 sm:p-12 shadow-md">
          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-3">
              <h4 className="font-sans text-2xl font-black text-gray-950 sm:text-3xl leading-snug">
                Join our design alerts newsletter
              </h4>
              <p className="font-sans text-sm text-gray-900 max-w-md leading-relaxed">
                Be notified about low-stock warnings, limited custom colorway releases, and seasonal promo discounts.
              </p>
            </div>

            <div className="w-full max-w-md lg:ml-auto">
              {newsletterSubbed ? (
                <div className="rounded-2xl bg-white/95 p-4 shadow-sm text-center border border-amber-600/15">
                  <p className="font-sans text-sm font-bold text-gray-950">Thank you for subscribing!</p>
                  <p className="font-sans text-xs text-gray-600 mt-1">We will send design details to <span className="font-semibold italic">{newsletterEmail}</span> shortly.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newsletterEmail.trim()) setNewsletterSubbed(true);
                  }}
                  className="flex space-x-2 bg-white/90 p-1.5 rounded-2xl shadow-sm"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 rounded-xl border-none bg-transparent px-4 py-2.5 text-xs font-sans text-gray-950 placeholder-gray-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
          {/* STYLISH GRAPHICS PATTERN FOR THE BACKGOUND */}
          <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-amber-400 opacity-30 select-none"></div>
        </div>
      </section>

      {/* 6. STATIC TRUSTED COMPLIANCE FOOTER */}
      <footer className="border-t border-gray-100 bg-gray-50/55 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase select-none">
            Object & Space Elements
          </p>
          <p className="mt-1.5 font-sans text-xs text-gray-500">
            A beautiful high-fidelity sandbox sales system. No real banking details are exchanged.
          </p>
          <p className="mt-1 font-mono text-[9px] text-gray-400 select-none">
            © 2026 Object & Space Retail Ltd. Sandboxed Worldwide Logistics.
          </p>
        </div>
      </footer>

      {/* ======================================= */}
      {/* 7. MODALS AND SIDEBAR DRAWER OVERLAYS */}
      {/* ======================================= */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isPiMode={isPiMode}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        promoCodeApplied={promoApplied}
        onApplyPromoCode={handleApplyPromoCode}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        isPiMode={isPiMode}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        promoCodeApplied={promoApplied}
        onCompleteOrder={handleCompleteOrder}
        isPiMode={isPiMode}
        piUser={piUser}
      />

      <SupportPanel
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* 8. ACTIVE PI BROWSER DECISION SYSTEM SIMULATOR badge */}
      <PiDecisionSystem 
        isPiMode={isPiMode} 
        setIsPiMode={setIsPiMode} 
        piUser={piUser} 
        setPiUser={setPiUser} 
      />

      {/* 9. VERCEL SPEED INSIGHTS */}
      <SpeedInsights />

    </div>
  );
}
