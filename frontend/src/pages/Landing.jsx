import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: 'linear-gradient(135deg, #000000 0%, #E90802 100%)' }}
    >
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-extrabold text-white mb-4 drop-shadow-xl"
        >
          Welcome to the Texas Tech Exam Scheduler
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg text-white mb-8 max-w-xl leading-relaxed"
        >
          Organize all your exams in one place, set reminders, and stay on top of your
          academic game. Designed for Texas Tech students, this tool keeps you on track
          so you can focus on what matters most.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 text-lg font-semibold uppercase tracking-wider rounded-full shadow-lg bg-[#E90802] text-white hover:bg-white hover:text-[#E90802] transition-all duration-300 transform hover:-translate-y-1"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="px-8 py-4 text-lg font-semibold uppercase tracking-wider rounded-full shadow-lg border-2 border-white text-white hover:bg-white hover:text-[#E90802] transition-all duration-300 transform hover:-translate-y-1"
          >
            Login
          </Button>
        </motion.div>
      </main>
      <footer className="py-4 text-center text-white text-sm">
        &copy; {new Date().getFullYear()} Exam Scheduler. Built with ❤️ for Texas Tech.
      </footer>
      <div className="wave-container">
        <svg
          viewBox="0 0 1440 120"
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#FFFFFF"
            d="M0,32L48,48C96,64,192,96,288,106.7C384,117,480,107,576,101.3C672,96,768,96,864,96C960,96,1056,96,1152,90.7C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            opacity=".25"
          />
          <path
            fill="#FFFFFF"
            d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,106.7C672,96,768,96,864,106.7C960,117,1056,139,1152,138.7C1248,139,1344,117,1392,106.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            opacity=".5"
          />
          <path
            fill="#FFFFFF"
            d="M0,80L48,85.3C96,91,192,101,288,117.3C384,133,480,155,576,149.3C672,144,768,112,864,96C960,80,1056,80,1152,80C1248,80,1344,80,1392,80L1440,80L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
}
