import logo from "../assets/geowizlogo.png";
import { useState } from 'react'
//import { Link } from 'react-router-dom'
//import {authgetUser } from "../auth/auth_request_api"

const Banner = () => {
    const [searchTerm, setSearchTerm] = useState(''); // state for searchbar
    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            console.log("User hit enter")
        }
    };
    //print(authgetUser); <img src= 'client\src\assets\geowizlogo.png'/>
    return(
<header>
    <nav className="bg-white border-gray-200 px-4 lg:px-6 py-6 dark:bg-gray-800"> 
        <div className="flex flex-wrap justify-between items-center mx-auto  px-20" >
            <a className="flex items-center">
                <img src={logo} className="mr-6 h-9 sm:h-20" alt="Flowbite Logo" />
                <span className="self-center text-5xl font-PyeongChangPeace-Light whitespace-nowrap text-primary-GeoPurple dark:text-white">GeoWizard</span>
            </a>

            <div className="flex items-center">
                <input
                    className="text-l font-PyeongChangPeace-Light w-96 rounded-md py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none "
                    placeholder="Search for maps"
                    style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyUp={handleSearch}
                ></input>
                <button
                    className = "text-l font-PyeongChangPeace-Bold rounded-md ml-10 py-2 px-6 border-solid border-2 border-gray-300 hover:bg-gray-300 text-gray-600"
                > Search</button>
            </div>

        </div>

        <div className="flex flex-wrap justify-between items-center mt-4 px-20" >
            <ul className="flex flex-col mt-4 font-PyeongChangPeace-Bold lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                    <a href="#" className="text-l block py-2 pr-4 pl-3 text-gray-600 hover:text-primary-GeoPurple">Home</a>
                </li>
                <li>
                    <a href="#" className="text-l block py-2 pr-4 pl-3 text-gray-600 hover:text-primary-GeoPurple">Create/Edit Map</a>
                </li>
                <li>
                    <a href="/profile" className="text-l block py-2 pr-4 pl-3 text-gray-600 hover:text-primary-GeoPurple">Profile</a>
                </li>
                <li>
                    <a href="#" className="text-l block py-2 pr-4 pl-3 text-gray-600 hover:text-primary-GeoPurple">About</a>
                </li>
            </ul>

            <div className="flex items-center">
                <button
                    className = "text-l font-PyeongChangPeace-Bold rounded-md ml-10 py-2 px-6 border-solid border-2 border-gray-300 hover:bg-gray-300 text-gray-600"
                >Login / Welcome User!</button>
                <button
                    className = "text-l font-PyeongChangPeace-Bold rounded-md ml-10 py-2 px-6 bg-primary-GeoPurple border-solid border-2 border-gray-300 hover:bg-gray-300 text-white"
                >Sign Up/Log out</button>
            </div>
        </div>

    </nav>
</header>
    );
}

export default Banner


{/* <header>
<div>
    <img src= 'geowizlogo.png' alt="GeoWizard Logo"/>
    <h1 className="text-3xl font-PyeongChangPeace-Light text-primary-GeoPurple" >
    GeoWizard
    </h1>
</div>
</header> */}