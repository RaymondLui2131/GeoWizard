import yellowCheck from "../../assets/yellowCheck.png";
import { useNavigate } from 'react-router-dom'

const ChangePasswordSuccessScreen = () => {
    const navigate = useNavigate();
    const returnToHomePageClick = () => {
        navigate('/'); 
    }
    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <div className='flex justify-center w-full'>

                <div className="flex justify-center container">
                    <div className="rectangle font-PyeongChangPeace-Light">
                        <div className="pt-12 ">
                            <img src={yellowCheck} className="h-10 sm:h-28 mx-auto" />
                        </div>
                        <div className='pt-12 text-2xl'>Password Changed!</div>
                        <div className='pt-12 text-base'>Your password has been changed successfully. You many now close this window.</div>

                        <div className = "pt-8 pr-14 flex-col justify-center items-center">
                            <button onClick={returnToHomePageClick} className = "text-yellow-200 font-PyeongChangPeace-Bold rounded-md ml-10 py-2 px-6 border-solid border-2 border-gray-300 hover:bg-gray-300">
                                Return to Homepage
                            </button>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}


export default ChangePasswordSuccessScreen