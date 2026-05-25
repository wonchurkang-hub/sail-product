import React, { useState, useRef, useEffect } from 'react';
import { X, Send, HelpCircle, Bot, MessageSquare } from 'lucide-react';

interface Msg {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQS = [
  { q: "How do I care for the Merino wool felt desk pad?", a: "To maintain the premium merino wool fibers, spot clean any spills immediately with a lint-free damp cloth and lukewarm water. Avoid machine washing or harsh scrubbing. Air dry naturally away from direct heating elements." },
  { q: "Are the mechanical keyboard switches hot-swappable?", a: "Yes, the Luminary mechanical keyboard features a premium 5-pin hot-swappable plate compatible with Cherry MX, Gateron, and Kailh switches. No soldering required!" },
  { q: "What does the 2-year warranty cover?", a: "The warranty covers any functional manufacturing defects, electronic switch failures, and LED driver errors. It does not cover standard cosmetic wear or liquid accidents." },
  { q: "Where do you ship from and what are the delivery estimate times?", a: "We ship carbon-neutral via premium carriers directly from our central warehouses in San Francisco, CA and Frankfurt, DE. Shipping is free worldwide, taking 2 to 4 business days." }
];

export default function SupportPanel({ isOpen, onClose }: SupportPanelProps) {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<Msg[]>([
    {
      sender: 'assistant',
      text: "Hello! I am your Object & Space Desk Assistant. Feel free to click any common FAQ below, or write your own inquiry about our premium acoustics, custom keycaps, or felt accessories.",
      time: '12:46 PM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to the bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendResponse = (txt: string) => {
    const userMsg: Msg = {
      sender: 'user',
      text: txt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate smart support response matching key words
    setTimeout(() => {
      let reply = "Thank you for reaching out. Your question has been routed to our workspace design advisors. We will get back to you shortly or you can email us directly at sales@objectandspace.design.";
      
      const query = txt.toLowerCase();
      if (query.includes('felt') || query.includes('desk pad') || query.includes('clean')) {
        reply = "MERINO CARE: Spot-clean immediately with a damp cloth and lukewarm water. Do not submerge, and let air-dry. Cork base protects from moisture.";
      } else if (query.includes('switch') || query.includes('keyboard') || query.includes('hot-swappable')) {
        reply = "KEYBOARD SWITCHES: The Luminary keyboard is fully 3/5-pin hot-swappable. Ships with tactile lubed linear switches, easily swappable with Cherry or Gateron profile switches.";
      } else if (query.includes('warranty') || query.includes('defect')) {
        reply = "WARRANTY DETAILS: Every piece is backed by our full 2-year design warranty covering components and electronics. Standard email lookup confirms eligibility.";
      } else if (query.includes('ship') || query.includes('track') || query.includes('time')) {
        reply = "DESTINATION DELIVERIES: Standard delivery ranges 2-4 business days fully tracked. Orders clear within 24 hours carbon-neutrally.";
      } else if (query.includes('promo') || query.includes('discount') || query.includes('coupon')) {
        reply = "CURRENT OFFERS: Use coupon code 'WELCOME10' inside your cart drawer to lock down an immediate 10% discount on today's catalog items.";
      }

      const botMsg: Msg = {
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const sendTxt = inputText.trim();
    setInputText('');
    handleSendResponse(sendTxt);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white border-l border-gray-150 shadow-2xl animate-in slide-in-from-right duration-300">
      
      {/* PANEL HEADER */}
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-gray-950" />
          <h3 className="font-sans text-base font-bold text-gray-900">Desk Support Assistant</h3>
        </div>
        <button
          id="close-support-drawer-btn"
          onClick={onClose}
          className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-950 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* CHAT MESSAGES PANEL */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2.5 max-w-[85%] ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              
              {/* SENDER ICON badge */}
              <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl text-xs font-bold ${
                m.sender === 'user' ? 'bg-amber-100 text-amber-800' : 'bg-gray-950 text-white'
              }`}>
                {m.sender === 'user' ? 'Me' : <Bot className="h-3.5 w-3.5" />}
              </div>

              {/* MESSAGE CONTENT */}
              <div className={`rounded-2xl px-4 py-2.5 shadow-xs border ${
                m.sender === 'user'
                  ? 'bg-amber-500 border-amber-600 text-white font-medium'
                  : 'bg-gray-50 border-gray-150/40 text-gray-800'
              }`}>
                <p className="font-sans text-xs leading-relaxed">{m.text}</p>
                <span className={`block font-mono text-[9px] mt-1 text-right ${
                  m.sender === 'user' ? 'text-amber-100' : 'text-gray-400'
                }`}>
                  {m.time}
                </span>
              </div>

            </div>
          </div>
        ))}

        {/* TYPING SIMULATOR */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2.5 bg-gray-50 border border-gray-150/40 rounded-full px-4 py-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"></span>
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"></span>
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* PRE-CONSTRUCTED FAQs ACCORDIONS QUICK CLICKS */}
      <div className="border-t border-gray-100 bg-gray-50/50 p-4">
        <span className="font-sans text-[10px] uppercase font-bold text-gray-400 block mb-2 tracking-wide">Suggested FAQ Enquiries</span>
        <div className="flex flex-wrap gap-1.5">
          {FAQS.map((faq, index) => (
            <button
              key={index}
              onClick={() => handleSendResponse(faq.q)}
              className="text-left rounded-xl bg-white border border-gray-150 px-3 py-1.5 text-[11px] font-sans text-gray-700 hover:border-gray-950 hover:bg-gray-50 transition font-medium"
            >
              {faq.q}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT CHIEF INTERACTION BOX */}
      <form onSubmit={handleFormSubmit} className="border-t border-gray-100 p-4 flex space-x-2 items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about acoustics, tactile linear switches..."
          className="flex-1 rounded-full border border-gray-250 bg-white px-4 py-2 text-xs font-sans text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-950"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-950 text-white hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 transition"
          title="Send inquiry"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
}
