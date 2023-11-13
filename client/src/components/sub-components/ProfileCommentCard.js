import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
const ProfileCommentCard = ({ id }) => {
    return (
        <li className='shadow-sleek w-full h-[30%] flex flex-col justify-evenly bg-white hover:bg-opacity-90'>
            <div className='border-l-8 border-primary-GeoBlue flex flex-col justify-between mt-3 ml-8 pb-6 pl-3 gap-6'>
                <p className='flex text-lg font-PyeongChangPeace-Light gap-2 justify-start'>
                    Comment On
                    <span className='font-PyeongChangPeace-Bold'>{`My Map ${id}`}</span>
                    <span className='font-PyeongChangPeace-Light px-3 rounded-3xl bg-primary-GeoOrange'>Choropleth</span>
                    by
                    <span className='font-PyeongChangPeace-Bold'>@Alex123</span>
                </p>
                <div className='flex items-center justify-start font-PyeongChangPeace-Light text-xl'>
                    <FontAwesomeIcon icon={faChartBar} />
                    <p>"Amazing map! Way to go!"</p>
                </div>
            </div>
            <div className='flex justify-end items-center gap-2 mr-4 mb-2 text-lg font-PyeongChangPeace-Light'>
                <FontAwesomeIcon icon={faThumbsUp} />
                <p>12</p>
                <FontAwesomeIcon icon={faThumbsDown} />
                <p className='text-primary-GeoOrange font-PyeongChangPeace-Bold mx-1'>Reply</p>
                <p>10/4/23</p>
            </div>
        </li>
    )
}

export default ProfileCommentCard