import React from 'react';
import Nav from './Nav';
import Title from './Title';

const MainPageLayout = ({ children }) => {
  return (
    <div>
      <Title title="NBA" subtitle="Are you looking for a player or a game?" />
      <Nav />

      {children}
    </div>
  );
};

export default MainPageLayout;
