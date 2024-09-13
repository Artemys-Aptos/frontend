// App.tsx

import React from 'react';
import EventsList from '@/components/EventList';

const Event: React.FC = () => {
  return (
    <div>
      <h1>Aptos Events Viewer</h1>
      <EventsList />
    </div>
  );
};

export default Event;
