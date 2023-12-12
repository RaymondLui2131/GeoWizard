
import logo from "../../assets/geowizlogo.png";
import { useState, useContext } from 'react'
import { postUser, authloginUser, checkEmail, checkUser } from '../../api/auth_request_api.js';
import { useNavigate } from 'react-router-dom'
import { UserContext, UserActionType } from "../../api/UserContext.js"

const LoginScreen = () => {
    const navigate = useNavigate();
    const { errorMessage, dispatch } = useContext(UserContext)
    const [userName, setUserName] = useState(''); // state for username
    const [userEmail, setUserEmail] = useState(''); // state for email
    const [password, setPassword] = useState(''); // state for password
    const [confirmPassword, setConfirmPassword] = useState(''); // state for confirm password
    const [passwordMismatch, setPasswordMismatch] = useState(false); // check if passwords match
    const [emailInDb, setEmailInDb] = useState(false); // check if email is unqiue
    const [userInDb, setUserInDb] = useState(false); // check if user is unqiue
    const [validEmail, setValidEmail] = useState(false); // check if email is valid
    const [blankErrors, setBlankErrors] = useState({    // check if input slots are empty
        userName: false,
        userEmail: false,
        password: false,
        confirmPassword: false
    });

    const validateInputs = () => {
        let newErrors = {};
        if (!userName) newErrors.userName = true;
        if (!userEmail) newErrors.userEmail = true;
        if (!password) newErrors.password = true;
        if (!confirmPassword) newErrors.confirmPassword = true;

        setBlankErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    function isValidEmail(email) {
        return email.includes('@') && email.includes('.');
    }

    const userData = {
        email: userEmail,
        username: userName,
        password: password
    }

    const handleCreateAccountClick = () => {
        setBlankErrors({
            userName: false,
            userEmail: false,
            password: false,
            confirmPassword: false
        })
        setPasswordMismatch(false)
        setEmailInDb(false)
        setUserInDb(false)
        setValidEmail(false)

        if (validateInputs() === false) {
            return;
        }

        if (isValidEmail(userEmail) === false) {
            setValidEmail(true)
            return;
        }


        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            return;
        }

        const loginUser = async () => {
            const response = await authloginUser(userEmail, password)
            if (response.status == 200) {
                dispatch({ type: UserActionType.LOGIN, payload: response.data })
            } else {
                dispatch({ type: UserActionType.ERROR, payload: response.data.message }) // login failed
            }
        }

        const postCreatedAccount = async () => {
            try {
                const response = await postUser(userData);
                if (response.status === 200) {
                    loginUser();
                    navigate('/createAccountSuccess');
                }
                else if (response.status === 400) {
                    console.log("Error in posting an account")
                }
            } catch (error) {
                console.error('Error registering user:', error);
            }
        }

        const checkUniqueEmail = async () => {
            try {
                const uniqueEmailresponse = await checkEmail(userData.email);
                if (uniqueEmailresponse.status === 409) {
                    setEmailInDb(true);
                    return;
                }
                else if (uniqueEmailresponse.status === 200) {
                    postCreatedAccount();
                }
            } catch (error) {
                console.error('Error finding an email:', error);
            }
        };

        const checkUniqueUser = async () => {
            try {
                const uniqueUserresponse = await checkUser(userData.username);
                if (uniqueUserresponse.status === 409) {
                    setUserInDb(true);
                    return;
                }
                else if (uniqueUserresponse.status === 200) {
                    postCreatedAccount();
                }
            } catch (error) {
                console.error('Error finding an username:', error);
            }
        };

        checkUniqueEmail()
        checkUniqueUser()
    };

    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple py-10 overflow-scroll">
            <div className="flex flex-col gap-5 rounded-xl shadow-aesthetic py-10 justify-between items-center w-2/5 bg-white mx-auto">
                <div className="flex items-center gap-3 justify-center w-full">
                    <img src={logo} className="h-9 sm:h-20" alt="Flowbite Logo" />
                    <span className="text-purple-800 font-bold self-center text-5xl font-PyeongChangPeace-Light whitespace-nowrap">GeoWizard</span>
                </div>

                <label className="flex flex-col font-NanumSquareNeoOTF-Lt gap-1">
                    Email
                    <input
                        className="caUserEmail text-l px-2 font-PyeongChangPeace-Light w-96 rounded-md shadow-aesthetic py-2 border  hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}

                    ></input>
                </label>

                {blankErrors.userEmail ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input an email!
                    </div>
                ) : validEmail ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Email is not valid!
                    </div>
                ) : emailInDb ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Email is already used!
                    </div>
                ) : null}

                <label className="flex flex-col font-NanumSquareNeoOTF-Lt gap-1">
                    UserName
                    <input
                        className="text-l px-2 font-PyeongChangPeace-Light w-96 rounded-md shadow-aesthetic py-2 border  hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none"

                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}

                    ></input>
                </label>


                {blankErrors.userName ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input an username!
                    </div>
                ) : userInDb ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Username is already used!
                    </div>
                ) : null}

                <label className="flex flex-col font-NanumSquareNeoOTF-Lt gap-1">
                    Password
                    <input
                        type="password"
                        className="caPassword text-l px-2 font-PyeongChangPeace-Light w-96 rounded-md shadow-aesthetic py-2 border  hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none"

                        value={password}
                        onChange={(e) => setPassword(e.target.value)}

                    ></input>
                </label>

                {blankErrors.password ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input an username!
                    </div>
                ) : null}

                <label className="flex flex-col font-NanumSquareNeoOTF-Lt gap-1">
                    Confirm Password
                    <input
                        type="password"
                        className="caComfirmPassword text-l px-2 font-PyeongChangPeace-Light w-96 rounded-md shadow-aesthetic py-2 border  hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none"

                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}

                    ></input>
                </label>

                {blankErrors.confirmPassword ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input a confirmation password!
                    </div>
                ) : passwordMismatch ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Passwords do not match!
                    </div>
                ) : null}

                <div className="w-full flex justify-center mt-2">
                    <button onClick={handleCreateAccountClick} className="text-white text-xl bg-primary-GeoPurple font-PyeongChangPeace-Bold w-[60%] px-2 py-3 rounded-full shadow-aesthetic hover:opacity-70">
                        Create Account
                    </button>
                </div>

                <div className="font-NanumSquareNeoOTF-Lt flex justify-center items-center gap-2 w-full">
                    Already on GeoWizard?
                    <a className="hover:underline hover:cursor-pointer text-[#0a66c2]" onClick={() => navigate('/login')}>Sign in</a>
                </div>
            </div>
        </div>
    );
}


export default LoginScreen