import logo from "../assets/geowizlogo.png";
import { useNavigate } from 'react-router-dom'

const ResetEmailMessageScreen = () => {
    const navigate = useNavigate();
    const handleChangePasswordClick= () => {
        navigate('/changePassword')   //For now brings you to change password screen
    };

    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <div className='flex justify-center w-full'>

                <div className="flex justify-center container">
                    <div className="rectangle font-PyeongChangPeace-Light">
                        <div className="pt-1 ">
                            <img src={logo} className="h-10 sm:h-28 mx-auto" />
                        </div>
                        <div className='pt-4 text-3xl'>Reset Your Password</div>
                        <div className='pt-12 text-base'>Check your email for a link to reset your password, if it doesn't appear, check your spam folder</div>
                        
                        <div className = "pt-16 pr-11 flex-col justify-center items-center">
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


export default ResetEmailMessageScreen