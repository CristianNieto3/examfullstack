import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import { Loader2, CalendarDays, Clock, MapPin, Edit3, ArrowLeft, CalendarPlus } from 'lucide-react';
import * as ics from 'ics';

export default function ViewExam() {
  const navigate = useNavigate();
  const { id: examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchExamData() {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const res = await fetch(`/api/exams/${examId}`, {
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
        setExam(data);
      } catch (err) {
        setError(err.message || 'Something went wrong while fetching exam data.');
      } finally {
        setLoading(false);
      }
    }
    if (examId) {
      fetchExamData();
    }
  }, [examId, navigate]);

  const handleAddToCalendar = () => {
    if (!exam) return;

    const eventStartTime = new Date(exam.examDate);
    const eventEndTime = new Date(eventStartTime.getTime() + 2 * 60 * 60 * 1000); // Assume 2-hour duration

    const event = {
      title: exam.subject,
      description: `Exam for ${exam.subject}`,
      location: exam.location || '',
      start: [
        eventStartTime.getFullYear(),
        eventStartTime.getMonth() + 1, // Month is 0-indexed
        eventStartTime.getDate(),
        eventStartTime.getHours(),
        eventStartTime.getMinutes(),
      ],
      end: [
        eventEndTime.getFullYear(),
        eventEndTime.getMonth() + 1,
        eventEndTime.getDate(),
        eventEndTime.getHours(),
        eventEndTime.getMinutes(),
      ],
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
    };

    const { error: icsError, value: icsFileContent } = ics.createEvent(event);

    if (icsError) {
      console.error('Failed to create .ics file', icsError);
      // Optionally, show an error to the user
      alert('Sorry, there was an error creating the calendar file.');
      return;
    }

    if (icsFileContent) {
      const blob = new Blob([icsFileContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${exam.subject.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_exam.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-red-900 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-white" size={48} />
        <p className="text-white mt-4">Loading Exam Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-red-900 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center">
          <p className="text-red-300 text-center text-xl mb-6 bg-red-900 bg-opacity-50 p-6 rounded-xl">{error}</p>
          <Button onClick={() => navigate('/exams')} variant="outline">
            <ArrowLeft size={18} className="mr-2" /> Go Back to Exams
          </Button>
        </main>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-red-900 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-6 py-12 text-center">
          <p className="text-gray-300 text-xl">Exam not found.</p>
          <Button onClick={() => navigate('/exams')} variant="outline" className="mt-6">
             <ArrowLeft size={18} className="mr-2" /> Go Back to Exams
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
          <div className="bg-red-700 p-6">
            <h1 className="text-3xl font-bold text-white truncate" title={exam.subject}>{exam.subject}</h1>
          </div>
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start space-x-4">
              <CalendarDays className="text-red-600 h-7 w-7 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="text-lg font-semibold text-gray-900">{new Date(exam.examDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="text-red-600 h-7 w-7 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Time</h3>
                <p className="text-lg font-semibold text-gray-900">{new Date(exam.examDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            {exam.location && (
              <div className="flex items-start space-x-4">
                <MapPin className="text-red-600 h-7 w-7 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="text-lg font-semibold text-gray-900 break-words">{exam.location}</p>
                </div>
              </div>
            )}
            
            {/* Add more details here if available, e.g., notes, attachments etc. */}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              variant="outline"
              onClick={() => navigate('/exams')}
              className="w-full sm:w-auto"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to All Exams
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 w-full sm:w-auto space-y-3 sm:space-y-0">
                <Button 
                  variant="outline" 
                  onClick={handleAddToCalendar}
                  className="w-full sm:w-auto"
                >
                  <CalendarPlus size={18} className="mr-2" />
                  Add to Calendar
                </Button>
                <Button 
                  variant="solid"
                  onClick={() => navigate(`/exams/${examId}`)} // Link to the existing edit page
                  className="w-full sm:w-auto"
                >
                  <Edit3 size={18} className="mr-2" />
                  Edit Exam
                </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 