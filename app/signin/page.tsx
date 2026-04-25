'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserByEmail } from '@/lib/db';

export default function SigninPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Find user by email (simplified - no password check)
      const user = getUserByEmail(formData.email);
      if (!user) {
        setError('User not found');
        return;
      }

      // Store current user in session storage
      sessionStorage.setItem('currentUser', JSON.stringify(user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-border rounded-lg p-8 bg-card">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-wider text-muted-foreground mb-2">SIGN IN</p>
          <h1 className="text-4xl font-bold text-foreground">Welcome Back</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/50 rounded text-sm text-destructive">
              {error}
            </div>
          )}

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
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity mt-6"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Sign up link */}
        <div className="mt-6 text-sm text-foreground">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="underline text-accent hover:text-accent/80"
          >
            Sign up
          </button>
        </div>

        {/* Demo info */}
        <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground">
          <p className="mb-2 font-semibold">Demo Accounts:</p>
          <p>Buyer: buyer@acmelogistics.com</p>
          <p>Supplier: supplier1@bluelinefreight.com</p>
        </div>
      </div>
    </div>
  );
}
