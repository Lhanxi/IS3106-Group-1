import React from 'react';
import ForumPost from './ForumPost'; 
const ForumList = () => {
  // Example dummy posts
  const posts = [
    { id: 1, title: "Welcome to the Discussion Board", content: "blah blah" },
    { id: 2, title: "Project Updates", content: " progress and ideas " },
    { id: 3, title: "General Discussion", content: " topic #3" },
  ];

  return (
    <div>
      <h2>Discussion Posts</h2>
      {posts.map((post) => (
        <ForumPost key={post.id} post = {post} /> //maps received posts into format
      ))}
    </div>
  );
};

export default ForumList;
