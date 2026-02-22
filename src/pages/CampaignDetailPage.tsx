import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  BarChart, 
  FileImage, 
  Loader2,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import { Campaign, Job } from '../types';
import { cn, formatCurrency } from '../utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

type Tab = 'overview' | 'assets' | 'performance';

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await api.getCampaignById(id);
        const campaignJobs = await api.getJobsByCampaign(id);
        setCampaign(data);
        setJobs(campaignJobs);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  // Polling for jobs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const hasActiveJobs = jobs.some(j => j.status === 'Pending' || j.status === 'Processing');

    if (hasActiveJobs) {
      interval = setInterval(async () => {
        if (!id) return;
        const campaignJobs = await api.getJobsByCampaign(id);
        setJobs(campaignJobs);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [jobs, id]);

  const handleStartOptimization = async () => {
    if (!id) return;
    setIsSimulating(true);
    try {
      await api.createJob(id, 'Optimization');
      const campaignJobs = await api.getJobsByCampaign(id);
      setJobs(campaignJobs);
    } finally {
      setIsSimulating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) return <div>Campaign not found</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <button 
          onClick={() => navigate('/campaigns')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Campaigns
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight">{campaign.name}</h1>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-semibold border",
                campaign.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
              )}>
                {campaign.status}
              </span>
            </div>
            <p className="text-lg text-muted-foreground flex items-center gap-2">
              Campaign ID: <span className="font-mono text-foreground font-medium">{campaign.id.toUpperCase()}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 px-1.5 py-1.5 rounded-2xl bg-muted/50 border border-border w-fit">
            {[
              { id: 'overview', icon: Settings, label: 'Overview' },
              { id: 'assets', icon: FileImage, label: 'Assets' },
              { id: 'performance', icon: BarChart, label: 'Performance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                  activeTab === tab.id 
                    ? "bg-card text-foreground shadow-sm shadow-black/5" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-slide-in">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                <h3 className="text-xl font-bold">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
                    <p className="text-lg font-medium">{new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">End Date</label>
                    <p className="text-lg font-medium">{new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Budget</label>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(campaign.budget)}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Spent to Date</label>
                    <p className="text-2xl font-bold">{formatCurrency(campaign.spent)}</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border">
                  <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-muted transition-colors font-semibold">
                    Edit Details
                  </button>
                </div>
              </section>

              <section className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Optimization Jobs</h3>
                  <button 
                    onClick={handleStartOptimization}
                    disabled={isSimulating}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {isSimulating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                    Run Optimization
                  </button>
                </div>

                <div className="space-y-4">
                  {jobs.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl flex flex-col items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                        <RotateCcw size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">No optimization history</p>
                        <p className="text-sm text-muted-foreground">Start an optimization job to see progress here.</p>
                      </div>
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div key={job.id} className="p-5 rounded-2xl bg-muted/30 border border-border flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            job.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                            job.status === 'Failed' ? 'bg-red-500/10 text-red-500' :
                            'bg-primary/10 text-primary'
                          )}>
                            {job.status === 'Completed' ? <CheckCircle2 size={20} /> :
                             job.status === 'Failed' ? <XCircle size={20} /> :
                             <Loader2 size={20} className="animate-spin" />}
                          </div>
                          <div>
                            <p className="font-bold">{job.type} Job</p>
                            <p className="text-xs text-muted-foreground font-mono">{job.id.slice(0, 8)} • {new Date(job.createdAt).toLocaleTimeString()}</p>
                          </div>
                        </div>

                        <div className="flex-1 max-w-[200px] flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <span>{job.status}</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all duration-500",
                                job.status === 'Completed' ? 'bg-emerald-500' :
                                job.status === 'Failed' ? 'bg-red-500' :
                                'bg-primary'
                              )}
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )).reverse()
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="p-8 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 space-y-4">
                <p className="text-primary-foreground/70 font-semibold uppercase tracking-wider text-xs">Projected ROI</p>
                <div className="text-5xl font-black">2.4x</div>
                <p className="text-sm font-medium leading-relaxed">Based on current performance trends and automated optimization, you are on track to exceed Q3 targets by 14%.</p>
              </section>

              <section className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                <h3 className="text-xl font-bold">Campaign Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="font-semibold text-emerald-700">Healthy</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 uppercase">98% uptime</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-amber-800">Budget pacing is slightly ahead of schedule. Consider adjusting daily caps.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-8">
            <div>
              <h3 className="text-2xl font-bold">Performance Analytics</h3>
              <p className="text-muted-foreground">Real-time conversion and reach metrics.</p>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', reach: 4000, conv: 240 },
                  { name: 'Tue', reach: 3000, conv: 139 },
                  { name: 'Wed', reach: 2000, conv: 980 },
                  { name: 'Thu', reach: 2780, conv: 390 },
                  { name: 'Fri', reach: 1890, conv: 480 },
                  { name: 'Sat', reach: 2390, conv: 380 },
                  { name: 'Sun', reach: 3490, conv: 430 },
                ]}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="reach" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-muted/50 border border-border overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold translate-y-2 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                  creative_asset_v{i}.png
                </div>
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                  <FileImage size={48} />
                </div>
              </div>
            ))}
            <div className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
              <Plus size={24} />
              <span className="text-xs font-bold uppercase tracking-wider">Add Asset</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
