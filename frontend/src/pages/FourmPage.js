import React from 'react';
import './ForumPage.css';
import FilterPanel from '../components/forum/FilterPanel';
import ForumList from '../components/forum/ForumList'; // import all the posts
//import AnnouncementCalendar from '../components/AnnouncementCalendar';

const ForumPage = () => {
  return (
    <div className="forum-page">
      <div className="left-column">
        <FilterPanel />
      </div>
      <div className="middle-column">
        <ForumList />
      </div>
      <div className="right-column">
        <h1>announcements</h1>
        {/*        <AnnouncementCalendar /> */}
      </div>
    </div>
  );
};

export default ForumPage;
