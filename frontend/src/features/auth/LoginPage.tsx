import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Loader2 } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { useAuthStore } from './authStore';
import { LoginSchema } from './auth.schema';

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const navigate = useNavigate();

  const validateForm = () => {
    const data = { email, password };
    const validation = LoginSchema.safeParse(data);

    if (!validation.success) {
      const errors = validation.error.format();
      setErrors({
        email: errors.email?._errors[0] || "",
        password: errors.password?._errors[0] || "",
      });
      return false;
    }
    return true;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!validateForm()) return;
    const result = await useAuthStore.getState().login(email, password);
    if(result){
      console.log('User role:', result);
      navigate(`/${result}/dashboard`);
    }
  };

  return (
    <div className="w-screen h-full max-w-[450px] flex flex-col justify-center gap-8 font-sans mx-auto">
      <div className="flex flex-col items-center gap-6 text-center">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo size="lg" />
        </Link>
      </div>

      <Card className="w-full p-8 flex flex-col gap-6 shadow-sm border-[var(--color-hairline)] bg-white rounded-2xl">
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-ink)] tracking-tight">Welcome back</h1>
          <p className="text-sm text-[var(--color-ink-subtle)]">Enter your details to sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }))
            }}
            error={errors.email}
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="font-sans font-medium text-xs text-[var(--color-ink-muted)]">Password</label>
              <Link to="/forgot-password" className="text-xs text-[var(--color-primary)] hover:underline font-medium">Forgot password?</Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }))
              }}
              className={`bg-white text-[var(--color-ink)] font-sans text-sm rounded-md px-3 py-2 border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] ${
                errors.password ? 'border-red-500/70' : 'border-[var(--color-hairline-strong)]'
              }`}
            />
            {errors.password && <span className="text-xs text-red-500 mt-0.5 flex items-center gap-1"><span>⚠</span> {errors.password}</span>}
          </div>
          <Button variant="primary" type="submit" className="w-full mt-2 h-10 font-semibold shadow-sm" disabled={isLoggingIn}>
            {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  Signing In
                  <Loader2 className="h-5 w-5 animate-spin" />
                </span>
              ) : (
                "Sign In"
              )}
          </Button>
        </form>
        <div className="flex flex-col gap-2 text-center">
          <p className="text-[13px] text-[var(--color-ink-subtle)]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--color-ink)] hover:underline font-semibold">Sign up</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
