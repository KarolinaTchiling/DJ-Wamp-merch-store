import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TokenProvider } from './contexts/TokenContext.tsx';
import { CartProvider } from './contexts/cart/CartContext.tsx';
import { MetadataProvider } from './contexts/MetadataContext.tsx';
import App from './App.tsx';
import './index.css';
import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <HashRouter>
      <TokenProvider>
      <MetadataProvider>
          <CartProvider>
              <App />
          </CartProvider>
        </MetadataProvider>
      </TokenProvider>
    </HashRouter>
  //</StrictMode>,
);
