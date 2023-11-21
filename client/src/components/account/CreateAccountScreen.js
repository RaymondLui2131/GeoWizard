
import logo from "../../assets/geowizlogo.png";
import { useState, useContext } from 'react'
import { postUser, checkUserEmail, authloginUser } from '../../api/auth_request_api.js';
import { useNavigate } from 'react-router-dom'
import { UserContext, UserActionType } from "../../api/UserContext.js"

const LoginScreen = () => {
    const navigate = useNavigate();
    const {errorMessage, dispatch } = useContext(UserContext)
    const [userName, setUserName] = useState(''); // state for username
    const [userEmail, setUserEmail] = useState(''); // state for email
    const [password, setPassword] = useState(''); // state for password
    const [confirmPassword, setConfirmPassword] = useState(''); // state for confirm password
    const [passwordMismatch, setPasswordMismatch] = useState(false); // check if passwords match
    const [emailInDb, setEmailInDb] = useState(false); // check if email is unqiue
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

    const handleCreateAccountClick= () => {
        setBlankErrors({
            userName: false,
            userEmail: false,
            password: false,
            confirmPassword: false
        })
        setPasswordMismatch(false)
        setEmailInDb(false)
        setValidEmail(false)

        validateInputs()

        if (isValidEmail(userEmail) === false){
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

        const postCreatedAccount = async () =>{
            try {
                const response = await postUser(userData);
                if (response.status === 200) {
                    loginUser();
                    navigate('/createAccountSuccess'); 
                }
                else if (response.status === 400){
                    console.log("Error in posting an account")
                }
            } catch (error) {
                console.error('Error registering user:', error);
            }
        }

        const checkUniqueEmail = async () =>{
            try {
                const uniqueEmailresponse = await checkUserEmail(userData);
                if (uniqueEmailresponse.status === 400) {
                    setEmailInDb(true)
                    return
                }
                else if (uniqueEmailresponse.status === 200){
                    postCreatedAccount();
                }
            } catch (error) {
                console.error('Error registering user:', error);
            }
        }

        checkUniqueEmail()
    };

    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <div className="flex flex-col justify-center items-center">
                <div className="pt-12 flex items-center">
                    <img src={logo} className="mr-6 h-9 sm:h-20" alt="Flowbite Logo" />
                    <span className="text-purple-800 font-bold self-center text-5xl font-PyeongChangPeace-Light whitespace-nowrap">GeoWizard</span>
                </div>


                <div className="pl-2 pr-80 font-bold pt-4 flex flex-col justify-center items-center">
                    Email
                </div>
                
                <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                <input
                    className="caUserEmail text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                    style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}

                ></input>
                </div>

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

                <div className="pl-2 font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                    UserName
                </div>
                
                <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                <input
                    className="caUserName text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                    style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}

                ></input>
                </div>


                {blankErrors.userName ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input an username!
                    </div>
                ) : null}

                <div className="font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                    Password
                </div>

                <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                <input
                    className="caPassword text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                    style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                ></input>
                </div>

                {blankErrors.password ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input an username!
                    </div>
                ) : null}

                <div className="pl-16 font-bold pt-4 pr-72 flex flex-col justify-center items-center">
                    Confirm Password
                </div>

                
                <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                <input
                    className="caComfirmPassword text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                    style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}

                ></input>
                </div>

                {blankErrors.confirmPassword ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Please input a confirmation password!
                    </div>
                ) : passwordMismatch ? (
                    <div style={{ color: '#8B0000', textAlign: 'center' }}>
                        Passwords do not match!
                    </div>
                ) : null}

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