import Banner from './Banner.js'
import logo from "../assets/geowizlogo.png";
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
const LoginScreen = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(''); // state for username
    const [password, setPassword] = useState(''); // state for password

    const [user, setUser] = useState('')

    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    const handleLoginClick = () => {
        navigate('/')   //For now brings you to the home screen
    };

    const handleCreateAccountClick = () => {
        navigate('/createAccount')   //For now brings you to create account screen
    };

    const handleForgotPasswordClick = () => {
        navigate('/findEmail')   //For now brings you to find email screen
    };

    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    console.log(res.data)
                })
                .catch((err) => console.log(err));
        }
    }, [user])

    return (
        <div data-test-id="login-div" className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <Banner />
            <div className="flex flex-col justify-center items-center">
                <div className="pt-12 flex items-center">
                    <img src={logo} className="mr-6 h-9 sm:h-20" alt="Flowbite Logo" />
                    <span className="text-purple-800 font-bold self-center text-5xl font-PyeongChangPeace-Light whitespace-nowrap">GeoWizard</span>
                </div>

                <div className="pl-3 font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                    UserName
                </div>

                <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                    <input
                        className="text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                        style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    // onKeyUp={handleUserName}
                    ></input>
                </div>

                <div className="font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                    Password
                </div>

                <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                    <input
                        className="text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                        style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    // onKeyUp={handlePassword}
                    ></input>
                </div>

                <div onClick={handleForgotPasswordClick} className="pl-12 pt-4 pr-72 text-align:center underline font-bold  flex flex-col justify-center items-center">
                    Forgot Password
                </div>

                <div onClick={handleCreateAccountClick} className="pl-14 pt-4 pr-72 underline font-bold flex flex-col justify-center items-center">
                    Create an Account
                </div>

                <div className="pt-8 pr-4 flex-col justify-center items-center">
                    <button onClick={handleLoginClick} className="text-yellow-200 font-PyeongChangPeace-Bold rounded-md ml-10 py-2 px-6 border-solid border-2 border-gray-300 hover:bg-gray-300">
                        Login
                    </button>
                    <button onClick={() => googleLogin()} className="text-yellow-200 font-PyeongChangPeace-Bold rounded-md ml-10 py-2 px-6 border-solid border-2 border-gray-300 hover:bg-gray-300">Sign In With Google</button>
                </div>
            </div>
        </div>
    );
}


export default LoginScreen