import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Build1LoginScreen from './components/old/Build1LoginScreen.js'
import RegisterScreen from './components/old/RegisterScreen.js'
import HomeScreen from './components/HomeScreen'
import EditUpload from './components/EditUploadScreen'
import EditingMap from './components/editingMaps/EditingMapScreen'
import LoginScreen from './components/account/LoginScreen.js'
import CreateAccountScreen from './components/account/CreateAccountScreen.js'
import AccountCreationSuccessScreen from './components/account/AccountCreationSuccessScreen.js'
import ProfileScreen from "./components/profile/ProfileScreen.js"
import MapView from './components/MapViewScreen'
import AboutScreen from './components/AboutScreen'
import SearchScreen from './components/SearchScreen'
import FindEmailScreen from './components/password_reset/FindEmailScreen.js'
import ResetEmailMessageScreen from './components/password_reset/ResetEmailMessageScreen.js'
import ChangePasswordScreen from './components/password_reset/ChangePasswordScreen.js'
import ChangePasswordSuccessScreen from './components/password_reset/ChangePasswordSuccessScreen.js'
import Dashboard from './components/Dashboard'
import Banner from './components/Banner'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { UserContextProvider } from './api/UserContext.js'
import { MapContextProvider } from './api/MapContext.js'
import { SearchContextProvider } from './api/SearchContext.js'
function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <GoogleOAuthProvider clientId='1093090289019-21ekfvlhv6s9vrmuf58eh72kp8ki173t.apps.googleusercontent.com'>
          <MapContextProvider>
            <SearchContextProvider>
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
            </SearchContextProvider>
          </MapContextProvider>
        </GoogleOAuthProvider>
      </UserContextProvider>
    </BrowserRouter>
  )

}

export default App
