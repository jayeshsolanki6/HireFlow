import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Table } from '../../components/ui/Table';
import { Loading } from '@/components/ui/Loading';
import { Users, FileText, ArrowLeft, ArrowUpDown, Sparkles, RefreshCw } from 'lucide-react';
import { useRecruiterStore } from './recruiterStore';

const statusVariants: Record<string, 'default' | 'primary' | 'error' | 'success'> = {
  applied: 'default',
  shortlisted: 'primary',
  rejected: 'error',
  hired: 'success',
};

const statusTabs = ['All', 'applied', 'shortlisted', 'rejected', 'hired'];

export const JobApplicantsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const isLoading = useRecruiterStore((state) => state.isLoading);
  const isAnalyzingAll = useRecruiterStore((state) => state.isAnalyzingAll);
  const applicants = useRecruiterStore((state) => state.applicants);
  const getApplicants = useRecruiterStore((state) => state.getApplicants);
  const updateApplicationStatus = useRecruiterStore((state) => state.updateApplicationStatus);
  const analyzeAllForJob = useRecruiterStore((state) => state.analyzeAllForJob);
  const analyzeSingleApplication = useRecruiterStore((state) => state.analyzeSingleApplication);
  const clearApplicants = useRecruiterStore((state) => state.clearApplicants);
  
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  useEffect(() => {
    if (jobId) {
      clearApplicants();
      getApplicants(jobId);
    }
  }, [jobId, getApplicants, clearApplicants]);

  // poll while anything is pending/processing
  useEffect(() => {
    const hasInFlight = applicants.some(
      (a) => a.analysisStatus === 'pending' || a.analysisStatus === 'processing'
    );

    if (hasInFlight && !pollRef.current) {
      pollRef.current = setInterval(() => {
        if (jobId) getApplicants(jobId);
      }, 3000);
    }

    if (!hasInFlight && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [applicants, jobId, getApplicants]);

  const filteredApplicants = applicants
    .filter((app) => statusFilter === 'All' || app.status === statusFilter)
    .sort((a, b) => {
      if (a.analysisScore === null && b.analysisScore === null) return 0;
      if (a.analysisScore === null) return 1;
      if (b.analysisScore === null) return -1;
      return sortDir === 'desc' ? b.analysisScore - a.analysisScore : a.analysisScore - b.analysisScore;
    });

  if (isLoading && applicants.length === 0) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="tertiary" className="p-1.5" onClick={() => navigate('/recruiter/jobs')}>
            <ArrowLeft size={16} />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">Applicants</h1>
            <p className="text-xs text-[var(--color-ink-subtle)]">Review matched profiles and process screenings.</p>
          </div>
        </div>
        <Button
          variant="primary"
          leftIcon={<Sparkles size={14} />}
          onClick={() => jobId && analyzeAllForJob(jobId)}
          isLoading={isAnalyzingAll}
        >
          Analyse All
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-[var(--color-hairline)] gap-2">
        {statusTabs.map((tab) => {
          const count = tab === 'All' ? applicants.length : applicants.filter((a) => a.status === tab).length;
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
              {tab === 'All' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="text-[10px] font-mono opacity-60 ml-0.5">({count})</span>
            </button>
          );
        })}
      </div>

      {filteredApplicants.length === 0 ? (
        <EmptyState
          icon={<Users size={18} />}
          title={`No ${statusFilter !== 'All' ? statusFilter : ''} applicants`}
          description="Candidates applying for this role will appear in this table."
        />
      ) : (
        <Card className="overflow-hidden">
          <Table
            columns={[
              {
                header: 'Candidate',
                accessor: (row: any) => (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {row.candidateName?.[0] || '?'}
                    </div>
                    <span className="font-semibold text-[var(--color-ink)]">{row.candidateName}</span>
                  </div>
                )
              },
              {
                header: 'Resume',
                accessor: (row: any) => (
                  <a href={row.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-primary-hover)] hover:underline flex items-center gap-1">
                    <FileText size={12} /> View
                  </a>
                )
              },
              {
                header: 'Applied Date',
                accessor: (row: any) => new Date(row.appliedAt).toLocaleDateString(),
                className: 'font-mono text-xs'
              },
              {
                header: 'Status',
                accessor: (row: any) => <Badge variant={statusVariants[row.status]}>{row.status}</Badge>
              },
              {
                header: (
                  <button
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
                  >
                    Score <ArrowUpDown size={12} />
                  </button>
                ) as any,
                accessor: (row: any) => {
                  if (row.analysisStatus === 'pending' || row.analysisStatus === 'processing') {
                    return <span className="text-[10px] text-[var(--color-ink-subtle)] italic">Analysing...</span>;
                  }
                  if (row.analysisStatus === 'failed') {
                    return <span className="text-[10px] text-red-500">Failed</span>;
                  }
                  if (row.analysisStatus === 'completed') {
                    return (
                      <div className="flex flex-col">
                        <span className="font-mono font-semibold text-[var(--color-primary-hover)]">{row.analysisScore}</span>
                        <span className="text-[9px] text-[var(--color-ink-subtle)]">{row.analysisRecommendation}</span>
                      </div>
                    );
                  }
                  return <span className="text-[10px] text-[var(--color-ink-subtle)]">—</span>;
                }
              },
              {
                header: 'Actions',
                accessor: (row: any) => (
                  <div className="flex items-center gap-2 justify-start flex-wrap">

                    <Button
                      variant={row.status === 'shortlisted' ? 'primary' : 'secondary'}
                      className="text-[10px] py-1.5 px-2.5"
                      onClick={() => updateApplicationStatus(row.applicationId, 'shortlisted')}
                    >
                      Shortlist
                    </Button>

                    <Button
                      variant={row.status === 'hired' ? 'primary' : 'secondary'}
                      className={`text-[10px] py-1.5 px-2.5 ${row.status === 'hired' ? '!bg-emerald-600 hover:!bg-emerald-700' : ''}`}
                      onClick={() => updateApplicationStatus(row.applicationId, 'hired')}
                    >
                      Hire
                    </Button>

                    <Button
                      variant={row.status === 'rejected' ? 'danger' : 'secondary'}
                      className="text-[10px] py-1.5 px-2.5"
                      onClick={() => updateApplicationStatus(row.applicationId, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                )
              },
              {
                header: 'Analysis',
                accessor: (row: any) => {
                  const isBusy = row.analysisStatus === 'pending' || row.analysisStatus === 'processing';
                  return (
                    <Button
                      variant="secondary"
                      className="text-[10px] py-1.5 px-2.5"
                      onClick={() => analyzeSingleApplication(row.applicationId)}
                      disabled={isBusy}
                      isLoading={isBusy}
                      leftIcon={row.analysisStatus === 'completed' ? <RefreshCw size={10} /> : <Sparkles size={10} />}
                    >
                      {row.analysisStatus === 'completed' ? 'Re-analyse' : 'Analyse'}
                    </Button>
                  );
                }
              },
              {
                header: 'View',
                accessor: (row: any) => (
                  <Button
                    variant="secondary"
                    className="text-[10px] py-1.5 px-2.5"
                    onClick={() => navigate(`/recruiter/applicants/${row.applicationId}`)}
                  >
                    View
                  </Button>
                )
              },
            ]}
            data={filteredApplicants}
          />
        </Card>
      )}
    </div>
  );
};