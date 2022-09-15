import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routing from './components/Routing';
import { LocalStorageProvider } from "./contexts/LocalStorageContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LocalStorageProvider>
      <Routing />
    </LocalStorageProvider>
  </React.StrictMode>
);
