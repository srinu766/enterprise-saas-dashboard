import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  Target,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '../utils';

const data = [
  { name: 'Jan', revenue: 45000, spend: 32000, conversions: 1200 },
  { name: 'Feb', revenue: 52000, spend: 34000, conversions: 1450 },
  { name: 'Mar', revenue: 48000, spend: 31000, conversions: 1280 },
  { name: 'Apr', revenue: 61000, spend: 38000, conversions: 1800 },
  { name: 'May', revenue: 55000, spend: 36000, conversions: 1600 },
  { name: 'Jun', revenue: 72000, spend: 42000, conversions: 2100 },
  { name: 'Jul', revenue: 68000, spend: 39000, conversions: 1950 },
];

const pieData = [
  { name: 'Direct', value: 400 },
  { name: 'Social', value: 300 },
  { name: 'Email', value: 200 },
  { name: 'Search', value: 278 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your campaign ROI and audience demographics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-card border border-border shadow-sm">
            {['7D', '30D', '90D', 'All'].map((range) => (
              <button
                key={range}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  range === '30D' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors font-semibold text-sm">
            <Download size={16} />
            Report
          </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg. CPA', value: '$4.12', change: '-8.4%', grow: false, icon: Target },
          { label: 'Conversion Rate', value: '3.82%', change: '+1.2%', grow: true, icon: MousePointer2 },
          { label: 'Impressions', value: '18.4M', change: '+24%', grow: true, icon: Users },
          { label: 'Net Profit', value: '$84,120', change: '+12.5%', grow: true, icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                <stat.icon size={20} />
              </div>
              <span className={cn(
                "text-xs font-black px-2 py-1 rounded-lg",
                stat.grow ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-3xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Revenue vs Spend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Spend</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col">
          <h3 className="text-xl font-bold mb-8">Traffic Sources</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black">1.2M</span>
              <span className="text-xs font-bold text-muted-foreground uppercase">Total Reach</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-xs font-semibold text-muted-foreground mr-auto">{d.name}</span>
                <span className="text-xs font-bold">{(d.value/11.78).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Performance Table */}
      <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
        <h3 className="text-xl font-bold mb-6">Regional Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Region</th>
                <th className="pb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Reach</th>
                <th className="pb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Conv. Rate</th>
                <th className="pb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Revenue</th>
                <th className="pb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { region: 'North America', reach: '520k', rate: '4.2%', revenue: '$42,500', trend: 12 },
                { region: 'Europe', reach: '410k', rate: '3.8%', revenue: '$31,200', trend: 8 },
                { region: 'Asia Pacific', reach: '380k', rate: '2.5%', revenue: '$18,400', trend: -4 },
                { region: 'Latin America', reach: '120k', rate: '1.9%', revenue: '$4,100', trend: 15 },
              ].map((row, i) => (
                <tr key={i} className="group">
                  <td className="py-4 font-bold text-foreground group-hover:text-primary transition-colors">{row.region}</td>
                  <td className="py-4 text-right font-medium">{row.reach}</td>
                  <td className="py-4 text-right font-medium">{row.rate}</td>
                  <td className="py-4 text-right font-bold">{row.revenue}</td>
                  <td className="py-4 text-right">
                    <span className={cn(
                      "font-bold text-xs",
                      row.trend > 0 ? "text-emerald-500" : "text-red-500"
                    )}>
                      {row.trend > 0 ? '↑' : '↓'} {Math.abs(row.trend)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
