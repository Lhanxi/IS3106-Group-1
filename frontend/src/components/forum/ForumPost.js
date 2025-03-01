import React from 'react';

const ForumPost = ({ post }) => {
  return (
    <div className="forum-post">
      <h4>{post.title}</h4>
      <p>{post.content}</p>
    </div>
  );
};

export default ForumPost;
