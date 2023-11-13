import Banner from './Banner.js'
import yellowCheck from "../assets/yellowCheck.png";
import { useState } from 'react'

const AccountCreationSuccessScreen = () => {
    const [userName, setUserName] = useState(''); // state for username
    const [password, setPassword] = useState(''); // state for password

    // const handleUserName= (event) => {
    // };

    // const handlePassword= (event) => {
    // };

    const handleLoginClick= (event) => {
        console.log(event) //handle click later
    };

    const handleCreateAccountClick= (event) => {
        console.log(event) //handle click later
    };

    const handleForgotPasswordClick= (event) => {
        console.log(event) //handle click later
    };

    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <Banner/>
            <div className="container">
                <div className="rectangle font-PyeongChangPeace-Light">
                    <div className="pt-12 ">
                        <img src={yellowCheck} className="h-10 sm:h-28 mx-auto" />
                    </div>
                    <div className='pt-12 text-2xl'>Account Created</div>
                    <div className='pt-12 text-base'>You have successfully created an account. You may now close this window.</div>
                </div>
            </div>
        </div>
    );
}


export default AccountCreationSuccessScreen