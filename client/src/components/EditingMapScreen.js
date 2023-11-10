import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer,GeoJSON } from 'react-leaflet';
import {useState} from "react";
import L from 'leaflet';
import PropTypes from 'prop-types';
import Banner from './Banner.js'
import {  AlphaSlider } from 'react-slider-color-picker'
import tinycolor from "tinycolor2";
import { HexColorPicker } from 'react-colorful';


import undo from '../assets/EditMapAssets/undoSmall.png'
import redo from '../assets/EditMapAssets/redoSmall.png'
import franceMap from '../assets/EditMapAssets/france-r.geo.json'  //To be removed
import {MAP_TYPES, STRING_MAPPING} from '../constants/MapTypes.js'
import {p1,p2,p3,p4,p5,p6,p7,p8,p9} from '../assets/EditMapAssets/pointerImages/index.js'

const hexToHlsa = (hexString) => {
    
    const color = tinycolor(hexString)
    const hsl = color.toHsv()
    const hslReformat = {
        h: hsl.h,
        s: hsl.s,
        l : hsl.v,
        a: hsl.a
    }
    console.log(hslReformat)
    console.log(typeof hslReformat);

    return hslReformat
}


const ColorSlider = (props) => {
    const hlsaColor = props.hlsaColor
    const changeHlsa = props.changeHlsa

    const handleChangeColor = (newcolor) => {
        console.log('Changer')
      console.log(newcolor)
      changeHlsa(newcolor)
    }

    return (
      <>
        <AlphaSlider handleChangeColor={handleChangeColor} color={hlsaColor}/>
      </>
    )
  }
  ColorSlider.propTypes = {
    hlsaColor: PropTypes.object.isRequired,
    changeHlsa: PropTypes.func.isRequired
};

const BottomRow = () => {
    return(
        <div className='w-4/5 flex  flex-row justify-between'>
        <div className='flex flex-row'>
            <div className='flex flex-row ' >
                <div ><img src={undo} className='object-contain' alt='Undo action'/></div>
                <div ><img src={redo} className='object-contain' alt='Redo action'/></div>
            </div>
            
        </div>
        <div className='flex justify-between'>
            <div className='pr-14'>
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

const MapEditOptions = (props) => {
    const type_of_map =  props.mapType 
    const [selected,setSelected] = useState('') //used to control current item can for any
    const [heatColor, setHlsa] = useState( hexToHlsa('#000000')) //Used for heat map, in hlsa format
    const selectedColor = '#3b82f6' //used for heatmap

    const [choroColor, setColor] = useState("#aabbcc");  //Used for choro map, hex format
    const choroColorFormat = choroColor.toUpperCase()

    switch(type_of_map){
        case MAP_TYPES.NONE:
            return(null)
            
        case MAP_TYPES.HEAT_MAP:
            console.log(selected)
            return(
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl '>
                        <div className='bg-primary-GeoOrange rounded-t-3xl '>Colors</div>
                        <div className='grid grid-cols-3 gap-3 h-2/3 pt-12'>
                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={()=>{setHlsa(hexToHlsa('#ff0000'));setSelected('red')}} 
                            style={{ borderColor: selected === 'red' ? selectedColor : '#000000', backgroundColor:'#ff0000'}}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={()=>{setHlsa(hexToHlsa('#00ff00'));setSelected('green')}} 
                            style={{ borderColor: selected === 'green' ? selectedColor : '#000000', backgroundColor:'#00ff00'}}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={()=>{setHlsa(hexToHlsa('#0019ff'));setSelected('blue')}} 
                            style={{ borderColor: selected === 'blue' ? selectedColor : '#000000', backgroundColor:'#0019ff'}}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={()=>{setHlsa(hexToHlsa('#00fffd'));setSelected('cyan')}} 
                            style={{ borderColor: selected === 'cyan' ? selectedColor : '#000000', backgroundColor:'#00fffd'}}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={()=>{setHlsa(hexToHlsa('#5b00ff'));setSelected('purple')}} 
                            style={{ borderColor: selected === 'purple' ? selectedColor : '#000000', backgroundColor:'#5b00ff'}}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={()=>{setHlsa(hexToHlsa('#ffb400'));setSelected('orange')}} 
                            style={{ borderColor: selected === 'orange' ? selectedColor : '#000000', backgroundColor:'#ffb400'}}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={()=>{setHlsa(hexToHlsa('#000000'));setSelected('black')}} 
                            style={{ borderColor: selected === 'black' ? selectedColor : '#000000', backgroundColor:'#000000'}}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={()=>{setHlsa(hexToHlsa('#ff00d9'));setSelected('pink')}} 
                            style={{ borderColor: selected === 'pink' ? selectedColor : '#000000', backgroundColor:'#ff00d9'}}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={()=>{setHlsa(hexToHlsa('#fffe00'));setSelected('yellow')}} 
                            style={{ borderColor: selected === 'yellow' ? selectedColor : '#000000',backgroundColor:'#fffe00'}}></div>
                        </div>
                        {
                            selected != ''
                            ?
                                <div><ColorSlider {...{hlsaColor:heatColor, changeHlsa:setHlsa}}/></div>
                            :
                                null
                        }
                    </div>
                </>
            )
        case MAP_TYPES.POINT_MAP:
            return(
            <>
                <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl'>
                        <div className='bg-primary-GeoOrange rounded-t-3xl'><div>Point Locator Options</div></div>
                        <div className='grid grid-cols-3 gap-3  h-4/5  mx-auto'>
                        <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4' 
                            style={{ borderColor: selected === 'p1' ? selectedColor : '#F9FAFB'}}>
                            <img src={p1} alt='p1' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={()=>setSelected("p1")}/>
                        </div>
                        <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4' 
                            style={{ borderColor: selected === 'p2' ? selectedColor : '#F9FAFB'}}>
                            <img src={p2} alt='p2' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={()=>setSelected("p2")}/>
                        </div>
                        <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4' 
                            style={{ borderColor: selected === 'p3' ? selectedColor : '#F9FAFB'}}>
                            <img src={p3} alt='p3' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={()=>setSelected("p3")}/>
                        </div>
                        <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4' 
                            style={{ borderColor: selected === 'p4' ? selectedColor : '#F9FAFB'}}>
                            <img src={p4} alt='p4' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={()=>setSelected("p4")}/>
                        </div>
                        <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4' 
                            style={{ borderColor: selected === 'p5' ? selectedColor : '#F9FAFB'}}>
                            <img src={p5} alt='p5' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={()=>setSelected("p5")}/>
                        </div>
                        <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4' 
                            style={{ borderColor: selected === 'p6' ? selectedColor : '#F9FAFB'}}>
                            <img src={p6} alt='p6' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={()=>setSelected("p6")}/>
                        </div>
                        <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4' 
                            style={{ borderColor: selected === 'p7' ? selectedColor : '#F9FAFB'}}>
                            <img src={p7} alt='p7' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={()=>setSelected("p7")}/>
                        </div>
                        <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4' 
                            style={{ borderColor: selected === 'p8' ? selectedColor : '#F9FAFB'}}>
                            <img src={p8} alt='p8' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={()=>setSelected("p8")}/>
                        </div>
                        <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4' 
                            style={{ borderColor: selected === 'p9' ? selectedColor : '#F9FAFB'}}>
                            <img src={p9} alt='p9' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={()=>setSelected("p9")}/>
                        </div>
                        </div>
                </div>
            </>
            )
        case MAP_TYPES.CHOROPLETH_MAP:
            return(
                <>
                <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl'>
                        <div className='bg-primary-GeoOrange rounded-t-3xl '><div>Color Selector</div>
                        </div>
                        <div className='flex flex-col items-center pt-32 w-full mx-auto'>
                            <HexColorPicker color={choroColor} onChange={setColor} style={{ width: '80%', height:'400px' }} />
                        </div>
                        <div>Hex Color: {choroColorFormat}</div>
                    </div>
                </>
            )
        case MAP_TYPES.FLOW_MAP:
            break
        default:
            break
    }
}
MapEditOptions.propTypes = {
    mapType: PropTypes.number.isRequired
};
const MapView = () => {

    // const [map, setMap] = useState(null)
    const [title, setTitle] = useState('')
    console.log(title)
    const [map, ] = useState(franceMap) //For testing
    const [typeSelected, setType] = useState(MAP_TYPES.NONE)
    const [mapTypeClicked, isClicked] = useState(false)

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

    return (
        <>
        <div className='w-4/5 flex justify-center flex-row'>   
            <div className='w-1/2 flex justify-center flex-col pt-32 items-center'>
                <div>
                    <input type='text' name='title' className='bg-primary-GeoPurple text-white placeholder-white text-2xl w-[35rem]
                        text-center'
                            placeholder='Enter Title...' maxLength={48} onChange={(e) => setTitle(e.target.value)} >
                    </input>
                </div>
                <div className='pt-3'> 
                    <MapContainer 
                        center={center} 
                        zoom={5} 
                        style={{ height: '750px', width: '900px' }} 
                        scrollWheelZoom={true}
                        maxBounds={[padded_NE,padded_SW]}>
                    <TileLayer
                         url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                         attribution='Tiles © Esri &mdash; Esri, DeLorme, NAVTEQ'
                    />
                    <GeoJSON data={map.features}/>
                    </MapContainer>
                </div>
            </div> 
            <div className='w-1/2 flex justify-center pt-32 ' > 
                <div className='w-full text-2xl font-NanumSquareNeoOTF-Lt flex flex-col  items-center text-center'>

                    {!mapTypeClicked
                        ?
                            <>
                            {typeSelected == ""
                                ?<button className='w-3/5 bg-primary-GeoOrange' onClick={() => isClicked(!mapTypeClicked) }>Select Map Type ▼ </button>
                                :
                                <>
                                <button className='w-3/5 bg-primary-GeoOrange' onClick={() => isClicked(!mapTypeClicked) }>{STRING_MAPPING[typeSelected]}</button>
                                <MapEditOptions {...{mapType:typeSelected}}/>
                                </>
                            }
                            </>
                        :
                        <>
                            <button onClick={() => isClicked(!mapTypeClicked) } className='w-3/5 bg-primary-GeoOrange'>Select Map Type ▼ </button>
                            <button className='w-3/5 bg-primary-GeoOrange ' onClick={() => {isClicked(false); setType(MAP_TYPES.HEAT_MAP)}}>Heatmap </button>
                            <button className='w-3/5 bg-primary-GeoOrange' onClick={() => {isClicked(false); setType(MAP_TYPES.POINT_MAP)}}>Point/Locator</button>
                            <button className='w-3/5 bg-primary-GeoOrange' onClick={() => {isClicked(false); setType(MAP_TYPES.SYMBOL_MAP)}}> Symbol </button>
                            <button className='w-3/5 bg-primary-GeoOrange' onClick={() => {isClicked(false); setType(MAP_TYPES.CHOROPLETH_MAP)}}>Choropleth </button>
                            <button className='w-3/5 bg-primary-GeoOrange' onClick={() => {isClicked(false); setType(MAP_TYPES.FLOW_MAP)}}>Flow </button>
                        </>
                    }
                    
                </div>
               
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