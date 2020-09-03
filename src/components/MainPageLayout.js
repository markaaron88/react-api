import React from 'react';
import Nav from './Nav';
import Title from './Title';

const MainPageLayout = ({ children }) => {
  return (
    <div>
      <Title title="Movies" subtitle="Are you looking for a movie or actor" />
      <Nav />

      {children}
    </div>
  );
};

export default MainPageLayout;
