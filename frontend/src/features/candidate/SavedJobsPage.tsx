import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { Bookmark, Trash2 } from 'lucide-react';
import { useCandidateStore } from './candidateStore';

const jobTypeLabels: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  internship: 'Internship',
};

export const SavedJobsPage = () => {
  const navigate = useNavigate();

  const savedJobs = useCandidateStore((state) => state.savedJobs);
  const getSavedJobs = useCandidateStore((state) => state.getSavedJobs);
  const removeSavedJob = useCandidateStore((state) => state.removeSavedJob);

  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    (async () => {
      await getSavedJobs();
      setIsFetching(false);
    })();
  }, [getSavedJobs]);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight">Saved Opportunities</h1>
        <p className="text-xs text-[var(--color-ink-subtle)]">Bookmarks you have saved for later review</p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={<Bookmark size={18} />}
          title="No saved jobs"
          description="Browse open job postings and bookmark the ones that fit your skills to apply later."
          actionLabel="Browse Openings"
          onAction={() => navigate('/candidate/jobs')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <Card key={job.jobId} isHoverable className="p-5 flex flex-col justify-between gap-5 relative group h-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSavedJob(job.jobId);
                }}
                className="absolute top-4 right-4 text-amber-500 hover:text-red-500 p-1 rounded hover:bg-[var(--color-surface-2)] cursor-pointer transition-colors"
                title="Remove Bookmark"
              >
                <Trash2 size={14} />
              </button>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded flex items-center justify-center text-xs font-bold bg-white text-black border border-[var(--color-hairline)] shrink-0 overflow-hidden">
                    {job.companyLogoUrl ? (
                      <img src={job.companyLogoUrl} alt={job.companyName} className="w-full h-full object-cover" />
                    ) : (
                      job.companyName?.[0] || '?'
                    )}
                  </div>
                  <div className="flex flex-col pr-6">
                    <span className="text-[10px] text-[var(--color-ink-subtle)] font-mono line-clamp-1">{job.companyName}</span>
                    <span className="text-xs text-[var(--color-ink-muted)] line-clamp-1">{job.location}</span>
                  </div>
                </div>
                <h3 className="text-xs font-semibold text-[var(--color-ink)] line-clamp-2 min-h-[32px]">{job.title}</h3>
                <span className="bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] px-1.5 py-0.5 rounded text-[10px] font-medium w-fit">
                  {jobTypeLabels[job.jobType] || job.jobType}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-hairline)] text-[10px] text-[var(--color-ink-subtle)] mt-auto">
                {(job.salaryMin || job.salaryMax) ? (
                  <span className="font-mono text-[var(--color-primary-hover)] font-medium">
                    ${job.salaryMin?.toLocaleString() ?? '—'} - ${job.salaryMax?.toLocaleString() ?? '—'}
                  </span>
                ) : (
                  <span className="italic">Not disclosed</span>
                )}
                <Button variant="secondary" className="text-[10px] py-1 px-2.5" onClick={() => navigate(`/candidate/jobs/${job.jobId}`)}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};