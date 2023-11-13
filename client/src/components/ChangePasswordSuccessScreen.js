import Banner from './Banner.js'
import yellowCheck from "../assets/yellowCheck.png";

const ChangePasswordSuccessScreen = () => {
    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <Banner/>

            <div className='flex justify-center w-full'>

                <div className="flex justify-center container">
                    <div className="rectangle font-PyeongChangPeace-Light">
                        <div className="pt-12 ">
                            <img src={yellowCheck} className="h-10 sm:h-28 mx-auto" />
                        </div>
                        <div className='pt-12 text-2xl'>Password Changed!</div>
                        <div className='pt-12 text-base'>Your password has been changed successfully. You many now close this window.</div>
                    </div>
                </div>

            </div>

        </div>
    );
}


export default ChangePasswordSuccessScreen