// src/pages/Exams.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Eye, Trash2, CalendarDays, Clock, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';

export default function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadExams() {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const res = await fetch('/api/exams/all', {
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
        if (!res.ok) throw new Error('Failed to fetch exams');

        const data = await res.json();
        setExams(data || []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    loadExams();
  }, [navigate]);

  const handleView = (id) => {
    navigate(`/exams/view/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam?')) return;
    setLoading(true);
    setError('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const res = await fetch(`/api/exams/${id}`, {
        method: 'DELETE',
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
      if (!res.ok) throw new Error('Failed to delete exam');

      setExams((prev) => prev.filter((exam) => exam.id !== id));
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">All Exams</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-white" size={48} />
          </div>
        ) : error ? (
          <p className="text-red-300 text-center mb-6">{error}</p>
        ) : exams.length === 0 ? (
          <motion.p
            className="text-gray-300 text-center mt-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            No exams scheduled. Click "Add Exam" to get started.
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {exams.map((exam) => (
              <motion.div
                key={exam.id}
                className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border-t-4 border-red-600"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 truncate" title={exam.subject}>
                    {exam.subject}
                  </h2>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center">
                      <CalendarDays size={16} className="mr-2 text-red-600 flex-shrink-0" />
                      <span className="font-medium">{new Date(exam.examDate).toLocaleDateString()}</span>
                    </p>
                    <p className="flex items-center">
                      <Clock size={16} className="mr-2 text-red-600 flex-shrink-0" />
                      <span className="font-medium">{new Date(exam.examDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                    {exam.location && (
                      <p className="flex items-center">
                        <MapPin size={16} className="mr-2 text-red-600 flex-shrink-0" />
                        <span className="font-medium truncate" title={exam.location}>{exam.location}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleView(exam.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-md"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(exam.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-md"
                    title="Delete Exam"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
