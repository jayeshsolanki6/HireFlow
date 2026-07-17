import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Briefcase, User2, BookOpen, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  // Featured 3 jobs
  // const featuredJobs = jobs.filter(j => j.status === 'active').slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight text-[var(--color-ink)]">
              <div className="h-6 w-6 rounded-md bg-black flex items-center justify-center text-white">
                <Briefcase size={12} strokeWidth={2.5} />
              </div>
              <span>HireFlow</span>
            </Link>
            <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-[var(--color-ink-subtle)]">
              <Link to="/jobs" className="hover:text-[var(--color-ink)] transition-colors">Browse Jobs</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors px-2 py-1">
                  Log In
                </Link>
                <Button variant="primary" className="text-xs px-3.5 py-1.5" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col gap-12 py-10 font-sans text-[var(--color-ink)]">
          
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-2xl p-8 md:p-16 text-center flex flex-col items-center gap-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-transparent opacity-50" />
            
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight max-w-3xl">
              Find your next role at a great company
            </h1>
            
            <p className="text-base md:text-lg text-[var(--color-ink-muted)] max-w-xl leading-relaxed">
              HireFlow connects talented candidates with innovative companies. Discover curated job listings, apply in minutes, and track your journey.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Button variant="primary" size="lg" onClick={() => navigate('/jobs')} rightIcon={<ArrowRight size={16} />}>
                Find Jobs
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/register?role=recruiter')}>
                Post a Job
              </Button>
            </div>
          </section>

          {/* Bento How It Works */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-primary-hover)]">How it works</span>
              <h2 className="text-2xl font-semibold tracking-tight">Built for modern engineers & recruiters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 flex flex-col gap-3">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                  <User2 size={20} />
                </div>
                <h3 className="text-base font-medium">1. Create Your Profile</h3>
                <p className="text-xs text-[var(--color-ink-subtle)] leading-relaxed">
                  Input your tech stacks, write your summary, and upload your resume PDF to complete your applicant file.
                </p>
              </Card>
              <Card className="p-6 flex flex-col gap-3">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-base font-medium">2. Search & Apply</h3>
                <p className="text-xs text-[var(--color-ink-subtle)] leading-relaxed">
                  Browse transparently published salary levels, tech stacks, and location statuses. Apply in a single click.
                </p>
              </Card>
              <Card className="p-6 flex flex-col gap-3">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-base font-medium">3. Automatic Screening</h3>
                <p className="text-xs text-[var(--color-ink-subtle)] leading-relaxed">
                  Our integrated AI analyzes candidate experience alignment and generates instant matching scores for recruiters.
                </p>
              </Card>
            </div>
          </section>

          {/* Featured Jobs Section */}
          <section className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Featured Openings</h2>
                <p className="text-xs text-[var(--color-ink-subtle)]">High-growth roles at premier tech organizations</p>
              </div>
              <Link to="/jobs" className="text-xs text-[var(--color-primary-hover)] hover:underline flex items-center gap-1 font-medium">
                View All Jobs <ArrowRight size={14} />
              </Link>
            </div>
            
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <Card key={job.id} isHoverable className="p-6 flex flex-col justify-between gap-5 cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded flex items-center justify-center text-xs font-bold text-white bg-[var(--color-surface-2)] border border-[var(--color-hairline)]" style={{ backgroundColor: job.companyLogoBg }}>
                        {job.companyName[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[var(--color-ink-subtle)] font-mono">{job.companyName}</span>
                        <span className="text-xs text-[var(--color-ink-muted)]">{job.location}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-primary-hover)] transition-colors line-clamp-1">{job.title}</h3>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.skillsRequired.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="default">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-hairline)] text-[11px] text-[var(--color-ink-subtle)]">
                    <span className="font-mono text-[var(--color-primary-hover)] font-medium">
                      ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                    </span>
                    <span className="bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] px-1.5 py-0.5 rounded text-[10px] font-medium">{job.jobType}</span>
                  </div>
                </Card>
              ))}
            </div> */}
          </section>
        </div>
      </main>

      {/* Clean elegant technical footer */}
      <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-surface-2)] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--color-ink-subtle)]">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-black flex items-center justify-center text-white">
              <Briefcase size={10} strokeWidth={2.5} />
            </div>
            <span>• Built in high-fidelity Professional Polish Layout</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px]">
            <span>UTC_SERVER: OK</span>
            <span>VER: 1.0.0-PRO</span>
          </div>
        </div>
      </footer>
      
    </div>
  );
};