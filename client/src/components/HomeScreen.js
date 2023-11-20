import React, { useState, useRef, useCallback} from 'react'
//import { Link } from 'react-router-dom'
//import {authgetUser } from "../auth/auth_request_api"
//import {useGetUser} from "./UserContext" //updating user via Context jadenw2542@gmail.com
//import HomeScreenMapCard from "./HomeScreenMapCard.js"
//import gz_2010_us_outline_500k from "../assets/gz_2010_us_outline_500k.json"
import useMapSearch from './useMapSearch.js'
//import { getAllMaps } from '../api/map_request_api.js'

const HomeScreen = () => {
    //const user = useGetUser()
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownTimeOpen, setDropdownTimeOpen] = useState(false);

    const [maps1, setMaps] = useState(null)

    const [query, setQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)

    const {
        maps,
        hasMore,
        loading,
        error
      } = useMapSearch(query, pageNumber)

    const observer = useRef()
    const lastMapElementRef = useCallback(node =>{
        if(loading) return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore){
                console.log('Visible')
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if(node) observer.current.observe(node)
        console.log(node)
    },[loading, hasMore])
  

    

    function handleSearch(e) {
        setQuery(e.target.value)
        setPageNumber(1)
      }

    
    // useEffect(() => {
    //     getAllMaps().then(mapsData => {
    //         setMaps(mapsData);
    //         console.log(maps1)
    //     }).catch(error => {
    //         console.error('Error fetching maps:', error);
    //     });
    // }, []);

    

    function handleRecents(){
        console.log("recents")
        console.log(maps1)
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
            <div className='flex flex-wrap justify-between items-center mx-auto pt-5 px-28 z-10 '>
            
                <div className= 'text-5xl font-PyeongChangPeace-Light text-primary-GeoBlue'>Popular Maps</div>

                <div> 
                    <div className="relative inline-block z-[80]">
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


                    <div className="relative inline-block z-[80] ml-5">
                        <button
                        onClick={() => setDropdownTimeOpen(!dropdownTimeOpen)}
                        className={`px-4  py-2 w-52  font-NanumSquareNeoOTF-Lt ${dropdownTimeOpen ? 'rounded-b-none rounded-t-md' : 'rounded-md' } text-left bg-primary-GeoOrange text-white flex items-center justify-between`}
                        >
                        Time
                        <span className="ml-2">
                            {dropdownTimeOpen ? (
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
                        {dropdownTimeOpen && (
                        <div className="absolute w-52 bg-primary-GeoOrange rounded-md shadow-lg ">
                            <a onClick={handleRecents} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-b-none ">Today</a>
                            <a onClick={handleMostComments} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md" >This Week</a>
                            <a onClick={handleTrending} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">This Month</a>
                            <a onClick={handlePopular} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">This Year</a>
                            <a onClick={handlePopular} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">All The Time</a>
                        </div>)}

                    </div>
                </div>

            </div>



            <div>
                <input type="text" value={query} onChange={handleSearch}></input>
                <div className="grid grid-cols-2 mx-24 py-5 z-0">
                    {maps.map((map, index) => {
                    if (maps.length === index + 1) { //last book
                        return <div ref={lastMapElementRef} key={map.id}>{map}</div>
                    } else { 
                        return <div key={map.id}>{map}</div>
                    }
                    })}
                </div>
                <div>{loading && 'Loading...'}</div>
                <div>{error && 'Error'}</div>
            </div>
        </div>


    );
}

export default HomeScreen

//<HomeScreenMapCard key={index} file={map} />

// {maps && (
//     <div className="grid grid-cols-3 mx-24 py-5 z-0">
//         {/* You can map through the data if there are multiple items */}
//         {maps.map((mapItem, index) => (
//             <div key={index}>{mapItem.title}</div>
//         ))}
//     </div>
//     )}