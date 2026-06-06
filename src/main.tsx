import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LocaleProvider } from './LocaleContext.tsx';
import { ToastProvider } from './components/ToastContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LocaleProvider>
  </StrictMode>,
);
