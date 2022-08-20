import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GraphQLClient, ClientContext } from 'graphql-hooks';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const graphqlClient = new GraphQLClient({
  url: 'http://etzer-api.herokuapp.com/persons',
  headers: {
    'Content-Type': 'application/json'
  }
});

root.render(
  <React.StrictMode>
    <ClientContext.Provider value={graphqlClient}>
      <App />
    </ClientContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
