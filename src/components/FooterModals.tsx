import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, HelpCircle } from 'lucide-react';

interface FooterModalsProps {
  footerSection: 'privacy' | 'terms' | 'support' | null;
  setFooterSection: (section: 'privacy' | 'terms' | 'support' | null) => void;
}

export const FooterModals: React.FC<FooterModalsProps> = ({ footerSection, setFooterSection }) => {
  const content = {
    privacy: {
      title: 'Privacy Policy',
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      text: 'Your privacy is paramount at HP. The Horus AI Diagnostic System processes images locally and securely via encrypted channels. We do not store your personal images beyond the analysis session unless you explicitly choose to save them to your profile. All diagnostic data is anonymized to improve our AI models.'
    },
    terms: {
      title: 'Terms of Service',
      icon: <FileText className="w-6 h-6 text-hp-blue" />,
      text: 'By using the Horus AI Diagnostic System, you agree to provide accurate information for diagnostic purposes. HP provides these estimates as a guide; actual repair costs and resale values may vary based on local market conditions and official HP service center assessments.'
    },
    support: {
      title: 'Expert Support',
      icon: <HelpCircle className="w-6 h-6 text-amber-500" />,
      text: 'Need immediate assistance? Our technical experts are available 24/7. You can use the AI Support Bot for instant answers, or contact HP Official Support for complex hardware repairs and warranty claims.'
    }
  };

  const active = footerSection ? content[footerSection] : null;

  return (
    <AnimatePresence>
      {footerSection && active && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFooterSection(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    {active.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-hp-dark">{active.title}</h3>
                </div>
                <button onClick={() => setFooterSection(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-lg">
                  {active.text}
                </p>
                <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="font-bold text-hp-dark mb-2">Still have questions?</h4>
                  <p className="text-sm text-slate-500 mb-4">Our team is here to help you get the most out of your HP devices.</p>
                  <button 
                    onClick={() => setFooterSection(null)}
                    className="px-6 py-2 bg-hp-blue text-white rounded-full text-sm font-bold shadow-lg shadow-hp-blue/20"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
