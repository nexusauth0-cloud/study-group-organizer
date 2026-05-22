import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiCalendar, FiBookOpen, FiMessageSquare, FiStar, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) navigate('/dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-primary-600">StudyGroup</h1>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary text-sm">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Study Together, <span className="text-primary-600">Achieve More</span></h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Connect with students, tutors, and mentors. Create study groups, schedule sessions, share resources, and learn together in real-time.
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
            Join for Free <FiArrowRight />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: FiUsers, title: 'Study Groups', desc: 'Create or join groups by subject, topic, or interest.' },
            { icon: FiCalendar, title: 'Smart Scheduling', desc: 'Schedule sessions, set reminders, and sync with your calendar.' },
            { icon: FiBookOpen, title: 'Shared Resources', desc: 'Upload, annotate, and collaborate on notes and documents.' },
            { icon: FiMessageSquare, title: 'Real-time Chat', desc: 'Chat with text, images, and emojis in group channels.' },
            { icon: FiStar, title: 'Mentor Connection', desc: 'Find mentors, request guidance, and rate your experience.' },
            { icon: FiUsers, title: 'Video Calls', desc: 'Face-to-face study sessions with WebRTC video calling.' },
          ].map((feature, i) => (
            <div key={i} className="card text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
