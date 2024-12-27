import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TokenProvider } from './components/TokenContext.tsx';
import { CartProvider } from './cart/CartContext.tsx';
import App from './App.tsx';
import './index.css';
import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TokenProvider>
        <CartProvider>
            <App />
        </CartProvider>
      </TokenProvider>
    </HashRouter>
  </StrictMode>,
);
