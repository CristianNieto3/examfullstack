// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
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
      // build basic auth token and test on protected route
      const credentials = btoa(`${form.email}:${form.password}`);
      const res = await fetch('/api/exams/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentials}`,
        },
      });

      if (res.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (!res.ok) {
        throw new Error('Login failed');
      }

      // on success, store token and go to dashboard
      localStorage.setItem('authToken', credentials);
      navigate('/home', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900 flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full space-y-6"
        >
          <h2 className="text-2xl font-semibold text-white text-center">
            Welcome Back
          </h2>

          {serverError && (
            <div role="alert" className="text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <div>
            <label className="block text-white mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-white mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute inset-y-0 right-3 flex items-center text-white"
              tabIndex={-1}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="solid"
            className="w-full flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : ''}
            {loading ? 'Logging In…' : 'Log In'}
          </Button>

          <p className="text-center text-white">
            Don’t have an account?{' '}
            <button
              type="button"
              className="underline"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </p>
        </motion.form>
      </main>
    </div>
  );
}
