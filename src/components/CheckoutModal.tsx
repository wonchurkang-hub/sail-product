import React, { useState } from 'react';
import { X, ShieldAlert, CreditCard, Ship, CheckCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { CartItem, ShippingAddress, PaymentDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  promoCodeApplied: boolean;
  onCompleteOrder: () => void;
  isPiMode?: boolean;
  piUser?: any;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  promoCodeApplied,
  onCompleteOrder,
  isPiMode = false,
  piUser = null,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment & Final, 3: Success

  // Address State
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  // Payment State
  const [payment, setPayment] = useState<PaymentDetails>({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [piTxState, setPiTxState] = useState<'idle' | 'requesting' | 'signing' | 'broadcasting' | 'completed'>('idle');
  const [piTxId, setPiTxId] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = promoCodeApplied ? subtotal * 0.1 : 0;
  const netTotal = subtotal - discountAmount;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isPiMode) {
      // Step-by-step genuine/simulated Pi Network wallet transaction loop
      setPiTxState('requesting');
      
      setTimeout(() => {
        setPiTxState('signing');
        
        setTimeout(() => {
          setPiTxState('broadcasting');
          
          setTimeout(() => {
            setPiTxState('completed');
            const generatedTx = 'pi-tx-' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
            const generatedInvoice = `PI-INV-${Math.floor(200000 + Math.random() * 800000)}`;
            setPiTxId(generatedTx);
            setInvoiceId(generatedInvoice);
            setIsSubmitting(false);
            setStep(3);
          }, 1200);
        }, 1200);
      }, 1000);
    } else {
      // Standard credit card authorization protocol
      setTimeout(() => {
        const generatedInvoice = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
        setInvoiceId(generatedInvoice);
        setIsSubmitting(false);
        setStep(3);
      }, 1500);
    }
  };

  const handleDone = () => {
    onCompleteOrder();
    onClose();
  };

  const copyInvoiceToClipboard = () => {
    navigator.clipboard.writeText(invoiceId);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/65 p-4 backdrop-blur-sm">
      <div 
        id="checkout-portal"
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl transition duration-300"
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-emerald-600" />
            <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-widest">
              Secure Checkout Portal
            </h3>
          </div>
          {step !== 3 && (
            <button
              id="close-checkout-btn"
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-950 transition"
              title="Close checkout"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* STEP STATUS INDICATOR BAR */}
        {step !== 3 && (
          <div id="checkout-progress" className="flex bg-gray-50 border-b border-gray-100 text-center font-sans text-xs font-semibold">
            <div className={`flex-1 py-3 border-r border-gray-150 transition-colors ${step === 1 ? 'bg-gray-950 text-white' : 'text-gray-500 bg-white'}`}>
              1. Delivery Destination
            </div>
            <div className={`flex-1 py-3 transition-colors ${step === 2 ? 'bg-gray-950 text-white' : 'text-gray-500 bg-white'}`}>
              2. Secured Billing
            </div>
          </div>
        )}

        {/* CONTENT CHANNELS */}
        <div className="max-h-[68vh] overflow-y-auto p-6 sm:p-8">
          
          {/* STEP 1: SHIPPING DETAILS */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h4 className="font-sans text-base font-bold text-gray-900 mb-2">Where should we deliver your design pieces?</h4>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col">
                  <label className="font-sans text-[10px] font-bold text-gray-400 uppercase mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    placeholder="e.g. Liam Sterling"
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-sans placeholder-gray-450 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-sans text-[10px] font-bold text-gray-400 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    placeholder="liam@gmail.com"
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-sans placeholder-gray-450 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-sans text-[10px] font-bold text-gray-400 uppercase mb-1">Mailing Address</label>
                <input
                  type="text"
                  required
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  placeholder="Street and house number"
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-sans placeholder-gray-450 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-sans text-[10px] font-bold text-gray-400 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    placeholder="San Francisco"
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-sans placeholder-gray-450 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-sans text-[10px] font-bold text-gray-400 uppercase mb-1">Postal/ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    placeholder="94107"
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-sans placeholder-gray-450 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-sans text-[10px] font-bold text-gray-400 uppercase mb-1">Country</label>
                <select
                  value={shipping.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-sans focus:border-gray-950"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between items-center bg-gray-50 -mx-8 -mb-8 p-6 mt-8">
                <span className="text-xs font-sans text-gray-500">Security checkout is sandbox simulated.</span>
                <button
                  type="submit"
                  className="rounded-xl bg-gray-950 px-6 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition shadow-md"
                >
                  Continue to Billing
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: BILLING SECURED DETAIL */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              
              {/* CART QUICK SUMMARY PANEL */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-2">
                <h5 className="font-sans text-xs font-bold text-gray-900 border-b border-gray-100 pb-1.5 uppercase tracking-wider">Order Summary</h5>
                <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.selectedColor}`} className="flex justify-between text-xs font-sans text-gray-600">
                      <span>{item.product.name} ({item.selectedColor}) <span className="font-mono text-gray-400 font-bold">x{item.quantity}</span></span>
                      <span className="font-mono font-semibold text-gray-800">
                        {isPiMode ? `π ${((item.product.price * item.quantity) / 40.0).toFixed(3)}` : `$${item.product.price * item.quantity}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-150 pt-1.5 flex justify-between text-xs font-sans font-bold text-gray-900">
                  <span>Total Due Today</span>
                  <span className="font-mono text-sm">
                    {isPiMode ? `π ${(netTotal / 40.0).toFixed(3)}` : `$${netTotal.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {isPiMode ? (
                /* PI PLATFORM TRANSACTIONS FLOW */
                <div className="space-y-4">
                  <div>
                    <h4 className="font-sans text-base font-bold text-gray-900">Pi App Platform Escrow checkout</h4>
                    <p className="font-sans text-xs text-amber-600 mt-0.5 font-medium">Verified by Pi Network Security Sandbox.</p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-500/5 p-5 space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500 font-mono text-sm font-black text-gray-950">
                        π
                      </span>
                      <div>
                        <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-widest leading-none mt-1">
                          Consolidated Wallet Escrow Ledger
                        </h4>
                        <p className="font-sans text-[10px] text-gray-500 mt-1.5 leading-normal">
                          Authentication tokens confirm secure checkout processing. Once payment parameters are confirmed, a prompt to authorize transfer in the Pi Wallet application is broadcasted.
                        </p>
                      </div>
                    </div>

                    {piUser ? (
                      <div className="rounded-xl border border-emerald-150 bg-emerald-50/45 p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <div>
                            <p className="font-sans text-[10px] font-bold text-gray-800">Connected Pioneer Profile</p>
                            <p className="font-mono text-[9px] text-gray-500">@{piUser.username}</p>
                          </div>
                        </div>
                        <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-800">
                          AUTHORIZED ✓
                        </span>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-amber-150 bg-amber-50/10 p-3 text-center">
                        <p className="font-sans text-[10px] text-amber-900">
                          You are proceeding with a simulated checkout profile. To attach a custom username, initialize Pioneer credentials from the diagnostics bar inside the dashboard.
                        </p>
                      </div>
                    )}

                    {piTxState !== 'idle' && (
                      <div className="rounded-xl border border-gray-150 bg-white p-3.5 space-y-2.5">
                        <p className="font-sans text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                          Blockchain Escrow Pipeline
                        </p>
                        
                        <div className="space-y-1.5 text-xs font-sans">
                          <div className="flex justify-between">
                            <span className="text-gray-400">1. Verification Check:</span>
                            <span className="text-emerald-600 font-bold font-mono">
                              Verified Order ✓
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">2. Secure Signature:</span>
                            <span className={['signing', 'broadcasting', 'completed'].includes(piTxState) ? 'text-emerald-600 font-bold font-mono' : 'text-amber-600 animate-pulse'}>
                              {piTxState === 'signing' ? 'Awaiting wallet consent...' : 'Awaiting payment authorization'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">3. Broadcasting Block:</span>
                            <span className={piTxState === 'completed' ? 'text-emerald-600 font-bold' : piTxState === 'broadcasting' ? 'text-amber-600 animate-pulse' : 'text-gray-400'}>
                              {piTxState === 'broadcasting' ? 'Submitting block to consensus...' : piTxState === 'completed' ? 'BLOCK MINED ✓' : 'Pending signature'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* TRADITIONAL CREDIT CARD FLOW */
                <div className="space-y-4">
                  <div>
                    <h4 className="font-sans text-base font-bold text-gray-900">Secured Payment Authorization</h4>
                    <p className="font-sans text-xs text-gray-400 mt-0.5">We support simulated Visa, Mastercard, and American Express.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] font-bold text-gray-400 uppercase mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={payment.cardNumber}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '');
                            const formatted = digits.match(/.{1,4}/g)?.join(' ') || '';
                            setPayment({ ...payment, cardNumber: formatted.slice(0, 19) });
                          }}
                          placeholder="4111 2222 3333 4444"
                          className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-xs font-mono placeholder-gray-450 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="font-sans text-[10px] font-bold text-gray-400 uppercase mb-1">Expiration Date</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={payment.expirationDate}
                          placeholder="MM/YY"
                          onChange={(e) => {
                            const sanitized = e.target.value.replace(/\D/g, '');
                            if (sanitized.length <= 2) {
                              setPayment({ ...payment, expirationDate: sanitized });
                            } else {
                              setPayment({ ...payment, expirationDate: `${sanitized.slice(0, 2)}/${sanitized.slice(2, 4)}` });
                            }
                          }}
                          className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-mono placeholder-gray-450 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="font-sans text-[10px] font-bold text-gray-400 uppercase mb-1">CVV / CVC Code</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={payment.cvv}
                          onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '') })}
                          placeholder="•••"
                          className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-mono placeholder-gray-450 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION BACK OR PAY */}
              <div className="pt-4 flex justify-between items-center bg-gray-50 -mx-8 -mb-8 p-6 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition font-sans"
                >
                  ← Deliver Details
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gray-950 px-6 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition shadow-md disabled:bg-gray-400 disabled:cursor-wait flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent inline-block animate-spin"></span>
                      <span>
                        {isPiMode 
                          ? piTxState === 'requesting' 
                            ? 'Verifying order...'
                            : piTxState === 'signing'
                              ? 'Signing Wallet transaction...'
                              : piTxState === 'broadcasting'
                                ? 'Broadcasting block...'
                                : 'Completing escrow...'
                          : 'Processing card authorization...'
                        }
                      </span>
                    </>
                  ) : (
                    <span>
                      {isPiMode 
                        ? `Authorize payment of π ${(netTotal / 40.0).toFixed(3)}` 
                        : `Authorize Total of $${netTotal.toFixed(2)}`
                      }
                    </span>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: SUCCESS CELEBRATION */}
          {step === 3 && (
            <div id="checkout-success" className="text-center py-6 space-y-6">
              
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-500/10">
                <CheckCircle className="h-8 w-8 text-emerald-600 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h4 className="font-sans text-xl font-extrabold text-gray-950 sm:text-2xl">
                  {isPiMode ? 'Pi Escrow Completed!' : 'Order Element Authorized Successfully!'}
                </h4>
                <p className="font-sans text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  {isPiMode 
                    ? 'Your transaction has been minted on the Pi Network decentral ledger. Your curated setups are secured.' 
                    : 'Thank you for placing your trust with us. We are preparing to dispatch your curated workspace desk setups shortly.'
                  }
                </p>
              </div>

              {/* INVOICE & RECEIPT */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 max-w-md mx-auto space-y-3.5 text-left">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                  <span className="font-mono text-[10px] text-gray-400 uppercase font-bold">Your Receipt Number</span>
                  <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-gray-800">
                    <span>{invoiceId}</span>
                    <button
                      onClick={copyInvoiceToClipboard}
                      className="text-gray-400 hover:text-gray-600 transition"
                      title="Copy receipt ID to clipboard"
                    >
                      {copiedInvoice ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                {isPiMode && piTxId && (
                  <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                    <span className="font-mono text-[10px] text-gray-400 uppercase font-bold">Pi Tx Hash</span>
                    <span className="font-mono text-[10px] overflow-hidden text-amber-700 font-bold max-w-[200px] truncate" title={piTxId}>
                      {piTxId}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-sans text-gray-650">
                    <span>Shipment Target</span>
                    <span className="font-semibold text-gray-800">{shipping.fullName}</span>
                  </div>
                  <div className="flex justify-between text-xs font-sans text-gray-650">
                    <span>Destination Country</span>
                    <span className="font-semibold text-gray-800">{shipping.country}</span>
                  </div>
                  <div className="flex justify-between text-xs font-sans text-gray-650">
                    <span>Notification Email</span>
                    <span className="font-semibold text-gray-800 italic">{shipping.email}</span>
                  </div>
                  <div className="flex justify-between font-sans text-xs text-gray-650">
                    <span>Invoice Value</span>
                    <span className="font-mono font-bold text-gray-900">
                      {isPiMode ? `π ${(netTotal / 40.0).toFixed(3)} Paid` : `$${netTotal.toFixed(2)} Paid`}
                    </span>
                  </div>
                </div>
              </div>

              {/* SHIPPING TIMELINE ASSURANCE CARDS */}
              <div className="max-w-md mx-auto text-left rounded-xl border border-gray-150 p-4 bg-white flex items-start space-x-3">
                <div id="shipment-status-icon" className="p-2 rounded-lg bg-emerald-50 text-emerald-600 font-bold font-mono text-xs">
                  24h
                </div>
                <div>
                  <h5 className="font-sans text-xs font-bold text-gray-900">Carbon Neutral Dispatch</h5>
                  <p className="font-sans text-[11px] text-gray-500 leading-normal mt-0.5">
                    We will dispatch a tracking link to <span className="underline italic text-gray-650">{shipping.email}</span> within 24 hours. Transit times to <span className="font-semibold">{shipping.country}</span> are typically 2-4 business days.
                  </p>
                </div>
              </div>

              {/* DONE ACTION */}
              <div className="pt-4 max-w-xs mx-auto">
                <button
                  id="checkout-complete-done-btn"
                  onClick={handleDone}
                  className="w-full rounded-xl bg-gray-950 py-3 text-xs font-bold text-white hover:bg-gray-800 transition shadow-md active:scale-95"
                >
                  Return to Store Dashboard
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
