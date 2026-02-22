import { Campaign, Job, CampaignStatus, JobStatus } from '../types';

const DELAY = 800;

const initialCampaigns: Campaign[] = [
    {
        id: '1',
        name: 'Summer Sale 2024',
        status: 'Active',
        budget: 50000,
        spent: 12500,
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        reach: 150000,
        conversions: 2400,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Brand Awareness - Q2',
        status: 'Paused',
        budget: 25000,
        spent: 25000,
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        reach: 450000,
        conversions: 1200,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'New Product Launch',
        status: 'Draft',
        budget: 100000,
        spent: 0,
        startDate: '2024-09-01',
        endDate: '2024-12-31',
        reach: 0,
        conversions: 0,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: '4',
        name: 'Retargeting Campaign',
        status: 'Active',
        budget: 15000,
        spent: 8900,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        reach: 85000,
        conversions: 4500,
        lastUpdated: new Date().toISOString(),
    },
    {
        id: '5',
        name: 'Holiday Special',
        status: 'Completed',
        budget: 75000,
        spent: 74500,
        startDate: '2023-11-01',
        endDate: '2023-12-31',
        reach: 1200000,
        conversions: 15000,
        lastUpdated: new Date().toISOString(),
    },
];

class MockApiService {
    private campaigns: Campaign[] = [];
    private jobs: Job[] = [];

    constructor() {
        const storedCampaigns = localStorage.getItem('mock_campaigns');
        const storedJobs = localStorage.getItem('mock_jobs');

        if (storedCampaigns) {
            this.campaigns = JSON.parse(storedCampaigns);
        } else {
            this.campaigns = initialCampaigns;
            this.saveCampaigns();
        }

        if (storedJobs) {
            this.jobs = JSON.parse(storedJobs);
        }
    }

    private saveCampaigns() {
        localStorage.setItem('mock_campaigns', JSON.stringify(this.campaigns));
    }

    private saveJobs() {
        localStorage.setItem('mock_jobs', JSON.stringify(this.jobs));
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getCampaigns(params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: CampaignStatus | 'All';
        sortBy?: keyof Campaign;
        sortOrder?: 'asc' | 'desc';
    }) {
        await this.sleep(DELAY);
        let filtered = [...this.campaigns];

        if (params.search) {
            const search = params.search.toLowerCase();
            filtered = filtered.filter(c => c.name.toLowerCase().includes(search));
        }

        if (params.status && params.status !== 'All') {
            filtered = filtered.filter(c => c.status === params.status);
        }

        if (params.sortBy) {
            filtered.sort((a, b) => {
                const valA = a[params.sortBy!];
                const valB = b[params.sortBy!];
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return params.sortOrder === 'desc'
                        ? valB.localeCompare(valA)
                        : valA.localeCompare(valB);
                }
                return params.sortOrder === 'desc'
                    ? (valB as number) - (valA as number)
                    : (valA as number) - (valB as number);
            });
        }

        const total = filtered.length;
        const page = params.page || 1;
        const limit = params.limit || 10;
        const start = (page - 1) * limit;
        const data = filtered.slice(start, start + limit);

        return { data, total, page, limit };
    }

    async getCampaignById(id: string) {
        await this.sleep(DELAY);
        const campaign = this.campaigns.find(c => c.id === id);
        if (!campaign) throw new Error('Campaign not found');
        return campaign;
    }

    async updateCampaign(id: string, updates: Partial<Campaign>) {
        await this.sleep(DELAY);
        const index = this.campaigns.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Campaign not found');

        this.campaigns[index] = {
            ...this.campaigns[index],
            ...updates,
            lastUpdated: new Date().toISOString()
        };
        this.saveCampaigns();
        return this.campaigns[index];
    }

    async createJob(campaignId: string, type: Job['type']) {
        await this.sleep(DELAY);
        const newJob: Job = {
            id: Math.random().toString(36).substr(2, 9),
            campaignId,
            type,
            status: 'Pending',
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.jobs.push(newJob);
        this.saveJobs();

        // Start simulation
        this.simulateJobProgress(newJob.id);

        return newJob;
    }

    private async simulateJobProgress(jobId: string) {
        const index = this.jobs.findIndex(j => j.id === jobId);
        if (index === -1) return;

        // Transition to Processing
        await this.sleep(1000);
        this.jobs[index].status = 'Processing';
        this.saveJobs();

        // Progress increments
        for (let i = 1; i <= 5; i++) {
            await this.sleep(1500);
            const jobIdx = this.jobs.findIndex(j => j.id === jobId);
            if (jobIdx === -1) break;
            this.jobs[jobIdx].progress = i * 20;
            this.saveJobs();
        }

        // Completion
        const finalIdx = this.jobs.findIndex(j => j.id === jobId);
        if (finalIdx !== -1) {
            this.jobs[finalIdx].status = Math.random() > 0.1 ? 'Completed' : 'Failed';
            this.jobs[finalIdx].progress = 100;
            this.jobs[finalIdx].updatedAt = new Date().toISOString();
            this.saveJobs();
        }
    }

    async getJob(id: string) {
        // Shorter delay for polling
        await this.sleep(300);
        return this.jobs.find(j => j.id === id);
    }

    async getJobsByCampaign(campaignId: string) {
        await this.sleep(DELAY);
        return this.jobs.filter(j => j.campaignId === campaignId);
    }
}

export const api = new MockApiService();
