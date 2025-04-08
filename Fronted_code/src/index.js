import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="dev-omeybg5mdvxafsyn.us.auth0.com"  // Ensure this matches your Auth0 domain
    clientId="ThEd5hd6Gdxx0e9DNrnClEQmf0PioY4a" // Ensure this matches your Auth0 clientId
    authorizationParams={{
      redirect_uri: window.location.origin  // Ensure redirect_uri is correct
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
);

reportWebVitals(console.log);
