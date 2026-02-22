import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BarChart3, Megaphone, Zap, User } from 'lucide-react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { CampaignsPage } from './pages/CampaignsPage';
import { CampaignDetailPage } from './pages/CampaignDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { cn } from './utils';

// Placeholder pages
const Dashboard = () => (
  <div className="space-y-8 max-w-7xl mx-auto">
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Welcome back, Srinu</h1>
      <p className="text-lg text-muted-foreground font-medium">Here's your performance snapshot for the last 30 days.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Total Revenue', value: '$128,430', change: '+12.5%', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Active Campaigns', value: '12', change: '+2', icon: Megaphone, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Conversion Rate', value: '3.4%', change: '+0.8%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Total Reach', value: '1.2M', change: '+18%', icon: User, color: 'text-purple-500', bg: 'bg-purple-500/10' },
      ].map((stat, i) => (
        <div key={i} className="p-6 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-all group">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
            <stat.icon size={24} />
          </div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
          <p className="text-3xl font-black text-foreground">{stat.value}</p>
          <p className="text-sm font-bold text-emerald-500 mt-2 flex items-center gap-1">
            {stat.change} <span className="text-muted-foreground font-medium">vs last month</span>
          </p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
        <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20"></div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">New campaign "Winter Collection" launched</p>
                <p className="text-xs text-muted-foreground">2 hours ago • Marketing Team</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>
        <div className="relative z-10 space-y-6">
          <h3 className="text-2xl font-bold">Campaign Optimization Engine</h3>
          <p className="text-slate-300 text-lg leading-relaxed">Our analytical engines have identified 4 new ways to improve your current ad spend efficiency.</p>
          <button className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors">
            Review Recommendations
          </button>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
};

export default App;
