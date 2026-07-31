import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Bookmark, BookmarkCheck, AlertCircle,
  Sparkles, RefreshCw, Star, CheckCircle2, AlertTriangle, Lightbulb
} from 'lucide-react';
import { formatSalaryRange } from '@/lib/format';
import { useCandidateStore } from './candidateStore';
import { candidateApi } from './candidate.api';

const jobTypeLabels: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  internship: 'Internship',
};

const recommendationColors: Record<string, string> = {
  'Highly Recommended': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Recommended': 'bg-blue-50 text-blue-600 border-blue-200',
  'Consider': 'bg-amber-50 text-amber-600 border-amber-200',
  'Not Recommended': 'bg-rose-50 text-rose-600 border-rose-200',
};

export const CandidateJobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const candidate = useCandidateStore((state) => state.candidate);
  const getCandidateProfile = useCandidateStore((state) => state.getCandidateProfile);
  const savedJobIds = useCandidateStore((state) => state.savedJobIds);
  const getSavedJobs = useCandidateStore((state) => state.getSavedJobs);
  const saveJob = useCandidateStore((state) => state.saveJob);
  const removeSavedJob = useCandidateStore((state) => state.removeSavedJob);
  const appliedJobIds = useCandidateStore((state) => state.appliedJobIds);
  const getMyApplications = useCandidateStore((state) => state.getMyApplications);
  const applyToJob = useCandidateStore((state) => state.applyToJob);

  const jobMatchAnalysis = useCandidateStore((state) => state.jobMatchAnalysis);
  const isAnalyzingJobMatch = useCandidateStore((state) => state.isAnalyzingJobMatch);
  const analyzeJobMatch = useCandidateStore((state) => state.analyzeJobMatch);
  const clearJobMatchAnalysis = useCandidateStore((state) => state.clearJobMatchAnalysis);

  const [job, setJob] = useState<any>(null);
  const [isFetchingJob, setIsFetchingJob] = useState(true);
  const [profileGateAction, setProfileGateAction] = useState<'apply' | 'analyze' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCandidateProfile();
    getSavedJobs();
    getMyApplications();
  }, [getCandidateProfile, getSavedJobs, getMyApplications]);

  useEffect(() => {
    if (!jobId) return;
    clearJobMatchAnalysis();
    (async () => {
      setIsFetchingJob(true);
      try {
        const result = await candidateApi.getJobById(jobId);
        setJob(result.data);
      } catch (error) {
        console.error(error);
        setJob(null);
      } finally {
        setIsFetchingJob(false);
      }
    })();
  }, [jobId, clearJobMatchAnalysis]);

  if (isFetchingJob) {
    return <Loading />;
  }

  if (!job) {
    return <EmptyState title="Job missing" description="This posting does not exist." />;
  }

  const isSaved = savedJobIds.has(job.jobId);
  const alreadyApplied = appliedJobIds.has(job.jobId);
  const isJobClosed = job.jobStatus !== 'open';
  const hasResume = !!candidate?.resumeUrl;

  const toggleSave = () => {
    if (isSaved) {
      removeSavedJob(job.jobId);
    } else {
      saveJob(job.jobId);
    }
  };

  const handleApplyClick = () => {
    if (!hasResume) {
      setProfileGateAction('apply');
      return;
    }
    submitApplication();
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    const success = await applyToJob(job.jobId);
    setIsSubmitting(false);
    if (success) setProfileGateAction(null);
  };

  const handleRunAnalysis = () => {
    if (!hasResume) {
      setProfileGateAction('analyze');
      return;
    }
    if (jobId) analyzeJobMatch(jobId);
  };

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)] w-full">
      {/* Navigation Header */}
      <div className="flex justify-between items-center">
        <Button variant="tertiary" className="text-xs" onClick={() => navigate(-1)}>
          ← Back to listings
        </Button>
        <Button
          variant="tertiary"
          className="text-xs"
          onClick={toggleSave}
          leftIcon={isSaved ? <BookmarkCheck size={14} className="text-amber-400" /> : <Bookmark size={14} />}
        >
          {isSaved ? 'Saved' : 'Save Job'}
        </Button>
      </div>

      {/* Main Container - Full Width */}
      <div className="flex flex-col gap-6 w-full">
        {/* Main Job Header & Description Card */}
        <Card className="p-6 md:p-8 flex flex-col gap-6">
          {/* Header row with Title, Company Logo, and integrated Apply CTA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-hairline)] pb-6">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-lg flex items-center justify-center text-xl font-bold bg-white text-black border border-[var(--color-hairline)] shrink-0 overflow-hidden">
                {job.companyLogoUrl ? (
                  <img src={job.companyLogoUrl} alt={job.companyName} className="w-full h-full object-cover" />
                ) : (
                  job.companyName?.[0] || '?'
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {job.companyWebsite ? (
                    <a
                      href={job.companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-[var(--color-primary-hover)] hover:underline"
                    >
                      {job.companyName} ↗
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-[var(--color-primary-hover)]">{job.companyName}</span>
                  )}
                  <span className="text-[var(--color-hairline-strong)]">•</span>
                  <span className="text-xs text-[var(--color-ink-subtle)]">{job.location}</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">{job.title}</h1>
              </div>
            </div>

            {/* Application Button integrated right at the top */}
            <div className="w-full md:w-auto shrink-0">
              {isJobClosed ? (
                <Button variant="secondary" className="w-full md:w-auto cursor-not-allowed opacity-60" disabled>
                  Applications Closed
                </Button>
              ) : alreadyApplied ? (
                <div className="flex flex-col items-start md:items-end gap-1">
                  <Button variant="secondary" className="w-full md:w-auto text-emerald-500 border-emerald-900/50 cursor-default" disabled>
                    ✓ Applied
                  </Button>
                  <span className="text-[11px] text-[var(--color-ink-subtle)]">Track status in My Applications</span>
                </div>
              ) : (
                <Button variant="primary" className="w-full md:w-auto px-8" onClick={handleApplyClick} isLoading={isSubmitting}>
                  Apply Now
                </Button>
              )}
            </div>
          </div>

          {/* Key Job Specifications Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--color-surface-2)]/50 p-4 rounded-lg border border-[var(--color-hairline)] text-xs font-mono text-[var(--color-ink-muted)]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--color-ink-subtle)] uppercase">Job Type</span>
              <span className="font-semibold text-[var(--color-primary-hover)]">{jobTypeLabels[job.jobType] || job.jobType}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--color-ink-subtle)] uppercase">Annual Salary</span>
              <span className="font-semibold text-emerald-500">
                {formatSalaryRange(job.salaryMin, job.salaryMax)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--color-ink-subtle)] uppercase">Deadline</span>
              <span className="font-semibold">
                {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open-ended'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--color-ink-subtle)] uppercase">Posted Date</span>
              <span className="font-semibold">
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description & Requirements */}
          <div className="text-sm text-[var(--color-ink-muted)] leading-relaxed flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[var(--color-ink)] border-b border-[var(--color-hairline)] pb-1.5 mt-2">Job Description</h3>
            <p className="whitespace-pre-line text-xs">{job.description}</p>

            {job.requirements && (
              <>
                <h3 className="text-sm font-semibold text-[var(--color-ink)] border-b border-[var(--color-hairline)] pb-1.5 mt-4">Requirements</h3>
                <p className="whitespace-pre-line text-xs">{job.requirements}</p>
              </>
            )}
          </div>
        </Card>

        {/* AI Resume & Skill Match Card (Full Width) */}
        <Card className="p-6 md:p-8 flex flex-col gap-6 border-l-4 border-l-[var(--color-primary)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--color-hairline)] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--color-ink)]">AI Resume & Skill Match</h3>
                <p className="text-xs text-[var(--color-ink-subtle)]">Analyze how your resume aligns with this job posting</p>
              </div>
            </div>

            {jobMatchAnalysis && (
              <Button
                variant="tertiary"
                className="text-xs shrink-0 self-start md:self-auto"
                leftIcon={<RefreshCw size={12} />}
                onClick={handleRunAnalysis}
                disabled={isAnalyzingJobMatch}
              >
                Re-analyze Match
              </Button>
            )}
          </div>

          {isAnalyzingJobMatch ? (
            <div className="bg-[var(--color-surface-2)] border border-[var(--color-primary)]/30 p-8 rounded-xl flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw size={28} className="text-[var(--color-primary)] animate-spin" />
              <span className="text-sm font-semibold text-[var(--color-ink)]">Evaluating your profile alignment...</span>
              <span className="text-xs text-[var(--color-ink-subtle)] font-mono">Comparing your resume against {job.companyName}'s job spec</span>
            </div>
          ) : jobMatchAnalysis ? (
            (() => {
              const result = jobMatchAnalysis;
              return (
                <div className="flex flex-col gap-6">
                  {/* Top Score Banner */}
                  <div className="bg-[var(--color-surface-2)] border border-[var(--color-hairline)] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center h-16 w-16 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-hairline-strong)] shrink-0">
                        <span className="text-2xl font-bold font-mono text-[var(--color-primary-hover)]">{result.score}</span>
                        <span className="text-[9px] font-mono text-[var(--color-ink-subtle)] uppercase">/ 100</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono uppercase text-[var(--color-ink-subtle)]">Match Evaluation</span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border w-fit ${recommendationColors[result.recommendation] || ''}`}>
                          <Star size={12} className="fill-current" />
                          {result.recommendation}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 md:w-56">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-[var(--color-ink-muted)]">Skill Alignment</span>
                        <span className="font-mono font-bold text-xs text-[var(--color-primary-hover)]">{result.score}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[var(--color-hairline)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            result.score >= 80 ? 'bg-emerald-500' : result.score >= 60 ? 'bg-blue-500' : result.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${result.score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--color-surface-2)]/40 border border-[var(--color-hairline)] p-4 rounded-lg flex flex-col gap-1.5">
                    <span className="text-[11px] font-mono uppercase text-[var(--color-primary-hover)] font-semibold">Alignment Summary</span>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">{result.resumeSummary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2.5 bg-[var(--color-surface-2)]/30 border border-[var(--color-hairline)] p-4 rounded-lg">
                      <span className="text-[11px] font-mono text-emerald-600 uppercase font-semibold flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> Matching Skills ({result.matchingSkills?.length || 0})
                      </span>
                      {result.matchingSkills?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {result.matchingSkills.map((s: string, i: number) => (
                            <span key={i} className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">✓ {s}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-[var(--color-ink-subtle)] italic">No matching skills detected in your profile.</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2.5 bg-[var(--color-surface-2)]/30 border border-[var(--color-hairline)] p-4 rounded-lg">
                      <span className="text-[11px] font-mono text-amber-600 uppercase font-semibold flex items-center gap-1.5">
                        <AlertTriangle size={14} /> Missing Required Skills ({result.missingSkills?.length || 0})
                      </span>
                      {result.missingSkills?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {result.missingSkills.map((s: string, i: number) => (
                            <span key={i} className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-mono">! {s}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-600 italic font-mono">You possess 100% of required skills!</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 bg-emerald-50/50 border border-emerald-200 p-4 rounded-lg">
                      <span className="text-[11px] font-mono text-emerald-600 uppercase font-semibold">Key Profile Strengths</span>
                      <ul className="flex flex-col gap-1.5 text-xs text-[var(--color-ink-muted)]">
                        {result.strengths?.map((str: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-600 shrink-0 mt-0.5">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-2 bg-amber-50/50 border border-amber-200 p-4 rounded-lg">
                      <span className="text-[11px] font-mono text-amber-600 uppercase font-semibold">Areas to Highlight</span>
                      <ul className="flex flex-col gap-1.5 text-xs text-[var(--color-ink-muted)]">
                        {result.weaknesses?.map((w: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-600 shrink-0 mt-0.5">!</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-200 p-4 rounded-lg text-xs">
                    <Lightbulb size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-blue-700">AI Guidance for Application</span>
                      <p className="text-[var(--color-ink-muted)] leading-relaxed">{result.reasoning}</p>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-[var(--color-surface-2)]/60 border border-[var(--color-hairline)] p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-1.5 text-center md:text-left">
                <span className="text-xs font-semibold text-[var(--color-ink)]">Want to see how your resume scores against this job?</span>
                <p className="text-xs text-[var(--color-ink-subtle)] max-w-lg leading-relaxed">
                  Run our instant AI skill-matcher to discover your matching skills, missing requirements, key strengths, and recommendations before applying.
                </p>
              </div>
              <Button variant="primary" className="shrink-0" leftIcon={<Sparkles size={16} />} onClick={handleRunAnalysis}>
                Analyze My Fit
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Complete Profile / Missing Resume Modal */}
      <Modal
        isOpen={profileGateAction !== null}
        onClose={() => setProfileGateAction(null)}
        title="Complete your profile to continue"
        description={
          profileGateAction === 'apply'
            ? "A resume is required before you can submit job applications."
            : "A resume is required before we can check your match against this job."
        }
      >
        <div className="flex flex-col gap-4">
          <div className="bg-amber-50 text-amber-600 border border-amber-200 p-3 rounded-md text-xs leading-normal flex items-start gap-1.5">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>No resume on file. Please upload one from your profile page.</span>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="tertiary" onClick={() => setProfileGateAction(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => navigate('/candidate/profile')}>
              Go to Profile
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};