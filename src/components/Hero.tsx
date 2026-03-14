import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface HeroProps {
  user: UserProfile | null;
  setStep: (step: number) => void;
  setShowAuthModal: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  laptopHeroImg: string;
}

export function Hero({ user, setStep, setShowAuthModal, setAuthMode, laptopHeroImg }: HeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="px-4 py-1.5 bg-hp-blue/10 text-hp-blue rounded-full text-sm font-bold tracking-wider uppercase">
              AI-Powered Diagnostics
            </span>
            <h1 className="mt-6 text-5xl sm:text-7xl font-bold text-hp-dark tracking-tighter leading-tight">
              The Future of <br />
              <span className="text-hp-blue">Laptop Care</span>
            </h1>
            <p className="mt-6 text-xl text-slate-500 max-w-xl mx-auto lg:mx-0">
              Professional-grade external inspection for your HP device. 
              Detect damage, screen defects, and keyboard issues in seconds.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button 
              onClick={() => setStep(1)}
              className="px-10 py-4 bg-hp-blue text-white rounded-full font-bold text-lg shadow-xl shadow-hp-blue/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              Start Inspection
              <ArrowRight className="w-5 h-5" />
            </button>
            {!user && (
              <button 
                onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                className="px-10 py-4 bg-white text-hp-dark border-2 border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all"
              >
                Create Account
              </button>
            )}
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotateY: [0, 10, 0, -10, 0] 
          }}
          transition={{ 
            opacity: { duration: 1 },
            scale: { duration: 1 },
            rotateY: { 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }
          }}
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-hp-blue/20 border border-white/20 bg-white glass-card">
            <img 
              src={laptopHeroImg} 
              alt="HP Laptop" 
              className="w-full h-64 sm:h-96 object-contain p-8"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hp-dark/5 to-transparent" />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-hp-blue/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        </motion.div>
      </div>
    </motion.div>
  );
}
