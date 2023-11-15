import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './dist/output.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { UserContextProvider } from './auth/UserContext.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <GoogleOAuthProvider clientId='1093090289019-21ekfvlhv6s9vrmuf58eh72kp8ki173t.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </UserContextProvider>
  </React.StrictMode>
)
