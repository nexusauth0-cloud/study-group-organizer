import React from 'react';
import { resourceAPI } from '../../services/api';
import { FiFile, FiDownload, FiTrash2, FiBookOpen } from 'react-icons/fi';
import EmptyState from '../common/EmptyState';

const ResourceList = ({ resources, onUpdate, groupId }) => {
  const handleDownload = async (resourceId) => {
    try {
      await resourceAPI.download(groupId, resourceId);
      if (onUpdate) onUpdate();
    } catch { /* ignore */ }
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm('Delete this resource?')) {
      try {
        await resourceAPI.delete(groupId, resourceId);
        if (onUpdate) onUpdate();
      } catch { /* ignore */ }
    }
  };

  if (!resources?.length) {
    return <EmptyState icon={FiBookOpen} title="No resources yet" description="Upload notes, assignments, and reference materials." />;
  }

  return (
    <div className="space-y-3">
      {resources.map(resource => (
        <div key={resource._id} className="card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
            <FiFile className="text-primary-600" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-semibold truncate">{resource.title}</h4>
              <span className="badge bg-gray-100 dark:bg-gray-700 text-xs">{resource.category}</span>
              {resource.isCollaborative && <span className="badge bg-green-100 text-green-700 text-xs">Collab</span>}
            </div>
            {resource.description && <p className="text-sm text-gray-500 truncate">{resource.description}</p>}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span>by {resource.uploadedBy?.name || 'Unknown'}</span>
              {resource.fileSize > 0 && <span>{(resource.fileSize / 1024).toFixed(0)} KB</span>}
              <span>{resource.downloads || 0} downloads</span>
              {resource.tags?.length > 0 && resource.tags.map((t, i) => (
                <span key={i} className="badge bg-gray-50 dark:bg-gray-700 text-xs">{t}</span>
              ))}
            </div>
            {resource.content && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
                {resource.content}
              </div>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {resource.fileUrl && (
              <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer"
                onClick={() => handleDownload(resource._id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-primary-600">
                <FiDownload size={16} />
              </a>
            )}
            <button onClick={() => handleDelete(resource._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceList;
