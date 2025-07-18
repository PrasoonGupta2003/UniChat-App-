import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
export const serverUrl = "https://unichat-app-backend.onrender.com";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
  <Provider store={store}> 
    <App /> 
  </Provider>
  </BrowserRouter>
);
