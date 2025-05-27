// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords must match';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrs = validate();
    if (Object.keys(fieldErrs).length) {
      setErrors(fieldErrs);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.email, password: form.password }),
      });
      const text = await response.text();
      if (!response.ok) throw new Error(text || 'Signup failed');

      // ─── AUTO-LOGIN ON SIGNUP ─────────────────────────────────────────
      const basicToken = btoa(`${form.email}:${form.password}`);
      localStorage.setItem('authToken', basicToken);

      navigate('/home');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900 flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full space-y-6"
        >
          <h2 className="text-2xl font-semibold text-white text-center">
            Create your account
          </h2>

          {serverError && (
            <div role="alert" className="text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <div>
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.confirm && (
              <p className="text-red-300 text-sm mt-1">{errors.confirm}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="solid"
            className="w-full"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <p className="text-center text-white">
            Already have an account?{' '}
            <button
              type="button"
              className="underline"
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}

