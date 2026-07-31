import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Briefcase, User2, BookOpen, ArrowRight, CheckCircle2, Users2, BarChart3 } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]">

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>

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
              Shortlist connects talented candidates with innovative companies. Discover curated job listings, apply in minutes, and track your journey.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Button variant="primary" size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight size={16} />}>
                Sign Up
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

          {/* For Job Seekers / For Hiring Teams */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-primary-hover)]">Built for both sides of the table</span>
              <h2 className="text-2xl font-semibold tracking-tight">Whichever seat you're in, we've got you covered</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Seekers */}
              <Card className="p-6 md:p-8 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <Users2 size={20} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold">For Job Seekers</h3>
                    <p className="text-xs text-[var(--color-ink-subtle)]">Accelerate your career search</p>
                  </div>
                </div>

                <ul className="flex flex-col gap-3">
                  {[
                    { title: 'Transparent Salary Ranges', desc: 'Know compensation expectations upfront before applying.' },
                    { title: 'One-Click Applications', desc: 'Apply seamlessly using your saved profile and resume.' },
                    { title: 'AI Resume Match Score', desc: 'See how well your resume fits a role before you apply.' },
                    { title: 'Application Tracking', desc: 'Track review stages transparently across all submitted roles.' },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 size={15} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                      <span className="text-[var(--color-ink-muted)] leading-relaxed">
                        <strong className="text-[var(--color-ink)] font-semibold">{item.title}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button variant="secondary" className="w-full mt-1" onClick={() => navigate('/register')}>
                  Browse Active Roles
                </Button>
              </Card>

              {/* Hiring Teams */}
              <Card className="p-6 md:p-8 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <BarChart3 size={20} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold">For Hiring Teams</h3>
                    <p className="text-xs text-[var(--color-ink-subtle)]">Shortlist top talent effortlessly</p>
                  </div>
                </div>

                <ul className="flex flex-col gap-3">
                  {[
                    { title: 'AI Resume Screening', desc: 'Receive instant 0-100 alignment scores and skill gap analysis.' },
                    { title: 'Structured Applicant Pipeline', desc: 'Manage candidate stages cleanly from Applied to Hired.' },
                    { title: 'Bulk Analysis', desc: 'Screen every applicant for a role in a single click.' },
                    { title: 'Quality Talent Matching', desc: 'Highlight strengths, weaknesses, and direct technical fit.' },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 size={15} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                      <span className="text-[var(--color-ink-muted)] leading-relaxed">
                        <strong className="text-[var(--color-ink)] font-semibold">{item.title}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button variant="primary" className="w-full mt-1" onClick={() => navigate('/register?role=recruiter')}>
                  Start Hiring on Shortlist
                </Button>
              </Card>
            </div>
          </section>
        </div>
      </main>

    </div>
  );
};