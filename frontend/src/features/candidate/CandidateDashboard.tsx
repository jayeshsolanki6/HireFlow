import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Table } from '../../components/ui/Table';
import { Loading } from '@/components/ui/Loading';
import { Briefcase } from 'lucide-react';
import { formatSalaryRange } from '@/lib/format';
import { useCandidateStore } from './candidateStore';
import { candidateApi } from './candidate.api';

const jobTypeLabels: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  internship: 'Internship',
};

const statusVariants: Record<string, 'default' | 'primary' | 'error' | 'success'> = {
  applied: 'default',
  shortlisted: 'primary',
  rejected: 'error',
  hired: 'success',
};

export const CandidateDashboard = () => {
  const navigate = useNavigate();

  const candidate = useCandidateStore((state) => state.candidate);
  const getCandidateProfile = useCandidateStore((state) => state.getCandidateProfile);
  const myApplications = useCandidateStore((state) => state.myApplications);
  const getMyApplications = useCandidateStore((state) => state.getMyApplications);
  const savedJobs = useCandidateStore((state) => state.savedJobs);
  const getSavedJobs = useCandidateStore((state) => state.getSavedJobs);

  const [latestJobs, setLatestJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await Promise.all([
        getCandidateProfile(),
        getMyApplications(),
        getSavedJobs(),
        (async () => {
          try {
            const result = await candidateApi.getJobs({});
            setLatestJobs(result.data.slice(0, 5));
          } catch (error) {
            console.error(error);
          }
        })(),
      ]);
      setIsLoading(false);
    })();
  }, [getCandidateProfile, getMyApplications, getSavedJobs]);

  if (isLoading) {
    return <Loading />;
  }

  const appliedCount = myApplications.length;
  const savedCount = savedJobs.length;
  const activeCount = myApplications.filter((a) => a.status === 'applied' || a.status === 'shortlisted').length;
  const shortlistedCount = myApplications.filter((a) => a.status === 'shortlisted').length;

  const recentApps = myApplications.slice(0, 5);

  const profileFields = [!!candidate?.name, !!candidate?.bio, !!candidate?.profileImageUrl, !!candidate?.resumeUrl];
  const profilePercent = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      {/* Welcome & Completion Prompt */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--color-surface-1)] border border-[var(--color-hairline)] p-6 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-2)] via-transparent to-transparent" />
        <div className="flex flex-col gap-1 z-10">
          <h1 className="text-xl font-bold tracking-tight">Welcome back, {candidate?.name || 'there'}</h1>
          <p className="text-xs text-[var(--color-ink-subtle)]">Track, manage, and discover engineering roles.</p>
          <div className="flex gap-2 mt-3">
            <Button variant="secondary" className="text-xs py-1.5" onClick={() => navigate('/candidate/jobs')}>
              Browse Jobs
            </Button>
            <Button variant="tertiary" className="text-xs py-1.5" onClick={() => navigate('/candidate/applications')}>
              View Applied Jobs
            </Button>
          </div>
        </div>
        {profilePercent < 100 && (
          <div className="flex items-center gap-3 bg-[var(--color-surface-2)] border border-[var(--color-hairline-strong)] p-3 rounded-lg z-10 max-w-sm">
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--color-primary-hover)] font-medium">Profile {profilePercent}% Complete</span>
              <div className="w-40 h-1.5 bg-[var(--color-hairline)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-primary)] transition-all" style={{ width: `${profilePercent}%` }} />
              </div>
            </div>
            <Button variant="primary" className="text-xs shrink-0 py-1.5" onClick={() => navigate('/candidate/profile')}>
              Complete Profile
            </Button>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Applied Jobs', value: appliedCount },
          { label: 'Saved Jobs', value: savedCount },
          { label: 'Active Applications', value: activeCount },
          { label: 'Shortlisted', value: shortlistedCount }
        ].map((stat, i) => (
          <Card key={i} className="p-4 flex flex-col gap-1">
            <span className="text-[11px] font-mono uppercase text-[var(--color-ink-subtle)] font-medium">{stat.label}</span>
            <span className="text-2xl font-bold text-[var(--color-ink)]">{stat.value}</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Applications Table (Left) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-subtle)]">Recent Applications</h2>
            <Link to="/candidate/applications" className="text-xs text-[var(--color-primary-hover)] hover:underline font-medium">View All</Link>
          </div>

          {recentApps.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={18} />}
              title="No applications yet"
              description="Start exploring job opportunities and apply directly to find your next match."
              actionLabel="Search Open Jobs"
              onAction={() => navigate('/candidate/jobs')}
            />
          ) : (
            <Card className="overflow-hidden">
              <Table
                columns={[
                  {
                    header: 'Job Post',
                    accessor: (row: any) => (
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--color-ink)]">{row.jobTitle}</span>
                        <span className="text-[10px] text-[var(--color-ink-subtle)]">{row.companyName}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Applied Date',
                    accessor: (row: any) => new Date(row.appliedAt).toLocaleDateString(),
                    className: 'font-mono text-[var(--color-ink-subtle)]'
                  },
                  {
                    header: 'Status',
                    accessor: (row: any) => (
                      <Badge variant={statusVariants[row.status]}>{row.status}</Badge>
                    )
                  },
                  {
                    header: 'Action',
                    accessor: (row: any) => (
                      <Button variant="tertiary" className="text-[10px] py-1 px-2.5" onClick={() => navigate(`/candidate/jobs/${row.jobId}`)}>
                        View Details
                      </Button>
                    )
                  }
                ]}
                data={recentApps}
              />
            </Card>
          )}
        </div>

        {/* Latest Jobs (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-subtle)]">Latest Jobs</h2>
          <div className="flex flex-col gap-3">
            {latestJobs.length === 0 ? (
              <Card className="p-5 text-center text-xs text-[var(--color-ink-subtle)] italic border border-dashed border-[var(--color-hairline)]">
                No active jobs available at the moment.
              </Card>
            ) : (
              latestJobs.map((job) => (
                <Card
                  key={job.jobId}
                  isHoverable
                  className="p-4 flex flex-col gap-3 cursor-pointer"
                  onClick={() => navigate(`/candidate/jobs/${job.jobId}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-primary-hover)]">{job.title}</h4>
                      <span className="text-[10px] text-[var(--color-ink-subtle)]">{job.companyName} • {job.location}</span>
                    </div>
                    <span className="bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] text-[9px] px-1.5 py-0.5 rounded uppercase font-mono">
                      {jobTypeLabels[job.jobType] || job.jobType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-[var(--color-hairline)] text-[10px] text-[var(--color-ink-subtle)]">
                    {(job.salaryMin || job.salaryMax) ? (
                      <span className="font-mono text-[var(--color-primary-hover)] font-medium">
                        {formatSalaryRange(job.salaryMin, job.salaryMax)}
                      </span>
                    ) : (
                      <span className="italic">Not disclosed</span>
                    )}
                    <span className="hover:underline text-[var(--color-primary-hover)] flex items-center gap-0.5">View ↗</span>
                  </div>
                </Card>
              ))
            )}
            <Button variant="secondary" className="w-full mt-1 text-xs" onClick={() => navigate('/candidate/jobs')}>
              Explore All Open Roles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};