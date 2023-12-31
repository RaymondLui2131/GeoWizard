/**
 * Banner Component
 *
 * @author Jaden Wong
 */

import logo from '../assets/geowizlogo.png'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext, UserActionType } from '../api/UserContext'
import { SearchContext, SearchActionType } from '../api/SearchContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
const Banner = () => {
  const { user, dispatch } = useContext(UserContext)
  const { searchQuery, searchDispatch } = useContext(SearchContext)
  const [searchTerm, setSearchTerm] = useState('') // state for searchbar
  const navigate = useNavigate()

  const handleSearch = () => {
    searchDispatch({ type: SearchActionType.SEARCH, payload: searchTerm })
    console.log(searchQuery)
    navigate('/search')
  }

  const menuItems = [
    ['Home', '/'],
    ['Create Map/Edit Map', '/editUpload'],
    user ? ['Profile', `/profile/${user._id}`] : null,
    // user ? ['Dashboard', '/dashboard'] : null,
    ['About', '/about'],
  ]

  function handleLogin() {
    //logOutUser()
    navigate('/login')
  }
  function handleLogOut() {
    dispatch({ type: UserActionType.LOGOUT })
    navigate('/')
  }
  function handleSignUp() {
    navigate('/createAccount')
  }

  return (
    <header>
      <nav className='bg-white border-gray-200 px-4 lg:px-6 py-2 dark:bg-gray-800'>
        <div className='flex justify-between items-center mx-auto w-full px-20'>
          <a className='flex items-center'>
            <img src={logo} className='mr-6 h-9 sm:h-20 hover:cursor-pointer' alt='Flowbite Logo' onClick={() => navigate("/")}/>
            <span className='self-center text-5xl font-PyeongChangPeace-Light whitespace-nowrap text-primary-GeoPurple dark:text-white'>
              GeoWizard
            </span>
          </a>

          <div className='flex items-center relative'>
            <input
              className='text-l font-PyeongChangPeace-Light w-96 rounded-full py-2 border-solid border-2 border-gray-300 hover:border-primary-GeoPurple focus:border-primary-GeoPurple focus:outline-none'
              placeholder='Search for maps'
              style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            ></input>
            <button
              onClick={handleSearch}
              className='absolute right-0 px-5 bg-gray-200 h-[90%] mr-[2px] rounded-r-full'
            >
              <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </button>
          </div>
        </div>

        <div className='flex flex-wrap justify-between items-center mb-2 px-20'>
          <ul className='flex flex-col mt-4 font-PyeongChangPeace-Bold lg:flex-row lg:space-x-8 lg:mt-0'>
            {menuItems
              .filter(Boolean) // remove null values
              .map(([title, url]) => (
                <li key={title}>
                  <a
                    className='cursor-pointer text-l block py-2 pr-4 pl-3 text-gray-600 hover:text-primary-GeoPurple'
                    onClick={() => navigate(url)}
                  >
                    {title}
                  </a>
                </li>
              ))}
          </ul>

          <div className='flex items-center'>
            {!user && (
              <button
                onClick={handleLogin}
                className='text-l font-PyeongChangPeace-Bold rounded-lg shadow-lg bg-primary-GeoPurple text-white ml-10 py-2 px-6 border-solid border-2 border-gray-300 hover:opacity-70'
              >
                Login
              </button>
            )}

            {user && (
              <div className='text-xl font-PyeongChangPeace-Bold ml-10 py-2 px-6 text-gray-600'>
                Welcome {user.username}!{' '}
              </div>
            )}

            {!user && (
              <button
                onClick={handleSignUp}
                className='text-l font-PyeongChangPeace-Bold rounded-lg shadow-lg ml-10 py-2 px-6 bg-primary-GeoPurple border-solid border-2 border-gray-300 hover:opacity-70 text-white'
              >
                Sign Up
              </button>
            )}

            {user && (
              <button
                onClick={handleLogOut}
                className='text-l font-PyeongChangPeace-Bold rounded-lg shadow-lg ml-10 py-2 px-6 bg-primary-GeoPurple border-solid border-2 border-gray-300 hover:opacity-70 text-white'
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Banner
