import React from 'react';
import { motion } from 'motion/react';
import { Laptop, RefreshCcw, ChevronRight, ShieldCheck } from 'lucide-react';

interface InspectionTypeSelectionProps {
  inspectionMode: 'laptop' | 'siteprint';
  setInspectionMode: (mode: 'laptop' | 'siteprint') => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  setStep: (step: number) => void;
  hpModels: string[];
  sitePrintHeroImg: string;
}

export function InspectionTypeSelection({
  inspectionMode,
  setInspectionMode,
  selectedModel,
  setSelectedModel,
  setStep,
  hpModels,
  sitePrintHeroImg
}: InspectionTypeSelectionProps) {
  const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-6 sm:px-8 py-12 space-y-12"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-hp-dark">Select Inspection Type</h2>
        <p className="text-slate-500">Choose the hardware you want to diagnose today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Laptop Option */}
        <button 
          onClick={() => setInspectionMode('laptop')}
          className={cn(
            "p-8 rounded-3xl border-2 transition-all text-left group relative overflow-hidden",
            inspectionMode === 'laptop' ? "border-hp-blue bg-hp-blue/5 ring-4 ring-hp-blue/10" : "border-slate-200 bg-white hover:border-hp-blue/30"
          )}
        >
          <div className="relative z-10 space-y-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
              inspectionMode === 'laptop' ? "bg-hp-blue text-white" : "bg-slate-100 text-slate-400 group-hover:bg-hp-blue/10 group-hover:text-hp-blue"
            )}>
              <Laptop className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-hp-dark">HP Laptop Refurbishment</h3>
              <p className="text-sm text-slate-500">External health, repair costs, and resale valuation.</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Laptop className="w-32 h-32" />
          </div>
        </button>

        {/* SitePrint Option */}
        <button 
          onClick={() => setInspectionMode('siteprint')}
          className={cn(
            "p-8 rounded-3xl border-2 transition-all text-left group relative overflow-hidden",
            inspectionMode === 'siteprint' ? "border-hp-blue bg-hp-blue/5 ring-4 ring-hp-blue/10" : "border-slate-200 bg-white hover:border-hp-blue/30"
          )}
        >
          <div className="relative z-10 space-y-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
              inspectionMode === 'siteprint' ? "bg-hp-blue text-white" : "bg-slate-100 text-slate-400 group-hover:bg-hp-blue/10 group-hover:text-hp-blue"
            )}>
              <RefreshCcw className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-hp-dark">HP SitePrint Components</h3>
              <p className="text-sm text-slate-500">Analyze the external inkjet part for wear and maintenance.</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <RefreshCcw className="w-32 h-32" />
          </div>
        </button>
      </div>

      {inspectionMode === 'laptop' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold text-hp-dark text-center">Select Model</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hpModels.map((model) => (
              <button
                key={model}
                onClick={() => { setSelectedModel(model); setStep(2); }}
                className={cn(
                  "group p-6 text-left rounded-2xl border-2 transition-all duration-300 hover:shadow-lg",
                  selectedModel === model ? "border-hp-blue bg-hp-blue/5" : "border-slate-200 bg-white hover:border-hp-blue/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-hp-blue/10 transition-colors">
                      <Laptop className="w-6 h-6 text-slate-600 group-hover:text-hp-blue" />
                    </div>
                    <span className="font-semibold text-lg">{model}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-hp-blue" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-bottom-4 border border-white/5 shadow-2xl">
          <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden border border-white/10">
            <img src={sitePrintHeroImg} alt="HP SitePrint" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="px-3 py-1 bg-hp-blue/20 text-hp-blue rounded-full text-xs font-bold w-fit uppercase tracking-widest">HP SitePrint Robot</div>
            <h3 className="text-2xl font-bold">Autonomous Layout Robot</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              HP SitePrint is designed to automate construction layout with high precision. 
              Regular inkjet inspection ensures the robot maintains its printing quality and longevity in harsh environments.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> External Inkjet</div>
              <div className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Rugged Design</div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-4 px-8 py-3 bg-hp-blue text-white rounded-full font-bold text-sm shadow-lg shadow-hp-blue/30 hover:bg-hp-blue/90 transition-all flex items-center gap-2 w-fit"
            >
              Start Inkjet Inspection
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
