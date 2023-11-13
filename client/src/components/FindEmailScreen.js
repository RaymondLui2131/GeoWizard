import Banner from './Banner.js'
import logo from "../assets/geowizlogo.png";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FindEmailScreen = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(''); // state for email

    const handleNextClick= () => {
        navigate('/resetMessage')   //For now brings you to reset password message screen
    };

    return (
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <Banner/>
            <div className="container">
                <div className="rectangle font-PyeongChangPeace-Light">
                    <div className="pt-1 ">
                        <img src={logo} className="h-10 sm:h-28 mx-auto" />
                    </div>
                    <div className='pt-4 text-3xl'>Find Your Email</div>
                    <div className='pt-8 text-base'>Enter Your Recovery Email</div>
                    
                    <div className="pl-4 pt-4 flex flex-col justify-center items-center">
                        <input
                            className="text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                            style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            // onKeyUp={handleEmail}
                        ></input>
                    </div>

                    <div className = "pt-8 pr-11 flex-col justify-center items-center">
                        <button onClick={handleNextClick} className = "text-yellow-200 font-PyeongChangPeace-Bold rounded-md ml-10 py-2 px-6 border-solid border-2 border-gray-300 hover:bg-gray-300">
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}


export default FindEmailScreen