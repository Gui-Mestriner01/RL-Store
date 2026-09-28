/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';
import Toasts from './components/Toasts.jsx';
import { StoreProvider } from './store/StoreContext.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';

function Roteador() {
  const [rota] = useHashRoute();
  const ehAdmin = rota.startsWith('/admin');

  return (
    <StoreProvider>
      {ehAdmin ? <AdminApp /> : <App />}
      <Toasts />
    </StoreProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Roteador />
  </StrictMode>
);
