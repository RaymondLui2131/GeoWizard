import React, { useState, useRef, useCallback, useContext, useEffect} from 'react'
import useMapSearch from './useMapSearch.js'
import { SearchContext, SearchActionType } from "../api/SearchContext";

const HomeScreen = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownTimeOpen, setDropdownTimeOpen] = useState(false);

    const [sortTime, setSortTime] = useState('')

    const [activeMetricButton, setActiveMetricButton] = useState('');
    const [activeTimeButton, setActiveTimeButton] = useState('');

    const buttonMetricKeys = ['Recents', 'Oldest', 'Most Comments', 'Most Likes', 'Most Views'];
    const buttonTimeKeys = ['Today', 'This Week', 'This Month', 'This Year', 'All The Time'];

    const [query, setQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const {searchQuery, searchDispatch} = useContext(SearchContext)


    const toggleMetricButton = (buttonKey) => {
        // If the clicked button is already active, deactivate it, otherwise activate it
        setActiveMetricButton(activeMetricButton === buttonKey ? '' : buttonKey);
        console.log(activeMetricButton)
    };

    const toggleTimeButton = (buttonKey) => {
        // If the clicked button is already active, deactivate it, otherwise activate it
        setActiveTimeButton(activeTimeButton === buttonKey ? '' : buttonKey);
        console.log(activeTimeButton)
    };


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
                //console.log('Visible')
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if(node) observer.current.observe(node)
        //console.log(node)
    },[loading, hasMore])
    
    useEffect(() => {
        console.log('search', searchQuery)

        //if(searchQuery == '') return
        console.log(searchQuery)
        setActiveMetricButton('')
        setActiveTimeButton('')
        setQuery({
            query: searchQuery,
            metric: activeMetricButton,
            time: activeTimeButton
        })
        setPageNumber(1)
        console.log("searched button clicked")
    }, [searchQuery])

    useEffect(() => {
        console.log('search', searchQuery)
        console.log(searchQuery)
        setQuery({
            query: searchQuery,
            metric: activeMetricButton,
            time: activeTimeButton
        })
        setPageNumber(1)
        console.log("searched button clicked")
    }, [activeMetricButton, activeTimeButton])


    // let test = true
    // if(test){
    //     return null  
    // }
    return(
        <div className="min-h-screen max-h-[100%] bg-primary-GeoPurple">
            <div className='flex flex-wrap justify-between items-center mx-auto pt-5 px-28 z-10 '>
            
                <div className= 'text-5xl font-PyeongChangPeace-Light text-primary-GeoBlue'>Welcome to GeoWizard!</div>

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
                            {buttonMetricKeys.map((key, index) => (
                                <a
                                    key={key}
                                    className={`block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white 
                                                ${activeMetricButton === key ? 'bg-primary-GeoBlue' : 'bg-primary-GeoOrange hover:bg-primary-GeoBlue'}
                                                ${index == 0 ? 'rounded-b-none': 'rounded-md'}`}
                                    onClick={() => toggleMetricButton(key)}
                                >
                                    {key}
                                </a>
                            ))}
                            {/* <a onClick={handleRecents}  className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-b-none">Recents</a>
                            <a onClick={handleOldest} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-b-none ">Oldest</a>
                            <a onClick={handleMostComments} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md" >Most Comments</a>
                            <a onClick={handleMostLikes} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">Most Likes</a>
                            <a onClick={handleMostViews} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">Most Views</a> */}
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
                            {buttonTimeKeys.map((key, index) => (
                                <a
                                    key={key}
                                    className={`block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white
                                                ${activeTimeButton === key ? 'bg-primary-GeoBlue' : 'bg-primary-GeoOrange hover:bg-primary-GeoBlue'}
                                                ${index == 0 ? 'rounded-b-none': 'rounded-md'}`}
                                    onClick={() => toggleTimeButton(key)}
                                >
                                    {key}
                                </a>
                            ))}
                            {/* <a onClick={handleToday} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-b-none ">Today</a>
                            <a onClick={handleWeek} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md" >This Week</a>
                            <a onClick={handleMonth} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">This Month</a>
                            <a onClick={handleYear} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">This Year</a>
                            <a onClick={handleAllTheTime} className="block px-4 py-2 w-52 font-NanumSquareNeoOTF-Lt text-white bg-primary-GeoOrange hover:bg-primary-GeoBlue rounded-md">All The Time</a> */}
                        </div>)}

                    </div>
                </div>

            </div>



            <div>
                <div className="grid grid-cols-3 mx-24 py-5 z-0">
                    {maps.map((map, index) => {
                    if (maps.length === index + 1) { //last book
                        return <div ref={lastMapElementRef} key={map._id + '-' + index}>{map}</div>
                    } else { 
                        return <div key={map._id + '-' + index}>{map}</div>
                    }
                    })}
                </div>
                <div className='text-2xl font-PyeongChangPeace-Light text-primary-GeoBlue'>{loading && 'Loading...'}</div>
                <div className='text-2xl font-PyeongChangPeace-Light text-primary-GeoBlue'>{error && 'Error'}</div>
            </div>
            
        </div>


    );
}

export default HomeScreen