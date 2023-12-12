import logo from "../../assets/geowizlogo.png";
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { authloginUser, googleLoginUser } from '../../api/auth_request_api.js';
import { UserContext, UserActionType } from "../../api/UserContext.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const LoginScreen = () => {
    const { errorMessage, dispatch } = useContext(UserContext)
    const navigate = useNavigate();
    const [userEmail, setuserEmail] = useState(''); // state for userEmail
    const [password, setPassword] = useState(''); // state for password
    const [blankErrors, setBlankErrors] = useState({ // check if input slots are empty
        userEmail: false,
        password: false,
    });
    const [googleSignInError, setGoogleSignInError] = useState(false) // if google sign in fails because of same username or email
    const [loginFailed, setLoginFailed] = useState(false) // state for failed login

    const googleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            if (codeResponse) {
                const response = await googleLoginUser(codeResponse)
                if (response.status == 200) {
                    dispatch({ type: UserActionType.LOGIN, payload: response.data })
                    navigate("/")
                }
                else {
                    dispatch({ type: UserActionType.ERROR, payload: response.data.message }) // login failed
                    setGoogleSignInError(true)
                }
            }
        },
        onError: (error) => {
            dispatch({ type: UserActionType.ERROR, payload: error.message })
        }
    });

    const validateInputs = () => {
        let newErrors = {};
        if (!userEmail) newErrors.userEmail = true;
        if (!password) newErrors.password = true;

        setBlankErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginClick = async (e) => {
        e.preventDefault()
        setBlankErrors({
            userEmail: false,
            password: false,
        })
        setLoginFailed(false)
        validateInputs()
        const response = await authloginUser(userEmail, password)
        console.log(response.status)
        if (response.status == 200) {
            dispatch({ type: UserActionType.LOGIN, payload: response.data })
            navigate("/dashboard") // login successful
        } else {
            setLoginFailed(true)
            dispatch({ type: UserActionType.ERROR, payload: response.data.message }) // login failed
        }
    };

    const handleGoogleLoginClick = async () => {
        setGoogleSignInError(false);
        setBlankErrors({
            userEmail: false,
            password: false,
        })
        setLoginFailed(false)
        googleLogin();
    };

    const handleCreateAccountClick = () => {
        navigate('/createAccount')   //For now brings you to create account screen
    };

    const handleForgotPasswordClick = () => {
        navigate('/findEmail')   //For now brings you to find email screen
    };

    return (
        <div data-test-id="login-div" className="min-h-screen py-10 max-h-screen  bg-primary-GeoPurple">
            <div className="flex flex-col justify-between gap-5 items-center rounded-xl py-10 shadow-aesthetic w-[40%] mx-auto bg-white overflow-scroll">
                <div className=" flex items-center gap-3 justify-center w-full">
                    <img src={logo} className="h-9 sm:h-20" alt="Flowbite Logo" />
                    <span className="text-purple-800 font-bold self-center text-5xl font-PyeongChangPeace-Light whitespace-nowrap">GeoWizard</span>
                </div>

                <label data-test-id="LoginEmailSection" className="flex flex-col font-NanumSquareNeoOTF-Lt gap-1">
                    Email
                    <input
                        className="text-l px-2 font-PyeongChangPeace-Light w-96 rounded-md shadow-aesthetic py-2 border  hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setuserEmail(e.target.value)}
                    ></input>
                </label>

                {blankErrors.userEmail ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input an userEmail!
                    </div>
                ) : null}


                <label className="flex flex-col font-NanumSquareNeoOTF-Lt gap-1">
                    Password
                    <input
                        type="password"
                        className="text-l px-2 font-PyeongChangPeace-Light w-96 rounded-md shadow-aesthetic py-2 border hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </label>

                {blankErrors.password ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input an userEmail!
                    </div>
                ) : null}

                <div className="flex w-96 items-center justify-between text-[#0a66c2]">
                    <div className="text-align:center hover:underline font-NanumSquareNeoOTF-Lt flex flex-col justify-center items-center hover:cursor-pointer">
                        <a onClick={handleForgotPasswordClick}>Forgot password?</a>
                    </div>

                    <div className="hover:underline font-NanumSquareNeoOTF-Lt flex flex-col justify-center items-center hover:cursor-pointer">
                        <a onClick={handleCreateAccountClick}>Create an Account</a>
                    </div>
                </div>

                {googleSignInError ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Google Account exist with an existing Email or Username
                    </div>
                ) : null}

                {loginFailed && !blankErrors.password && !blankErrors.userEmail ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Incorrect Email or Password
                    </div>
                ) : null}

                <div className="flex flex-col gap-5 w-full items-center">
                    <button onClick={handleLoginClick} className="text-white text-xl bg-primary-GeoPurple font-PyeongChangPeace-Bold w-[60%] px-2 py-3 rounded-full shadow-aesthetic hover:opacity-70">
                        Sign In
                    </button>
                    <h2 className="w-[85%] text-center border-b-2 border-b-gray-200  leading-[0.1em]"><span className="bg-white px-4 font-PyeongChangPeace-Light">or</span></h2>
                    <button onClick={() => handleGoogleLoginClick()} className="text-black border border-gray-400 text-xl bg-white font-PyeongChangPeace-Bold rounded-full shadow-aesthetic hover:opacity-70 w-[60%] px-2 py-3 whitespace-nowrap flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" /></svg>
                        Sign In With Google</button>
                </div>
            </div>
        </div>
    );
}


export default LoginScreen