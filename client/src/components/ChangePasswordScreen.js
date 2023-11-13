import Banner from './Banner.js'
import logo from "../assets/geowizlogo.png";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ChangePasswordScreen = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState(''); // state for password
    const [confirmPassword, setConfirmPassword] = useState(''); // state for confirm password

    const handleChangePasswordClick= () => {
        navigate('/changePasswordSuccess')   //For now brings you to change password success screen
    };

    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <Banner/>


            <div className='flex justify-center w-full'>


                <div className="flex justify-center container">
                    <div className="rectangle font-PyeongChangPeace-Light">
                        <div className="pt-1 ">
                            <img src={logo} className="h-10 sm:h-28 mx-auto" />
                        </div>
                        <div className='pt-4 text-2xl'>Change Password for @bob123</div>
                        
                        

                        <div className="text-black font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                            Password
                        </div>

                        <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                        <input
                            className="cpPassword text-black font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                            style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // onKeyUp={handlePassword}
                        ></input>
                        </div>

                        <div className="text-black pl-16 font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                            Confirm Password
                        </div>

                        
                        <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                        <input
                            className="cpComfirmPassword text-black font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                            style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            // onKeyUp={handlePassword}
                        ></input>
                        </div>

                        <div className="font-bold pt-4 ">
                            Make sure your new password has at least 8 characters, including an uppercase character, a number, and a special character.
                        </div>

                        <div className = "pt-8 pr-11 flex-col justify-center items-center">
                            <button onClick={handleChangePasswordClick} className = "text-yellow-200 font-PyeongChangPeace-Bold rounded-md ml-10 py-2 px-6 border-solid border-2 border-gray-300 hover:bg-gray-300">
                                Change Password
                            </button>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
}


export default ChangePasswordScreen