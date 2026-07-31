import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ArrowLeft, Edit3, Users, Calendar, MapPin, Clock, Trash2, Tag, IndianRupee } from 'lucide-react';

import { formatSalaryRange } from '@/lib/format';
import { useRecruiterStore } from './recruiterStore';

export const RecruiterJobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const allJobs = useRecruiterStore((state) => state.allJobs);
  const deleteJob = useRecruiterStore((state) => state.deleteJob);

  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const job = allJobs.find(j => j.id === jobId);

  if (!job) {
    return (
      <div className="flex flex-col gap-4 py-8 items-center justify-center">
        <h2 className="text-xl font-bold">Job Not Found</h2>
        <Button variant="secondary" onClick={() => navigate('/recruiter/jobs')}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  const statusVariants = {
    open: 'success' as const,
    draft: 'default' as const
  };

  const handleDeleteConfirm = async  () => {
    setIsDeleting(true);
    const success = await deleteJob(job.id);
    setIsDeleting(false);
    if(success) {
        setIsDeleteModalOpen(false);
        navigate('/recruiter/jobs');
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      <div className="flex items-center gap-3">
        <Button variant="tertiary" className="p-1.5" onClick={() => navigate('/recruiter/jobs')}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">Job Details</h1>
          <p className="text-xs text-[var(--color-ink-subtle)]">View full specifications for this listing.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-grow flex flex-col gap-6 w-full lg:w-2/3">
          <Card className="p-6 md:p-8 flex flex-col gap-5">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">{job.title}</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant={statusVariants[job.jobStatus]}>{job.jobStatus}</Badge>
                  <span className="text-xs text-[var(--color-ink-subtle)] font-mono flex items-center gap-1">
                    <Clock size={12} /> Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="tertiary" className="text-red-500 hover:text-red-600 hover:bg-red-50" leftIcon={<Trash2 size={14} />} onClick={() => setIsDeleteModalOpen(true)}>
                  Delete
                </Button>
                <Button variant="secondary" leftIcon={<Edit3 size={14} />} onClick={() => navigate(`/recruiter/jobs/${job.id}/edit`)}>
                  Edit
                </Button>
                <Button variant="primary" leftIcon={<Users size={14} />} onClick={() => navigate(`/recruiter/jobs/${job.id}/applicants`)}>
                  View Applicants
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-[var(--color-hairline)]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-[var(--color-ink-subtle)] flex items-center gap-1"><MapPin size={12} /> Location</span>
                <span className="text-sm font-medium">{job.location}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-[var(--color-ink-subtle)] flex items-center gap-1"><Tag size={12} /> Job Type</span>
                <span className="text-sm font-medium">{job.jobType}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-[var(--color-ink-subtle)] flex items-center gap-1"><IndianRupee size={12} /> Salary Range</span>
                <span className="text-sm font-medium">{(job.salaryMin || job.salaryMax) ? formatSalaryRange(job.salaryMin, job.salaryMax) : 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-[var(--color-ink-subtle)] flex items-center gap-1"><Calendar size={12} /> Deadline</span>
                <span className="text-sm font-medium">{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-subtle)]">Job Description</h3>
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-ink-muted)]">
                {job.description}
              </div>
            </div>

            {job.requirements && (
              <div className="flex flex-col gap-4 mt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-subtle)]">Requirements</h3>
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-ink-muted)]">
                  {job.requirements}
                </div>
              </div>
            )}
            
          </Card>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Job Posting?"
        description={
            <span>
                Are you sure you want to completely delete <strong>{job.title}</strong>? This action cannot be undone, and all associated applications will also be lost.
            </span>
        }
        >
        <div className="flex justify-end gap-3">
            <Button variant="tertiary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} isLoading={isDeleting}>
                Yes, Delete Job
            </Button>
        </div>
      </Modal>
    </div>
  );
};
