import { useNavigate, Link } from 'react-router-dom';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { Briefcase, Users, Plus, Eye, ChevronRight } from 'lucide-react';


export const RecruiterDashboard = () => {

  const navigate = useNavigate();
  const totalJobs = 10;
  const activeJobs = 5;
  const closedJobs = 3;
  const totalApplicants = 50;

  const recentJobs :any[] = [];
  const recentActivities : any[] = [];
  
  const stats = [
    { label: 'Total Jobs Posted', value: totalJobs },
    { label: 'Active Jobs', value: activeJobs },
    { label: 'Closed Jobs', value: closedJobs },
    { label: 'Total Applications', value: totalApplicants }
  ]

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-xs text-[var(--color-ink-subtle)]">Track your job postings and applicant pipeline.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs" leftIcon={<Eye size={14} />} onClick={() => navigate('/recruiter/jobs')}>
            View All Jobs
          </Button>
          <Button variant="primary" className="text-xs" leftIcon={<Plus size={14} />} onClick={() => navigate('/recruiter/jobs/new')}>
            Create Job
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-5 flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase text-[var(--color-ink-subtle)] font-medium">{stat.label}</span>
            <span className="text-2xl font-bold text-[var(--color-ink)]">{stat.value}</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Recent Jobs */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-[var(--color-ink)]">Recent Jobs</h2>
            <Link to="/recruiter/jobs" className="text-xs font-medium text-[var(--color-primary-hover)] flex items-center hover:underline">
              View all <ChevronRight size={14} className="ml-0.5" />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <Card className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-ink-subtle)]">
                <Briefcase size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold">No jobs posted</h3>
                <p className="text-xs text-[var(--color-ink-subtle)] max-w-[250px]">Create your first job posting to start receiving applications.</p>
              </div>
              <Button variant="secondary" className="mt-2 text-xs" onClick={() => navigate('/recruiter/jobs/new')}>
                Create Job
              </Button>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <Table
                columns={[
                  {
                    header: 'Title',
                    accessor: (row) => (
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[var(--color-ink)]">{row.title}</span>
                        <span className="text-[10px] text-[var(--color-ink-subtle)]">{row.location}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Status',
                    accessor: (row) => {
                      const variants = {
                        active: 'success' as const,
                        draft: 'default' as const,
                        closed: 'error' as const
                      };
                      return <Badge variant={variants[row.status]}>{row.status}</Badge>;
                    }
                  },
                  {
                    header: '',
                    accessor: (row) => (
                      <div className="flex justify-end">
                        <Button variant="tertiary" className="text-[10px] py-1 px-2" onClick={() => navigate(`/recruiter/jobs/${row.id}`)}>
                          View
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={recentJobs}
              />
            </Card>
          )}
        </div>

        {/* Recent Applications */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-[var(--color-ink)]">Recent Applications</h2>
          </div>
          
          {recentActivities.length === 0 ? (
            <Card className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-ink-subtle)]">
                <Users size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold">No applications yet</h3>
                <p className="text-xs text-[var(--color-ink-subtle)] max-w-[250px]">When candidates apply to your jobs, they will appear here.</p>
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <Table<{ id: string; candidateName: string; jobTitle: string; appliedDate: string; status: string }>
                columns={[
                  {
                    header: 'Candidate',
                    accessor: (row) => (
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[var(--color-ink)]">{row.candidateName}</span>
                        <span className="text-[10px] text-[var(--color-ink-subtle)]">Applied for {row.jobTitle}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Date',
                    accessor: (row) => <span className="text-xs text-[var(--color-ink-subtle)]">{new Date(row.appliedDate).toLocaleDateString()}</span>
                  },
                  {
                    header: 'Status',
                    accessor: (row) => {
                      const variants = {
                        applied: 'default' as const,
                        shortlisted: 'success' as const,
                        rejected: 'error' as const,
                        hired: 'success' as const
                      };
                      return <Badge variant={variants[row.status as keyof typeof variants] || 'default'}>{row.status}</Badge>;
                    }
                  }
                ]}
                data={recentActivities}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
