import React from 'react';
import GroupCard from './GroupCard';
import EmptyState from '../common/EmptyState';
import Loading from '../common/Loading';
import { FiUsers } from 'react-icons/fi';

const GroupList = ({ groups, loading, error }) => {
  if (loading) return <Loading text="Loading groups..." />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!groups?.length) {
    return <EmptyState icon={FiUsers} title="No groups found" description="Create or join a study group to get started." />;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map(group => <GroupCard key={group._id} group={group} />)}
    </div>
  );
};

export default GroupList;
