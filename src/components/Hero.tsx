import React from 'react';
import { ArrowDown, Sparkles, MoveRight } from 'lucide-react';
import { HERO_IMAGE } from '../data';

interface HeroProps {
  onScrollToCatalog: () => void;
  onApplyPromoCode: (code: string) => void;
  promoCodeApplied: boolean;
}

export default function Hero({ onScrollToCatalog, onApplyPromoCode, promoCodeApplied }: HeroProps) {
  return (
    <div id="hero-banner" className="relative overflow-hidden bg-gray-50/55 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* HERO TEXT COLUMN */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-600/10">
              <Sparkles className="h-3 w-3 text-amber-600" />
              <span>Premium Workspace Elements</span>
            </div>

            <h2 className="font-sans text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Aesthetics designed to help you <span className="underline decoration-amber-400 decoration-4">focus</span>.
            </h2>

            <p className="font-sans text-base leading-relaxed text-gray-650 sm:text-lg">
              A curated suite of high-fidelity mechanical keyboards, acoustically calibrated audio gear, 
              and premium desk pads designed with raw geological textures & minimalist integrity. Create your sacred workspace.
            </p>

            {/* INTERACTIVE PROMO REWARD CARD */}
            <div id="promo-card" className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-amber-600 font-bold">Inaugural Discount</p>
                  <p className="font-sans text-sm font-semibold text-gray-900">Get 10% off with promo code <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-rose-600">WELCOME10</code></p>
                </div>
                <button
                  id="promo-activation-btn"
                  onClick={() => onApplyPromoCode('WELCOME10')}
                  disabled={promoCodeApplied}
                  className={`rounded-xl px-3.5 py-2 text-xs font-medium font-sans transition ${
                    promoCodeApplied
                      ? 'bg-emerald-50 text-emerald-700 cursor-not-allowed border border-emerald-200'
                      : 'bg-gray-950 text-white hover:bg-gray-800'
                  }`}
                >
                  {promoCodeApplied ? 'Activated ✓' : 'Apply'}
                </button>
              </div>
            </div>

            {/* CTAS */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                id="hero-primary-cta"
                onClick={onScrollToCatalog}
                className="group flex items-center justify-center space-x-2 rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-medium font-sans text-white hover:bg-gray-800 transition duration-200 shadow-md"
              >
                <span>Browse Elements</span>
                <MoveRight className="h-4 w-4 transition duration-200 group-hover:translate-x-1" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => {
                  const el = document.getElementById('story-segment');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-medium font-sans text-gray-700 hover:bg-gray-50 transition"
              >
                Our Design Story
              </button>
            </div>
          </div>

          {/* BEAUTIFUL WORKSPACE GRAPHIC COLUMN */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition hover:scale-[1.01] duration-300">
              <img
                src={HERO_IMAGE}
                alt="Minimalist Desk Workspace Setting"
                className="aspect-video w-full object-cover sm:aspect-[4/3] lg:aspect-square"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 rounded-lg bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-sm border border-gray-100/30">
                <span className="font-mono text-[10px] text-gray-500 font-semibold tracking-wide flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                  <span>PREVIEW PLATFORM ACTIVE</span>
                </span>
              </div>
              
              {/* ACCENT PIECES FLOATING WITH PRODUCT STATS ON THE WORKSPACE */}
              <div className="hidden sm:block absolute bottom-6 right-6 rounded-xl bg-gray-950/90 backdrop-blur-md p-4 text-white hover:bg-gray-950 transition">
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400 font-mono">Elements Selection /</span>
                    <span className="rounded bg-amber-500 px-1 py-0.5 text-[8px] text-gray-950 font-bold">100% MERINO</span>
                  </div>
                  <p className="font-sans text-sm font-semibold text-gray-100 leading-tight">Handcrafted to reduce echo & heighten precision.</p>
                </div>
              </div>
            </div>
            {/* AMBIENT SHADOWS */}
            <div className="absolute -z-10 -bottom-6 -left-6 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl"></div>
            <div className="absolute -z-10 -top-6 -right-6 h-64 w-64 rounded-full bg-slate-200/35 blur-3xl"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
