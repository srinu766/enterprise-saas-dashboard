import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Eye, 
  PauseCircle, 
  PlayCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Campaign, CampaignStatus } from '../../types';
import { cn, formatCurrency, formatNumber } from '../../utils';

interface CampaignTableProps {
  campaigns: Campaign[];
  isLoading: boolean;
  onStatusChange: (id: string, newStatus: CampaignStatus) => Promise<void>;
  onSort: (key: keyof Campaign) => void;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns,
  isLoading,
  onStatusChange,
  onSort,
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusToggle = async (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    setUpdatingId(campaign.id);
    const newStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
    try {
      await onStatusChange(campaign.id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: CampaignStatus) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Paused': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Draft': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      case 'Completed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button onClick={() => onSort('name')} className="flex items-center gap-1 hover:text-foreground">
                  Campaign Name <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                <button onClick={() => onSort('budget')} className="flex items-center gap-1 hover:text-foreground ml-auto">
                  Budget <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Reach</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Conversions</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                  No campaigns found matching your filters.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{campaign.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Updated {new Date(campaign.lastUpdated).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      getStatusStyle(campaign.status)
                    )}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium">{formatCurrency(campaign.budget)}</div>
                    <div className="w-24 h-1.5 bg-muted rounded-full mt-2 ml-auto overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{formatNumber(campaign.reach)}</td>
                  <td className="px-6 py-4 text-right font-medium">{formatNumber(campaign.conversions)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 isolate">
                      <button 
                        onClick={(e) => handleStatusToggle(e, campaign)}
                        disabled={updatingId === campaign.id}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
                        title={campaign.status === 'Active' ? 'Pause Campaign' : 'Resume Campaign'}
                      >
                        {updatingId === campaign.id ? (
                          <Loader2 size={18} className="animate-spin text-primary" />
                        ) : campaign.status === 'Active' ? (
                          <PauseCircle size={18} />
                        ) : (
                          <PlayCircle size={18} />
                        )}
                      </button>
                      <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="font-medium text-foreground">{totalCount}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={cn(
                "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                currentPage === i + 1 
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                  : "border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {i + 1}
            </button>
          ))}
          <button 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
