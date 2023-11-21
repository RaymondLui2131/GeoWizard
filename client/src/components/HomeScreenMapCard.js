import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faEye } from '@fortawesome/free-solid-svg-icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getMap } from '../api/map_request_api';
import React, { useRef, useEffect, useContext, useState } from 'react';
import { MapContext, MapActionType } from "../api/MapContext"
import { useNavigate } from "react-router-dom";

const HomeScreenMapCard = ({mapObject}) => {
    const {map, dispatch } = useContext(MapContext)
    const navigate = useNavigate()
    const [geojsonData, setGeojsonData] = useState(null); // State to store map data
    const [isLoading, setIsLoading] = useState(true); // Loading flag

    const mapRef = useRef(null); // Create a ref for the map container
    //console.log(mapObject)
    
    //const mapData = async() => (await getMap(mapObject._id)) 

    useEffect(() => {
        if (geojsonData) return;
    
        const fetchMapData = async () => {
            try {
                console.log('getmap in card')
                const data = await getMap(mapObject._id);
                setGeojsonData(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading map data:", error);
                setIsLoading(false);
            }
        };
    
        fetchMapData();
    }, [mapObject]); // This effect should only rerun if mapObject changes

    // useEffect(() => {
    //     if (isLoading || !geojsonData || !mapRef.current) return;
        
    //    // geojsonData().then(geojsonData => {
    //         //if (!mapRef.current) return // If the ref is not attached to the element, do nothing
    //         //console.log(mapData)
    //         // const displayMap = L.map(mapRef.current).setView([39.50, -98.35], 4); // Use the ref here

    //         // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         //     maxZoom: 19
    //         // }).addTo(displayMap)

    //         // const geojsonLayer = L.geoJSON(geojsonData).addTo(displayMap)
            
    //         // displayMap.fitBounds(geojsonLayer.getBounds())

    //         // // Cleanup function to remove the map
    //         // return () => {
    //         //     if(displayMap) displayMap.remove()
    //         // }
    //     // }).catch(error => {
    //     //     console.error("Error loading map data:", error)
    //     // });
        
    // }, [isLoading, geojsonData])

    function handleView() {
        //console.log("view");
        //console.log(mapObject._id);

        async function dispatchMapData() {
            try {
                console.log(geojsonData); 
                dispatch({ type: MapActionType.VIEW, payload: geojsonData });
                console.log(map)
                navigate('/mapView');
            } catch (error) {
                console.error("Error loading map data:", error);
            }
        }
        dispatchMapData();
    }

    if (!geojsonData) {
        return <div>Loading...</div>; // Or any other placeholder for loading
    }
    return(
            <div className=" max-w-xl rounded border-2 border-primary-GeoBlue overflow-hidden shadow-lg bg-white m-4">
                <div ref={mapRef} className="z-0 w-full h-96"></div>
                <div className="px-6 py-4">
                    <div className="font-NanumSquareNeoOTF-Bd text-3xl mb-2">{mapObject.title}</div>
                    <p className="font-NanumSquareNeoOTF-Lt min-h-[10rem] text-gray-700 text-base">
                    {mapObject.description}
                    </p>
                </div>
                <div className="px-6 pt-4 pb-0">
                    <span className="font-NanumSquareNeoOTF-Lt inline-block bg-primary-GeoOrange text-white rounded-full px-3 py-1  font-semibold  mr-2 mb-2">Submitted By: Anon2131</span>
                </div>
                <div className="px-6 font-NanumSquareNeoOTF-Lt pt-0 pb-2 flex flex-row justify-between items-center">
                    <span className="inline-block mr-2">
                    <FontAwesomeIcon icon={faThumbsUp} /> {mapObject.likes}
                    </span>
                    <span className="inline-block mr-2">
                    <FontAwesomeIcon icon={faComment} /> {mapObject.dislikes}
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