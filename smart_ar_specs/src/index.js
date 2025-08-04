import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ProductsList from './productsList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <ProductsList />
  </React.StrictMode>
);
