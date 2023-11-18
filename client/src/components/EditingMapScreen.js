import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState, useContext } from "react";
import L from 'leaflet';
import PropTypes from 'prop-types';
import { AlphaSlider, HueSlider } from 'react-slider-color-picker'
import tinycolor from "tinycolor2";
import { HexColorPicker } from 'react-colorful';
import undo from '../assets/EditMapAssets/undoSmall.png'
import redo from '../assets/EditMapAssets/redoSmall.png'
// import franceMap from '../assets/EditMapAssets/france-r.geo.json'  //To be removed
import { MAP_TYPES, STRING_MAPPING } from '../constants/MapTypes.js'
import { p1, p2, p3, p4, p5, p6, p7, p8, p9 } from '../assets/EditMapAssets/pointerImages/index.js'
import { circle, triangle, square, star, hexagon, pentagon } from '../assets/EditMapAssets/symbolImages/index.js'
import { a1, a2, a3, a4, a5, a6 } from '../assets/EditMapAssets/arrowImages/index.js'
import { authgetUser } from '../api/auth_request_api.js';
import { saveUserMap, createMap } from "../api/map_request_api.js"
import { /**UserActionType, */ UserContext } from "../api/UserContext.js"
import { /**MapActionType，*/ MapContext } from "../api/MapContext.js"
import geobuf_api from '../api/geobuf_api.js';
const hexToHlsa = (hexString) => {

    const color = tinycolor(hexString)
    const hsl = color.toHsv()
    const hslReformat = {
        h: hsl.h,
        s: hsl.s,
        l: hsl.v,
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
            <AlphaSlider handleChangeColor={handleChangeColor} color={hlsaColor} />
        </>
    )
}
ColorSlider.propTypes = {
    hlsaColor: PropTypes.object.isRequired,
    changeHlsa: PropTypes.func.isRequired
};

const BottomRow = ({ title, typeSelected }) => {
    const { user } = useContext(UserContext)
    const { map } = useContext(MapContext)
    const handleSaveMap = async (e) => {
        e.preventDefault()
        if (user) {
            const mapData = geobuf_api.geojson_compress(map)
            const response = await saveUserMap(user._id, "test title", false, 'NONE', "", mapData) // testing
            console.log(response)
        }
    }

    return (
        <div className='w-4/5 flex  flex-row justify-between mt-4'>
            <div className='flex flex-row'>
                <div className='flex flex-row ' >
                    <div ><img src={undo} className='object-contain' alt='Undo action' /></div>
                    <div ><img src={redo} className='object-contain' alt='Redo action' /></div>
                </div>

            </div>
            <div className='flex justify-between'>
                <div className='pr-14'>
                    <div className='inline-block'><button className='bg-primary-GeoOrange text-3xl 
                                                font-NanumSquareNeoOTF-Lt px-14 rounded-full py-2'>
                        Export</button>
                    </div>
                    <div className='pl-12 inline-block pr-16'><button className='bg-primary-GeoOrange text-3xl
                                                font-NanumSquareNeoOTF-Lt px-14 rounded-full py-2 disabled:opacity-30' onClick={handleSaveMap} disabled={!(map && user)}>
                        Save</button>
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
    const type_of_map = props.mapType
    const selectedColor = '#3b82f6' //used for heatmap

    const [selected, setSelected] = useState('') //used to control current item can for any
    const [heatColor, setHlsa] = useState(hexToHlsa('#000000')) //Used for heat map, in hlsa format
    const [lowerBound, setLower] = useState('')
    const [upperBound, setUpper] = useState('')
    console.log(lowerBound)
    console.log(upperBound)


    const [choroColor, setColor] = useState("#aabbcc");  //Used for choro map, hex format
    const choroColorFormat = choroColor.toUpperCase()
    const [key, setKey] = useState('')
    const [label, setLabel] = useState('')
    console.log(key)
    console.log(label)

    const [symbColor, setSymbColor] = useState("#aabbcc");  //Used for symbmap color, hlsa

    const handleChangeColor = (newColor) => {
        setSymbColor(newColor)
    }
    switch (type_of_map) {
        case MAP_TYPES.NONE:
            return (null)

        case MAP_TYPES.HEAT_MAP:
            console.log(selected)
            return (
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl '>
                        <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt'>Colors</div>
                        <div className='grid grid-cols-3 gap-3 h-2/3 pt-12'>
                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { setHlsa(hexToHlsa('#ff0000')); setSelected('red') }}
                                style={{ borderColor: selected === 'red' ? selectedColor : '#000000', backgroundColor: '#ff0000' }}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { setHlsa(hexToHlsa('#00ff00')); setSelected('green') }}
                                style={{ borderColor: selected === 'green' ? selectedColor : '#000000', backgroundColor: '#00ff00' }}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { setHlsa(hexToHlsa('#0019ff')); setSelected('blue') }}
                                style={{ borderColor: selected === 'blue' ? selectedColor : '#000000', backgroundColor: '#0019ff' }}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { setHlsa(hexToHlsa('#00fffd')); setSelected('cyan') }}
                                style={{ borderColor: selected === 'cyan' ? selectedColor : '#000000', backgroundColor: '#00fffd' }}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { setHlsa(hexToHlsa('#5b00ff')); setSelected('purple') }}
                                style={{ borderColor: selected === 'purple' ? selectedColor : '#000000', backgroundColor: '#5b00ff' }}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { setHlsa(hexToHlsa('#ffb400')); setSelected('orange') }}
                                style={{ borderColor: selected === 'orange' ? selectedColor : '#000000', backgroundColor: '#ffb400' }}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { setHlsa(hexToHlsa('#000000')); setSelected('black') }}
                                style={{ borderColor: selected === 'black' ? selectedColor : '#000000', backgroundColor: '#000000' }}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { setHlsa(hexToHlsa('#ff00d9')); setSelected('pink') }}
                                style={{ borderColor: selected === 'pink' ? selectedColor : '#000000', backgroundColor: '#ff00d9' }}></div>

                            <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { setHlsa(hexToHlsa('#fffe00')); setSelected('yellow') }}
                                style={{ borderColor: selected === 'yellow' ? selectedColor : '#000000', backgroundColor: '#fffe00' }}></div>
                        </div>
                        {
                            selected != ''
                                ?
                                <>
                                    <div><ColorSlider {...{ hlsaColor: heatColor, changeHlsa: setHlsa }} /></div>
                                    <div className='flex justify-between flex-col'>
                                        <div className='flex flex-row justify-between text-1xl'>
                                            <div>Lower Bound</div>
                                            <div>Upper Bound</div>
                                        </div>
                                        <div className='flex flex-row justify-between w-full items-center'>
                                            <div className='w-1/2 '>
                                                <input className='w-4/12 border-2 border-black' onChange={(e) => { setLower(e.target.value) }} />
                                            </div>
                                            <div className='w-1/2'>
                                                <input className='w-4/12 border-2 border-black' onChange={(e) => { setUpper(e.target.value) }} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                null
                        }
                    </div>
                </>
            )
        case MAP_TYPES.POINT_MAP:
            return (
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl'>
                        <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt'><div>Point Locator Options</div></div>
                        <div className='grid grid-cols-3 gap-3  h-4/5  mx-auto'>
                            <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'p1' ? selectedColor : '#F9FAFB' }}>
                                <img src={p1} alt='p1' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("p1")} />
                            </div>
                            <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'p2' ? selectedColor : '#F9FAFB' }}>
                                <img src={p2} alt='p2' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("p2")} />
                            </div>
                            <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'p3' ? selectedColor : '#F9FAFB' }}>
                                <img src={p3} alt='p3' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("p3")} />
                            </div>
                            <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'p4' ? selectedColor : '#F9FAFB' }}>
                                <img src={p4} alt='p4' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("p4")} />
                            </div>
                            <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'p5' ? selectedColor : '#F9FAFB' }}>
                                <img src={p5} alt='p5' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("p5")} />
                            </div>
                            <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'p6' ? selectedColor : '#F9FAFB' }}>
                                <img src={p6} alt='p6' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("p6")} />
                            </div>
                            <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'p7' ? selectedColor : '#F9FAFB' }}>
                                <img src={p7} alt='p7' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("p7")} />
                            </div>
                            <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'p8' ? selectedColor : '#F9FAFB' }}>
                                <img src={p8} alt='p8' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("p8")} />
                            </div>
                            <div className='flex justify-center items-center w-20 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'p9' ? selectedColor : '#F9FAFB' }}>
                                <img src={p9} alt='p9' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("p9")} />
                            </div>
                        </div>
                    </div>
                </>
            )
        case MAP_TYPES.CHOROPLETH_MAP:
            return (
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl font-NanumSquareNeoOTF-Lt flex flex-col'>
                        <div className='bg-primary-GeoOrange rounded-t-3xl '><div>Color Selector</div>
                        </div>
                        <div className='flex flex-col items-center pt-10 w-full mx-auto'>
                            <HexColorPicker color={choroColor} onChange={setColor} style={{ width: '80%', height: '300px' }} />
                        </div>
                        <div>Hex Color: {choroColorFormat}</div>
                        <div className='grid grid-cols-2 gap-2 pt-2 text-sm'> {/*TEMP FILLER WILL HAVE TO BUILD DYNAMICALLY LATER*/}
                            <div>Key</div>
                            <div>Label</div>
                            <div>#C20000</div>
                            <div>Warm</div>
                            <div>#0004B7</div>
                            <div>Cold</div>
                        </div>

                        <div className='flex items-end text-sm flex-row'>
                            <div className='w-1/2 '>
                                <input className='w-4/12 border-2 border-black' onChange={(e) => { setKey(e.target.value) }} />
                            </div>
                            <div className='w-1/2'>
                                <input className='w-4/12 border-2 border-black' onChange={(e) => { setLabel(e.target.value) }} />
                            </div>
                        </div>
                        <div className='justify justify-center'><button className='text-sm border-2 border-black w-2/12 bg-primary-GeoBlue'>Add New</button></div>
                    </div>
                </>
            )
        case MAP_TYPES.SYMBOL_MAP:
            return (
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl'>
                        <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt'><div>Symbol Options</div></div>
                        <div className='grid grid-cols-2 gap-2  h-4/5  mx-auto'>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'circle' ? selectedColor : '#F9FAFB' }}>
                                <img src={circle} alt='circle' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("circle")} />
                            </div>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'triangle' ? selectedColor : '#F9FAFB' }}>
                                <img src={triangle} alt='triangle' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("triangle")} />
                            </div>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'square' ? selectedColor : '#F9FAFB' }}>
                                <img src={square} alt='square' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("square")} />
                            </div>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'star' ? selectedColor : '#F9FAFB' }}>
                                <img src={star} alt='star' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("star")} />
                            </div>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'hexagon' ? selectedColor : '#F9FAFB' }}>
                                <img src={hexagon} alt='hexagon' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("hexagon")} />
                            </div>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'pentagon' ? selectedColor : '#F9FAFB' }}>
                                <img src={pentagon} alt='pentagon' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("pentagon")} />
                            </div>
                        </div>
                        <div className='flex flex-col items-center w-full mx-auto'>
                            <HueSlider handleChangeColor={handleChangeColor} color={symbColor} />
                        </div>
                    </div>
                </>
            )
        case MAP_TYPES.FLOW_MAP:
            return (
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl'>
                        <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt'><div>Symbol Options</div></div>
                        <div className='grid grid-cols-2 gap-2  h-4/5  mx-auto'>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'a1' ? selectedColor : '#F9FAFB' }}>
                                <img src={a1} alt='a1' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("a1")} />
                            </div>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'a2' ? selectedColor : '#F9FAFB' }}>
                                <img src={a2} alt='a2' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("a2")} />
                            </div>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'a3' ? selectedColor : '#F9FAFB' }}>
                                <img src={a3} alt='a3' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("a3")} />
                            </div>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'a4' ? selectedColor : '#F9FAFB' }}>
                                <img src={a4} alt='a4' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("a4")} />
                            </div>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'a5' ? selectedColor : '#F9FAFB' }}>
                                <img src={a5} alt='a5' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("a5")} />
                            </div>
                            <div className='flex justify-center items-center w-24 h-24 mx-auto my-auto origin-center border-4'
                                style={{ borderColor: selected === 'a6' ? selectedColor : '#F9FAFB' }}>
                                <img src={a6} alt='a6' className='max-h-full max-w-auto min-h-full min-w-auto' onClick={() => setSelected("a6")} />
                            </div>
                        </div>
                    </div>
                </>
            )
        default:
            break
    }
}
MapEditOptions.propTypes = {
    mapType: PropTypes.number.isRequired
};
const MapView = () => {
    const { map, /** dispatch */ } = useContext(MapContext)
    // const [map, setMap] = useState(null)
    const [title, setTitle] = useState('')
    console.log(title)
    // const [map,] = useState(franceMap) //For testing
    const [typeSelected, setType] = useState(MAP_TYPES.NONE)
    const [mapTypeClicked, isClicked] = useState(false)

    // console.log(map)
    // const zoomLevel = 2
    // const center = [46.2276, 2.2137]
    let geoJsonLayer
    let bounds
    let center
    let padded_NE
    let padded_SW
    if (map) {
        geoJsonLayer = L.geoJSON(map);
        bounds = geoJsonLayer.getBounds();
        center = bounds.getCenter();
        //Padding for bounds
        padded_NE = bounds.getNorthEast()
        padded_SW = bounds.getSouthWest()
        padded_NE.lat = padded_NE.lat + 5
        padded_SW.lat = padded_SW.lat - 5
        padded_NE.lng = padded_NE.lng + 5
        padded_SW.lng = padded_SW.lng - 5
    }
    return (
        map && (<>
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
                            maxBounds={[padded_NE, padded_SW]}>
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                                attribution='Tiles © Esri &mdash; Esri, DeLorme, NAVTEQ'
                            />
                            <GeoJSON data={map.features} />
                        </MapContainer>
                    </div>
                </div>
                <div className='w-1/2 flex justify-center pt-32 ' >
                    <div className='w-full text-2xl font-NanumSquareNeoOTF-Lt flex flex-col  items-center text-center'>

                        {!mapTypeClicked
                            ?
                            <>
                                {typeSelected == ""
                                    ? <button className='w-3/5 bg-primary-GeoOrange' onClick={() => isClicked(!mapTypeClicked)}>Select Map Type ▼ </button>
                                    :
                                    <>
                                        <button className='w-3/5 bg-primary-GeoOrange' onClick={() => isClicked(!mapTypeClicked)}>{STRING_MAPPING[typeSelected]}</button>
                                        <MapEditOptions {...{ mapType: typeSelected }} />
                                    </>
                                }
                            </>
                            :
                            <>
                                <button onClick={() => isClicked(!mapTypeClicked)} className='w-3/5 bg-primary-GeoOrange'>Select Map Type ▼ </button>
                                <button className='w-3/5 bg-primary-GeoOrange ' onClick={() => { isClicked(false); setType(MAP_TYPES.HEAT_MAP) }}>Heatmap </button>
                                <button className='w-3/5 bg-primary-GeoOrange' onClick={() => { isClicked(false); setType(MAP_TYPES.POINT_MAP) }}>Point/Locator</button>
                                <button className='w-3/5 bg-primary-GeoOrange' onClick={() => { isClicked(false); setType(MAP_TYPES.SYMBOL_MAP) }}> Symbol </button>
                                <button className='w-3/5 bg-primary-GeoOrange' onClick={() => { isClicked(false); setType(MAP_TYPES.CHOROPLETH_MAP) }}>Choropleth </button>
                                <button className='w-3/5 bg-primary-GeoOrange' onClick={() => { isClicked(false); setType(MAP_TYPES.FLOW_MAP) }}>Flow </button>
                            </>
                        }

                    </div>

                </div>
            </div>
            <BottomRow title={title} mapType={typeSelected}></BottomRow>
        </>)
    )
}



const EditingMap = () => {
    return (
        <>
            <div className="bg-primary-GeoPurple min-h-screen max-h-screen flex justify-between items-center flex-col overflow-auto">
                <MapView />
            </div>

        </>
    );
}

export default EditingMap