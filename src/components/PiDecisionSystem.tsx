import React, { useState, useEffect } from 'react';
import { Smartphone, Shield, Orbit, Code, Info, Check, UserCheck, AlertCircle } from 'lucide-react';
import { PiUser } from '../types';

interface PiDecisionSystemProps {
  isPiMode: boolean;
  setIsPiMode: (val: boolean) => void;
  piUser: PiUser | null;
  setPiUser: (user: PiUser | null) => void;
}

export const USD_TO_PI_RATE = 40.00; // 1 Pi = $40 USD

export default function PiDecisionSystem({
  isPiMode,
  setIsPiMode,
  piUser,
  setPiUser,
}: PiDecisionSystemProps) {
  const [nativeDetected, setNativeDetected] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Auto detect environment on load
  useEffect(() => {
    // 1. Inspect UserAgent for "pibrowser" or "pinetwork"
    const ua = navigator.userAgent.toLowerCase();
    const hasPiAgent = ua.includes('pibrowser') || ua.includes('pinetwork');
    
    // 2. Clear checks
    setNativeDetected(hasPiAgent);

    // 3. Inspect if the window.Pi SDK from CDN loads
    if ((window as any).Pi) {
      setSdkLoaded(true);
      if (hasPiAgent) {
        setIsPiMode(true); // Auto-activate if we are strictly in raw native Pi Browser
      }
    } else {
      // Check again after a short delay in case of late inject
      const timer = setTimeout(() => {
        if ((window as any).Pi) {
          setSdkLoaded(true);
          if (hasPiAgent) {
            setIsPiMode(true);
          }
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [setIsPiMode]);

  // Handle genuine or simulated Authentication
  const handleAuthenticate = async () => {
    setErrorText('');
    const PiSDK = (window as any).Pi;

    if (PiSDK) {
      try {
        // Authenticate using the genuine Pi Network SDK sandbox / production scope
        const scopes = ['username', 'payments'];
        const authResult = await PiSDK.authenticate(scopes, (onIncompletePaymentFound: any) => {
          console.log("Incomplete payment identified", onIncompletePaymentFound);
        });
        
        if (authResult?.user) {
          setPiUser({
            uid: authResult.user.uid,
            username: authResult.user.username,
            accessToken: authResult.accessToken,
          });
          setIsPiMode(true);
        }
      } catch (err: any) {
        console.error("Pi SDK Authentication error", err);
        setErrorText("Native authentication error: " + (err.message || String(err)));
        
        // Fallback to beautiful simulation if actual API rejects sandbox credentials
        fallbackToSimulatedAuth();
      }
    } else {
      // No native SDK loaded (external test) - apply rich simulation immediately
      fallbackToSimulatedAuth();
    }
  };

  const fallbackToSimulatedAuth = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setPiUser({
      uid: `pi-uid-${Date.now()}`,
      username: `pioneer_architect_${randomSuffix}`,
      accessToken: `pi-token-sim-${Math.random().toString(36).substring(2)}`,
    });
    setIsPiMode(true);
  };

  const handleDisconnect = () => {
    setPiUser(null);
    setIsPiMode(nativeDetected); // Revert to native state if applicable
  };

  return (
    <div 
      id="pi-decision-engine" 
      className="fixed bottom-4 left-4 z-40 max-w-sm rounded-2xl border border-gray-150 bg-white p-4 shadow-xl transition-all duration-300"
    >
      {/* MINIMIZED VIEW HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isPiMode ? 'bg-amber-500 text-gray-950' : 'bg-gray-100 text-gray-400'}`}>
            <Orbit className="h-4.5 w-4.5 animate-spin-slow" />
          </div>
          <div>
            <span className="font-mono text-[9px] font-black uppercase tracking-wider text-amber-600 block leading-none">
              Platform Integration
            </span>
            <h4 className="font-sans text-xs font-bold text-gray-900 leading-tight">
              Pi Browser Decision System
            </h4>
          </div>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="rounded-lg bg-gray-50 px-2.5 py-1 font-sans text-[10px] font-bold text-gray-600 hover:bg-gray-150 transition"
        >
          {showConfig ? 'Hide' : 'Diagnostics'}
        </button>
      </div>

      {/* CONDITIONAL SYSTEM DISPLAY DIAGNOSTICS */}
      {showConfig && (
        <div className="mt-4 border-t border-gray-100 pt-3.5 space-y-3">
          
          {/* DETECTION STATUS LIST */}
          <div className="space-y-1.5 rounded-xl bg-gray-50 p-3 border border-gray-100">
            <div className="flex justify-between items-center text-[11px] font-sans">
              <span className="text-gray-400">Native UA Match:</span>
              <span className={`font-semibold ${nativeDetected ? 'text-emerald-600 font-mono' : 'text-gray-500 font-mono'}`}>
                {nativeDetected ? 'YES (PiBrowser)' : 'No (Standard)'}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-[11px] font-sans">
              <span className="text-gray-400">MinePi Client SDK:</span>
              <span className={`font-semibold ${sdkLoaded ? 'text-emerald-600 font-mono' : 'text-amber-600 font-mono'}`}>
                {sdkLoaded ? 'Loaded CDN ✓' : 'SDK Mock Injection'}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] font-sans">
              <span className="text-gray-400">System Mode Status:</span>
              <span className="font-semibold text-gray-800 font-mono uppercase">
                {isPiMode ? 'π Protocol Active' : 'USD Fiat Protocol'}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] font-sans">
              <span className="text-gray-400">Exch. Anchor Ref:</span>
              <span className="font-semibold text-amber-700 font-mono">
                1 π = ${USD_TO_PI_RATE} USD
              </span>
            </div>
          </div>

          {/* SIMULATION FORCE CONTROLS */}
          <div className="space-y-2">
            <span className="font-sans text-[9px] uppercase font-bold text-gray-400 tracking-wider">Configure State Simulation</span>
            
            <div className="flex items-center justify-between p-1.5 rounded-xl border border-gray-150 bg-white">
              <span className="font-sans text-xs text-gray-700 font-medium">Force Pi Browser Mode</span>
              <button
                id="toggle-pi-mode-simulation-btn"
                onClick={() => {
                  const targetState = !isPiMode;
                  setIsPiMode(targetState);
                  if (targetState && !piUser) {
                    fallbackToSimulatedAuth();
                  } else if (!targetState) {
                    handleDisconnect();
                  }
                }}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-205 focus:outline-none ${
                  isPiMode ? 'bg-amber-500' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-205 ${
                  isPiMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* AUTH STATUS BLOCK */}
            <div className="rounded-xl border border-gray-150 p-2.5 bg-amber-50/20">
              {piUser ? (
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-800 font-sans">
                    <UserCheck className="h-4 w-4 text-emerald-600" />
                    <span>Pioneer Logged In</span>
                  </div>
                  <p className="font-mono text-[10px] text-gray-700 tracking-tight text-center bg-white border rounded p-1">
                    @{piUser.username}
                  </p>
                  <button
                    onClick={handleDisconnect}
                    className="w-full rounded bg-gray-100 py-1 font-sans text-[9px] text-gray-500 hover:bg-gray-200"
                  >
                    Disconnect Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="font-sans text-[10px] text-gray-500 leading-normal">
                    Connect as a simulated or real Pioneer user to test in-app Pi Network wallet popups & item conversions.
                  </p>
                  <button
                    onClick={handleAuthenticate}
                    className="w-full flex items-center justify-center space-x-1 rounded bg-amber-500 py-1 font-sans text-[10px] font-bold text-gray-950 hover:bg-amber-600"
                  >
                    <span>Connect Pioneer ID</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {errorText && (
            <p className="text-[10px] font-sans text-rose-600 bg-rose-50 rounded p-1 border border-rose-100">
              {errorText}
            </p>
          )}

        </div>
      )}

      {/* COMPACT FLOATING PERSISTENT BADGE */}
      {!showConfig && (
        <div className="mt-2 flex items-center justify-between text-[11px] font-sans text-gray-505 border-t border-gray-50 pt-1.5">
          <span className="flex items-center space-x-1 select-none">
            <span className={`h-2 w-2 rounded-full ${isPiMode ? 'bg-amber-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="font-mono text-[9px] tracking-wide text-gray-550 uppercase">
              {isPiMode ? 'π Protocol Active' : 'USD protocol active'}
            </span>
          </span>
          <span className="text-gray-400 scale-95 select-none font-medium">1 π = ${USD_TO_PI_RATE}</span>
        </div>
      )}

    </div>
  );
}
