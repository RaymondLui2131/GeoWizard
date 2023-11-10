import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Build1LoginScreen from './components/Build1LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import HomeScreen from './components/HomeScreen'
import EditUpload from './components/EditUploadScreen'
import EditingMap from './components/EditingMapScreen'
import LoginScreen from './components/LoginScreen'
import CreateAccountScreen from './components/CreateAccountScreen'
import ProfileScreen from "./components/ProfileScreen"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<Build1LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/editUpload" element={<EditUpload />} />
        <Route path="/editingMap" element={<EditingMap />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/createAccount" element={<CreateAccountScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  )
  
}

export default App
