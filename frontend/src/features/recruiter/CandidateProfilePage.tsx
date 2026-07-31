import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { Play, CheckCircle2, AlertTriangle, RefreshCw, Star } from 'lucide-react';
import { useRecruiterStore } from './recruiterStore';

const statusVariants: Record<string, 'default' | 'primary' | 'error' | 'success'> = {
  applied: 'default',
  shortlisted: 'primary',
  rejected: 'error',
  hired: 'success',
};

const recommendationColors: Record<string, string> = {
  'Highly Recommended': 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  'Recommended': 'bg-blue-500/15 text-blue-600 border-blue-500/30',
  'Consider': 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  'Not Recommended': 'bg-rose-500/15 text-rose-600 border-rose-500/30',
};

export const CandidateProfilePage = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const isLoading = useRecruiterStore((state) => state.isLoading);
  const applicationDetail = useRecruiterStore((state) => state.applicationDetail);
  const applicationAnalysis = useRecruiterStore((state) => state.applicationAnalysis);
  const getApplicationDetail = useRecruiterStore((state) => state.getApplicationDetail);
  const getApplicationAnalysis = useRecruiterStore((state) => state.getApplicationAnalysis);
  const clearApplicationDetail = useRecruiterStore((state) => state.clearApplicationDetail);
  const updateApplicationStatus = useRecruiterStore((state) => state.updateApplicationStatus);
  const analyzeSingleApplication = useRecruiterStore((state) => state.analyzeSingleApplication);
  const isFetchingAnalysis = useRecruiterStore((state) => state.isFetchingAnalysis);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!applicationId) return;
    clearApplicationDetail();
    getApplicationDetail(applicationId);
    getApplicationAnalysis(applicationId);
  }, [applicationId, getApplicationDetail, getApplicationAnalysis, clearApplicationDetail]);

  // poll while analysis is pending/processing
  useEffect(() => {
    const status = applicationAnalysis?.status;
    const inFlight = status === 'pending' || status === 'processing';

    if (inFlight && !pollRef.current && applicationId) {
      pollRef.current = setInterval(() => {
        getApplicationAnalysis(applicationId);
      }, 3000);
    }

    if (!inFlight && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [applicationAnalysis, applicationId, getApplicationAnalysis]);

  const handleRunScreening = () => {
    if (applicationId) analyzeSingleApplication(applicationId);
  };

  if (isLoading || !applicationDetail) {
    return <Loading />;
  }

  const app = applicationDetail;
  const isBusy = applicationAnalysis?.status === 'pending' || applicationAnalysis?.status === 'processing';
  const hasResult = applicationAnalysis?.status === 'completed' && applicationAnalysis?.analysis;
  const hasFailed = applicationAnalysis?.status === 'failed';
  const result = hasResult ? applicationAnalysis.analysis : null;

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      <div className="flex justify-between items-center">
        <Button variant="tertiary" className="text-xs" onClick={() => navigate(-1)}>
          ← Back to applicants list
        </Button>
        <div className="flex gap-2">
          <Button variant="danger" className="text-xs" onClick={() => updateApplicationStatus(app.applicationId, 'rejected')}>
            Reject Candidate
          </Button>
          <Button variant="secondary" className="text-xs" onClick={() => updateApplicationStatus(app.applicationId, 'shortlisted')}>
            Shortlist
          </Button>
          <Button variant="primary" className="text-xs" onClick={() => updateApplicationStatus(app.applicationId, 'hired')}>
            Hire Candidate
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Card */}
        <Card className="p-6 md:p-8 flex flex-col gap-5">
          <div className="flex items-center gap-4 pb-4 border-b border-[var(--color-hairline)] justify-between flex-wrap">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-[var(--color-primary)] text-white text-lg font-bold flex items-center justify-center overflow-hidden">
                {app.candidateProfileImageUrl ? (
                  <img src={app.candidateProfileImageUrl} alt={app.candidateName} className="w-full h-full object-cover" />
                ) : (
                  app.candidateName?.[0] || '?'
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-bold text-[var(--color-ink)]">{app.candidateName}</h2>
                <span className="text-xs text-[var(--color-ink-subtle)] font-mono">{app.candidateEmail}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-right text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-ink-subtle)]">Status:</span>
                <Badge variant={statusVariants[app.status]}>{app.status}</Badge>
              </div>
              <span className="text-[var(--color-ink-subtle)]">
                Applied: <span className="font-mono text-[var(--color-ink)]">{new Date(app.appliedAt).toLocaleDateString()}</span>
              </span>
              <span className="text-[var(--color-ink-subtle)]">
                Job: <span className="font-semibold text-[var(--color-ink)]">{app.jobTitle}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[var(--color-primary-hover)] uppercase font-semibold">Summary Bio</span>
            <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed italic">
              {app.candidateBio || '"This candidate has not provided a bio statement."'}
            </p>
          </div>
        </Card>

        {/* AI resume screener */}
        <Card className="p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-3">
            <h3 className="text-xs font-semibold uppercase text-[var(--color-ink-subtle)] tracking-wider">
              AI Resume Screening
            </h3>
          </div>

          {isFetchingAnalysis && !applicationAnalysis ? (
            <div className="bg-[var(--color-surface-2)] border border-[var(--color-hairline)] p-6 rounded-lg flex flex-col items-center justify-center gap-3 text-center">
                <RefreshCw size={24} className="text-[var(--color-ink-subtle)] animate-spin" />
                <span className="text-xs font-medium text-[var(--color-ink)]">Checking screening status...</span>
            </div>
            ) : isBusy ? (
            <div className="bg-[var(--color-surface-2)] border border-[var(--color-primary)]/20 p-6 rounded-lg flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw size={24} className="text-[var(--color-primary)] animate-spin" />
              <span className="text-xs font-medium text-[var(--color-ink)]">Screening resume against job description...</span>
              <span className="text-[10px] text-[var(--color-ink-subtle)] font-mono italic">Evaluating skills, strengths, weaknesses & recommendation</span>
            </div>
          ) : hasFailed ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex flex-col gap-2">
              <div className="flex items-start gap-2 text-red-600">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-semibold">Screening failed</span>
                  <span className="text-[11px] leading-relaxed text-red-500">Something went wrong while analyzing this resume.</span>
                </div>
              </div>
              <Button variant="primary" className="mt-2 text-xs" onClick={handleRunScreening}>
                Retry Screening
              </Button>
            </div>
          ) : hasResult ? (
            <div className="flex flex-col gap-5">
              <div className="bg-[var(--color-surface-2)] border border-[var(--color-hairline)] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase font-mono text-[var(--color-ink-subtle)] font-medium">AI Recommendation</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border w-fit ${recommendationColors[result.recommendation] || ''}`}>
                    <Star size={12} className="fill-current" />
                    {result.recommendation}
                  </span>
                </div>

                <div className="flex flex-col gap-1 md:w-48">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[var(--color-ink-muted)]">Match Score</span>
                    <span className="font-mono font-bold text-sm text-[var(--color-primary-hover)]">{result.score}/100</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--color-hairline)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.score >= 80 ? 'bg-emerald-500' : result.score >= 60 ? 'bg-blue-500' : result.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-[var(--color-surface-2)]/50 border border-[var(--color-hairline)] p-4 rounded-lg">
                <span className="text-[11px] font-mono text-[var(--color-primary-hover)] uppercase font-semibold">Resume Summary</span>
                <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">{result.resumeSummary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 bg-[var(--color-surface-2)]/40 border border-[var(--color-hairline)] p-3.5 rounded-lg">
                  <span className="text-[11px] font-mono text-emerald-600 uppercase font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Matching Skills ({result.matchingSkills?.length || 0})
                  </span>
                  {result.matchingSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {result.matchingSkills.map((skill: string, i: number) => (
                        <span key={i} className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-[var(--color-ink-subtle)] italic">No direct matching keywords found.</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 bg-[var(--color-surface-2)]/40 border border-[var(--color-hairline)] p-3.5 rounded-lg">
                  <span className="text-[11px] font-mono text-amber-600 uppercase font-semibold flex items-center gap-1.5">
                    <AlertTriangle size={13} /> Missing Skills ({result.missingSkills?.length || 0})
                  </span>
                  {result.missingSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingSkills.map((skill: string, i: number) => (
                        <span key={i} className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-emerald-600 italic">No missing required skills!</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 bg-emerald-50/50 border border-emerald-200 p-4 rounded-lg">
                  <span className="text-[11px] font-mono text-emerald-600 uppercase font-semibold">Strengths</span>
                  <ul className="flex flex-col gap-1.5 text-xs text-[var(--color-ink-muted)]">
                    {result.strengths?.length > 0 ? (
                      result.strengths.map((str: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 shrink-0 mt-0.5">✓</span>
                          <span>{str}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[11px] italic text-[var(--color-ink-subtle)]">None listed.</li>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col gap-2 bg-rose-50/50 border border-rose-200 p-4 rounded-lg">
                  <span className="text-[11px] font-mono text-rose-600 uppercase font-semibold">Weaknesses / Gaps</span>
                  <ul className="flex flex-col gap-1.5 text-xs text-[var(--color-ink-muted)]">
                    {result.weaknesses?.length > 0 ? (
                      result.weaknesses.map((weak: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-600 shrink-0 mt-0.5">!</span>
                          <span>{weak}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[11px] italic text-emerald-600">No major weaknesses identified.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-blue-50/50 border border-blue-200 p-4 rounded-lg">
                <span className="text-[11px] font-mono text-blue-600 uppercase font-semibold">AI Decision Reasoning</span>
                <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed italic">"{result.reasoning}"</p>
              </div>

              <Button variant="secondary" className="w-full text-xs mt-1" leftIcon={<RefreshCw size={12} />} onClick={handleRunScreening}>
                Re-run AI Screening
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-center py-4">
              <p className="text-xs text-[var(--color-ink-subtle)] leading-relaxed">
                Run automated AI screening on this candidate to evaluate score, resume summary, matching & missing skills, strengths, weaknesses, recommendation, and decision reasoning.
              </p>
              <Button variant="primary" className="w-full" leftIcon={<Play size={12} className="fill-current" />} onClick={handleRunScreening}>
                Run AI Screening
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--color-hairline)] text-xs">
            <span className="text-xs font-medium text-[var(--color-ink-muted)]">Candidate Resume</span>
            <div className="bg-[var(--color-surface-2)] border border-[var(--color-hairline)] p-2.5 rounded flex justify-between items-center">
              <span className="text-[11px] font-mono text-[var(--color-ink-muted)]">📄 Resume.pdf</span>
              <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-[var(--color-primary-hover)] hover:underline text-[10px] font-medium">
                Download / View
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};