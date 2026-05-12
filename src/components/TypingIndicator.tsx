import { motion } from "motion/react";

export default function TypingIndicator() {
  return (
    <div className="flex space-x-1.5 p-3 px-4 bg-white/5 border border-white/10 rounded-2xl w-fit">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-eco-green rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}
