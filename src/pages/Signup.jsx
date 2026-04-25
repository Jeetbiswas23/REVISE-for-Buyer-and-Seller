import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../lib/db.js';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('supplier');
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!form.name || !form.company || !form.email) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const user = await registerUser({
        email: form.email,
        fullName: form.name,
        company: form.company,
        password: form.password,
        role,
      });

      sessionStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-12">

      {/* Container Box */}
      <div className="w-full max-w-[460px] bg-zinc-900 rounded-xl p-8 slide-up shadow-2xl">

        {/* Header */}
        <div className="mb-6">
          <p className="text-[11px] tracking-[0.35em] text-gray-500 uppercase font-medium mb-2">
            Create Account
          </p>
          <h2 className="text-[30px] font-semibold tracking-tight leading-tight">
            Join REVERSE
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 text-red-400 text-[13px] bg-red-500/10">
            {error}
          </div>
        )}

        {/* Role Toggle */}
        <div className="flex bg-zinc-800 p-1.5 rounded-xl mb-8">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`w-1/2 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              role === 'buyer'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            BUYER
          </button>

          <button
            type="button"
            onClick={() => setRole('supplier')}
            className={`w-1/2 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              role === 'supplier'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            SUPPLIER
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-zinc-800 rounded-lg p-3 text-[15px] text-white border border-transparent focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Company</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-zinc-800 rounded-lg p-3 text-[15px] text-white border border-transparent focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-zinc-800 rounded-lg p-3 text-[15px] text-white border border-transparent focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Password (min 6 chars)</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-zinc-800 rounded-lg p-3 text-[15px] text-white border border-transparent focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-zinc-900 rounded-xl py-3.5 hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-sm font-bold tracking-wide disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6 pt-6 border-t border-zinc-800">
          Have an account?{' '}
          <Link to="/signin" className="underline cursor-pointer text-white hover:text-gray-300 transition-colors">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
