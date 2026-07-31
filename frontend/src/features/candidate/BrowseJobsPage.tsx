import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Search, MapPin, Briefcase, Bookmark, BookmarkCheck, IndianRupee, Loader2 } from 'lucide-react';
import { useCandidateStore } from './candidateStore';

const jobTypeLabels: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  internship: 'Internship',
};

export const BrowseJobsPage = () => {
  const navigate = useNavigate();

  const jobs = useCandidateStore((state) => state.jobs);
  const isLoading = useCandidateStore((state) => state.isLoading);
  const jobFilters = useCandidateStore((state) => state.jobFilters);
  const setJobFilters = useCandidateStore((state) => state.setJobFilters);
  const resetJobFilters = useCandidateStore((state) => state.resetJobFilters);
  const fetchJobs = useCandidateStore((state) => state.fetchJobs);
  const savedJobIds = useCandidateStore((state) => state.savedJobIds);
  const getSavedJobs = useCandidateStore((state) => state.getSavedJobs);
  const saveJob = useCandidateStore((state) => state.saveJob);
  const removeSavedJob = useCandidateStore((state) => state.removeSavedJob);

  useEffect(() => {
    getSavedJobs();
  }, [getSavedJobs]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchJobs();
    }, 400);
    return () => clearTimeout(timeout);
  }, [jobFilters.search, jobFilters.location, jobFilters.jobType, jobFilters.minSalary, fetchJobs]);

  const hasActiveFilters = jobFilters.search || jobFilters.location || jobFilters.jobType !== 'All' || jobFilters.minSalary > 0;
  const [isSavingJobId, setIsSavingJobId] = useState<string | null>(null);

  const toggleSaveJob = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    setIsSavingJobId(jobId);
    try {
      if (savedJobIds.has(jobId)) {
        await removeSavedJob(jobId);
      } else {
        await saveJob(jobId);
      }
    } finally {
      setIsSavingJobId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-6 font-sans">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-[var(--color-ink)] tracking-tight">Search Opportunities</h1>
        <p className="text-xs text-[var(--color-ink-subtle)]">Find your next technical or design role</p>
      </div>

      {/* Search Header Widget */}
      <div className="flex flex-col bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row p-1.5 gap-1.5 bg-[var(--color-surface-2)] border-b border-[var(--color-hairline)]">
          <div className="relative flex-1 flex items-center">
            <Search size={16} className="absolute left-4 text-[var(--color-ink-subtle)]" />
            <input
              type="text"
              placeholder="Job title, keywords, or requirements..."
              value={jobFilters.search}
              onChange={(e) => setJobFilters({ search: e.target.value })}
              className="w-full bg-transparent border-none text-sm pl-11 pr-4 py-3 text-[var(--color-ink)] focus:outline-none focus:ring-0 placeholder:text-[var(--color-ink-subtle)]"
            />
          </div>
          <div className="hidden md:block w-[1px] bg-[var(--color-hairline)] my-2"></div>
          <div className="relative flex-1 flex items-center border-t border-[var(--color-hairline)] md:border-t-0">
            <MapPin size={16} className="absolute left-4 text-[var(--color-ink-subtle)]" />
            <input
              type="text"
              placeholder="City, state, or 'Remote'..."
              value={jobFilters.location}
              onChange={(e) => setJobFilters({ location: e.target.value })}
              className="w-full bg-transparent border-none text-sm pl-11 pr-4 py-3 text-[var(--color-ink)] focus:outline-none focus:ring-0 placeholder:text-[var(--color-ink-subtle)]"
            />
          </div>
          <Button variant="primary" className="rounded-lg px-8 py-3 m-0.5" onClick={() => fetchJobs()}>
            Search
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[var(--color-surface-1)]">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-subtle)] whitespace-nowrap bg-[var(--color-surface-2)] border border-[var(--color-hairline)] px-3 py-1.5 rounded-md">
              <Briefcase size={14} />
              <select
                value={jobFilters.jobType}
                onChange={(e) => setJobFilters({ jobType: e.target.value as typeof jobFilters.jobType })}
                className="bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer font-medium text-[var(--color-ink)] appearance-none pr-4 outline-none"
              >
                <option value="All">All Job Types</option>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="flex items-center gap-4 w-full max-w-xs px-2">
              <span className="text-xs font-medium text-[var(--color-ink-muted)] whitespace-nowrap">Min Salary</span>
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={jobFilters.minSalary}
                onChange={(e) => setJobFilters({ minSalary: Number(e.target.value) })}
                className="flex-1 accent-[var(--color-primary)]"
              />
              <span className="text-xs font-mono font-medium text-[var(--color-ink)] w-14 text-right">
                ${jobFilters.minSalary >= 1000 ? `${jobFilters.minSalary / 1000}k` : jobFilters.minSalary}
              </span>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetJobFilters}
              className="text-xs font-medium text-amber-600 hover:text-amber-700 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Job Listings */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-xs text-[var(--color-ink-subtle)] font-mono">
          <span>{isLoading ? 'Loading roles...' : `Showing ${jobs.length} active roles`}</span>
        </div>

        {isLoading && jobs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[180px] text-sm text-[var(--color-ink-subtle)] gap-2">
            <Loader2 size={16} className="animate-spin" />
            Loading roles...
          </div>
        ) : !isLoading && jobs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--color-hairline)] rounded-xl bg-[var(--color-surface-1)]/30">
            <span className="text-3xl mb-3 block">🔍</span>
            <h3 className="font-sans font-medium text-sm text-[var(--color-ink)] mb-1">No jobs match your filters</h3>
            <p className="text-xs text-[var(--color-ink-subtle)] max-w-sm mx-auto mb-4 leading-relaxed">
              Try broadening your keyword search, resetting location requirements, or clearing selected tags.
            </p>
            <Button variant="secondary" onClick={resetJobFilters}>Reset Search</Button>
          </div>
        ) : (
          <div className="relative">
            <div className={`grid grid-cols-1 gap-3.5 ${isLoading ? 'opacity-30' : ''}`}>
            {jobs.map((job) => {
              const isSaved = savedJobIds.has(job.jobId);
              const isSaving = isSavingJobId === job.jobId;
              return (
                <Card
                  key={job.jobId}
                  isHoverable
                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
                  onClick={() => navigate(`/candidate/jobs/${job.jobId}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded flex items-center justify-center text-sm font-bold bg-white text-black border border-[var(--color-hairline)] shrink-0 overflow-hidden">
                      {job.companyLogoUrl ? (
                        <img src={job.companyLogoUrl} alt={job.companyName} className="w-full h-full object-cover" />
                      ) : (
                        job.companyName?.[0] || '?'
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-ink-muted)] font-medium">{job.companyName}</span>
                        <span className="text-[var(--color-hairline-strong)]">•</span>
                        <span className="text-xs text-[var(--color-ink-subtle)]">{job.location}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--color-ink)]">{job.title}</h3>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] px-1.5 py-0.5 rounded text-[10px] font-medium">
                        {jobTypeLabels[job.jobType] || job.jobType}
                      </span>
                      {(job.salaryMin || job.salaryMax) ? (
                        <span className="text-xs font-mono text-[var(--color-primary-hover)] font-medium">
                          <IndianRupee size={12} className="inline mr-1" />
                          {job.salaryMin?.toLocaleString() ?? '—'} - {job.salaryMax?.toLocaleString() ?? '—'}
                        </span>
                      ) : (<span className="text-xs font-mono text-[var(--color-ink-subtle)] font-medium"><IndianRupee size={12} className="inline mr-1" />Not disclosed</span>)}
                      <span className="text-[10px] text-[var(--color-ink-subtle)] font-mono">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      variant="tertiary"
                      className="text-[10px] py-1 px-2 border border-[var(--color-hairline)]"
                      onClick={(e) => toggleSaveJob(e, job.jobId)}
                      isLoading={isSaving}
                      disabled={isSaving}
                      
                    >
                      {isSaved ? <span className="flex items-center gap-1"><BookmarkCheck size={12} />Saved</span> : <span className="flex items-center gap-1"><Bookmark size={12} />Save</span>}
                    </Button>
                  </div>
                </Card>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};