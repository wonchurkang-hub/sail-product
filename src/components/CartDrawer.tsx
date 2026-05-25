import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Gift } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, selectedColor: string, newQty: number) => void;
  onRemoveItem: (productId: string, selectedColor: string) => void;
  onOpenCheckout: () => void;
  promoCodeApplied: boolean;
  onApplyPromoCode: (code: string) => void;
  isPiMode?: boolean;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  promoCodeApplied,
  onApplyPromoCode,
  isPiMode = false,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = promoCodeApplied ? subtotal * 0.1 : 0;
  const netTotal = subtotal - discountAmount;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gray-950/65 backdrop-blur-sm">
      
      {/* BACKGROUND SHADE FOR DISMISSAL */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* DRAWER CONTROLLER */}
      <div 
        id="cart-drawer-panel"
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-350"
      >
        {/* HEADER */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-gray-950" />
            <h3 className="font-sans text-base font-bold text-gray-900">Your Basket</h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-950 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CART LIST AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div id="empty-cart-view" className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h4 className="mt-4 font-sans text-sm font-semibold text-gray-900">No items in cart</h4>
              <p className="mt-1 font-sans text-xs text-gray-500 max-w-xs leading-relaxed">
                Add premium acoustic keycaps, ambient lights, or high-fidelity studio devices to elevate your setup.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-xl border border-gray-200 px-6 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Back to Elements
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${index}`}
                id={`cart-item-${item.product.id}`}
                className="flex items-center space-x-4 border-b border-gray-50 pb-4"
              >
                {/* THUMBNAIL */}
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* PRODUCT DETAIL INSIDE CART */}
                <div className="flex-1">
                  <h4 className="font-sans text-xs font-bold text-gray-950 line-clamp-1">{item.product.name}</h4>
                  <p className="font-sans text-[10px] text-gray-400 mt-0.5">Finish: <span className="font-semibold text-gray-650">{item.selectedColor}</span></p>
                  
                  {/* QUANTITY RECONCILING COMPONENT */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                        className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 transition text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 font-mono text-xs font-semibold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                        className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 transition text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-gray-950">
                        {isPiMode 
                          ? `π ${((item.product.price * item.quantity) / 40.0).toFixed(3)}` 
                          : `$${item.product.price * item.quantity}`
                        }
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                        className="text-gray-400 hover:text-rose-600 transition"
                        title="Remove unit"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER TOTALS AREA */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-4">
            
            {/* IN-CART PROMO CODE APPLY FORM */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="PROMO CODE (WELCOME10)"
                id="drawer-promo-input"
                className="flex-1 rounded-xl border border-gray-250 bg-white px-3 py-1.5 font-mono text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 uppercase"
                disabled={promoCodeApplied}
              />
              <button
                id="drawer-promo-apply-btn"
                onClick={() => {
                  const el = document.getElementById('drawer-promo-input') as HTMLInputElement | null;
                  if (el && el.value.trim().toUpperCase() === 'WELCOME10') {
                    onApplyPromoCode('WELCOME10');
                  } else {
                    alert('Invalid discount code. Try "WELCOME10"');
                  }
                }}
                disabled={promoCodeApplied}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                  promoCodeApplied
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {promoCodeApplied ? 'LOCKED' : 'Apply'}
              </button>
            </div>

            {/* DYNAMIC SUM DISPLAY */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-gray-400">Items Subtotal</span>
                <span className="font-medium text-gray-800">
                  {isPiMode ? `π ${(subtotal / 40.0).toFixed(3)}` : `$${subtotal}.00`}
                </span>
              </div>
              
              {promoCodeApplied && (
                <div className="flex justify-between text-xs font-sans text-emerald-700">
                  <span className="flex items-center space-x-1">
                    <Gift className="h-3.5 w-3.5" />
                    <span>Promo Applied (WELCOME10 -10%)</span>
                  </span>
                  <span className="font-semibold">
                    {isPiMode ? `-π ${(discountAmount / 40.0).toFixed(3)}` : `-$${discountAmount.toFixed(2)}`}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-xs font-sans">
                <span className="text-gray-400">Carbon offset shipment</span>
                <span className="font-mono font-bold text-emerald-600 uppercase">Complimentary</span>
              </div>

              <div className="flex justify-between border-t border-gray-150 pt-3 text-sm font-sans">
                <span className="font-bold text-gray-900">Total Invoice</span>
                <span className="font-mono font-black text-gray-950 text-lg">
                  {isPiMode ? `π ${(netTotal / 40.0).toFixed(3)}` : `$${netTotal.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* CHECKOUT ACTION BUTTON */}
            <button
              id="begin-checkout-btn"
              onClick={onOpenCheckout}
              className="group flex w-full items-center justify-center space-x-2 rounded-xl bg-gray-950 py-3.5 text-sm font-bold text-white hover:bg-gray-800 transition shadow-md"
            >
              <span>Proceed to secure checkout</span>
              <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
