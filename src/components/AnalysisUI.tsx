import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function ScanningOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
      <motion.div 
        className="absolute inset-x-0 h-1 bg-hp-blue shadow-[0_0_20px_rgba(0,150,214,1)] z-30"
        initial={{ top: "-5%" }}
        animate={{ top: "105%" }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute inset-0 bg-hp-blue/10 backdrop-blur-[2px]"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full border-2 border-hp-blue/30 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

export function Hotspot({ x, y, width, height, title, description }: { x: number; y: number; width: number; height: number; title: string; description: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="absolute z-30 group"
      style={{ 
        left: `${x/10}%`, 
        top: `${y/10}%`,
        width: `${width/10}%`,
        height: `${height/10}%`,
        minWidth: '20px',
        minHeight: '20px'
      }}
    >
      <div 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full border-2 border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)] rounded-sm transition-all hover:bg-red-500/20 cursor-help"
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 p-3 bg-white rounded-xl shadow-xl border border-slate-200 pointer-events-none"
          >
            <p className="text-xs font-bold text-hp-dark mb-1">{title}</p>
            <p className="text-[10px] text-slate-500 leading-tight break-words">{description}</p>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-slate-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
