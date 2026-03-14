import React from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Globe, Shield, History, ChevronRight, FileText, Download } from 'lucide-react';
import { UserProfile, InspectionRecord } from '../types';

interface UserProfileViewProps {
  user: UserProfile | null;
  pastInspections: InspectionRecord[];
  setSelectedInspection: (inspection: InspectionRecord) => void;
  handleDownloadReport: (inspection: InspectionRecord) => void;
}

export function UserProfileView({
  user,
  pastInspections,
  setSelectedInspection,
  handleDownloadReport
}: UserProfileViewProps) {
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 sm:px-8 py-12 space-y-8"
    >
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-hp-blue/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-hp-blue rounded-3xl flex items-center justify-center text-white shadow-xl shadow-hp-blue/20">
            <UserIcon className="w-16 h-16" />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl font-bold text-hp-dark tracking-tight">{user.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">{user.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-hp-blue" />
                <span className="text-sm font-bold text-hp-blue uppercase tracking-widest">{user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-hp-dark flex items-center gap-3">
            <History className="w-6 h-6 text-hp-blue" />
            Inspection History
          </h3>
          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
            {pastInspections.length} Total
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {pastInspections.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No inspections found yet. Start your first one today!</p>
            </div>
          ) : (
            pastInspections.map((insp) => (
              <div 
                key={insp.id} 
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-hp-blue/10 group-hover:text-hp-blue transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-hp-dark">{insp.model}</p>
                    <p className="text-xs text-slate-400">{new Date(insp.date).toLocaleDateString()} • {insp.inspection_type || 'laptop'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right mr-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health</p>
                    <p className="text-sm font-bold text-hp-blue">{insp.overall_health}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedInspection(insp)}
                      className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-hp-blue hover:text-white transition-all"
                      title="View Details"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDownloadReport(insp)}
                      className="p-2 bg-slate-900 text-white rounded-xl hover:bg-hp-blue transition-all"
                      title="Download PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
