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

function App() {
  // const[user, setUser] = useState('guest') //default state is 'guest', which means the user is viewing as a guess
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
        <Route path="/createAccountSuccess" element={<AccountCreationSuccessScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/mapView" element={<MapView />} />
        <Route path="/about" element={<AboutScreen/>} />
        <Route path="/search" element={<SearchScreen/>} />


      </Routes>
    </BrowserRouter>
  )
  
}

export default App
