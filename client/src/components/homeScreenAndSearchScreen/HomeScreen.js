import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  useEffect,
} from 'react'
import useMapSearch from './useMapSearch.js'
import { SearchContext } from '../../api/SearchContext.js'

const HomeScreen = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownTimeOpen, setDropdownTimeOpen] = useState(false)

  const [activeMetricButton, setActiveMetricButton] = useState('')
  const [activeTimeButton, setActiveTimeButton] = useState('')

  const buttonMetricKeys = [
    'Recents',
    'Oldest',
    'Most Comments',
    'Most Likes',
    'Most Views',
  ]
  const buttonTimeKeys = [
    'Today',
    'This Week',
    'This Month',
    'This Year',
    'All The Time',
  ]


  const toggleMetricButton = (buttonKey) => {
    // If the clicked button is already active, deactivate it, otherwise activate it
    setActiveMetricButton(activeMetricButton === buttonKey ? '' : buttonKey)
    //console.log(activeMetricButton)
  }

  const toggleTimeButton = (buttonKey) => {
    // If the clicked button is already active, deactivate it, otherwise activate it
    setActiveTimeButton(activeTimeButton === buttonKey ? '' : buttonKey)
    //console.log(activeTimeButton)
  }

  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const { searchQuery } = useContext(SearchContext)
  const { maps, hasMore, loading, error } = useMapSearch(query, pageNumber)

  const observer = useRef()
  const lastMapElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          //console.log('Visible')
          setPageNumber((prevPageNumber) => prevPageNumber + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  useEffect(() => {
    //console.log('search', searchQuery)
    //if(searchQuery == '') return
    setActiveMetricButton('')
    setActiveTimeButton('')
    setQuery({
      query: '',
      metric: activeMetricButton,
      time: activeTimeButton,
    })
    setPageNumber(1)
    //console.log("searched button clicked")
  }, [searchQuery])

  useEffect(() => {
    //console.log('search', searchQuery)
    setQuery({
      query: '',
      metric: activeMetricButton,
      time: activeTimeButton,
    })
    setPageNumber(1)
    //console.log("searched button clicked")
  }, [activeMetricButton, activeTimeButton])

  return (
    <div className='max-h-[100%] min-h-screen bg-primary-GeoPurple'>
      <div className='z-10 mx-auto flex flex-wrap items-center justify-between px-28 pt-5'>
        <div className='font-PyeongChangPeace-Light text-5xl text-primary-GeoBlue'>
          Welcome to GeoWizard!
        </div>

        {/*Metric DropDown*/}
        <div>
          <div className='relative z-[80] inline-block'>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`w-52  px-4 py-2  font-NanumSquareNeoOTF-Lt ${
                dropdownOpen ? 'rounded-b-none rounded-t-md' : 'rounded-md'
              } flex items-center justify-between bg-primary-GeoOrange text-left text-white`}
            >
              Sort
              <span className='ml-2'>
                {dropdownOpen ? (
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path d='M19 9l-7 7-7-7'></path>
                  </svg>
                ) : (
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path d='M5 15l7-7 7 7'></path>
                  </svg>
                )}
              </span>
            </button>
            {dropdownOpen && (
              <div className='absolute w-52 rounded-md bg-primary-GeoOrange shadow-lg '>
                {buttonMetricKeys.map((key, index) => (
                  <button
                    key={key}
                    className={`block w-52 px-4 py-2 font-NanumSquareNeoOTF-Lt text-white text-left 
                                                ${
                                                  activeMetricButton === key
                                                    ? 'bg-primary-GeoBlue'
                                                    : 'bg-primary-GeoOrange hover:bg-primary-GeoBlue'
                                                }
                                                ${
                                                  index == 0
                                                    ? 'rounded-b-none'
                                                    : 'rounded-md'
                                                }`}
                    onClick={() => toggleMetricButton(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/*Time DropDown*/}
          <div className='relative z-[80] ml-5 inline-block'>
            <button
              onClick={() => setDropdownTimeOpen(!dropdownTimeOpen)}
              className={`w-52 px-4 py-2  font-NanumSquareNeoOTF-Lt ${
                dropdownTimeOpen ? 'rounded-b-none rounded-t-md' : 'rounded-md'
              } flex items-center justify-between bg-primary-GeoOrange text-left text-white`}
            >
              Time
              <span className='ml-2'>
                {dropdownTimeOpen ? (
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path d='M19 9l-7 7-7-7'></path>
                  </svg>
                ) : (
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path d='M5 15l7-7 7 7'></path>
                  </svg>
                )}
              </span>
            </button>
            {dropdownTimeOpen && (
              <div className='absolute w-52 rounded-md bg-primary-GeoOrange shadow-lg '>
                {buttonTimeKeys.map((key, index) => (
                  <button
                    key={key}
                    className={`block w-52 px-4 py-2 font-NanumSquareNeoOTF-Lt text-white text-left
                                                ${
                                                  activeTimeButton === key
                                                    ? 'bg-primary-GeoBlue'
                                                    : 'bg-primary-GeoOrange hover:bg-primary-GeoBlue'
                                                }
                                                ${
                                                  index == 0
                                                    ? 'rounded-b-none'
                                                    : 'rounded-md'
                                                }`}
                    onClick={() => toggleTimeButton(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Infinite Loading */}
      <div>
        <div className='z-0 grid grid-cols-3 gap-8 mx-28 mt-10'>
          {maps.map((map, index) => {
            if (maps.length === index + 1) {
              //last book
              return (
                <div ref={lastMapElementRef} key={map._id + '-' + index}>
                  {map}
                </div>
              )
            } else {
              return <div key={map._id + '-' + index}>{map}</div>
            }
          })}
        </div>

        {maps.length === 0 && (
          <div className='px-28 py-5 font-PyeongChangPeace-Light text-2xl text-primary-GeoBlue'>
            No results found
          </div>
        )}
        
        <div className=' mx-24 py-5 font-PyeongChangPeace-Light text-2xl text-primary-GeoBlue'>
          {loading && 'Loading...'}
        </div>
        <div className='font-PyeongChangPeace-Light text-2xl text-primary-GeoBlue'>
          {error && 'Error'}
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
