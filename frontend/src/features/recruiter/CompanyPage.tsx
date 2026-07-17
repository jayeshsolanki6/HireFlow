import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { useRecruiterStore } from './recruiterStore';
import { Loading } from '@/components/ui/Loading';

export const CompanyPage = () => {
  const navigate = useNavigate();

  const isLoading = useRecruiterStore((state) => state.isLoading);
  const company = useRecruiterStore((state) => state.company);
  const createOrUpdateCompany = useRecruiterStore((state) => state.createOrUpdateCompany);
  const getCompany = useRecruiterStore((state) => state.getCompany);
  
  const [name, setName] = useState(company?.name || '');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(company?.logoUrl || null);
  const [about, setAbout] = useState(company?.about || '');
  const [website, setWebsite] = useState(company?.website || '');
  
  const [errors, setErrors] = useState({
    name: '',
    logo: ''
  });

  const [isEditing, setIsEditing] = useState(!company);
    
  useEffect(() => {
    getCompany();
  }, [getCompany]);

  useEffect(() => {
    if(!company) return;
    setIsEditing(false);
    setName(company.name || '');
    setLogoPreview(company.logoUrl || null);
    setAbout(company.about || '');
    setWebsite(company.website || '');
  }, [company]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if(!file?.type.startsWith('image/')){
            setErrors((prev) => ({ ...prev, logo: "Please select a valid image file" }));
            return;
        }
        if(file.size > 2*1024*1024){
            setErrors((prev) => ({ ...prev, logo: "File size should be less than 2MB" }));
            return;
        }

        setErrors((prev) => ({ ...prev, logo: "" }));
        setLogo(file);

        const reader = new FileReader();
        reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(errors.name || errors.logo) {
        return;
    }
    setErrors({
      name: '',
      logo: '',
    });

    if (!name) {
        setErrors((prev) => ({ ...prev, name: "Company Name is required" }));
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('about', about);
    formData.append('website', website);
    if (logo) {
        formData.append('logo', logo);
    }

    const success = await createOrUpdateCompany(formData);
    if(!success) return;
    navigate('/recruiter/dashboard');
  };

  if(isLoading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col gap-6 py-4 font-sans text-[var(--color-ink)]">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight">Corporate Profile</h1>
          <p className="text-xs text-[var(--color-ink-subtle)]">View and update your company branding and details.</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <div className="w-full">
        {!isEditing && company ? (
          <Card className="overflow-hidden">
            <div className="h-32 bg-[var(--color-surface-1)]/50 border-b border-[var(--color-hairline)] w-full"></div>
            <div className="px-6 md:px-10 pb-10">
              <div className="flex justify-between items-end -mt-12 mb-6">
                <div className="h-24 w-24 rounded-2xl flex items-center justify-center text-4xl font-bold bg-white text-black border-4 border-white shadow-sm overflow-hidden z-10">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    company?.name?.[0] || '?'
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                 <div className="flex-1 flex flex-col gap-4">
                    <h2 className="text-3xl font-bold text-[var(--color-ink)] tracking-tight">{company.name}</h2>
                    <a href={company.website} target="_blank" rel="noreferrer" className="text-sm text-[var(--color-primary-hover)] hover:underline font-mono inline-flex items-center gap-1 w-max">
                      {company.website || 'No website provided'} ↗
                    </a>
                    <div className="mt-6 flex flex-col gap-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-subtle)]">About the Company</h3>
                      <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed whitespace-pre-wrap max-w-prose">
                        {company.about || 'No description provided.'}
                      </p>
                    </div>
                 </div>
              </div>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-3xl">
            <Card className="p-6 md:p-8 flex flex-col gap-5">
              <h3 className="text-xs font-semibold uppercase text-[var(--color-primary-hover)] tracking-wider border-b border-[var(--color-hairline)] pb-2">
                Branding Details
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-medium text-xs text-[var(--color-ink-muted)]">Company Logo</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl flex items-center justify-center text-3xl font-bold bg-white text-black border border-[var(--color-hairline)] shadow-sm overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      company?.name?.[0] || '?'
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="text-xs text-[var(--color-ink-subtle)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-primary)]/10 file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary)]/20"
                  />
                  {errors.logo && <p className="mt-1 text-[10px] text-red-500">{errors.logo}</p>}
                </div>
              </div>

              <Input
                label="Company Legal Name *"
                placeholder="e.g. Notion"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({...prev, name : "" }));
                }}
                error={errors.name}
              />

              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Corporate Website URL"
                  placeholder="e.g. https://notion.so"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <Textarea
                label="About / Corporate Description"
                placeholder="Write a summary about company culture, values, history, and active domains..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
              />
            </Card>

            <div className="flex justify-end gap-3">
              {company && (
                <Button type="button" variant="tertiary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary" disabled={(errors.name || errors.logo)? true : false}>
                Save Company Profile
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
