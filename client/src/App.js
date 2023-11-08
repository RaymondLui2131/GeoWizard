import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import HomeScreen from './components/HomeScreen'
import EditUpload from './components/EditUploadScreen'
import EditingMap from './components/EditingMapScreen'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/editUpload" element={<EditUpload />} />
        <Route path="/editingMap" element={<EditingMap />} />
        <Route path="/" element={<HomeScreen />} />
        
      </Routes>
    </BrowserRouter>
  )
  
}

export default App
