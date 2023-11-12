import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faEye } from '@fortawesome/free-solid-svg-icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import gz_2010_us_outline_500k from "../assets/gz_2010_us_outline_500k.json";
import React, { useRef, useEffect } from 'react';
const HomeScreenMapCard = ({file}) => {
    const mapRef = useRef(null); // Create a ref for the map container



    useEffect(() => {
        if (!mapRef.current) return; // If the ref is not attached to the element, do nothing

        const map = L.map(mapRef.current).setView([39.50, -98.35], 4); // Use the ref here

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        const geojsonLayer = L.geoJSON(file).addTo(map);
        
        map.fitBounds(geojsonLayer.getBounds());

        // Cleanup function to remove the map
        return () => {
            map.remove();
        };
    }, []);

    function handleView(){
        console.log("view")
    }
    //max-w-md
    return(
            <div className=" max-w-xl rounded border-2 border-primary-GeoBlue overflow-hidden shadow-lg bg-white m-4">
                {/* <img className="w-full" src="/path-to-your-image" alt="Map" /> */}
                <div ref={mapRef} className="z-0 w-full h-80"></div>
                <div className="px-6 py-4">
                    <div className="font-NanumSquareNeoOTF-Bd text-3xl mb-2">US Outline</div>
                    <p className="font-NanumSquareNeoOTF-Lt min-h-[10rem] text-gray-700 text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. At purus tellus arcu sit nibh consectetur.
                    </p>
                </div>
                <div className="px-6 pt-4 pb-0">
                    <span className="font-NanumSquareNeoOTF-Lt inline-block bg-primary-GeoOrange text-white rounded-full px-3 py-1  font-semibold  mr-2 mb-2">Submitted By: Anon2131</span>
                </div>
                <div className="px-6 font-NanumSquareNeoOTF-Lt pt-0 pb-2 flex flex-row justify-between items-center">
                    <span className="inline-block mr-2">
                    <FontAwesomeIcon icon={faThumbsUp} /> 899
                    </span>
                    <span className="inline-block mr-2">
                    <FontAwesomeIcon icon={faComment} /> 284
                    </span>
                    <span className="inline-block">
                    <FontAwesomeIcon icon={faEye} /> 3620
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