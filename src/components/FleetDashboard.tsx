import React from 'react';
import { motion } from 'motion/react';
import { 
  Laptop, 
  RefreshCcw, 
  Plus, 
  LayoutGrid, 
  Activity, 
  Info,
  Lock
} from 'lucide-react';
import { UserProfile, InspectionRecord } from '../types';

interface FleetDashboardProps {
  user: UserProfile | null;
  pastInspections: InspectionRecord[];
  setStep: (step: number) => void;
  setInspectionMode: (mode: 'laptop' | 'siteprint') => void;
  setSelectedModel: (model: string) => void;
  setImages: (images: any[]) => void;
  setShowAuthModal: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
}

export function FleetDashboard({ 
  user, 
  pastInspections, 
  setStep, 
  setInspectionMode, 
  setSelectedModel, 
  setImages,
  setShowAuthModal,
  setAuthMode
}: FleetDashboardProps) {
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
          <Lock className="w-10 h-10 text-slate-400" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-hp-dark">Account Required</h2>
          <p className="text-slate-500">Please sign in to access your personalized HP Fleet Management dashboard and monitor your devices.</p>
        </div>
        <button 
          onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
          className="px-8 py-3 bg-hp-blue text-white rounded-full font-bold shadow-lg shadow-hp-blue/20 hover:bg-hp-blue/90 transition-all"
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  // Derive fleet from past inspections
  const userFleet = pastInspections.reduce((acc: any[], curr) => {
    const existing = acc.find(d => d.name === curr.model);
    if (!existing) {
      const isSitePrint = curr.model.includes('SitePrint');
      acc.push({
        id: curr.id.toString(),
        name: curr.model,
        type: isSitePrint ? 'siteprint' : 'laptop',
        health: curr.overall_health === 'Excellent' ? 95 : curr.overall_health === 'Good' ? 80 : curr.overall_health === 'Fair' ? 60 : 40,
        lastInspection: new Date(curr.date).toLocaleDateString(),
        remainingLife: curr.results?.estimatedRemainingLifeYears || 5,
        status: 'online'
      });
    }
    return acc;
  }, []);

  const getRelativeMaintenance = (years: number) => {
    if (years <= 0) return "Immediate service required";
    if (years < 1) {
      const months = Math.max(1, Math.round(years * 12));
      return `in ${months} month${months !== 1 ? 's' : ''}`;
    }
    const roundedYears = Math.round(years);
    return `in ${roundedYears} year${roundedYears !== 1 ? 's' : ''}`;
  };

  const handleReAnalyze = (device: any) => {
    setInspectionMode(device.type);
    setSelectedModel(device.name.replace('HP SitePrint ', ''));
    setStep(2);
    setImages([]);
  };

  const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-hp-dark">My Fleet Management</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor and manage all your HP devices in one centralized dashboard.</p>
        </div>
        <button 
          onClick={() => setStep(1)}
          className="flex items-center gap-2 px-4 py-2 bg-hp-blue text-white rounded-full font-bold text-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Device
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {userFleet.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <LayoutGrid className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No devices found in your fleet. Start an inspection to add your first device.</p>
              <button onClick={() => setStep(1)} className="text-hp-blue font-bold hover:underline">Start New Inspection</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userFleet.map(device => (
                <div key={device.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      device.type === 'laptop' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                    )}>
                      {device.type === 'laptop' ? <Laptop className="w-6 h-6" /> : <RefreshCcw className="w-6 h-6" />}
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      device.status === 'online' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {device.status}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-hp-dark group-hover:text-hp-blue transition-colors">{device.name}</h3>
                  <p className="text-xs text-slate-500 mb-6">Last Inspection: {device.lastInspection}</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Health Score</span>
                        <span className={device.health > 80 ? "text-emerald-500" : device.health > 50 ? "text-amber-500" : "text-red-500"
                        }>{device.health}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${device.health}%` }}
                          className={cn(
                            "h-full rounded-full",
                            device.health > 80 ? "bg-emerald-500" : device.health > 50 ? "bg-amber-500" : "bg-red-500"
                          )}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-hp-dark mb-1">
                        <Activity className="w-3 h-3 text-hp-blue" />
                        Predictive Maintenance
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Next service recommended: <span className="font-bold text-hp-blue">{getRelativeMaintenance(device.remainingLife)}</span>
                      </p>
                    </div>

                    <button 
                      onClick={() => handleReAnalyze(device)}
                      className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-hp-blue transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCcw className="w-3 h-3" /> Re-analyze Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-hp-dark mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-hp-blue" />
              What is Fleet Management?
            </h3>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                The <span className="font-bold text-hp-blue">Fleet Section</span> is a centralized hub designed for users and organizations to oversee multiple HP products simultaneously.
              </p>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-hp-blue mt-1.5 shrink-0" />
                  <p><span className="font-bold text-hp-dark">Real-time Monitoring:</span> Track the health status and connectivity of all your registered laptops and SitePrint robots.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-hp-blue mt-1.5 shrink-0" />
                  <p><span className="font-bold text-hp-dark">Predictive Maintenance:</span> Our AI analyzes past inspection data to predict when a device needs servicing before a failure occurs.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-hp-blue mt-1.5 shrink-0" />
                  <p><span className="font-bold text-hp-dark">Lifecycle Tracking:</span> Keep records of every inspection and repair in one place to maximize the lifespan of your hardware.</p>
                </div>
              </div>
              <p className="pt-2 border-t border-slate-100">
                Ideal for IT departments, construction site managers, and power users who rely on peak performance from their HP hardware ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
