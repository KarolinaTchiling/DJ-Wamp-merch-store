import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MerchPage from './pages/MerchPage';
import Navbar from './components/Navbar';
import TestPage from './pages/TestPage';
import LogInPage from "./pages/LogInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Shared search state

  const handleSearch = (query: string) => {
    setSearchQuery(query); // Update search query from Navbar
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navbar onSearch={handleSearch}  />
      <Routes>
        <Route path="/" element={<MerchPage searchQuery={searchQuery}/>} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;

