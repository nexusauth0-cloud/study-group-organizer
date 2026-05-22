import React, { useState, useRef } from 'react';
import { FiSend, FiPaperclip } from 'react-icons/fi';

const MessageInput = ({ onSend, onTyping }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const typingTimeout = useRef();
  const fileRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    const formData = new FormData();
    formData.append('content', text);
    if (file) formData.append('file', file);
    onSend(formData);
    setText('');
    setFile(null);
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (onTyping) {
      onTyping();
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {}, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
      {file && (
        <div className="mb-2 flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
          <span className="text-sm truncate flex-1">{file.name}</span>
          <button type="button" onClick={() => setFile(null)} className="text-red-500 text-sm">Remove</button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => fileRef.current?.click()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400">
          <FiPaperclip size={18} />
        </button>
        <input ref={fileRef} type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
        <input
          type="text" value={text} onChange={handleChange}
          placeholder="Type a message..." className="input-field flex-1" maxLength={5000}
        />
        <button type="submit" disabled={!text.trim() && !file} className="btn-primary rounded-full p-2.5 disabled:opacity-50">
          <FiSend size={18} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
