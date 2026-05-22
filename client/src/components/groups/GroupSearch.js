import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const GroupSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text" value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="Search groups by name, subject, or keyword..."
        className="input-field pl-10 pr-4 py-3"
      />
    </form>
  );
};

export default GroupSearch;
