import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import finland from "../../assets/finland.png"
const ProfileMapCard = ({ id }) => {
    return (
        <li className='w-full h-[30%] flex justify-between bg-white shadow-sleek hover:bg-opacity-90' id={id}>
            <div className='w-1/3'>
                <img src={finland} className='w-full h-full object-cover'></img>
            </div>
            <div className='flex flex-col justify-evenly text-center'>
                <p className='font-PyeongChangPeace-Bold text-lg'>{`My Map ${id}`}</p>
                <p className='font-PyeongChangPeace-Light'>Published: 10/4/23</p>
                <p className='font-PyeongChangPeace-Light rounded-3xl bg-primary-GeoOrange'>Choropleth</p>
                <div className='flex justify-center items-center font-PyeongChangPeace-Light gap-1'>
                    <FontAwesomeIcon icon={faChartBar} />
                    12 Comments
                </div>
            </div>
            <div className='flex flex-col justify-evenly font-PyeongChangPeace-Light mr-4 text-lg'>
                <FontAwesomeIcon icon={faThumbsUp} />
                <p>12</p>
                <FontAwesomeIcon icon={faThumbsDown} />
            </div>

        </li>
    )
}

export default ProfileMapCard