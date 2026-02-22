import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { api } from '../services/api';
import { Campaign, CampaignStatus } from '../types';
import { CampaignTable } from '../features/campaigns/CampaignTable';
import { cn } from '../utils';

export const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<keyof Campaign>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getCampaigns({
        page,
        limit: 5,
        search: searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder,
      });
      setCampaigns(response.data);
      setTotalCount(response.total);
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    // Debounced search logic if needed, but for simplicity let's just use the effect
    const timeout = setTimeout(fetchCampaigns, 300);
    return () => clearTimeout(timeout);
  }, [fetchCampaigns]);

  const handleStatusChange = async (id: string, newStatus: CampaignStatus) => {
    // Optimistic Update
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    try {
      await api.updateCampaign(id, { status: newStatus });
    } catch (error) {
      // Revert on error
      fetchCampaigns();
    }
  };

  const handleSort = (key: keyof Campaign) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Manage and monitor your advertising across all channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-colors font-medium">
            <Download size={18} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-semibold">
            <Plus size={18} />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative flex items-center">
          <Search size={18} className="absolute left-3.5 text-muted-foreground pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/60"
          />
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border">
            {['All', 'Active', 'Paused', 'Draft'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  statusFilter === status 
                    ? "bg-card text-foreground shadow-sm animate-fade-in" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <CampaignTable 
        campaigns={campaigns}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onSort={handleSort}
        currentPage={page}
        totalCount={totalCount}
        pageSize={5}
        onPageChange={setPage}
      />
    </div>
  );
};
