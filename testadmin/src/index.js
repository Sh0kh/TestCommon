import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import client from "./apollo/client.js";

const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендеринг приложения с ApolloProvider и StrictMode
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// Отчет о производительности
reportWebVitals();
