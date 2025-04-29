import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { RestaurantProvider } from './contexts/RestaurantContext';
import App from './App.jsx';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RestaurantProvider>
        <ToastContainer />
        <App />
      </RestaurantProvider>
    </ThemeProvider>
  </StrictMode>
);