import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../lib/db.js';

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex bg-black text-white">

      {/* LEFT SECTION */}
      <div className="w-1/2 hidden lg:flex flex-col justify-between py-16 pl-20 pr-16 bg-zinc-950 relative">

        {/* Top label */}
        <p className="text-[11px] tracking-[0.35em] text-gray-500 uppercase font-medium fade-in">
          Reverse · Auction OS
        </p>

        {/* Main Content */}
        <div className="max-w-xl slide-up">
          <h1 className="text-[46px] font-semibold leading-[1.12] tracking-tight mb-6">
            Procurement bidding,
            <br />
            built for operators.
          </h1>

          <p className="text-gray-400 text-[17px] leading-[1.7] max-w-md">
            Run British-style reverse auctions across freight, transit, and
            service lanes. Live ranking, auto-extensions, transparent activity logs.
          </p>
        </div>

        {/* Bottom features */}
        <div className="flex gap-16 fade-in">
          <div>
            <p className="text-[10px] uppercase text-gray-500 tracking-[0.2em] font-medium">Live</p>
            <p className="mt-2 text-white text-[15px] font-medium">Ranking</p>
          </div>

          <div>
            <p className="text-[10px] uppercase text-gray-500 tracking-[0.2em] font-medium">Auto</p>
            <p className="mt-2 text-white text-[15px] font-medium">Extensions</p>
          </div>

          <div>
            <p className="text-[10px] uppercase text-gray-500 tracking-[0.2em] font-medium">Full</p>
            <p className="mt-2 text-white text-[15px] font-medium">Audit Trail</p>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>
      </div>


      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-12">

        <div className="w-full max-w-[400px] slide-up">

          {/* Header */}
          <div className="mb-10">
            <p className="text-[11px] tracking-[0.35em] text-gray-500 uppercase font-medium mb-3">
              Sign in
            </p>
            <h2 className="text-[32px] font-semibold tracking-tight leading-tight">
              Access your dashboard
            </h2>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/30 text-red-400 text-[13px] bg-red-500/10">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1.5">Email</label>
              <input
                type="email"
                className="w-full bg-zinc-900 rounded-xl p-3.5 text-[15px] text-white border border-transparent focus:outline-none focus:border-zinc-600 transition-colors"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1.5">Password</label>
              <input
                type="password"
                className="w-full bg-zinc-900 rounded-xl p-3.5 text-[15px] text-white border border-transparent focus:outline-none focus:border-zinc-600 transition-colors"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                disabled={loading}
              />
              <p className="text-[11px] text-gray-600 mt-2">Password can be anything for demo</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-zinc-900 rounded-xl py-4 hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-[14px] font-bold tracking-wide disabled:opacity-50 mt-4"
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          {/* Create account */}
          <p className="text-[13px] text-gray-400 mt-8 mb-8">
            No account?{' '}
            <Link to="/signup" className="underline cursor-pointer text-white hover:text-gray-300 transition-colors">
              Create one
            </Link>
          </p>

          {/* Demo Accounts */}
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <p className="uppercase text-[10px] text-gray-500 tracking-[0.2em] font-medium mb-4">Demo Accounts</p>
            <div className="space-y-3">
              <p
                className="cursor-pointer hover:text-white transition-colors text-gray-400 text-[13px]"
                onClick={() => handleDemoLogin('buyer@acmelogistics.com')}
              >
                → buyer@acmelogistics.com / any password
              </p>
              <p
                className="cursor-pointer hover:text-white transition-colors text-gray-400 text-[13px]"
                onClick={() => handleDemoLogin('supplier1@bluelinefreight.com')}
              >
                → supplier1@bluelinefreight.com / any password
              </p>
              <p
                className="cursor-pointer hover:text-white transition-colors text-gray-400 text-[13px]"
                onClick={() => handleDemoLogin('supplier2@example.com')}
              >
                → supplier2@example.com / any password
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Signin;
