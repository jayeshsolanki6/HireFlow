import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { RegisterSchema } from './auth.schema';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Briefcase, Loader2 } from 'lucide-react';
import { useAuthStore } from './authStore';

export const RegisterPage = () => {

  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isSigningUp = useAuthStore((state) => state.isSigningUp);

  const navigate = useNavigate();

  const validateForm = () => {
    const data = { name, email, password, confirmPassword };
    const validation = RegisterSchema.safeParse(data);
    if(!validation.success){
      const errors = validation.error.format();
      setErrors({
        name : errors.name?._errors[0] || "",
        email : errors.email?._errors[0] || "",
        password : errors.password?._errors[0] || "",
        confirmPassword : errors.confirmPassword?._errors[0] || "",
      })
      return false;
    }
    return true;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!validateForm()) return;

    const result = await useAuthStore.getState().register(name, email, password, role);
    if(result){
      console.log('User role:', result);
      navigate(`/${result}/dashboard`);
    }
  };

  return (
    <div className="w-full max-w-[450px] flex flex-col gap-5 font-sans mx-auto py-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight text-[var(--color-ink)] hover:opacity-80 transition-opacity">
          <div className="h-12 w-12 rounded-xl bg-black flex items-center justify-center text-white shadow-sm">
            <Briefcase size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl">HireFlow</span>
        </Link>
      </div>

      <Card className="w-full p-8 flex flex-col gap-5 shadow-sm border-[var(--color-hairline)] bg-white rounded-2xl">
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-ink)] tracking-tight">Create an account</h1>
          <p className="text-sm text-[var(--color-ink-subtle)]">Join as a verified candidate or recruiter</p>
        </div>
        {/* Role Cards Selector */}
        <div className="grid grid-cols-2 gap-3.5">
          <div
            onClick={() => setRole('candidate')}
            className={`border rounded-xl p-4 flex flex-col gap-1 cursor-pointer transition-all ${
              role === 'candidate'
                ? 'border-[var(--color-ink)] bg-[var(--color-surface-2)] shadow-sm'
                : 'border-[var(--color-hairline)] bg-white hover:border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface-2)]/50'
            }`}
          >
            <span className="text-xl mb-1">👨‍💻</span>
            <span className={`text-[13px] font-semibold ${role === 'candidate' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]'}`}>Candidate</span>
            <span className="text-[11px] text-[var(--color-ink-subtle)] leading-snug">Applying to tech roles.</span>
          </div>
          <div
            onClick={() => setRole('recruiter')}
            className={`border rounded-xl p-4 flex flex-col gap-1 cursor-pointer transition-all ${
              role === 'recruiter'
                ? 'border-[var(--color-ink)] bg-[var(--color-surface-2)] shadow-sm'
                : 'border-[var(--color-hairline)] bg-white hover:border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface-2)]/50'
            }`}
          >
            <span className="text-xl mb-1">💼</span>
            <span className={`text-[13px] font-semibold ${role === 'recruiter' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]'}`}>Recruiter</span>
            <span className="text-[11px] text-[var(--color-ink-subtle)] leading-snug">Hiring talent for companies.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          <Input
            label="Full Name"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({...prev, name : "" }));
            }}
            error={errors.name}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({...prev, email : "" }));
            }}
            error={errors.email}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-medium text-xs text-[var(--color-ink-muted)]">Password</label>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({...prev, password : "" }));
                }}
                className={`bg-white text-[var(--color-ink)] font-sans text-sm rounded-md px-3 py-2 border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] ${
                  errors.password ? 'border-red-500/70' : 'border-[var(--color-hairline-strong)]'
                }`}
              />
              {errors.password && <span className="text-[10px] text-red-500 mt-0.5">⚠ {errors.password}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-medium text-xs text-[var(--color-ink-muted)]">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({...prev, confirmPassword : "" }));
                }}
                className={`bg-white text-[var(--color-ink)] font-sans text-sm rounded-md px-3 py-2 border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] ${
                  errors.confirmPassword ? 'border-red-500/70' : 'border-[var(--color-hairline-strong)]'
                }`}
              />
              {errors.confirmPassword && <span className="text-[10px] text-red-500 mt-0.5">⚠ {errors.confirmPassword}</span>}
            </div>
          </div>
          <Button variant="primary" type="submit" className="w-full mt-2 h-10 font-semibold shadow-sm" disabled={isSigningUp}>
            {isSigningUp ? (
                <span className="flex items-center gap-2">
                  Signing Up
                  <Loader2 className="h-5 w-5 animate-spin" />
                </span>
              ) : (
                "Sign In"
              )}
          </Button>
        </form>
        
        <div className="flex flex-col gap-2 text-center">
          <p className="text-[13px] text-[var(--color-ink-subtle)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--color-ink)] hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
