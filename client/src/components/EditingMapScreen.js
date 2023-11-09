import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer,GeoJSON } from 'react-leaflet';
import {useState} from "react";
import L from 'leaflet';

import Banner from './Banner.js'


import undo from '../assets/EditMapAssets/undoSmall.png'
import redo from '../assets/EditMapAssets/redoSmall.png'
import franceMap from '../assets/EditMapAssets/france-r.geo.json'  //To be removed

const BottomRow = () => {
    return(
        <div className='w-4/5 flex  flex-row justify-between'>
        <div className='flex flex-row'>
            <div className='flex flex-row' >
                <div ><img src={undo} className='object-contain' alt='Undo action'/></div>
                <div ><img src={redo} className='object-contain' alt='Redo action'/></div>
            </div>
            <div>
                <input type='text' name='title' className='bg-primary-GeoPurple text-white placeholder-white text-2xl w-[35rem]'
                        placeholder='Enter Title...' maxLength={48} >
                </input>
            </div>
        </div>
        <div className='flex justify-between'>
            <div className='pr-16'>
                <div className='inline-block'><button className='bg-primary-GeoOrange text-3xl 
                                                font-NanumSquareNeoOTF-Lt px-14 rounded-full py-2'>
                                                Export</button>
                </div>
                <div className='pl-12 inline-block pr-16'><button className='bg-primary-GeoOrange text-3xl
                                                font-NanumSquareNeoOTF-Lt px-14 rounded-full py-2'>
                                                Publish</button>
                </div>
            </div>
            <div>
                <div className='inline-block'><button className='bg-green-200 text-3xl
                                                    font-NanumSquareNeoOTF-Lt px-8 rounded-full py-2'>
                                                    Public</button>
                </div>
                <div className=' inline-block'> <button className='bg-red-300 text-3xl
                                                    font-NanumSquareNeoOTF-Lt px-8  rounded-full py-2'>
                                                    Private</button>
                </div>

            </div>
        </div>
    </div>
    )
}
const MapView = () => {

    // const [map, setMap] = useState(null)
    const [map, ] = useState(franceMap) //For testing
    // console.log(map)
    // const zoomLevel = 2
    // const center = [46.2276, 2.2137]

    const geoJsonLayer = L.geoJSON(map);
    const bounds = geoJsonLayer.getBounds();
    const center = bounds.getCenter();
    //Padding for bounds
    const padded_NE = bounds.getNorthEast()
    const padded_SW = bounds.getSouthWest()
    padded_NE.lat = padded_NE.lat + 5
    padded_SW.lat = padded_SW.lat - 5
    padded_NE.lng = padded_NE.lng + 5
    padded_SW.lng = padded_SW.lng - 5

    console.log(bounds)
    console.log(center)
    console.log(padded_NE)
    console.log(padded_SW)
    return (
        <>
        <div className='w-4/5 flex justify-center flex-row'>   
            <div className='w-1/2 flex justify-center pt-36'> 
                <MapContainer 
                    center={center} 
                    zoom={5} 
                    style={{ height: '750px', width: '1000px' }} 
                    scrollWheelZoom={true}
                    maxBounds={[padded_NE,padded_SW]}>
                <TileLayer
                    url="https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
                    attribution='Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
                />
                <GeoJSON data={map.features}/>
                </MapContainer>
            </div> 
            <div className='w-1/2 flex justify-center'> 
                edit
            </div>
        </div>
        </>
    )
}


const EditingMap = () => {
    return(
       <>
        <Banner></Banner>
        <div className="bg-primary-GeoPurple min-h-screen max-h-screen flex justify-between items-center flex-col ">
        <MapView></MapView>
        <BottomRow></BottomRow>
        </div>

       </>
    );
}

export default EditingMap