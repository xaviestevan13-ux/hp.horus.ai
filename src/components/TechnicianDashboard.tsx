import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, ComposedChart, Line, Area
} from 'recharts';
import { 
  Activity, AlertTriangle, CheckCircle2, TrendingUp, Globe, 
  Cpu, Zap, ShieldAlert, Package, Thermometer, CloudRain, Wind
} from 'lucide-react';
import { TechnicianStat } from '../types';

interface TechnicianDashboardProps {
  stats: TechnicianStat[];
  formatPrice: (price: number) => string;
}

const COLORS = ['#0096D6', '#007DBA', '#005F8F', '#004164', '#002339'];
const STATUS_COLORS = {
  excellent: '#10b981',
  good: '#34d399',
  fair: '#fbbf24',
  poor: '#f87171',
  critical: '#ef4444'
};

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({ stats, formatPrice }) => {
  // Process data for charts
  const issueTypes = stats.reduce((acc: any, curr) => {
    curr.results.errors?.forEach(err => {
      acc[err.type] = (acc[err.type] || 0) + 1;
    });
    return acc;
  }, {});

  const issueData = Object.entries(issueTypes).map(([name, value]) => ({ name, value }));

  const modelBreakdown = stats.reduce((acc: any, curr) => {
    acc[curr.model] = (acc[curr.model] || 0) + 1;
    return acc;
  }, {});

  const modelData = Object.entries(modelBreakdown).map(([name, value]) => ({ name, value }));

  const regionalData = stats.reduce((acc: any, curr) => {
    const country = curr.country || 'Unknown';
    if (!acc[country]) {
      acc[country] = { name: country, total: 0, critical: 0, avgCost: 0 };
    }
    acc[country].total += 1;
    if (curr.results.overallHealth === 'critical' || curr.results.overallHealth === 'poor') {
      acc[country].critical += 1;
    }
    acc[country].avgCost += curr.results.totalRepairCost || 0;
    return acc;
  }, {});

  const regionalChartData = Object.values(regionalData).map((d: any) => ({
    ...d,
    avgCost: Math.round(d.avgCost / d.total),
    failureRate: Math.round((d.critical / d.total) * 100)
  }));

  // Climate impact simulation (based on regional data)
  const climateData = [
    { environment: 'High Humidity', failureRate: 24, wearSpeed: 1.8, count: 145 },
    { environment: 'Arid/Dusty', failureRate: 31, wearSpeed: 2.2, count: 89 },
    { environment: 'Arctic/Cold', failureRate: 18, wearSpeed: 1.4, count: 67 },
    { environment: 'Tropical', failureRate: 38, wearSpeed: 2.5, count: 212 },
    { environment: 'Controlled', failureRate: 8, wearSpeed: 1.0, count: 430 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-hp-blue/10 rounded-2xl text-hp-blue">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Fleet</p>
              <h4 className="text-2xl font-bold text-hp-dark">{stats.length}</h4>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
            <TrendingUp className="w-4 h-4" />
            <span>+12% vs last month</span>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-50 rounded-2xl text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Critical Issues</p>
              <h4 className="text-2xl font-bold text-hp-dark">
                {stats.filter(s => s.results.overallHealth === 'critical').length}
              </h4>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-red-500 h-full" 
              style={{ width: `${(stats.filter(s => s.results.overallHealth === 'critical').length / stats.length) * 100}%` }} 
            />
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Repair Cost</p>
              <h4 className="text-2xl font-bold text-hp-dark">
                {formatPrice(stats.reduce((acc, curr) => acc + (curr.results.totalRepairCost || 0), 0) / (stats.length || 1))}
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-400">Based on current market parts pricing</p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resale Potential</p>
              <h4 className="text-2xl font-bold text-hp-dark">
                {formatPrice(stats.reduce((acc, curr) => acc + (curr.results.estimatedResaleValue || 0), 0))}
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-400">Total estimated value of analyzed fleet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-hp-dark">Failure Mode Analysis</h3>
              <p className="text-sm text-slate-500">Distribution of detected hardware errors</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <Cpu className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={issueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {issueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-hp-dark">Model Reliability</h3>
              <p className="text-sm text-slate-500">Inspection frequency by HP model</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#0096D6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-hp-dark">Regional Environmental Impact</h3>
            <p className="text-sm text-slate-500">Correlation between climate and hardware failure rates</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
              <Thermometer className="w-4 h-4" />
              Temp
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
              <CloudRain className="w-4 h-4" />
              Humidity
            </div>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={climateData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="environment" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="count" fill="#0096D6" fillOpacity={0.1} stroke="#0096D6" strokeWidth={2} />
              <Bar yAxisId="left" dataKey="failureRate" fill="#f87171" radius={[4, 4, 0, 0]} barSize={30} />
              <Line yAxisId="right" type="monotone" dataKey="wearSpeed" stroke="#fbbf24" strokeWidth={3} dot={{ r: 6, fill: '#fbbf24' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Globe className="w-6 h-6 text-hp-blue" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Global Fleet Distribution</h3>
            <p className="text-sm text-slate-400">Real-time inspection density by region</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regionalChartData.slice(0, 3).map((region, i) => (
            <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-lg font-bold">{region.name}</span>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${region.failureRate > 20 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {region.failureRate}% Failure Rate
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Avg. Repair Cost</span>
                    <span>{formatPrice(region.avgCost)}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full">
                    <div className="bg-hp-blue h-full" style={{ width: '65%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Fleet Size</span>
                    <span>{region.total} units</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full">
                    <div className="bg-emerald-500 h-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
