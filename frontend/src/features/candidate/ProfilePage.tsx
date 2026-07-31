import { useEffect, useState } from 'react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Edit3, FileText, Download } from 'lucide-react';
import { useCandidateStore } from './candidateStore';
import { Loading } from '@/components/ui/Loading';

export const ProfilePage = () => {
  const isLoading = useCandidateStore((state) => state.isLoading);
  const candidate = useCandidateStore((state) => state.candidate);
  const getCandidateProfile = useCandidateStore((state) => state.getCandidateProfile);
  const updateCandidateProfile = useCandidateStore((state) => state.updateCandidateProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    profileImage: '',
    resume: ''
  });

  // Form states
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [bio, setBio] = useState('');
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    getCandidateProfile();
  }, [getCandidateProfile]);

  // sync form state whenever candidate loads/changes, and whenever entering edit mode
  useEffect(() => {
    if (!candidate) return;
    setName(candidate.name || '');
    setProfileImagePreview(candidate.profileImageUrl || '');
    setBio(candidate.bio || '');
    setProfileImage(null);
    setResume(null);
    setErrors({ name: '', profileImage: '', resume: '' });
  }, [candidate, isEditing]);

  const handleProfileUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, profileImage: "Please select a valid image file" }));
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profileImage: "File size should be less than 2MB" }));
      e.target.value = '';
      return;
    }

    setErrors((prev) => ({ ...prev, profileImage: "" }));
    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrors((prev) => ({ ...prev, resume: "Please select a valid PDF file" }));
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: "File size should be less than 2MB" }));
      e.target.value = '';
      return;
    }

    setErrors((prev) => ({ ...prev, resume: "" }));
    setResume(file);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errors.name || errors.profileImage || errors.resume) return;

    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (profileImage) formData.append('profileImage', profileImage);
    if (resume) formData.append('resume', resume);

    setIsSaving(true);
    const success = await updateCandidateProfile(formData);
    setIsSaving(false);
    if (!success) return;
    setIsEditing(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight">Candidate Profile</h1>
          <p className="text-xs text-[var(--color-ink-subtle)]">Manage your personal information and resume.</p>
        </div>
        {!isEditing && (
          <Button variant="primary" leftIcon={<Edit3 size={14} />} onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {!isEditing ? (
        /* View Mode */
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6 md:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[var(--color-primary)] text-white text-xl font-bold flex items-center justify-center shrink-0 overflow-hidden">
                {candidate?.profileImageUrl ? (
                  <img src={candidate.profileImageUrl} alt={candidate?.name} className="w-full h-full object-cover" />
                ) : (
                  candidate?.name ? candidate.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?'
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="text-xl font-semibold">{candidate?.name}</h2>
                <span className="text-sm text-[var(--color-ink-subtle)] font-mono">{candidate?.email}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-[var(--color-primary-hover)] uppercase font-medium">Bio Statement</span>
              <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                {candidate?.bio ? candidate.bio : <span className="italic text-[var(--color-ink-subtle)]">No bio statement written yet. Add one in Edit Profile mode.</span>}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-[var(--color-hairline)]">
              <span className="text-xs font-mono text-[var(--color-primary-hover)] uppercase font-medium">Resume File</span>
              {candidate?.resumeUrl ? (
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="bg-[var(--color-surface-2)] border border-[var(--color-hairline-strong)] p-3 rounded-lg flex items-center gap-3 w-fit pr-6 hover:border-[var(--color-primary)] transition-colors group"
                >
                  <FileText size={20} className="text-[var(--color-primary)] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[var(--color-ink-muted)]">Resume.pdf</span>
                    <span className="text-[10px] text-[var(--color-ink-subtle)] uppercase">Active PDF Document</span>
                  </div>
                  <Download size={14} className="text-[var(--color-ink-subtle)] group-hover:text-[var(--color-primary)] ml-2 shrink-0" />
                </a>
              ) : (
                <div className="border border-dashed border-[var(--color-hairline)] p-4 rounded-lg text-sm text-[var(--color-ink-subtle)] w-fit pr-8">
                  No resume PDF uploaded. Submit one in Edit Profile mode.
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : (
        /* Edit Mode */
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <Card className="p-6 md:p-8 flex flex-col gap-6">
            <h2 className="text-sm font-semibold uppercase text-[var(--color-primary-hover)] tracking-wider border-b border-[var(--color-hairline)] pb-2">
            Edit Profile Information
            </h2>

            <div className="flex flex-col gap-1.5">
            <label className="font-sans font-medium text-xs text-[var(--color-ink-muted)]">Profile Photo</label>
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[var(--color-primary)] text-white text-xl font-bold flex items-center justify-center shrink-0 overflow-hidden">
                {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?'
                )}
                </div>
                <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpdate}
                className="text-xs text-[var(--color-ink-subtle)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-primary)]/10 file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary)]/20"
                />
                {errors.profileImage && <p className="mt-1 text-[10px] text-red-500">{errors.profileImage}</p>}
            </div>
            <span className="text-[10px] text-[var(--color-ink-subtle)]">Recommended: Square image, max 2MB.</span>
            </div>

            <div className="flex flex-col gap-4">
            <Input
                label="Full Name"
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
                }}
                error={errors.name}
                required
            />

            <Textarea
                label="Bio / Professional Summary"
                placeholder="Tell employers about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
            />

            <div className="flex flex-col gap-1.5">
                <label className="font-sans font-medium text-xs text-[var(--color-ink-muted)]">Resume Document</label>
                <div className="flex items-center gap-4">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    className="text-xs text-[var(--color-ink-subtle)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-primary)]/10 file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary)]/20"
                />
                {errors.resume && <p className="mt-1 text-[10px] text-red-500">{errors.resume}</p>}
                </div>
                <span className="text-[10px] text-[var(--color-ink-subtle)]">
                {resume?.name ? `Selected: ${resume.name}` : 'Accepts PDF only. Max 2MB.'}
                </span>
            </div>
            </div>
        </Card>

          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="tertiary" disabled={isSaving} onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving} disabled={(errors.name || errors.profileImage || errors.resume) ? true : false}>
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};