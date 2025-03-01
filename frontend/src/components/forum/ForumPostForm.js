import React, { useState } from 'react';

function ForumPostForm({ addPost }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      addPost(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post here..."
        rows="4"
        style={{ width: '100%', padding: '10px' }}
      />
      <button type="submit">Post</button>
    </form>
  );
}

export default ForumPostForm;
