import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Sun, Moon, Info, ShieldAlert } from "lucide-react";
import MessageBubble from "./components/MessageBubble";
import InputBox from "./components/InputBox";
import TypingIndicator from "./components/TypingIndicator";
import ProductGrid from "./components/ProductGrid";
import { generateEcoResponse } from "./services/geminiService";
import type { SerpProduct } from "./services/serpProductService";

interface Message {
  role: 'user' | 'bot';
  content: string;
  ecoScore?: {
    score: number;
    breakdown: string[];
  };
  outOfScope?: boolean;
  products?: SerpProduct[];
  loadingProducts?: boolean;
}

const SUGGESTIONS = [
  "Suggest eco friendly t-shirt 👕",
  "Plastic-free shampoo alternatives 🧴",
  "Sustainable running shoes 👟",
  "Organic snack brands 🍎",
  "Eco-friendly home cleaning 🏡",
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm your AI Eco-Friendly Shopping Assistant. Ask me anything about sustainable products, organic ingredients, or green alternatives — and I'll also show you **real products you can buy right now!** 🌿🛒" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (query: string) => {
    const userMsg: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 1. Backend: validation + product data from Open Food Facts
      const backendResponse = await axios.post('/api/chat', {
        query,
        preferences: { vegan: false, avoidPlastic: true }
      });

      const { product, ecoScore, outOfScope, response: backendStaticResponse } = backendResponse.data;

      let botMsg: Message;

      if (outOfScope) {
        botMsg = {
          role: 'bot',
          content: backendStaticResponse || "I only answer eco-friendly shopping and sustainability-related questions 🌿",
          outOfScope: true,
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        // 2. Get Gemini AI advice response
        const aiResponse = await generateEcoResponse(query, product, ecoScore);

        // Show bot response immediately with loadingProducts=true
        botMsg = {
          role: 'bot',
          content: aiResponse,
          ecoScore: ecoScore,
          outOfScope: false,
          loadingProducts: true,
          products: [],
        };
        setMessages(prev => [...prev, botMsg]);
        setIsLoading(false);

        // 3. Fetch real Google Shopping products via backend
        const productsRes = await axios.post('/api/products', { query });
        const products: SerpProduct[] = productsRes.data?.products || [];

        // Update the last bot message with products
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx].role === 'bot') {
            updated[lastIdx] = { ...updated[lastIdx], products, loadingProducts: false };
          }
          return updated;
        });
        return; // already set isLoading to false above
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "I'm sorry, I encountered an error. Please check your connection and try again later. 🌿"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-500 overflow-hidden ${darkMode ? 'bg-[#022c22]' : 'bg-white'}`}>
      <div className="mesh-bg" />

      {/* Header */}
      <header className="flex items-center justify-between p-4 px-6 glass-card border-x-0 border-t-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-eco-green/20 rounded-xl text-eco-green">
            <Leaf size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">EcoAssist</h1>
            <p className="text-[10px] uppercase tracking-widest font-semibold opacity-50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Sustainability Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white">
            <Info size={20} />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" ref={scrollRef}>
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
          <div className="flex-1">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <div key={idx}>
                  {msg.outOfScope && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center mb-6"
                    >
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-400/10 border border-red-400/20 text-red-400 rounded-full text-xs font-bold">
                        <ShieldAlert size={14} />
                        Domain Restriction Applied
                      </div>
                    </motion.div>
                  )}
                  <MessageBubble message={msg} />
                  {/* Product Grid below bot messages */}
                  {msg.role === 'bot' && !msg.outOfScope && (msg.loadingProducts || (msg.products && msg.products.length > 0)) && (
                    <ProductGrid
                      products={msg.products || []}
                      isLoading={msg.loadingProducts ?? false}
                    />
                  )}
                </div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <TypingIndicator />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestions */}
          {!isLoading && messages.length < 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 mb-4 flex flex-wrap gap-2 justify-center"
            >
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s)}
                  className="px-4 py-2 bg-white/5 hover:bg-eco-green hover:text-eco-dark transition-all rounded-full text-sm border border-white/10"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer / Input */}
      <footer className="z-10">
        <InputBox onSendMessage={handleSendMessage} disabled={isLoading} />
        <p className="text-[10px] text-center pb-4 opacity-30">
          Powered by Gemini · Open Food Facts API · Real product links from Amazon, Etsy & more
        </p>
      </footer>
    </div>
  );
}
