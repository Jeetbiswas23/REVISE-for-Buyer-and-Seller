'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/db';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<'buyer' | 'supplier'>('supplier');
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user
      const user = createUser({
        email: formData.email,
        fullName: formData.fullName,
        company: formData.company,
        role,
      });

      // Store current user in session storage
      sessionStorage.setItem('currentUser', JSON.stringify(user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-border rounded-lg p-8 bg-card">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-wider text-muted-foreground mb-2">
            CREATE ACCOUNT
          </p>
          <h1 className="text-4xl font-bold text-foreground">Join REVERSE</h1>
        </div>

        {/* Role Selection */}
        <div className="flex gap-3 mb-8">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex-1 py-3 px-4 border rounded transition-colors ${
              role === 'buyer'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card text-foreground hover:bg-secondary'
            }`}
          >
            BUYER
          </button>
          <button
            type="button"
            onClick={() => setRole('supplier')}
            className={`flex-1 py-3 px-4 border rounded transition-colors ${
              role === 'supplier'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card text-foreground hover:bg-secondary'
            }`}
          >
            SUPPLIER
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs tracking-wider text-muted-foreground block mb-3">
              FULL NAME
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-xs tracking-wider text-muted-foreground block mb-3">
              COMPANY
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Your company"
            />
          </div>

          <div>
            <label className="text-xs tracking-wider text-muted-foreground block mb-3">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs tracking-wider text-muted-foreground block mb-3">
              PASSWORD (MIN 6 CHARS)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity mt-6"
          >
            Create account →
          </button>
        </form>

        {/* Sign in link */}
        <div className="mt-6 text-sm text-foreground">
          Have an account?{' '}
          <button
            onClick={() => router.push('/signin')}
            className="underline text-accent hover:text-accent/80"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
