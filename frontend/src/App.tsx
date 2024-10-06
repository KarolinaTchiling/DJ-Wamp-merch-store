import { useState } from 'react';
import './App.css';

function App() {
  const [hello, setHello] = useState('hi');

  return (
    <>
      <h1 className="text-4x1 text-blue-500">{hello}</h1>
      <button onClick={() => setHello('Amogus')}>Click me</button>
    </>
  );
}

export default App;
