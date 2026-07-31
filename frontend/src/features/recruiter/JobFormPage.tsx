import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { useRecruiterStore } from './recruiterStore';

export const JobFormPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const isEdit = !!jobId;

  const isLoading = useRecruiterStore((state) => state.isLoading);
  const company = useRecruiterStore((state) => state.company);
  const getCompany = useRecruiterStore((state) => state.getCompany);
  const allJobs = useRecruiterStore((state) => state.allJobs);
  const getAllJobs = useRecruiterStore((state) => state.getAllJobs);
  const createJob = useRecruiterStore((state) => state.createJob);
  const updateJob = useRecruiterStore((state) => state.updateJob);

  const [isFetchingJob, setIsFetchingJob] = useState(isEdit);

  // Form Fields
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState<'full_time' | 'part_time' | 'internship'>('full_time');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  // Errors
  const [titleError, setTitleError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [descError, setDescError] = useState('');
  const [reqError, setReqError] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  useEffect(() => {
    getCompany();
  }, [getCompany]);

  // In edit mode, look up the job from the store (which has all statuses, including drafts).
  // If the store is empty (e.g. direct URL navigation), fetch all jobs first.
  useEffect(() => {
    if (!isEdit || !jobId) return;
    (async () => {
      let jobs = allJobs;
      if (jobs.length === 0) {
        await getAllJobs();
        jobs = useRecruiterStore.getState().allJobs;
      }
      const job = jobs.find((j) => j.id === jobId);
      if (!job) {
        navigate('/recruiter/jobs');
        return;
      }
      setTitle(job.title || '');
      setLocation(job.location || '');
      setJobType(job.jobType || 'full_time');
      setSalaryMin(job.salaryMin !== undefined ? String(job.salaryMin) : '');
      setSalaryMax(job.salaryMax !== undefined ? String(job.salaryMax) : '');
      setDeadline(job.deadline ? job.deadline.slice(0, 10) : '');
      setDescription(job.description || '');
      setRequirements(job.requirements || '');
      setIsFetchingJob(false);
    })();
  }, [isEdit, jobId, navigate]);

  if (isLoading || isFetchingJob) {
    return <Loading />;
  }

  // Recruiter - Post a Job: If no company profile exists, show a gate screen
  if (!company) {
    return (
      <div className="py-12 font-sans flex justify-center">
        <Card className="max-w-md w-full p-8 text-center flex flex-col items-center gap-4">
          <span className="text-4xl">🏢</span>
          <h2 className="text-base font-bold tracking-tight">Set up your company profile first</h2>
          <p className="text-xs text-[var(--color-ink-subtle)] leading-relaxed">
            To post new active job positions, we require your employer corporate brand card profile. Let's configure it first in under a minute.
          </p>
          <Button variant="primary" className="mt-2" onClick={() => navigate('/recruiter/company')}>
            Go to Company Setup
          </Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (finalStatus: 'open' | 'draft') => {
    setTitleError('');
    setLocationError('');
    setDescError('');
    setReqError('');

    let valid = true;
    if (!title) {
      setTitleError('Job Title is required');
      valid = false;
    }
    if (!location) {
      setLocationError('Location is required');
      valid = false;
    }
    if (!description) {
      setDescError('Job Description is required');
      valid = false;
    }
    if (!requirements) {
      setReqError('Requirements are required');
      valid = false;
    }

    if (!valid) return;

    const jobPayload: Record<string, unknown> = {
      title,
      location,
      jobType,
      description,
      requirements,
      jobStatus: finalStatus,
    };

    if (salaryMin !== '') jobPayload.salaryMin = Number(salaryMin);
    if (salaryMax !== '') jobPayload.salaryMax = Number(salaryMax);
    if (deadline !== '') jobPayload.deadline = deadline;

    if(finalStatus === 'draft') {
      setIsDrafting(true);
    } else {
      setIsSaving(true);
    }
    
    const success = isEdit && jobId
      ? await updateJob(jobId, jobPayload)
      : await createJob(jobPayload);

    if(finalStatus === 'draft') {
      setIsDrafting(false);
    } else {
      setIsSaving(false);
    }

    if (!success) return;
    navigate('/recruiter/jobs');
  };


  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">{isEdit ? 'Edit Job Posting' : 'Create Job'}</h1>
          <p className="text-xs text-[var(--color-ink-subtle)]">Draft high-density specification lists for matching applicants.</p>
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('open'); }} className="flex flex-col gap-6">
          <Card className="p-6 md:p-8 flex flex-col gap-5">
            <h3 className="text-xs font-semibold uppercase text-[var(--color-primary-hover)] tracking-wider border-b border-[var(--color-hairline)] pb-2">
              Position Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job Title *"
                placeholder="e.g. Senior Frontend Engineer"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
                error={titleError}
                required
              />
              <Input
                label="Location *"
                placeholder="e.g. Remote or San Francisco, CA"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setLocationError(''); }}
                error={locationError}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Job Type"
                options={[
                  { value: 'full_time', label: 'Full-time' },
                  { value: 'part_time', label: 'Part-time' },
                  { value: 'internship', label: 'Internship' }
                ]}
                value={jobType}
                onChange={(e: any) => setJobType(e.target.value)}
              />
              <Input
                label="Application Deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Salary Min (₹)"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
              <Input
                label="Salary Max (₹)"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </div>

            <Textarea
              label="Job Description *"
              placeholder="Detail role context, engineering challenges, day-to-day work specs..."
              value={description}
              onChange={(e) => { setDescription(e.target.value); setDescError(''); }}
              error={descError}
              required
              rows={6}
            />

            <Textarea
              label="Requirements *"
              placeholder="List specific credentials, tech-stack limits, minimum experience..."
              value={requirements}
              onChange={(e) => { setRequirements(e.target.value); setReqError(''); }}
              error={reqError}
              required
              rows={4}
            />

            <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-[var(--color-hairline)]">
              <Button type="button" variant="tertiary" disabled={isSaving || isDrafting} onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="button" variant="secondary" onClick={() => handleSubmit('draft')} isLoading={isDrafting}>
                Save as Draft
              </Button>
              <Button type="submit" variant="primary" isLoading={isSaving}>
                {isEdit ? 'Update Job' : 'Publish Job'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};