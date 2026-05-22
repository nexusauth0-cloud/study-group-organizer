import React, { useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MessageList = ({ messages, loading }) => {
  const { user } = useAuth();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return <div className="flex-1 flex items-center justify-center text-gray-500">Loading messages...</div>;

  if (!messages?.length) {
    return <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">No messages yet. Start the conversation!</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map(msg => {
        const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
        return (
          <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] sm:max-w-[70%] ${isMine ? 'order-1' : 'order-1'}`}>
              {!isMine && (
                <p className="text-xs text-gray-500 mb-1 ml-1">{msg.sender?.name || 'Unknown'}</p>
              )}
              <div className={`rounded-2xl px-4 py-2.5 ${
                isMine ? 'bg-primary-500 text-white rounded-br-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
              }`}>
                {msg.messageType === 'image' ? (
                  <img src={msg.fileUrl} alt="" className="max-w-full rounded-lg" />
                ) : msg.messageType === 'file' ? (
                  <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="underline flex items-center gap-1">
                    📎 {msg.content || 'File'}
                  </a>
                ) : (
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                )}
              </div>
              <p className={`text-[10px] text-gray-400 mt-1 ${isMine ? 'text-right mr-1' : 'ml-1'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
