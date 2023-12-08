import logo from "../../assets/geowizlogo.png";
import { useNavigate } from 'react-router-dom'

const ResetEmailMessageScreen = () => {

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
                        
                    </div>
                </div>

            </div>

        </div>
    );
}


export default ResetEmailMessageScreen