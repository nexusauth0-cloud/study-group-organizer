import React, { useState, useEffect, useCallback } from 'react';
import { groupAPI } from '../services/api';
import GroupList from '../components/groups/GroupList';
import GroupSearch from '../components/groups/GroupSearch';
import CreateGroup from '../components/groups/CreateGroup';


const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadGroups = useCallback(async (q) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await groupAPI.getAll({ search: q, limit: 50 });
      setGroups(data.groups);
    } catch (err) {
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  const handleSearch = (query) => {
    setSearch(query);
    loadGroups(query);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Study Groups</h1>
          <p className="text-gray-500">Discover and join study groups in your subjects.</p>
        </div>
        <CreateGroup onCreated={() => loadGroups(search)} />
      </div>
      <GroupSearch onSearch={handleSearch} />
      <GroupList groups={groups} loading={loading} error={error} />
    </div>
  );
};

export default Groups;
