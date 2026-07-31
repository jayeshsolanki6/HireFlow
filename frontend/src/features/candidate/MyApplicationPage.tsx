import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { Briefcase } from 'lucide-react';
import { useCandidateStore } from './candidateStore';

const statusLabels: Record<string, string> = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  hired: 'Hired',
};

const statusVariants: Record<string, 'default' | 'primary' | 'error' | 'success'> = {
  applied: 'default',
  shortlisted: 'primary',
  rejected: 'error',
  hired: 'success',
};

const statusTabs = ['All', 'applied', 'shortlisted', 'rejected', 'hired'];

export const MyApplicationsPage = () => {
  const navigate = useNavigate();

  const myApplications = useCandidateStore((state) => state.myApplications);
  const isLoading = useCandidateStore((state) => state.isLoading);
  const getMyApplications = useCandidateStore((state) => state.getMyApplications);

  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    (async () => {
      await getMyApplications();
      setIsFetching(false);
    })();
  }, [getMyApplications]);

  const filteredApps = myApplications.filter((app) => {
    if (selectedTab === 'All') return true;
    return app.status === selectedTab;
  });

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight">My Applications</h1>
        <p className="text-xs text-[var(--color-ink-subtle)]">Review status of your job submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-[var(--color-hairline)] gap-2">
        {statusTabs.map((tab) => {
          const count = tab === 'All'
            ? myApplications.length
            : myApplications.filter((a) => a.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`pb-2.5 px-3.5 text-xs font-medium border-b-2 cursor-pointer transition-all ${
                selectedTab === tab
                  ? 'border-[var(--color-primary)] text-[var(--color-ink)]'
                  : 'border-transparent text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]'
              }`}
            >
              {tab === 'All' ? 'All' : statusLabels[tab]} <span className="text-[10px] font-mono opacity-60 ml-0.5">({count})</span>
            </button>
          );
        })}
      </div>

      {filteredApps.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={18} />}
          title={`No ${selectedTab !== 'All' ? statusLabels[selectedTab]?.toLowerCase() : ''} applications`}
          description="Submit your application to open listings to see them tracked in this portal."
          actionLabel="Explore Careers"
          onAction={() => navigate('/candidate/jobs')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => (
            <Card key={app.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded flex items-center justify-center text-sm font-bold bg-white text-black border border-[var(--color-hairline)] shrink-0 overflow-hidden">
                  {app.companyLogo ? (
                    <img src={app.companyLogo} alt={app.companyName} className="w-full h-full object-cover" />
                  ) : (
                    app.companyName?.[0] || '?'
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xs font-semibold text-[var(--color-ink)]">{app.jobTitle || 'Job Unavailable'}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--color-ink-subtle)]">
                    <span className="font-medium text-[var(--color-ink-muted)]">{app.companyName}</span>
                    <span>•</span>
                    <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant={statusVariants[app.status]}>{statusLabels[app.status]}</Badge>
                <Button variant="tertiary" className="text-xs" onClick={() => navigate(`/candidate/jobs/${app.jobId}`)}>
                  View Listing
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};