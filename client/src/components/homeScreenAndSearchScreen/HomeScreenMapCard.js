import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faThumbsUp,
  faComment,
  faEye,
  faThumbsDown,
} from '@fortawesome/free-solid-svg-icons'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useContext, useState } from 'react'
import { MapContext, MapActionType } from '../../api/MapContext'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'

const HomeScreenMapCard = ({ mapObject }) => {
  const { map, dispatch } = useContext(MapContext)
  const navigate = useNavigate()
  //console.log(mapObject)

  const date = new Date(mapObject.createdAt)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // getMonth() returns a zero-based index
  const year = date.getFullYear()
  const formattedDate = `${month}/${day}/${year}`
  const [isLoading, setIsLoading] = useState(true) // Loading flag

  const MapDisplay = (props) => {
    //const mapData = mapObject.MapData
    //console.log('mapdata:', props.props.MapData)
    //console.log(props)
    const mapData = props.props.MapData
    //console.log(mapData)
    var center = [0, 0]
    var padded_NE = [0, 0]
    var padded_SW = [0, 0]
    if (mapData) {
      const geoJsonLayer = L.geoJSON(mapData.original_map)
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

    if (!mapData) {
      return <div>placeholder</div>
    }
    return (
      <>
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: '25rem' }}
          className='z-0 h-96 w-full'
          scrollWheelZoom={true}
          maxBounds={[padded_NE, padded_SW]}
        >
          <TileLayer
            url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            attribution='Tiles © Esri &mdash; Esri, DeLorme, NAVTEQ'
          />
          {Object.keys(mapData).length ? (
            <GeoJSON data={mapData.original_map.features} />
          ) : null}
        </MapContainer>
      </>
    )
  }

  function handleView() {
    //console.log("view");
    //console.log(mapObject._id);

    async function dispatchMapData() {
      try {
        //console.log(mapObject);
        const data = mapObject
        dispatch({ type: MapActionType.VIEW, payload: data })
        //console.log(map)
        navigate('/mapView')
      } catch (error) {
        console.error('Error loading map data:', error)
      }
    }
    dispatchMapData()
  }

  const handleProfile = () => {
    navigate(`/profile/${mapObject.user_id._id}`)
  }

  if (!mapObject) {
    return (
      <div className='max-w-xl font-PyeongChangPeace-Light text-2xl text-primary-GeoBlue'>
        Loading...
      </div>
    ) 
  }
  return (
    <div className=' m-4 max-w-xl overflow-hidden rounded border-2 border-primary-GeoBlue bg-white shadow-lg'>
      {/* <div ref={mapRef} className="z-0 w-full h-96"></div> */}
      <div>
        {' '}
        <MapDisplay props={{ MapData: mapObject.MapData }} />{' '}
      </div>
      <div className='px-6 py-4'>
        <div className='mb-2 font-NanumSquareNeoOTF-Bd text-3xl'>
          {mapObject.title}
        </div>
        <p
          style={{ minHeight: '3rem' }}
          className='font-NanumSquareNeoOTF-Lt text-base text-gray-700 break-words'
        >
          {mapObject.description}
        </p>
      </div>
      <div className='flex flex-row items-center justify-between px-6 pb-0 pt-2'>
        <span
          onClick={handleProfile}
          className='mb-2 mr-2 inline-block rounded-full bg-primary-GeoOrange px-5 py-1  font-NanumSquareNeoOTF-Lt  font-semibold text-white hover:cursor-pointer hover:opacity-70'
        >
          {mapObject.user_id.username}
        </span>
        <span className='mb-2 mr-2 inline-block rounded-full px-3 py-1  font-NanumSquareNeoOTF-Lt  font-semibold text-black'>
          Created On : {formattedDate}
        </span>
      </div>
      <div className='flex flex-row items-center justify-between px-6 pb-2 pt-0 font-NanumSquareNeoOTF-Lt'>
        <span className='mr-2 inline-block'>
          <FontAwesomeIcon icon={faThumbsUp} /> {mapObject.likes}
        </span>
        <span className='mr-2 inline-block'>
          <FontAwesomeIcon icon={faThumbsDown} /> {mapObject.dislikes}
        </span>
        <span className='mr-2 inline-block'>
          <FontAwesomeIcon icon={faComment} /> {mapObject.comments.length}
        </span>
        <span className='inline-block'>
          <FontAwesomeIcon icon={faEye} /> {mapObject.views}
        </span>

        <div className='px-6 py-4'>
          <button
            onClick={handleView}
            className=' rounded bg-primary-GeoBlue px-4 py-2 text-white hover:bg-blue-700'
          >
            Click To View
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeScreenMapCard
