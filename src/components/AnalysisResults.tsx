import React from 'react';
import { motion } from 'motion/react';
import { 
  RefreshCcw, 
  AlertCircle, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  X, 
  ShoppingBag, 
  DollarSign, 
  Wrench, 
  Download,
  MessageSquare,
  Loader2,
  Zap,
  Shield,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { ScanningOverlay, Hotspot } from './AnalysisUI';
import { AnalysisResult, SitePrintAnalysisResult } from '../types';

interface AnalysisResultsProps {
  inspectionMode: 'laptop' | 'siteprint';
  selectedModel: string;
  images: any[];
  isAnalyzing: boolean;
  combinedResult: AnalysisResult | null;
  combinedSitePrintResult: SitePrintAnalysisResult | null;
  combinedError: string | null;
  formatPrice: (price: number) => string;
  reset: () => void;
  setStep: (step: number) => void;
  downloadReport: () => void;
  showFeedbackForm: boolean;
  feedbackSubmitted: boolean;
  feedbackComment: string;
  setFeedbackComment: (comment: string) => void;
  submitFeedback: (isCorrect: boolean) => void;
  chatMessages: { role: string; content: string }[];
  isChatLoading: boolean;
  chatInput: string;
  setChatInput: (input: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

export function AnalysisResults({
  inspectionMode,
  selectedModel,
  images,
  isAnalyzing,
  combinedResult,
  combinedSitePrintResult,
  combinedError,
  formatPrice,
  reset,
  setStep,
  downloadReport,
  showFeedbackForm,
  feedbackSubmitted,
  feedbackComment,
  setFeedbackComment,
  submitFeedback,
  chatMessages,
  isChatLoading,
  chatInput,
  setChatInput,
  handleSendMessage
}: AnalysisResultsProps) {
  const totalEstimatedValue = combinedResult?.estimatedResaleValue || 0;
  const totalRepairCosts = combinedResult?.totalRepairCost || 0;

  const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-hp-dark">Analysis Results</h2>
        <button onClick={reset} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full font-bold hover:bg-slate-200 transition-colors">
          New Inspection
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Detailed Analysis */}
        <div className="lg:col-span-2 space-y-8">
          {/* Images Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
            <div className={cn(
              "grid gap-4",
              images.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
            )}>
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-video group">
                  <img src={img.preview} alt="Inspection" className="w-full h-full object-cover" />
                  {img.loading && <ScanningOverlay active={true} />}
                  
                  {/* Hotspots - only if we have a combined result and it's not loading */}
                  {!img.loading && combinedResult?.errors?.filter((e: any) => e.imageIndex === idx).map((error: any, eIdx: number) => (
                    <Hotspot 
                      key={eIdx} 
                      x={error.coordinates.x} 
                      y={error.coordinates.y} 
                      width={error.coordinates.width}
                      height={error.coordinates.height}
                      title={error.type} 
                      description={error.description} 
                    />
                  ))}

                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
                    View {idx + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6 gap-4">
              <div className="flex items-center gap-4">
                {isAnalyzing ? (
                  <div className="flex items-center gap-2 text-hp-blue">
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                    <span className="font-bold">AI Analyzing Fleet...</span>
                  </div>
                ) : combinedError ? (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-bold">Analysis Failed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold">Fleet Analysis Complete</span>
                  </div>
                )}
              </div>
              
              {!isAnalyzing && !combinedError && (combinedResult || combinedSitePrintResult) && (
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider",
                  (combinedResult?.overallHealth || combinedSitePrintResult?.condition) === "Excellent" ? "bg-emerald-100 text-emerald-700" :
                  (combinedResult?.overallHealth || combinedSitePrintResult?.condition) === "Good" ? "bg-blue-100 text-blue-700" :
                  (combinedResult?.overallHealth || combinedSitePrintResult?.condition) === "Fair" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                )}>
                  Overall Condition: {combinedResult?.overallHealth || combinedSitePrintResult?.condition}
                </span>
              )}
            </div>
          </div>

          {/* Combined Analysis Result Details */}
          {!isAnalyzing && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
              {combinedError ? (
                <div className="p-8 bg-red-50 border border-red-200 rounded-2xl space-y-4 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                  <h3 className="text-xl font-bold text-red-700">Verification Error</h3>
                  <p className="text-red-600 max-w-md mx-auto">{combinedError}</p>
                  <button onClick={() => setStep(2)} className="mt-4 px-8 py-3 bg-red-600 text-white rounded-full font-bold">Try Again</button>
                </div>
              ) : (
                <>
                  {combinedResult && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2 text-lg"><Info className="w-5 h-5 text-hp-blue" /> Fleet Analysis Summary</h4>
                        <p className="text-slate-600 leading-relaxed break-words">{combinedResult.summary}</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900 text-lg">Detected Issues ({combinedResult.errors.length})</h4>
                        {combinedResult.errors.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {combinedResult.errors.map((error, eIdx) => (
                              <div key={eIdx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                                  <div>
                                    <p className="font-bold text-sm text-hp-dark">{error.type}</p>
                                    <p className="text-xs text-slate-500 break-words">{error.description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-hp-blue">{formatPrice(error.repairCost)}</p>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold">Repair</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            <p className="font-medium text-emerald-700">No external defects detected across all views.</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6 pt-6 border-t border-slate-100">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 bg-slate-900 rounded-2xl text-white">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Total Repair Cost</p>
                            <p className="text-2xl font-bold">{formatPrice(combinedResult.totalRepairCost)}</p>
                          </div>
                          <div className="p-4 bg-hp-blue rounded-2xl text-white">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-blue-100 mb-1">Est. Resale Value</p>
                            <p className="text-2xl font-bold">{formatPrice(combinedResult.estimatedResaleValue)}</p>
                          </div>
                          <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-700 border border-emerald-200/50">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 mb-1">Useful Life Left</p>
                            <p className="text-2xl font-bold">{combinedResult.estimatedRemainingLifeYears}Y</p>
                          </div>
                        </div>

                        <div className={cn(
                          "p-6 rounded-3xl border-2 flex gap-6 items-start",
                          combinedResult.recommendation.action === "Repair" ? "bg-emerald-50 border-emerald-100" :
                          combinedResult.recommendation.action === "Sell As-Is" ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100"
                        )}>
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                            combinedResult.recommendation.action === "Repair" ? "bg-emerald-500 text-white" :
                            combinedResult.recommendation.action === "Sell As-Is" ? "bg-blue-500 text-white" : "bg-red-500 text-white"
                          )}>
                            {combinedResult.recommendation.action === "Repair" ? <ShieldCheck className="w-8 h-8" /> : 
                             combinedResult.recommendation.action === "Sell As-Is" ? <RefreshCcw className="w-8 h-8" /> : <X className="w-8 h-8" />}
                          </div>
                          <div>
                            <p className={cn(
                              "text-xs font-bold uppercase tracking-widest mb-1",
                              combinedResult.recommendation.action === "Repair" ? "text-emerald-600" :
                              combinedResult.recommendation.action === "Sell As-Is" ? "text-blue-600" : "text-red-600"
                            )}>AI Recommendation: {combinedResult.recommendation.action}</p>
                            <p className="text-lg font-bold text-hp-dark mb-1">Expert Verdict</p>
                            <p className="text-slate-700 leading-relaxed break-words">{combinedResult.recommendation.reasoning}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                          <a href="https://support.hp.com/us-en/contact" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm">
                            <Shield className="w-5 h-5 text-hp-blue" /> Support
                          </a>
                          <a href="https://www.hp.com/us-en/shop/cat/laptops" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-hp-blue text-white font-bold hover:bg-hp-blue/90 transition-colors shadow-md">
                            <ShoppingBag className="w-5 h-5" /> Shop New
                          </a>
                          <a href="https://www.hp.com/us-en/shop/slp/hp-trade-in" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-md">
                            <DollarSign className="w-5 h-5" /> Trade-In
                          </a>
                          <a href="https://www.hp.com/us-en/parts-store/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors shadow-sm">
                            <Wrench className="w-5 h-5 text-hp-blue" /> Parts Store
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {combinedSitePrintResult && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2 text-lg"><Info className="w-5 h-5 text-hp-blue" /> {combinedSitePrintResult.componentType} Fleet Analysis</h4>
                        <p className="text-slate-600 leading-relaxed break-words">{combinedSitePrintResult.summary}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-100 rounded-3xl">
                          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                            {combinedSitePrintResult.componentType === 'Inkjet' ? 'Clog/Wear Level' : 'Wear Level'}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-hp-blue" style={{ width: `${combinedSitePrintResult.wearLevel}%` }} />
                            </div>
                            <span className="text-lg font-bold">{combinedSitePrintResult.wearLevel}%</span>
                          </div>
                        </div>
                        <div className="p-6 bg-slate-900 rounded-3xl text-white">
                          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Useful Life Left</p>
                          <p className="text-3xl font-bold">{combinedSitePrintResult.estimatedRemainingLifeYears} Years</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900 text-lg">Maintenance Issues ({combinedSitePrintResult.detectedIssues.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {combinedSitePrintResult.detectedIssues.map((issue, iIdx) => (
                            <div key={iIdx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-3 h-3 rounded-full",
                                  issue.severity === "High" ? "bg-red-500" : issue.severity === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                                )} />
                                <div>
                                  <p className="font-bold text-hp-dark">{issue.type}</p>
                                  <p className="text-xs text-slate-500 break-words">{issue.description}</p>
                                </div>
                              </div>
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest",
                                issue.severity === "High" ? "bg-red-100 text-red-700" : 
                                issue.severity === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                              )}>{issue.severity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={cn(
                        "p-6 rounded-3xl border-2 flex gap-6 items-start",
                        combinedSitePrintResult.repairNeeded ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
                      )}>
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                          combinedSitePrintResult.repairNeeded ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                        )}>
                          {combinedSitePrintResult.repairNeeded ? <RefreshCcw className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                        </div>
                        <div>
                          <p className={cn(
                            "text-xs font-bold uppercase tracking-widest mb-1",
                            combinedSitePrintResult.repairNeeded ? "text-amber-600" : "text-emerald-600"
                          )}>Maintenance Verdict: {combinedSitePrintResult.repairNeeded ? "Repair Required" : "Healthy"}</p>
                          <p className="text-lg font-bold text-hp-dark mb-1">System Health Report</p>
                          <p className="text-slate-700 leading-relaxed">
                            {combinedSitePrintResult.repairNeeded 
                              ? `Maintenance is recommended ${combinedSitePrintResult.repairTimeline}. System devaluation is currently at ${combinedSitePrintResult.devaluationPercentage}%.` 
                              : `The inkjet part is in optimal condition. No immediate repairs needed. Devaluation is minimal at ${combinedSitePrintResult.devaluationPercentage}%.`}
                          </p>
                        </div>
                      </div>

                      {combinedSitePrintResult.manualRepairRecommendations && combinedSitePrintResult.manualRepairRecommendations.length > 0 && (
                        <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-hp-blue flex items-center justify-center text-white">
                              <Wrench className="w-5 h-5" />
                            </div>
                            <h4 className="text-xl font-bold text-hp-dark">Manual Repair Recommendations</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {combinedSitePrintResult.manualRepairRecommendations.map((rec, rIdx) => (
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
                              Note: Manual cleaning should be performed with caution using approved solvents (like 70% Isopropyl Alcohol) and lint-free materials to avoid damaging the delicate nozzle plate.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Summary & Recommendations */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-hp-dark">Analysis Summary</h3>
            <div className="space-y-4">
              {inspectionMode === 'laptop' && (
                <>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-500 font-medium">Total Estimated Value</span>
                    <span className="text-2xl font-bold text-hp-blue">{formatPrice(totalEstimatedValue)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-500 font-medium">Total Repair Costs</span>
                    <span className="text-2xl font-bold text-red-500">{formatPrice(totalRepairCosts)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="font-bold text-hp-dark flex items-center gap-2">
                <Zap className="w-4 h-4 text-hp-blue" />
                AI Recommendations
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-700">Schedule Repairs</p>
                    <p className="text-xs text-emerald-600">Fixing detected issues can restore up to 95% of original value.</p>
                  </div>
                </div>
                <div className="p-4 bg-hp-blue/5 border border-hp-blue/10 rounded-2xl flex gap-3">
                  <RefreshCcw className="w-5 h-5 text-hp-blue shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-hp-blue">HP Trade-In Program</p>
                    <p className="text-xs text-hp-blue/70">Get immediate credit towards a new HP device based on this analysis.</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={downloadReport}
              className="w-full py-4 bg-hp-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5" />
              Download Full Report
            </button>

            {showFeedbackForm && !feedbackSubmitted && (
              <div className="pt-6 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-4">
                <h4 className="font-bold text-hp-dark text-sm">Was this analysis accurate?</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => submitFeedback(true)}
                    className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Yes
                  </button>
                  <button 
                    onClick={() => submitFeedback(false)}
                    className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> No
                  </button>
                </div>
                <textarea 
                  placeholder="Optional: Tell us what we missed..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-hp-blue outline-none resize-none h-20"
                />
              </div>
            )}

            {feedbackSubmitted && (
              <div className="pt-6 border-t border-slate-100 flex items-center gap-3 text-emerald-600 animate-in fade-in zoom-in-95">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm">Thank you for your feedback!</p>
                  <p className="text-xs opacity-80">We'll use this to improve future inspections.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-hp-blue" />
              <h3 className="font-bold text-hp-dark">Chat with AI Expert</h3>
            </div>
            <div className="h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "p-3 rounded-2xl text-xs leading-relaxed",
                  msg.role === 'ai' ? "bg-slate-100 text-slate-700 mr-8" : "bg-hp-blue text-white ml-8"
                )}>
                  {msg.content}
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  AI is thinking...
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-hp-blue"
              />
              <button type="submit" className="p-2 bg-hp-blue text-white rounded-full hover:bg-hp-blue/90 transition-colors">
                <Zap className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
