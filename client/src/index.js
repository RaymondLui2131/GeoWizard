import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './dist/output.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { UserContextProvider } from './auth/UserContext.js'
import { MapContextProvider } from './map/MapContext.js'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <GoogleOAuthProvider clientId='1093090289019-21ekfvlhv6s9vrmuf58eh72kp8ki173t.apps.googleusercontent.com'>
        <MapContextProvider>
          <App />
        </MapContextProvider>
      </GoogleOAuthProvider>
    </UserContextProvider>
  </React.StrictMode>
)
