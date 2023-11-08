import React, { useState } from 'react'
//import { Link } from 'react-router-dom'
//import {authgetUser } from "../auth/auth_request_api"
//import {useGetUser} from "./UserContext" //updating user via Context jadenw2542@gmail.com
import Banner from './Banner.js'
import HomeScreenMapCard from "./HomeScreenMapCard.js"
const HomeScreen = () => {
    //const user = useGetUser()

    const [dropdownOpen, setDropdownOpen] = useState(false);

    function handleRecents(){
        console.log("recents")
    }

    function handleMostComments(){
        console.log("comments")
    }

    function handleTrending(){
        console.log("tredning")
    }

    function handlePopular(){
        console.log("Popular")
    }
    
    return(
        <div className="min-h-screen max-h-[100%] bg-primary-GeoPurple">
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
                        <a onClick={handleRecents} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-b-none ">Recents</a>
                        <a onClick={handleMostComments} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md" >Most Comments</a>
                        <a onClick={handleTrending} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">Trending</a>
                        <a onClick={handlePopular} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">Popular</a>

                    </div>)}

                </div>

            </div>

            <div className=" container mx-auto px-4">
                <div className="flex flex-row justify-between items-center mx-auto py-5 px-5">
                    <HomeScreenMapCard/>
                    
                    <HomeScreenMapCard/>

                    <HomeScreenMapCard/>
            
            </div>
            </div>

        </div>


    );
}

export default HomeScreen