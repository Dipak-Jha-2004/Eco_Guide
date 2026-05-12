import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InputBoxProps {
  onSendMessage: (query: string) => void;
  disabled?: boolean;
}

export default function InputBox({ onSendMessage, disabled }: InputBoxProps) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text);
      setText("");
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="relative p-4 md:p-6 bg-gradient-to-t from-eco-dark/80 to-transparent">
      <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about sustainable products..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-eco-green/50 focus:ring-1 focus:ring-eco-green/20 transition-all resize-none min-h-[56px] max-h-32 text-md"
            disabled={disabled || isListening}
            rows={1}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleListen}
            disabled={disabled}
            className={`p-4 rounded-2xl transition-all font-bold shadow-lg flex items-center justify-center shrink-0 ${
              isListening 
                ? 'bg-red-500 text-white shadow-red-500/20 scale-110' 
                : 'bg-white/5 text-white/50 hover:text-eco-green hover:bg-white/10 border border-white/10'
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
          </button>

          <button
            onClick={handleSend}
            disabled={!text.trim() || disabled || isListening}
            className="p-4 bg-eco-green text-eco-dark rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all font-bold shadow-lg shadow-eco-green/20 shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 -top-12 bg-eco-green text-eco-dark px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl shadow-eco-green/40"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map(id => (
                <motion.div
                  key={id}
                  className="w-1.5 h-1.5 bg-eco-dark rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: id * 0.1 }}
                />
              ))}
            </div>
            Listening...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
