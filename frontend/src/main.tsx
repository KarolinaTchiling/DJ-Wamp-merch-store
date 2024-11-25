import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TokenProvider } from './TokenContext'; 
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TokenProvider>
        <App />
      </TokenProvider>
    </BrowserRouter>
  </StrictMode>,
);
