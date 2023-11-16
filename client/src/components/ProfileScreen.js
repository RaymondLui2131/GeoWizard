import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faCakeCandles, faCircleArrowLeft, faCircleExclamation, faFire } from '@fortawesome/free-solid-svg-icons'
import ProfileMapCard from './sub-components/ProfileMapCard'
import ProfileCommentCard from './sub-components/ProfileCommentCard'
import { useNavigate } from 'react-router-dom'
const ProfileScreen = () => {
    const navigate = useNavigate()
    const [display, setDisplay] = useState("posts")
    const user_maps = [1, 2, 3] // list of maps 
    const user_comments = [1, 2, 3] // list of comments

    const generateMapCards = () => {
        return user_maps.map((map_id) => <ProfileMapCard key={map_id} id={map_id} />)
    }

    const generateCommentCards = () => {
        return user_comments.map((comment_id) => <ProfileCommentCard key={comment_id} id={comment_id} />)
    }

    const handleBackButton = () => {
        navigate("/")
    }

    return (
        <>
            <div className='min-h-screen  bg-primary-GeoPurple flex pb-6 m-5 rounded-2xl shadow-nimble'>
                <div className='relative grow w-1/2 h-screen bg-white overflow-hidden flex flex-col justify-between rounded-tl-2xl'>
                    <div className='w-full h-1/4 absolute bg-primary-GeoPurple rounded-2xl'>
                        <button onClick={handleBackButton}><FontAwesomeIcon icon={faCircleArrowLeft} className='h-10 w-10 mt-5 ml-8 hover:opacity-70' /></button>
                    </div>
                    <div className='h-2/5   bg-primary-GeoPurple transform skew-y-[-18.7deg] '>
                    </div>
                    <div className='shadow-aesthetic absolute w-4/5 h-1/2 top-20 left-1/2 transform -translate-x-1/2 rounded-2xl bg-white flex flex-col justify-between'>
                        <div className='shadow-aesthetic absolute left-1/2 transform -translate-x-1/2 -top-16 rounded-full w-32 h-32  bg-primary-GeoBlue z-10 flex items-center justify-center'>
                            <span className='text-black text-7xl font-PyeongChangPeace-Light'>B</span>
                        </div>

                        <div className='flex flex-col justify-evenly mt-20 text-center items-center gap-2.5'>
                            <p className='text-black text-4xl font-PyeongChangPeace-Light'>@Bob123</p>
                            <div className='flex items-center gap-1'>
                                <FontAwesomeIcon icon={faLocationDot} />
                                <p className='text-black text-base font-PyeongChangPeace-Light'>Stony Brook, NY</p>
                            </div>
                            <div className='flex items-center gap-1'>
                                <FontAwesomeIcon icon={faCakeCandles} />
                                <p className='text-black text-base font-PyeongChangPeace-Light ml-1'>October 10, 2002</p>
                            </div>
                        </div>

                        <div className='bg-gray-50 h-1/3 flex justify-evenly items-center rounded-b-2xl'>
                            <p className='text-center'>
                                <span className='block font-PyeongChangPeace-Bold text-lg '>53</span>
                                <span className='block font-PyeongChangPeace-Light'>Posts</span>
                            </p>
                            <p className='text-center'>
                                <span className='block font-PyeongChangPeace-Bold text-lg'>1,253</span>
                                <span className='block font-PyeongChangPeace-Light'>Highest Upvotes</span>
                            </p>
                            <p className='text-center'>
                                <span className='block font-PyeongChangPeace-Bold text-lg'>13</span>
                                <span className='block font-PyeongChangPeace-Light'>Days Active</span>
                            </p>
                        </div>
                    </div>
                    <div className='h-1/2 flex items-center justify-center px-12'>
                        <p className='shadow-warm font-PyeongChangPeace-Light text-center mt-20 text-sm rounded-2xl px-5 py-3 overflow-scroll bg-gray-50'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non tortor nec justo vestibulum lobortis quis ut est. Curabitur nec ex non augue ullamcorper venenatis a mattis nisi. Vestibulum tincidunt bibendum libero. In eu neque feugiat, bibendum libero nec, tristique neque. Nulla facilisi. Quisque quis tortor egestas, viverra nisl et, semper eros. Praesent sit amet hendrerit arcu. Donec tristique elit erat, vel suscipit massa pharetra ut. Suspendisse facilisis sed arcu vel laoreet. Sed vel pharetra metus.</p>
                    </div>
                </div>

                <div className='grow w-3/5 h-screen'>
                    <div className='grow h-1/4 flex flex-col justify-evenly items-baseine align-middle'>
                        <div className='flex justify-center gap-10 align-middle'>
                            <button className={`hover:text-primary-GeoBackGround text-2xl font-PyeongChangPeace-Light ${display === "posts" && 'border-b-2  border-primary-GeoBlue'}`} onClick={() => setDisplay("posts")}>Posts</button>
                            <button className={`hover:text-primary-GeoBackGround text-2xl font-PyeongChangPeace-Light ${display === "comments" && 'border-b-2  border-primary-GeoBlue'}`} onClick={() => setDisplay("comments")}>Comments</button>
                        </div>
                        <div className='flex justify-center gap-10 align-middle '>
                            <button className='flex items-center text-2xl px-5 bg-primary-GeoBackGround hover:bg-opacity-30 bg-opacity-20 rounded-2xl'><FontAwesomeIcon icon={faCircleExclamation} className='mr-1' />New</button>
                            <button className='flex items-center text-2xl px-5 bg-primary-GeoBackGround hover:bg-opacity-30 bg-opacity-20 rounded-2xl'><FontAwesomeIcon icon={faFire} className='mr-1' />Top</button>
                        </div>
                    </div>
                    <ul className='grow h-3/4 flex flex-col justify-between'>
                        {display === "posts" && generateMapCards()}
                        {display === "comments" && generateCommentCards()}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default ProfileScreen