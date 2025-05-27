// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Plus, CalendarPlus, CalendarDays, Clock, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';

export default function Home() {
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
        // No token → redirect to login
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
          // Invalid credentials → clear and redirect
          localStorage.removeItem('authToken');
          navigate('/login', { replace: true });
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch exams');
        }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Your Upcoming Exams</h1>
          <Button
            variant="solid"
            className="flex items-center space-x-2"
            onClick={() => navigate('/add')}
          >
            <Plus size={20} />
            <span>Add Exam</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-white" size={48} />
          </div>
        ) : error ? (
          <p className="text-red-300 text-center mt-10">{error}</p>
        ) : exams.length === 0 ? (
          <motion.div
            className="text-center mt-16 p-8 bg-white/5 backdrop-blur-md rounded-xl shadow-lg max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex justify-center mb-6">
              <CalendarPlus size={64} className="text-red-400" />
            </div>
            <h2 className="text-3xl font-semibold text-white mb-3">
              Ready to Get Organized?
            </h2>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              It looks like you haven't scheduled any exams yet.
              <br />
              Take control of your semester by adding your first exam!
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Pro Tip: Staying ahead of your schedule is the first step to acing your courses.
            </p>
            <Button
              variant="solid"
              className="flex items-center space-x-2 mx-auto text-lg px-6 py-3"
              onClick={() => navigate('/add')}
            >
              <Plus size={22} />
              <span>Schedule Your First Exam</span>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {exams.map((exam) => (
              <motion.div
                key={exam.id}
                className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg flex flex-col justify-between transition-all duration-300 border-t-4 border-red-600 hover:shadow-xl"
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
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
