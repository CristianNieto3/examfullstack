// src/pages/AddExam.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';

export default function AddExam() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    course: '',
    date: '',
    time: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]); // array of strings
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.course)   errs.course   = 'Subject cannot be blank';
    if (!form.date)     errs.date     = 'Exam date is required';
    if (!form.time)     errs.time     = 'Time is required';
    if (!form.location) errs.location = 'Location cannot be left blank';

    // Date validation: cannot be in the past
    if (form.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
      const selectedDate = new Date(form.date + 'T00:00:00'); // Ensure date is parsed as local, not UTC

      if (selectedDate < today) {
        errs.date = 'Exam date cannot be in the past';
      }
    }
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) client-side validation
    const fieldErrs = validate();
    if (Object.keys(fieldErrs).length) {
      setErrors(fieldErrs);
      return;
    }

    setLoading(true);
    setServerErrors([]);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch('/api/exams/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({
          subject:  form.course,
          examDate: form.date,
          examTime: form.time,
          location: form.location,
        }),
      });

      if (!res.ok) {
        // try to parse JSON errors
        let msgs = [];
        try {
          const body = await res.json();
          if (Array.isArray(body.errors)) {
            msgs = body.errors;
          } else if (body.message) {
            msgs = [body.message];
          } else {
            // collect any other values
            msgs = Object.values(body).flat();
          }
        } catch {
          const text = await res.text();
          msgs = [text || 'Failed to add exam'];
        }
        setServerErrors(msgs);
        return;
      }

      // on success
      navigate('/exams', { replace: true });

    } catch (err) {
      setServerErrors([err.message]);
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
            Schedule a New Exam
          </h2>

          {serverErrors.length > 0 && (
            <ul className="text-red-300 text-sm space-y-1" role="alert">
              {serverErrors.map((err, i) => (
                <li key={i}>• {err}</li>
              ))}
            </ul>
          )}

          <div>
            <label className="block text-white mb-1">Subject</label>
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.course && (
              <p className="text-red-300 text-sm mt-1">{errors.course}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-1">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.date && (
              <p className="text-red-300 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-1">Time</label>
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.time && (
              <p className="text-red-300 text-sm mt-1">{errors.time}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-1">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.location && (
              <p className="text-red-300 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/exams', { replace: true })}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="solid"
              className="flex-1"
            >
              {loading ? 'Saving…' : 'Save Exam'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
