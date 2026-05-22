import React from 'react';
import MentorList from '../components/mentor/MentorList';
import MentorRequests from '../components/mentor/MentorRequest';
import { FiStar, FiSend } from 'react-icons/fi';

const Mentors = () => {
  const [tab, setTab] = React.useState('browse');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mentors</h1>
        <p className="text-gray-500">Connect with experienced mentors for guidance.</p>
      </div>
      <div className="flex gap-2 border-b dark:border-gray-700 pb-2">
        <button onClick={() => setTab('browse')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${tab === 'browse' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <FiStar size={16} /> Browse Mentors
        </button>
        <button onClick={() => setTab('requests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${tab === 'requests' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <FiSend size={16} /> My Requests
        </button>
      </div>
      {tab === 'browse' ? <MentorList /> : <MentorRequests />}
    </div>
  );
};

export default Mentors;
