import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState, useContext,useRef,useEffect } from "react";
import L from 'leaflet';
import { SaturationSlider , HueSlider } from 'react-slider-color-picker'
import tinycolor from "tinycolor2";
import { HexColorPicker } from 'react-colorful';
import undo from '../../assets/EditMapAssets/undoSmall.png'
import redo from '../../assets/EditMapAssets/redoSmall.png'
// import franceMap from '../assets/EditMapAssets/france-r.geo.json'  //To be removed
import { MAP_TYPES, STRING_MAPPING } from '../../constants/MapTypes.js'
import { p1, p2, p3, p4, p5, p6, p7, p8, p9 } from '../../assets/EditMapAssets/pointerImages/index.js'
import { circle, triangle, square, star, hexagon, pentagon } from '../../assets/EditMapAssets/symbolImages/index.js'
import { a1, a2, a3, a4, a5, a6 } from '../../assets/EditMapAssets/arrowImages/index.js'
import { authgetUser } from '../../api/auth_request_api.js';
import { saveUserMap, createMap } from "../../api/map_request_api.js"
import { /**UserActionType, */ UserContext } from "../../api/UserContext.js"
import { /**MapActionType，*/ MapContext } from "../../api/MapContext.js"
import HeatUi from './HeatMapUI.js';

//Note assigns saturation of 100 for satslider
const hexToHlsa = (hexString) => {

    const color = tinycolor(hexString)
    const hsl = color.toHsl()
    
    // console.log(hexString, hsl)
    hsl.s = 100
    return hsl
}

const hlsaToRGBA = (hlsa) => {
    const color = tinycolor(hlsa)
    const rgba = color.toRgb()
    const rgbaString = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    // console.log("Input", hlsa)
    // console.log("COnversion",rgbaString)
    return rgbaString
}


const BottomRow = ({ title, mapType, description }) => {
    const [publicStatus, setPublic] = useState(false)
    const { user } = useContext(UserContext)
    const { map } = useContext(MapContext)

    const handleSaveMap = async (e) => {
        e.preventDefault()
        if (user) {
            // const mapData = geobuf_api.geojson_compress(map)
            const map_type = Object.keys(MAP_TYPES).find(key => MAP_TYPES[key] === mapType)
            const response = await saveUserMap(user._id, title, publicStatus, map_type, description, map) // testing
            // console.log(response)
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
                    <div className='inline-block'><button className={`bg-green-200 text-3xl
                                                    font-NanumSquareNeoOTF-Lt px-8 rounded-full py-2 ${!publicStatus && 'opacity-50'}`} onClick={() => setPublic(true)}>
                        Public</button>
                    </div>
                    <div className=' inline-block'> <button className={`bg-red-300 text-3xl
                                                    font-NanumSquareNeoOTF-Lt px-8  rounded-full py-2 ${publicStatus && 'opacity-50'}`} onClick={() => setPublic(false)}>
                        Private</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

const MapEditOptions = (props) => {
    const type_of_map = props.mapType
    const setType = props.setType
    const areaClicked = props.areaClicked
    const setAreaClicked = props.setAreaClicked
    const editsList = props.editsList
    const setEditsList = props.setEditsList

    const selectedColor = '#3b82f6' //used for heatmap

    const [selected, setSelected] = useState('') //used to control current item can for any
    const [heatColor, setHlsa] = useState(hexToHlsa('#000000')) //Used for heat map, in hlsa format
    const [lowerBound, setLower] = useState('')
    const [upperBound, setUpper] = useState('')
  

    const [choroColor, setColor] = useState("#aabbcc");  //Used for choro map, hex format
    const choroColorFormat = choroColor.toUpperCase()
    const [key, setKey] = useState('')
    const [label, setLabel] = useState('')
    // console.log(key)
    // console.log(label)

    const [symbColor, setSymbColor] = useState("#aabbcc");  //Used for symbmap color, hlsa

    const handleChangeColor = (newColor) => {
        setSymbColor(newColor)
    }
    // console.log('CUrrent Heat color',heatColor)
    switch (type_of_map) {
        case MAP_TYPES['NONE']:
            return (null)

        case MAP_TYPES['HEATMAP']:
        {
            const props = {
                setType : setType,
                selected : selected,
                setSelected : setSelected,
                selectedColor : selectedColor,
                areaClicked : areaClicked,
                setAreaClicked: setAreaClicked,
                heatColor : heatColor,
                setHlsa : setHlsa,
                editsList : editsList,
                setEditsList : setEditsList,
                setUpper: setUpper,
                setLower:setLower,
                hexToHlsa: hexToHlsa
            }
            return (
                <>
                    <HeatUi  {...props}/>
                </>
            )
        }
        case MAP_TYPES['POINT']:
            return (
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl'>
                        <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt' onClick={() => setType(MAP_TYPES['NONE'])}><div>Point Locator Options</div></div>
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
        case MAP_TYPES['CHOROPLETH']:
            return (
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl font-NanumSquareNeoOTF-Lt flex flex-col'>
                        <div className='bg-primary-GeoOrange rounded-t-3xl ' onClick={() => setType(MAP_TYPES['NONE'])}><div>Color Selector</div>
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
        case MAP_TYPES['SYMBOL']:
            return (
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl'>
                        <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt' onClick={() => setType(MAP_TYPES['NONE'])}><div>Symbol Options</div></div>
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
        case MAP_TYPES['FLOW']:
            return (
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-3/5 bg-gray-50 rounded-3xl'>
                        <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt' onClick={() => setType(MAP_TYPES['NONE'])}><div>Symbol Options</div></div>
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

const MapView = () => {
    const { map, /** dispatch */ } = useContext(MapContext)
    // const [map, setMap] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    // console.log(title)
    // const [map,] = useState(franceMap) //For testing
    const [typeSelected, setType] = useState(MAP_TYPES['NONE'])
    const [mapTypeClicked, isClicked] = useState(false)
    const [editsList, setEditsList] = useState([])//Holds the data object(depends on type) of changes
    const [styleMapping, setStyleMapping] = useState({});

    const [areaClicked, setAreaClicked] = useState(null) //In heat/choro should be feature, coordinates for other

    const possibleNames = ['name', 'nom', 'nombre','title', 'label', 'id']
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
    const mapString = STRING_MAPPING[typeSelected]

    const typeSelectedRef = useRef(typeSelected)
    useEffect(() => {
        typeSelectedRef.current = typeSelected
    }, [typeSelected])
    const editsListRef = useRef(editsList)
    useEffect(() => {
        editsListRef.current = editsList
        const newMappings = {}
        editsListRef.current.forEach((edit)=>{
            switch(typeSelectedRef.current)
            {
                case MAP_TYPES['HEATMAP']:
                {
                    // console.log("Adding", edit.featureName)
                    newMappings[edit.featureName] = {fillColor: hlsaToRGBA(edit.colorHLSA), fillOpacity: 1}
                    break
                }
                default:
                    break
            }
        }
        )
        setStyleMapping(newMappings)
    }, [editsList])

    // console.log("CUrrent Edits",editsListRef.current)
    const geoJsonKey = JSON.stringify(styleMapping); // Create a key that changes when styleMapping changes
    // console.log("Style Mapping",styleMapping)
    const getFeatureStyle = (feature) => {
        // console.log("AM HERE")
        const foundName = possibleNames.find(propertyName => propertyName in feature.properties)
        if (foundName) 
        {
            // console.log("STYLING", styleMapping[feature.properties[foundName]] )
            return styleMapping[feature.properties[foundName]] || {fillColor:'#ffffff'}
        }
        return {}
    }
    const onFeatureClick = (feature) => {
        const clickedFeature = feature;
        // console.log(typeSelectedRef.current)
        switch(typeSelectedRef.current)
        {
            case MAP_TYPES['HEATMAP']:
            {
                const foundName = possibleNames.find(propertyName => propertyName in clickedFeature.properties)
                // console.log("found Name",foundName)
                if (foundName) {
                    // console.log('Clicked feature ' + clickedFeature.properties[foundName])
                    setAreaClicked(clickedFeature.properties[foundName])
                } else {
                    // console.log('No known name property found in clicked feature', clickedFeature)
                }  
                break
            }
            default:
                break
        }
    }
    // console.log("type", typeSelected)
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
                            maxBounds={[padded_NE, padded_SW]}
                            doubleClickZoom={ false}
                            >
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                                attribution='Tiles © Esri &mdash; Esri, DeLorme, NAVTEQ'
                            />
                            <GeoJSON 
                                key = {geoJsonKey}
                                data={map.features}
                                onEachFeature={(feature, layer) => {
                                    layer.on('click', () => onFeatureClick(feature))
                                    const featureStyle = getFeatureStyle(feature)
                                    layer.setStyle(featureStyle); 
                                }}
                             />
                        </MapContainer>
                    </div>

                    <input type='text' name='description' className='bg-primary-GeoPurple text-white placeholder-white text-2xl w-[35rem]
                        text-center'
                        placeholder='Enter Description...' maxLength={48} onChange={(e) => setDescription(e.target.value)} >
                    </input>
                </div>
                <div className='w-1/2 flex justify-center pt-32 ' >
                    <div className='w-full text-2xl font-NanumSquareNeoOTF-Lt flex flex-col  items-center text-center'>

                        {!mapTypeClicked
                            ?
                            <>
                                {typeSelected == MAP_TYPES['NONE']
                                    ? <button className='w-3/5 bg-primary-GeoOrange' onClick={() => isClicked(!mapTypeClicked)}>Select Map Type ▼ </button>
                                    :
                                    <>
                                        <button className='w-3/5 bg-primary-GeoOrange' onClick={() => isClicked(!mapTypeClicked)}>{mapString}</button>
                                        <MapEditOptions mapType={typeSelected} setType={setType} areaClicked = {areaClicked} setAreaClicked={setAreaClicked}
                                            editsList = {editsList} setEditsList={setEditsList}
                                        />
                                    </>
                                }
                            </>
                            :
                            <>
                                <button onClick={() => isClicked(!mapTypeClicked)} className='w-3/5 bg-primary-GeoOrange'>Select Map Type ▼ </button>
                                <button className='w-3/5 bg-primary-GeoOrange ' onClick={() => { isClicked(false); setType(MAP_TYPES['HEATMAP']) }}>Heatmap </button>
                                <button className='w-3/5 bg-primary-GeoOrange' onClick={() => { isClicked(false); setType(MAP_TYPES['POINT']) }}>Point/Locator</button>
                                <button className='w-3/5 bg-primary-GeoOrange' onClick={() => { isClicked(false); setType(MAP_TYPES['SYMBOL']) }}> Symbol </button>
                                <button className='w-3/5 bg-primary-GeoOrange' onClick={() => { isClicked(false); setType(MAP_TYPES['CHOROPLETH']) }}>Choropleth </button>
                                <button className='w-3/5 bg-primary-GeoOrange' onClick={() => { isClicked(false); setType(MAP_TYPES['FLOW']) }}>Flow </button>
                            </>
                        }

                    </div>

                </div>
            </div>
            <BottomRow title={title} mapType={typeSelected} description={description}></BottomRow>
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