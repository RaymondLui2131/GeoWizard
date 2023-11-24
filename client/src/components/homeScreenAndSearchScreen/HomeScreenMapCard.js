import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faEye, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getMap } from '../../api/map_request_api';
import React, { useEffect, useContext, useState } from 'react';
import { MapContext, MapActionType } from "../../api/MapContext"
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer,GeoJSON } from 'react-leaflet';
import geobuf_api from '../../api/geobuf_api';

const HomeScreenMapCard = ({mapObject}) => {
    const {map, dispatch } = useContext(MapContext)
    const navigate = useNavigate()
    //console.log(mapObject)

    const date = new Date(mapObject.createdAt);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns a zero-based index
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    const [isLoading, setIsLoading] = useState(true); // Loading flag

    

    const MapDisplay = (props) =>{
        //const mapData = mapObject.MapData
        //console.log('mapdata:', props.props.MapData)
        //console.log(props)
        const mapData = props.props.MapData
        //console.log(mapData)
        var center = [0,0]
        var padded_NE = [0,0]
        var padded_SW = [0,0]
        if(mapData)
        {
            const geoJsonLayer = L.geoJSON(mapData.original_map)
            const bounds = geoJsonLayer.getBounds()
            center = bounds.getCenter()
            //Padding for bounds
            const currNe= bounds.getNorthEast()
            const currSw = bounds.getSouthWest()
            currNe.lat = currNe.lat + 5
            currSw.lat = currSw.lat - 5
            currNe.lng = currNe.lng + 5
            currSw.lng = currSw.lng - 5
            padded_NE = currNe
            padded_SW = currSw
        }
    
        if(!mapData)
        {
            return (<div>placeholder</div>)
        }
        return(
            <>
                <MapContainer 
                    center={center} 
                    zoom={6} 
                    style={{ height: '25rem' }} 
                    className='z-0 w-full h-96'
                    scrollWheelZoom={true}
                    maxBounds={[padded_NE,padded_SW]}>
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                        attribution='Tiles © Esri &mdash; Esri, DeLorme, NAVTEQ'
                    />
                    {Object.keys(mapData).length    
                        ?<GeoJSON data={mapData.original_map.features}/>
                        :null
                    }
                    
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
                dispatch({ type: MapActionType.VIEW, payload: data });
                //console.log(map)
                navigate('/mapView');
            } catch (error) {
                console.error("Error loading map data:", error);
            }
        }
        dispatchMapData();
    }

    if (!mapObject) {
        return <div className='max-w-xl text-2xl font-PyeongChangPeace-Light text-primary-GeoBlue'>Loading...</div>; // Or any other placeholder for loading
    }
    return(
            <div className=" max-w-xl rounded border-2 border-primary-GeoBlue overflow-hidden shadow-lg bg-white m-4">
                {/* <div ref={mapRef} className="z-0 w-full h-96"></div> */}
                 <div> <MapDisplay props={{MapData :  mapObject.MapData}} /> </div> 
                <div className="px-6 py-4">
                    <div className="font-NanumSquareNeoOTF-Bd text-3xl mb-2">{mapObject.title}</div>
                    <p style={{ minHeight: '6rem' }} className="font-NanumSquareNeoOTF-Lt text-gray-700 text-base">
                    {mapObject.description}
                    </p>
                </div>
                <div className="px-6 pt-4 pb-0 flex flex-row justify-between items-center">
                    <span className="font-NanumSquareNeoOTF-Lt inline-block bg-primary-GeoOrange text-white rounded-full px-3 py-1  font-semibold  mr-2 mb-2">Author  : {mapObject.user_id.username}</span>
                    <span className="font-NanumSquareNeoOTF-Lt inline-block text-black rounded-full px-3 py-1  font-semibold  mr-2 mb-2">Created On : {formattedDate}</span>
                </div>
                <div className="px-6 font-NanumSquareNeoOTF-Lt pt-0 pb-2 flex flex-row justify-between items-center">
                    <span className="inline-block mr-2">
                    <FontAwesomeIcon icon={faThumbsUp} /> {mapObject.likes}
                    </span>
                    <span className="inline-block mr-2">
                    <FontAwesomeIcon icon={faThumbsDown} /> {mapObject.dislikes}
                    </span>
                    <span className="inline-block mr-2">
                    <FontAwesomeIcon icon={faComment} /> {mapObject.comments.length}
                    </span>
                    <span className="inline-block">
                    <FontAwesomeIcon icon={faEye} /> {mapObject.views}
                    </span>

                    <div className="px-6 py-4">
                        <button onClick={handleView} className=" bg-primary-GeoBlue hover:bg-blue-700 text-white py-2 px-4 rounded">
                        Click To View
                        </button>
                    </div>
                </div>
            </div>

    )
}

export default HomeScreenMapCard