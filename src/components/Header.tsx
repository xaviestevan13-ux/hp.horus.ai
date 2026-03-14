import React from 'react';
import { motion } from 'motion/react';
import { Laptop, LogOut, User as UserIcon, BarChart3, LayoutGrid } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  step: number;
  setStep: (step: number) => void;
  setShowAuthModal: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  logout: () => void;
  hpLogo: string;
}

export function Header({
  user,
  step,
  setStep,
  setShowAuthModal,
  setAuthMode,
  logout,
  hpLogo
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setStep(0)}
        >
          <div className="w-10 h-10 bg-hp-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-hp-blue/20 group-hover:scale-110 transition-transform">
            <Laptop className="w-6 h-6" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-bold text-hp-dark tracking-tighter">HP <span className="text-hp-blue">Inspect</span></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Diagnostics</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setStep(0)} 
            className={`text-sm font-bold transition-colors ${step === 0 ? 'text-hp-blue' : 'text-slate-500 hover:text-hp-blue'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setStep(5)} 
            className={`text-sm font-bold transition-colors flex items-center gap-2 ${step === 5 ? 'text-hp-blue' : 'text-slate-500 hover:text-hp-blue'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Fleet
          </button>
          {user?.role === 'technician' && (
            <button 
              onClick={() => setStep(6)} 
              className={`text-sm font-bold transition-colors flex items-center gap-2 ${step === 6 ? 'text-hp-blue' : 'text-slate-500 hover:text-hp-blue'}`}
            >
              <BarChart3 className="w-4 h-4" />
              Stats
            </button>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(4)}
                className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 hover:bg-slate-100 transition-all group"
              >
                <div className="w-8 h-8 bg-hp-blue/10 rounded-full flex items-center justify-center text-hp-blue group-hover:bg-hp-blue group-hover:text-white transition-all">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-hp-dark">{user.name.split(' ')[0]}</span>
              </button>
              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                className="px-6 py-2.5 text-sm font-bold text-hp-dark hover:text-hp-blue transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                className="px-6 py-2.5 bg-hp-blue text-white rounded-full text-sm font-bold shadow-lg shadow-hp-blue/20 hover:scale-105 transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
