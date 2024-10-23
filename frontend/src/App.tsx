
import { Routes, Route } from 'react-router-dom';
import MerchPage from './pages/MerchPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="bg-tea min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<MerchPage />} />
      </Routes>
    </div>
  );
}

export default App;
