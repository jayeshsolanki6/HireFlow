import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Table } from '../../components/ui/Table';
import { Loading } from '@/components/ui/Loading';
import { Briefcase, Plus } from 'lucide-react';
import { useRecruiterStore } from './recruiterStore';

type Job = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string;
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  jobType: 'full_time' | 'part_time' | 'internship';
  jobStatus: 'open' | 'draft';
  deadline?: string;
  createdAt: string;
  updatedAt: string;
};

type TabType = 'All' | 'open' | 'draft';

export const JobsPage = () => {
  const navigate = useNavigate();

  const isLoading = useRecruiterStore((state) => state.isLoading);
  const allJobs = useRecruiterStore((state) => state.allJobs);
  const getAllJobs = useRecruiterStore((state) => state.getAllJobs);
  
  const [statusFilter, setStatusFilter] = useState<TabType>('All');

  useEffect(() => {
    getAllJobs();
  }, [getAllJobs]);

  const filteredJobs = allJobs.filter(job => {
    return statusFilter === 'All' ? true : job.jobStatus === statusFilter;
  });

  if (isLoading && allJobs.length === 0) {
    return <Loading />;
  }

  const jobTypeLabels: Record<Job['jobType'], string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    internship: 'Internship',
  };

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight">My Jobs</h1>
          <p className="text-xs text-[var(--color-ink-subtle)]">Manage listings, view applicants, and close jobs.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={14} />} onClick={() => navigate('/recruiter/jobs/new')}>
          Create Job
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-[var(--color-hairline)] gap-2">
        {(['All', 'open', 'draft'] as TabType[]).map((tab) => {
          const count = tab === 'All' ? allJobs.length : allJobs.filter(j => j.jobStatus === tab).length;
          const displayTab = tab === 'All' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1);
          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`pb-2.5 px-3.5 text-xs font-medium border-b-2 cursor-pointer transition-all ${
                statusFilter === tab
                  ? 'border-[var(--color-primary)] text-[var(--color-ink)]'
                  : 'border-transparent text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]'
              }`}
            >
              {displayTab} <span className="text-[10px] font-mono opacity-60 ml-0.5">({count})</span>
            </button>
          );
        })}
      </div>

      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={18} />}
          title="No jobs found"
          description={statusFilter !== 'All' ? "Try adjusting your filters." : "Create a job posting to begin attracting candidates."}
          actionLabel={statusFilter !== 'All' ? "Clear Filters" : "Create Job"}
          onAction={() => {
            if (statusFilter !== 'All') {
              setStatusFilter('All');
            } else {
              navigate('/recruiter/jobs/new');
            }
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <Table
            columns={[
              {
                header: 'Job Title',
                accessor: (row) => <span className="font-semibold">{row.title}</span>
              },
              {
                header: 'Location',
                accessor: 'location'
              },
              {
                header: 'Job Type',
                accessor: (row) => jobTypeLabels[row.jobType]
              },
              {
                header: 'Status',
                accessor: (row) => {
                  const variants = {
                    open: 'success' as const,
                    draft: 'default' as const
                  };
                  return <Badge variant={variants[row.jobStatus]}>{row.jobStatus}</Badge>;
                }
              },
              {
                header: 'Deadline',
                accessor: (row) => row.deadline ? new Date(row.deadline).toLocaleDateString() : 'N/A'
              },
              {
                header: 'Posted Date',
                accessor: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'
              },
              {
                header: 'Actions',
                accessor: (row) => (
                  <div className="flex items-center justify-start">
                    <Button variant="secondary" className="text-[10px] py-1 px-2.5" onClick={() => navigate(`/recruiter/jobs/${row.id}`)}>
                      View Details
                    </Button>
                  </div>
                )
              }
            ]}
            data={filteredJobs}
          />
        </Card>
      )}
    </div>
  );
};