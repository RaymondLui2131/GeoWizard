import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './dist/output.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='1093090289019-21ekfvlhv6s9vrmuf58eh72kp8ki173t.apps.googleusercontent.com'>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
)
