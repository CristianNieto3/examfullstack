import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

export default function EditExam() {
  const navigate = useNavigate();
  const { id: examId } = useParams(); // Get exam ID from URL
  const [form, setForm] = useState({
    course: '',
    date: '',
    time: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // For loading existing exam data

  useEffect(() => {
    async function fetchExamData() {
      setPageLoading(true);
      setServerErrors([]);
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const res = await fetch(`/api/exams/${examId}`, { // Fetch specific exam
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login', { replace: true });
          return;
        }
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch exam details');
        }

        const data = await res.json();
        // The API might return examDate with T and Z, so we need to format it for the input fields
        const examDateTime = new Date(data.examDate);
        const dateFormatted = examDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeFormatted = examDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); // HH:MM

        setForm({
          course: data.subject || '',
          date: dateFormatted || '',
          time: timeFormatted || '',
          location: data.location || '',
        });
      } catch (err) {
        setServerErrors([err.message || 'Something went wrong while fetching exam data.']);
      } finally {
        setPageLoading(false);
      }
    }
    if (examId) {
      fetchExamData();
    }
  }, [examId, navigate]);

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

      // build a full ISO string with seconds & millis
      const examDateTimeISO = new Date(`${form.date}T${form.time}:00`).toISOString();

      const res = await fetch(`/api/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({
          subject:  form.course,
          examDate: examDateTimeISO,   // now "2025-10-03T10:30:00.000Z"
          location: form.location,
        }),
      });

      // read response body exactly once
      const raw = await res.text();
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        body = null;
      }

      if (!res.ok) {
        let msgs = [];
        if (body?.errors && Array.isArray(body.errors)) {
          msgs = body.errors;
        } else if (body?.message) {
          msgs = [body.message];
        } else if (body?.error) {
          msgs = [body.error];
        } else {
          msgs = [raw || 'Failed to update exam'];
        }
        setServerErrors(msgs);
        return;
      }

      navigate('/exams', { replace: true });
    } catch (err) {
      setServerErrors([err.message]);
    } finally {
      setLoading(false);
    }
  };


  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-red-900 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-white" size={48} />
        <p className="text-white mt-4">Loading Exam Details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full space-y-6"
        >
          <h2 className="text-2xl font-semibold text-white text-center">
            Edit Exam
          </h2>

          {serverErrors.length > 0 && (
            <ul className="text-red-300 text-sm space-y-1 p-4 bg-red-900 bg-opacity-50 rounded-md" role="alert">
              {serverErrors.map((err, i) => (
                <li key={i}>• {err}</li>
              ))}
            </ul>
          )}

          <div>
            <label htmlFor="course" className="block text-white mb-1">Subject</label>
            <input
              id="course"
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.course && (
              <p className="text-red-300 text-sm mt-1">{errors.course}</p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-white mb-1">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.date && (
              <p className="text-red-300 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="block text-white mb-1">Time</label>
            <input
              id="time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.time && (
              <p className="text-red-300 text-sm mt-1">{errors.time}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-white mb-1">Location</label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.location && (
              <p className="text-red-300 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <div className="flex space-x-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/exams', { replace: true })}
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || pageLoading}
              variant="solid"
              className="w-1/2 flex-1"
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
} 