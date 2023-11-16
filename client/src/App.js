import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Build1LoginScreen from './components/Build1LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import HomeScreen from './components/HomeScreen'
import EditUpload from './components/EditUploadScreen'
import EditingMap from './components/EditingMapScreen'
import LoginScreen from './components/LoginScreen'
import CreateAccountScreen from './components/CreateAccountScreen'
import AccountCreationSuccessScreen from './components/AccountCreationSuccessScreen'
import ProfileScreen from "./components/ProfileScreen"
import MapView from './components/MapViewScreen'
import AboutScreen from './components/AboutScreen'
import SearchScreen from './components/SearchScreen'
import FindEmailScreen from './components/FindEmailScreen'
import ResetEmailMessageScreen from './components/ResetEmailMessageScreen'
import ChangePasswordScreen from './components/ChangePasswordScreen'
import ChangePasswordSuccessScreen from './components/ChangePasswordSuccessScreen'
import Dashboard from './components/Dashboard'
import Banner from './components/Banner'
function App() {
  return (
    <BrowserRouter>
      <Banner />
      <Routes>
        <Route path="/test" element={<Build1LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/editUpload" element={<EditUpload />} />
        <Route path="/editingMap" element={<EditingMap />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/createAccount" element={<CreateAccountScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/createAccountSuccess" element={<AccountCreationSuccessScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/mapView" element={<MapView />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/findEmail" element={<FindEmailScreen />} />
        <Route path="/resetMessage" element={<ResetEmailMessageScreen />} />
        <Route path="/changePassword" element={<ChangePasswordScreen />} />
        <Route path="/changePasswordSuccess" element={<ChangePasswordSuccessScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
