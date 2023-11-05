import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import HomeScreen from './components/HomeScreen'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
