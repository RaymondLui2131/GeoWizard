import Banner from './Banner.js'
import yellowCheck from "../assets/yellowCheck.png";

const AccountCreationSuccessScreen = () => {
    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <Banner/>
            <div className="container">
                <div className="rectangle font-PyeongChangPeace-Light">
                    <div className="pt-12 ">
                        <img src={yellowCheck} className="h-10 sm:h-28 mx-auto" />
                    </div>
                    <div className='pt-12 text-2xl'>Account Created!</div>
                    <div className='pt-12 text-base'>You have successfully created an account. You may now close this window.</div>
                </div>
            </div>
        </div>
    );
}


export default AccountCreationSuccessScreen