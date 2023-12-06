import React, { useContext, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import finland from "../../assets/finland.png"
import { MAP_TYPES, STRING_MAPPING } from '../../constants/MapTypes'
import { getMap } from '../../api/map_request_api'
import { MapContext, MapActionType } from '../../api/MapContext'
import { UserContext } from '../../api/UserContext'
import { useNavigate, useParams } from "react-router-dom";
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
const ProfileMapCard = React.memo(({ map_data, res }) => {
    const { dispatch } = useContext(MapContext)
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const { id } = useParams()
    const getDatePosted = () => {
        const date = new Date(map_data?.createdAt);
        const month = date.getMonth() + 1; // Months are zero-indexed
        const day = date.getDate();
        const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year

        // Padding the month and day with leading zeros if necessary
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;

        return `${formattedMonth}/${formattedDay}/${year}`;
    }

    const handleViewMap = () => {
        if (res) {
            if (user?._id === id) { // if visiting own profile page; allow user to directly update it
                dispatch({ type: MapActionType.UPDATE, payload: { map: res.MapData.original_map, mapObj: { title: res.title, description: res.description, MapData: res.MapData, isPublic: res.isPublic }, idToUpdate: map_data?._id } });
                navigate('/editingMap')
            }

            else { // if viewing someone else's map 
                dispatch({ type: MapActionType.VIEW, payload: res });
                navigate('/mapView')
            }
        }
    }

    const generatePreview = () => {
        var center = [0, 0]
        var padded_NE = [0, 0]
        var padded_SW = [0, 0]
        if (res) {
            const geoJsonLayer = L.geoJSON(res.MapData.original_map)
            const bounds = geoJsonLayer.getBounds()
            center = bounds.getCenter()
            //Padding for bounds
            const currNe = bounds.getNorthEast()
            const currSw = bounds.getSouthWest()
            currNe.lat = currNe.lat + 5
            currSw.lat = currSw.lat - 5
            currNe.lng = currNe.lng + 5
            currSw.lng = currSw.lng - 5
            padded_NE = currNe
            padded_SW = currSw
        }

        if (!res) {
            return <img src={finland} className='w-full h-full object-cover'></img>
        }

        return (
            <>
                <MapContainer
                    center={center}
                    zoom={6}
                    className='w-full h-full object-cover'
                    scrollWheelZoom={true}
                    maxBounds={[padded_NE, padded_SW]}
                >
                    <TileLayer
                        url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                    />
                    {Object.keys(res).length ? (
                        <GeoJSON data={res.MapData.original_map.features} />
                    ) : null}
                </MapContainer>
            </>
        )
    }

    return (
        <li className='w-full h-1/3 flex justify-between bg-white shadow-sleek hover:bg-opacity-90 hover:cursor-pointer' id={map_data?._id} onClick={handleViewMap}>
            <div className='w-1/3'>
                {res && generatePreview()}
            </div>
            <div className='flex flex-col justify-evenly text-center items-center'>
                <div className='flex items-center'>
                    <p className='font-PyeongChangPeace-Bold text-lg'>{map_data?.title}</p>
                    {!map_data?.isPublic && (
                        <span className='text-sm font-NanumSquareNeoOTF-Lt ml-2 px-1 bg-gray-100'>Private</span>
                    )}
                </div>
                <p className='font-PyeongChangPeace-Light'>{`Published: ${map_data && getDatePosted()}`}</p>
                <p className='w-fit font-PyeongChangPeace-Light px-8 rounded-3xl bg-primary-GeoOrange'>{STRING_MAPPING[MAP_TYPES[map_data?.mapType]]}</p>
                <div className='flex justify-center items-center font-PyeongChangPeace-Light gap-1'>
                    <FontAwesomeIcon icon={faChartBar} />
                    {`${map_data?.comments.length} Comment${map_data?.comments.length ? 's' : ''}`}
                </div>
            </div>
            <div className='flex justify-center items-center font-PyeongChangPeace-Light mr-4 text-lg gap-2'>
                <FontAwesomeIcon icon={faThumbsUp} />
                <p>{map_data?.likes}</p>
                {/* <FontAwesomeIcon icon={faThumbsDown} /> */}
            </div>

        </li>
    )
})

export default ProfileMapCard