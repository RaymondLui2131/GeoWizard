import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faThumbsUp,
  faComment,
  faEye,
  faThumbsDown,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useContext, useState } from 'react'
import { MapContext, MapActionType } from '../../api/MapContext'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { MAP_TYPES, STRING_MAPPING } from '../../constants/MapTypes'
import { addView } from '../../api/map_request_api'
import tinycolor from 'tinycolor2'
import FlowArrow from '../editingMaps/FlowArrow.js';
import NotDraggableImageOverlay from '../editingMaps/ImageNotDraggable.js';
import PointMarkerNotEditable from '../editingMaps/PointMarkerNotEditable.js';

const HomeScreenMapCard = ({ mapObject }) => {
  const { map, dispatch } = useContext(MapContext)
  const navigate = useNavigate()
  console.log(mapObject)

  const date = new Date(mapObject.createdAt)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // getMonth() returns a zero-based index
  const year = date.getFullYear()
  const formattedDate = `${month}/${day}/${year}`
  const [isLoading, setIsLoading] = useState(true) // Loading flag
  const [mapView,] = useState(map || null); //REPLACE WITH MAP CONTEXT
  const [mapType,] = useState(mapView?.mapType || '')


  const possibleNames = ['name', 'nom', 'nombre', 'title', 'label', 'id']
  const hlsaToRGBA = (hlsa) => {
    const color = tinycolor(hlsa)
    const rgba = color.toRgb()
    const rgbaString = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    // console.log("Input", hlsa)
    // console.log("COnversion",rgbaString)
    return rgbaString
  }

  const MapDisplay = (props) => {
    //console.log(props)
    const mapData = props.MapData
    const edits = mapData.edits
    const mapType = props.mapType
    //console.log(mapType)
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
        return (<div>Loading</div>)
    }
    const styleMapping = {}
    edits.editsList.forEach((edit) => {
        switch (MAP_TYPES[mapType]) {

            case MAP_TYPES['HEATMAP']: {
                //console.log("Adding", edit.featureName)
                styleMapping[edit.featureName] = { fillColor: hlsaToRGBA(edit.colorHLSA), fillOpacity: 0.7 };
                break;
            }
            case MAP_TYPES['CHOROPLETH']:
                {
                    // console.log("Adding", edit.featureName)
                    styleMapping[edit.featureName] = { fillColor: edit.colorHEX, fillOpacity: 0.7 }
                    break
                }
            default:
                break;
        }
    })
    //console.log(styleMapping)
    const getFeatureStyleView = (feature) => {
        const foundName = possibleNames.find(propertyName => propertyName in feature.properties)
        if (feature) {
            return styleMapping[feature.key] || { fillColor: '#ffffff' }
        }
        return {}
    }
    return (
        <>
            <MapContainer
                center={center}
                zoom={6}
                style={{ height: '650px' }}
                className='z-0 h-96 w-full'
                scrollWheelZoom={true}
                maxBounds={[padded_NE, padded_SW]}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {Object.keys(mapData).length
                    ?
                    <>
                        <GeoJSON
                            data={mapData.original_map.features}
                            pointToLayer={(feature, latlng) => {
                                if (feature.properties && feature.properties.iconUrl) {
                                    const icon = L.icon({
                                        iconUrl: feature.properties.iconUrl,
                                        iconSize: [32, 32],
                                    });
                                    const marker = L.marker(latlng, { icon });
                                    return marker;
                                }
                                return L.circleMarker(latlng);
                            }}
                            onEachFeature={(feature, layer) => {
                                if (feature.geometry.type === 'Point') {
                                    return;
                                }
                                if (MAP_TYPES[mapType] === MAP_TYPES['CHOROPLETH'] || MAP_TYPES[mapType] === MAP_TYPES['HEATMAP']) {
                                    const featureStyle = getFeatureStyleView(feature)
                                    layer.setStyle(featureStyle)
                                }

                            }} />
                        {
                            MAP_TYPES[mapType] === MAP_TYPES['SYMBOL']
                                ? edits.editsList.map((edit) =>
                                    <NotDraggableImageOverlay key={edit.id} id={edit.id} image={edit.symbol}
                                        initialBounds={edit.bounds}
                                        color={edit.colorHLSA}
                                    />)
                                : null
                        }
                        {
                            MAP_TYPES[mapType] === MAP_TYPES['POINT']
                                ? edits.editsList.map((edit) =>
                                    <PointMarkerNotEditable
                                        key={edit.id}
                                        id={edit.id}
                                        edit={edit}
                                    />)
                                : null
                        }
                        {
                            MAP_TYPES[mapType] === MAP_TYPES['FLOW']
                                ? edits.editsList.map((edit) => (
                                    <FlowArrow key={edit.id} id={edit.id} latlngs={edit.latlngs} colorRgba={edit.colorRgba} />
                                ))
                                : null
                        }
                    </>
                    : null
                }

            </MapContainer>
        </>
    )
  }

  function handleView() {

    async function dispatchMapData() {
      try {
        //console.log(mapObject);
        const data = mapObject
        dispatch({ type: MapActionType.VIEW, payload: data })
        const response = await addView(mapObject._id)
        if (response.status == 200) {
          console.log("200")
        } 
        else if (response.status == 404) {
          console.log("404")
        }
        else if (response.status == 403) {
          console.log("403")
        }
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
    <div className='relative max-w-xlgrow-0 max-h-fit rounded-md shadow-intense border-2 border-primary-GeoBlue bg-white'>
      <span className='absolute z-50 top-2 right-2  bg-primary-GeoOrange rounded-2xl px-2'>{STRING_MAPPING[MAP_TYPES[mapObject?.mapType]]}</span>
      <div>
        <MapDisplay {...{ MapData: mapObject.MapData, mapType: mapObject.mapType}} />
      </div>
      <div className='relative flex flex-col items-center justify-between h-full w-full pb-6'>
        <p className='group px-10 my-2 w-full font-NanumSquareNeoOTF-Bd text-3xl text-center text-ellipsis whitespace-nowrap overflow-hidden'>
          {mapObject.title}
          <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 whitespace-nowrap rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">{mapObject.title}</span>
        </p>
        <p className='bg-primary-GeoOrange px-2 rounded-md font-NanumSquareNeoOTF-Lt  font-semibold text-white hover:cursor-pointer hover:opacity-70' onClick={handleProfile}>
          {mapObject.user_id.username}
        </p>
        <p
          className='my-3 font-NanumSquareNeoOTF-Lt text-center text-gray-700 shadow-warm w-[90%] h-20 break-words overflow-scroll'
        >
          {mapObject.description || "No Description."}
        </p>

        {/* <div className='flex flex-row items-center justify-between px-6 pb-0 pt-2'>
          <span
            onClick={handleProfile}
            className='mb-2 mr-2 inline-block rounded-full bg-primary-GeoOrange px-5  font-NanumSquareNeoOTF-Lt  font-semibold text-white hover:cursor-pointer hover:opacity-70'
          >
            {mapObject.user_id.username}
          </span>
          <span className='mb-2 mr-2 inline-block rounded-full px-3 py-1  font-NanumSquareNeoOTF-Lt  font-semibold text-black'>
            Created On : {formattedDate}
          </span>
        </div> */}

        <div className='flex flex-row items-center justify-between w-full px-5 mb-3 font-NanumSquareNeoOTF-Lt'>
          <div className=''>
            <span className='mr-2 inline-block h-6'>
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
          </div>

          <div className='flex gap-1 items-center'>
            <FontAwesomeIcon icon={faCalendarDays} />
            {formattedDate}
          </div>
        </div>
        <div className='font-NanumSquareNeoOTF-Lt'>
          <button
            onClick={handleView}
            className=' rounded shadow-aesthetic bg-primary-GeoBlue whitespace-nowrap px-6 py-3 text-white text-xl hover:opacity-70'
          >
            Click To View
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeScreenMapCard
