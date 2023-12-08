
import logo from "../../assets/geowizlogo.png";
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { resetThePassword } from '../../api/auth_request_api.js';

const ChangePasswordScreen = () => {
    const { id, userName, token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState(''); // state for password
    const [confirmPassword, setConfirmPassword] = useState(''); // state for confirm password
    const [passwordMismatch, setPasswordMismatch] = useState(false); // check if passwords match
    const [blankErrors, setBlankErrors] = useState({    // check if input slots are empty
        password: false,
        confirmPassword: false
    });
    const [changePasswordFailed, setChangePasswordFailed] = useState(false) // state for failed password change

    const validateInputs = () => {
        let newErrors = {};
        if (!password) newErrors.password = true;
        if (!confirmPassword) newErrors.confirmPassword = true;
        setBlankErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangePasswordClick= async () => {
        setPasswordMismatch(false)
        setChangePasswordFailed(false)
        setBlankErrors({
            password: false,
            confirmPassword: false
        })
        if (validateInputs() === false){
            return;
        }
        if (password !== confirmPassword) {
            setPasswordMismatch(true); 
            return; 
        }
        const response = await resetThePassword(id,token,password)
        if (response.status == 200) {
            navigate('/changePasswordSuccess')   
        } else {
            setChangePasswordFailed(true)
            console.log("Changing password failed")
        }
    };

    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">

            <div className='flex justify-center w-full'>


                <div className="flex justify-center container">
                    <div className="rectangle font-PyeongChangPeace-Light">
                        <div className="pt-1 ">
                            <img src={logo} className="h-10 sm:h-28 mx-auto" />
                        </div>
                        <div className='pt-4 text-2xl'>Change Password for @{userName}</div>
                        
                        

                        <div className="text-black font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                            Password
                        </div>

                        {blankErrors.password ? (
                            <div style={{ color: '#FF0000', textAlign: 'center' }}>
                                Please input an password!
                            </div>
                        ) : null}

                        <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                        <input
                            className="cpPassword text-black font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                            style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}

                        ></input>
                        </div>

                        <div className="text-black pl-16 font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                            Confirm Password
                        </div>

                        {blankErrors.confirmPassword ? (
                            <div style={{ color: '#FF0000', textAlign: 'center' }}>
                                Please input an confirmation password!
                            </div>
                        ) : null}

                        <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                        <input
                            className="cpComfirmPassword text-black font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                            style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}

                        ></input>
                        </div>

                        {passwordMismatch ? (
                            <div style={{ color: '#FF0000', textAlign: 'center' }}>
                                Passwords do not match!
                            </div>
                        ) : null}

                        {changePasswordFailed ? (
                            <div style={{ color: '#FF0000', textAlign: 'center' }}>
                                Password change failed. Your token may have expired or is invalid
                            </div>
                        ) : null}


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