import Banner from './Banner.js'
import logo from "../assets/geowizlogo.png";
import { useState } from 'react'

const LoginScreen = () => {
    const [userName, setUserName] = useState(''); // state for username
    const [password, setPassword] = useState(''); // state for password
    const [confirmPassword, setConfirmPassword] = useState(''); // state for confirm password

    // const handleUserName= (event) => {
    // };

    // const handlePassword= (event) => {
    // };

    const handleCreateAccountClick= (event) => {
        console.log(event) //handle click later
    };

    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <Banner/>
            <div className="flex flex-col justify-center items-center">
                <div className="pt-12 flex items-center">
                    <img src={logo} className="mr-6 h-9 sm:h-20" alt="Flowbite Logo" />
                    <span className="text-purple-800 font-bold self-center text-5xl font-PyeongChangPeace-Light whitespace-nowrap">GeoWizard</span>
                </div>

                <div className="font-bold pt-4 pr-72 flex flex-col justify-center items-center">
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

                <div className="pl-16 font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                    Confirm Password
                </div>

                
                <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                <input
                    className="text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                    style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    // onKeyUp={handlePassword}
                ></input>
                </div>

                <div className = "pt-8 pr-4 flex-col justify-center items-center">
                    <button onClick={handleCreateAccountClick} className = "text-yellow-200 font-PyeongChangPeace-Bold rounded-md ml-10 py-2 px-6 border-solid border-2 border-gray-300 hover:bg-gray-300">
                        Create Account
                    </button>
                </div>

            </div>
        </div>
    );
}


export default LoginScreen