import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for PWA & Offline Emergency Data Caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[CareReach] Offline ServiceWorker active with scope:', registration.scope);
      })
      .catch((err) => {
        console.log('[CareReach] ServiceWorker registration note:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);

