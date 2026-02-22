export type CampaignStatus = 'Active' | 'Paused' | 'Draft' | 'Completed' | 'Failed';

export interface Campaign {
    id: string;
    name: string;
    status: CampaignStatus;
    budget: number;
    spent: number;
    startDate: string;
    endDate: string;
    reach: number;
    conversions: number;
    lastUpdated: string;
}

export type JobStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';

export interface Job {
    id: string;
    campaignId: string;
    type: 'Optimization' | 'Reporting' | 'AssetGeneration';
    status: JobStatus;
    progress: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    data: T;
    meta?: {
        total: number;
        page: number;
        limit: number;
    };
}
