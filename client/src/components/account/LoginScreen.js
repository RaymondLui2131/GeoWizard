import logo from "../../assets/geowizlogo.png";
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { authloginUser, googleLoginUser } from '../../api/auth_request_api.js';
import { UserContext, UserActionType } from "../../api/UserContext.js"
const LoginScreen = () => {
    const { errorMessage, dispatch } = useContext(UserContext)
    const navigate = useNavigate();
    const [userEmail, setuserEmail] = useState(''); // state for userEmail
    const [password, setPassword] = useState(''); // state for password
    const [blankErrors, setBlankErrors] = useState({ // check if input slots are empty
        userEmail: false,
        password: false,
    });

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
        validateInputs()
        const response = await authloginUser(userEmail, password)
        console.log(response.status)
        if (response.status == 200) {
            dispatch({ type: UserActionType.LOGIN, payload: response.data })
            navigate("/dashboard") // login successful
        } else {
            dispatch({ type: UserActionType.ERROR, payload: response.data.message }) // login failed
        }
    };

    const handleCreateAccountClick = () => {
        navigate('/createAccount')   //For now brings you to create account screen
    };

    const handleForgotPasswordClick = () => {
        navigate('/findEmail')   //For now brings you to find email screen
    };

    return (
        <div data-test-id="login-div" className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <div className="flex flex-col justify-center items-center">
                <div className="pt-12 flex items-center">
                    <img src={logo} className="mr-6 h-9 sm:h-20" alt="Flowbite Logo" />
                    <span className="text-purple-800 font-bold self-center text-5xl font-PyeongChangPeace-Light whitespace-nowrap">GeoWizard</span>
                </div>

                <div className="pl-2 pr-80 font-bold pt-4 flex flex-col justify-center items-center">
                    Email
                </div>

                <div data-test-id="LoginEmailSection" className="pl-4 pt-4 flex flex-col justify-center items-center">
                    <input
                        className="text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                        style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                        value={userEmail}
                        onChange={(e) => setuserEmail(e.target.value)}
                    ></input>
                </div>

                {blankErrors.userEmail ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input an userEmail!
                    </div>
                ) : null}

                <div className="font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                    Password
                </div>

                <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                    <input
                        type="password"
                        className="text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                        style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>

                {blankErrors.password ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input an userEmail!
                    </div>
                ) : null}

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