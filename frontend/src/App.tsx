import React, { useState } from 'react';
import { BrowserRouter as Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TestPage from './pages/TestPage';
import LogInPage from "./pages/LogInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import DetailPage from "./pages/DetailPage.tsx";
import MerchPage from "./pages/MerchPage.tsx";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Shared search state

  const handleSearch = (query: string) => {
    setSearchQuery(query); // Update search query from Navbar
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navbar onSearch={handleSearch}  />
      <Routes>
        <Route path="/" element={<Navigate to="/catalog/products" replace />} />

        <Route path="/catalog/products" element={<MerchPage searchQuery={searchQuery}/>} />
        <Route path="/catalog/products/:name" element={<DetailPage />} />

        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;

