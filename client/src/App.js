import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
