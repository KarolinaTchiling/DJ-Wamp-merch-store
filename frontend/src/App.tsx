
import { Routes, Route } from 'react-router-dom';
import MerchPage from './pages/MerchPage';
import Navbar from './components/Navbar';
import TestPage from './pages/TestPage';

function App() {
  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<MerchPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;
