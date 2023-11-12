import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import HomeScreen from './components/HomeScreen'
import AboutScreen from './components/AboutScreen'
import { UserProvider } from './components/UserContext'

function App() {
  // const[user, setUser] = useState('guest') //default state is 'guest', which means the user is viewing as a guess
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/" element={<HomeScreen />} />
          <Route path="/about" element={<AboutScreen />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
  
}

export default App
