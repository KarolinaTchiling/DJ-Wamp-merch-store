import React from 'react';
import Sidebar from '../components/Sidebar';

const MerchPage: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="border border-black p-4 flex-grow">
        <h1>Welcome to the Merch Page!</h1> {/* Ensure there's visible content */}
      </div>
    </div>
  );
};

export default MerchPage;