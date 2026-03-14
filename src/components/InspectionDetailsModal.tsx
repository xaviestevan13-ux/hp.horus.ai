import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, ShieldCheck, RefreshCcw, Wrench, AlertTriangle, Download } from 'lucide-react';
import { InspectionRecord } from '../types';

interface InspectionDetailsModalProps {
  inspection: InspectionRecord | null;
  onClose: () => void;
  formatPrice: (price: number) => string;
  onDownload: (inspection: InspectionRecord) => void;
}

export function InspectionDetailsModal({
  inspection,
  onClose,
  formatPrice,
  onDownload
}: InspectionDetailsModalProps) {
  if (!inspection) return null;

  const results = inspection.results;
  const isLaptop = inspection.inspection_type === 'laptop';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-hp-dark/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div>
              <h3 className="text-2xl font-bold text-hp-dark">{inspection.model}</h3>
              <p className="text-sm text-slate-500">Inspection Date: {new Date(inspection.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onDownload(inspection)}
                className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-hp-blue hover:text-white transition-all"
              >
                <Download className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Overall Health</p>
                <p className="text-2xl font-bold text-hp-blue">{inspection.overall_health}</p>
              </div>
              {isLaptop ? (
                <>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Repair Cost</p>
                    <p className="text-2xl font-bold text-red-500">{formatPrice(results.totalRepairCost || 0)}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Resale Value</p>
                    <p className="text-2xl font-bold text-emerald-500">{formatPrice(results.estimatedResaleValue || 0)}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Wear Level</p>
                    <p className="text-2xl font-bold text-hp-blue">{results.wearLevel}%</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Remaining Life</p>
                    <p className="text-2xl font-bold text-emerald-500">{results.estimatedRemainingLifeYears} Years</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-hp-dark flex items-center gap-2">
                <Info className="w-5 h-5 text-hp-blue" />
                Analysis Summary
              </h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
                {inspection.summary}
              </p>
            </div>

            {isLaptop ? (
              <div className="space-y-4">
                <h4 className="font-bold text-hp-dark">Detected Issues</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.errors?.map((error: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                      <div>
                        <p className="font-bold text-sm text-hp-dark">{error.type}</p>
                        <p className="text-xs text-slate-500">{error.description}</p>
                        <p className="text-xs font-bold text-hp-blue mt-1">Cost: {formatPrice(error.repairCost)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-bold text-hp-dark">Detected Issues</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.detectedIssues?.map((issue: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${issue.severity === 'High' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <div>
                        <p className="font-bold text-sm text-hp-dark">{issue.type}</p>
                        <p className="text-xs text-slate-500">{issue.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.recommendation && (
              <div className="p-6 bg-hp-blue/5 border border-hp-blue/10 rounded-3xl flex gap-6 items-start">
                <div className="w-12 h-12 bg-hp-blue text-white rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-bold text-hp-blue uppercase tracking-widest mb-1">AI Recommendation</p>
                  <p className="text-lg font-bold text-hp-dark mb-1">{results.recommendation.action}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{results.recommendation.reasoning}</p>
                </div>
              </div>
            )}

            {!isLaptop && results.manualRepairRecommendations?.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-hp-blue flex items-center justify-center text-white">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-bold text-hp-dark">Manual Repair Recommendations</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.manualRepairRecommendations.map((rec: string, rIdx: number) => (
                    <div key={rIdx} className="bg-white p-4 rounded-2xl border border-blue-100 flex items-start gap-3 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-hp-blue flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {rIdx + 1}
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed font-medium">{rec}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-white/50 rounded-2xl border border-blue-100/50 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] text-slate-500 italic">
                    Note: Manual cleaning should be performed with caution using approved solvents and lint-free materials.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
