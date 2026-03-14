import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Shield, HelpCircle, Laptop } from 'lucide-react';

interface FooterProps {
  showFooterSection: 'privacy' | 'terms' | 'support' | null;
  setShowFooterSection: (section: 'privacy' | 'terms' | 'support' | null) => void;
}

export function Footer({ showFooterSection, setShowFooterSection }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-hp-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-hp-blue/20">
                <Laptop className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-hp-dark tracking-tighter">HP <span className="text-hp-blue">Inspect</span></span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              Empowering HP device owners with professional-grade AI diagnostics. 
              Built for precision, reliability, and sustainability.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-hp-dark">Resources</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><button onClick={() => setShowFooterSection('support')} className="hover:text-hp-blue transition-colors">Support Center</button></li>
              <li><button onClick={() => setShowFooterSection('privacy')} className="hover:text-hp-blue transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setShowFooterSection('terms')} className="hover:text-hp-blue transition-colors">Terms of Service</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-hp-dark">Contact</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li>support@hpinspect.ai</li>
              <li>1-800-HP-INSPECT</li>
              <li>Palo Alto, CA</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© 2026 HP Inspect AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Shield className="w-4 h-4" />
              Secure Diagnostics
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFooterSection && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFooterSection(null)}
              className="absolute inset-0 bg-hp-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  {showFooterSection === 'privacy' && <Shield className="w-6 h-6 text-hp-blue" />}
                  {showFooterSection === 'terms' && <Info className="w-6 h-6 text-hp-blue" />}
                  {showFooterSection === 'support' && <HelpCircle className="w-6 h-6 text-hp-blue" />}
                  <h3 className="text-2xl font-bold text-hp-dark capitalize">{showFooterSection}</h3>
                </div>
                <button onClick={() => setShowFooterSection(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar text-slate-600 leading-relaxed">
                {showFooterSection === 'privacy' && (
                  <>
                    <p className="font-bold text-hp-dark">Your privacy is our priority.</p>
                    <p>We only use your uploaded images for real-time analysis. Images are processed securely and are not stored on our servers unless you explicitly save them to your profile history.</p>
                    <p>We do not sell your personal data to third parties. All diagnostic data is used solely to provide you with repair estimates and health reports.</p>
                  </>
                )}
                {showFooterSection === 'terms' && (
                  <>
                    <p className="font-bold text-hp-dark">Usage Agreement</p>
                    <p>By using HP Inspect, you agree that the AI-generated reports are for informational purposes only. While highly accurate, they should not replace a physical inspection by a certified technician for critical repairs.</p>
                    <p>Repair costs provided are estimates based on market averages and may vary by location and service provider.</p>
                  </>
                )}
                {showFooterSection === 'support' && (
                  <>
                    <p className="font-bold text-hp-dark">Need help?</p>
                    <p>Our support team is available 24/7 to assist you with any technical issues or questions about your inspection reports.</p>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                      <p className="font-bold text-hp-dark">Contact Options:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-hp-blue" /> support@hpinspect.ai</li>
                        <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-hp-blue" /> Live Chat (Available in Analysis Results)</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}

function Mail({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  );
}
