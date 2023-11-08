import React, { useState } from 'react'
//import { Link } from 'react-router-dom'
//import {authgetUser } from "../auth/auth_request_api"
//import {useGetUser} from "./UserContext" //updating user via Context jadenw2542@gmail.com
import Banner from './Banner.js'
import HomeScreenMapCard from "./HomeScreen"
const HomeScreen = () => {
    //const user = useGetUser()

    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    return(
        <div className="min-h-screen max-h-screen bg-primary-GeoPurple">
            <Banner/> 
            <div className='flex flex-wrap justify-between items-center mx-auto pt-5 px-20'>
                
                <div className= 'text-5xl font-PyeongChangPeace-Light text-primary-GeoBlue' > Popular Maps </div>

                <div className="relative inline-block">
                    <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`px-4  py-2 w-52  font-NanumSquareNeoOTF-Lt ${dropdownOpen ? 'rounded-b-none rounded-t-md' : 'rounded-md' } text-left bg-primary-GeoOrange text-white flex items-center justify-between`}
                    >
                    Sort
                    <span className="ml-2">
                        {dropdownOpen ? (
                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 9l-7 7-7-7"></path>
                        </svg>
                        ) : (
                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 15l7-7 7 7"></path>
                        </svg>
                        )}
                    </span>
                    </button>
                    {dropdownOpen && (
                    <div className="absolute w-52 bg-primary-GeoOrange rounded-md shadow-lg ">
                        <a href="#" className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-b-none ">Recents</a>
                        <a href="#" className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md" >Most Comments</a>
                        <a href="#" className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">Trending</a>
                        <a href="#" className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">Popular</a>

                    </div>)}

                </div>
            </div>

            <div>
            <HomeScreenMapCard>
                dsa
            </HomeScreenMapCard>
            </div>
        </div>
    );
}

export default HomeScreen