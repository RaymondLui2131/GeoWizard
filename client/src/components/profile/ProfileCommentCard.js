import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { getMap } from '../../api/map_request_api'
import { MAP_TYPES, STRING_MAPPING } from '../../constants/MapTypes'
import { useNavigate } from 'react-router-dom'
import { MapContext, MapActionType } from '../../api/MapContext'
const ProfileCommentCard = React.memo(({ comment_data, mapData }) => {
    const { dispatch } = useContext(MapContext)
    const navigate = useNavigate()
    const getDatePosted = () => {
        const date = new Date(mapData?.map?.createdAt);
        const month = date.getMonth() + 1; // Months are zero-indexed
        const day = date.getDate();
        const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year

        // Padding the month and day with leading zeros if necessary
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;

        return `${formattedMonth}/${formattedDay}/${year}`;
    }

    const handleViewMap = (e) => {
        e.stopPropagation()
        const fetchMapData = async () => {
            try {
                const res = await getMap(comment_data.map_id)
                if (res) {
                    dispatch({ type: MapActionType.VIEW, payload: res });
                    navigate('/mapView')
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchMapData()
    }

    const handleProfile = (e) => {
        e.stopPropagation()
        console.log(mapData)
        navigate(`/profile/${mapData?.map?.user_id?._id}`)

    }

    return (
        <li className='shadow-sleek w-full h-[30%] flex flex-col justify-evenly bg-white hover:bg-opacity-90 hover:cursor-pointer' onClick={handleViewMap}>
            <div className='border-l-8 border-primary-GeoBlue flex flex-col justify-between mt-3 ml-8 pb-6 pl-3 gap-6'>
                <p className='flex text-lg font-PyeongChangPeace-Light gap-2 justify-start'>
                    Comment On
                    <span className='font-PyeongChangPeace-Bold hover:underline hover:underline-offset-4'>{mapData?.map?.title}</span>
                    <span className='font-PyeongChangPeace-Light px-3 rounded-3xl bg-primary-GeoOrange'>{STRING_MAPPING[MAP_TYPES[mapData?.map?.mapType]]}</span>
                    by
                    <span className='font-PyeongChangPeace-Bold hover:underline hover:underline-offset-4' onClick={handleProfile}>{mapData?.username}</span>
                </p>
                <div className='flex items-center justify-start font-PyeongChangPeace-Light text-xl'>
                    <FontAwesomeIcon icon={faChartBar} />
                    <p className='ml-4'>"{comment_data?.text}"</p>
                </div>
            </div>
            <div className='flex justify-end items-center gap-2 mr-4 mb-2 text-lg font-PyeongChangPeace-Light'>
                <div className='flex items-center gap-2 mr-3'>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <p>{comment_data?.votes}</p>
                </div>
                {/* <p className='text-primary-GeoOrange font-PyeongChangPeace-Bold mx-1'>Reply</p> */}
                <p>{comment_data && getDatePosted()}</p>
            </div>
        </li>
    )
})

export default ProfileCommentCard