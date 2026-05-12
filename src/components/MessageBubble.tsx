import { motion } from "motion/react";
import ReactMarkdown from 'react-markdown';
import { Leaf, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  ecoScore?: {
    score: number;
    breakdown: string[];
  };
}

export default function MessageBubble({ message }: { message: Message }) {
  const isBot = message.role === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mb-6",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "flex max-w-[85%] md:max-w-[70%]",
        isBot ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isBot ? "bg-eco-green/20 text-eco-green mr-3" : "bg-white/10 text-white ml-3"
        )}>
          {isBot ? <Leaf size={16} /> : <User size={16} />}
        </div>
        
        <div className="flex flex-col">
          <div className={cn(
            "p-3 px-4 rounded-2xl",
            isBot 
              ? "bg-white/5 border border-white/10 rounded-tl-sm text-white/90" 
              : "bg-eco-green text-eco-dark font-medium rounded-tr-sm"
          )}>
            <div className="markdown-body">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            
            {message.ecoScore && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-60">Eco-Score</span>
                  <span className="text-sm font-bold text-eco-green">{message.ecoScore.score}/10</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${message.ecoScore.score * 10}%` }}
                    className="h-full bg-eco-green"
                  />
                </div>
                <ul className="mt-2 space-y-1">
                  {message.ecoScore.breakdown.slice(1).map((item, idx) => (
                    <li key={idx} className="text-[10px] opacity-50 flex items-center">
                      <span className="w-1 h-1 bg-eco-green rounded-full mr-2 opacity-60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
