import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState, useContext, useRef, useEffect } from "react";
import L from 'leaflet';
import { SaturationSlider, HueSlider } from 'react-slider-color-picker'
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
import { PointUI } from './PointUI.js';
import { HeatMapHeader } from '../../editMapDataStructures/HeatMapData.js';
import { ChoroHeader } from '../../editMapDataStructures/ChoroplethMapData.js';
import { NoneMapHeader } from '../../editMapDataStructures/NoneMapData.js';
import ChoroUi from './ChoroUi.js';
import DraggableImageOverlay from './ImageDragging.js';
import PointMarker from './PointMarker.js';
import SymbolUi from './SymbolsUI.js';
import { SymbolHeader } from '../../editMapDataStructures/SymbolsMapData.js';
import { async } from 'regenerator-runtime';
import { PointHeader } from '../../editMapDataStructures/PointMapData.js';
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


const BottomRow = ({ title, mapType, description, editsList, lowerBound, upperBound, setValidHeatRange,
    baseColor, setValidTitle, keyTable }) => {
    const [publicStatus, setPublic] = useState(false)
    const { user } = useContext(UserContext)
    const { map, transactions } = useContext(MapContext)
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'completed' , 'error'

    const handleCheckboxChange = (event) => {
        setPublic(event.target.checked);
    };

    const handleSaveMap = async (e) => {
        e.preventDefault()
        if (title === '') {
            setValidTitle(false)
            return
        }
        else
            setValidTitle(true)
        if (user) {
            // const mapData = geobuf_api.geojson_compress(map)
            const map_type = Object.keys(MAP_TYPES).find(key => MAP_TYPES[key] === mapType)
            const mapInfo = {
                original_map: {},
                edits: {
                    header: {},
                    editsList: []
                }
            }
            switch (mapType) {
                case MAP_TYPES['HEATMAP']:
                    {
                        const lower = parseFloat(lowerBound)
                        const upper = parseFloat(upperBound)
                        if (!upper || !lower) {
                            setValidHeatRange(false)
                            return
                        }
                        if (upper < lower) //handle invalid upper
                        {
                            setValidHeatRange(false)
                            return
                        }
                        else
                            setValidHeatRange(true)
                        const newHeatHeader = new HeatMapHeader(lower, upper, baseColor)
                        mapInfo.edits.header = newHeatHeader
                        mapInfo.edits.editsList = editsList
                        break
                    }
                case MAP_TYPES['CHOROPLETH']:
                    {
                        const newChoroHeader = new ChoroHeader(keyTable)
                        mapInfo.edits.header = newChoroHeader
                        mapInfo.edits.editsList = editsList
                        break
                    }
                case MAP_TYPES['SYMBOL']:
                {
                    const newSymbolHeader = new SymbolHeader(editsList.length)
                    mapInfo.edits.header = newSymbolHeader
                    mapInfo.edits.editsList = editsList
                    break
                }

                case MAP_TYPES['POINT']:
                    {
                        const newPointHeader= new PointHeader(editsList.length)
                        mapInfo.edits.header = newPointHeader
                        mapInfo.edits.editsList = editsList
                        break
                    }
                
                default:
                    break
            }
            mapInfo.original_map = { ...map }
            const response = await saveUserMap(user.token, title, publicStatus, map_type, description, mapInfo) // testing
            try {

                if (response.status === 200) {
                    // Assuming 'response.ok' is true when the request is successful
                    console.log("Save successful:", response);
                    setSaveStatus('completed');
                    setTimeout(() => setSaveStatus('idle'), 2000);
                } else {
                    // Handle non-successful responses
                    console.error("Server responded with an error:", response);
                    setSaveStatus('error');
                    setTimeout(() => setSaveStatus('idle'), 2000);
                }
            } catch (error) {
                console.error("Error saving map:", error);
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 2000);
            }
            // console.log(response)
        }
    }
    const handleExport = async () => {
        let editHeader = new NoneMapHeader()
        switch (mapType) {
            case MAP_TYPES['HEATMAP']:
                {
                    const lower = parseFloat(lowerBound)
                    const upper = parseFloat(upperBound)
                    if (upper < lower) //handle invalid upper
                    {
                        setValidHeatRange(false)
                        return
                    }
                    else
                        setValidHeatRange(true)
                    editHeader = new HeatMapHeader(lower, upper, baseColor)
                    break
                }
            case MAP_TYPES['CHOROPLETH']:
                {
                    editHeader = new ChoroHeader(keyTable)
                    break
                }
            case MAP_TYPES['SYMBOL']:
            {
                editHeader = new SymbolHeader(editsList.length)
                break
            }
            case MAP_TYPES['POINT']:
                {
                    editHeader = new PointHeader(editsList.length)
                    break
                }
            default:
                break
        }
        const exportedData = {
            ...map,
            edits: {
                header: editHeader,
                editsList: editsList
            },
            description: description,
            title: title
        }
        let fileName = "geowizardMap"
        if (title !== '')
            fileName = title

        const exportString = JSON.stringify(exportedData)
        const blob = new Blob([exportString], { type: "text/json" })
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".geowizjson";
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }
    return (
        <div className='w-4/5 flex flex-row justify-start mt-4 items-center'>
            <div className='flex flex-row'>
                <div className='flex flex-row ' >
                    <button disabled={!transactions?.hasTransactionToUndo()} onClick={transactions?.undoTransaction()}><img src={undo} className={`object-contain ${!transactions?.hasTransactionToUndo() && "opacity-30"}`} alt='Undo action' /></button>
                    <button disabled={!transactions?.hasTransactionToRedo()} onClick={transactions?.doTransaction()}><img src={redo} className={`object-contain ${!transactions?.hasTransactionToUndo() && "opacity-30"}`} alt='Redo action' /></button>
                </div>

            </div>
            <div className='flex justify-between'>
                <div className='flex justify-evenly'>
                    <div className='inline-block'><button className='bg-primary-GeoOrange text-3xl 
                                                font-NanumSquareNeoOTF-Lt px-14 rounded-full py-2' onClick={() => handleExport()}>
                        Export</button>
                    </div>
                    <div className='pl-12 inline-block pr-16'>
                        <button className='bg-primary-GeoOrange text-3xl font-NanumSquareNeoOTF-Lt px-14 rounded-full py-2 disabled:opacity-30'
                            onClick={handleSaveMap}
                            disabled={!(map && user)}>
                            {saveStatus === 'idle' ? 'Save' : saveStatus === 'error' ? 'Error' : saveStatus === 'saving' ? 'Saving Map...' : 'Completed'}
                        </button>
                    </div>
                </div>

                <label className="relative flex justify-between items-center p-2 text-3xl font-NanumSquareNeoOTF-Lt">
                    {publicStatus ? "Public" : "Private"}
                    <input onChange={handleCheckboxChange}
                        checked={publicStatus} type="checkbox" className="absolute left-1/2 -translate-x-1/2 peer appearance-none rounded-md pl-12 pr-16" />
                    <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
                </label>
            </div>
        </div>
    )
}

const MapEditOptions = (props) => {
    const padded_NE = props.padded_NE
    const padded_SW = props.padded_SW
    const type_of_map = props.mapType
    const setType = props.setType
    const areaClicked = props.areaClicked
    const setAreaClicked = props.setAreaClicked
    const editsList = props.editsList
    const setEditsList = props.setEditsList
    const setLower = props.setLower
    const setUpper = props.setUpper
    const lowerBound = props.lowerBound
    const upperBound = props.upperBound
    const selectedColor = '#3b82f6' //used for heatmap
    const validHeatRange = props.validHeatRange
    const heatColor = props.heatColor
    const setHlsa = props.setHlsa

    const setValidHeatRange = props.setValidHeatRange
    const setBaseColor = props.setBaseColor

    const keyTable = props.keyTable //holds list of key labels mappings in form {color: hexColor, label:label}
    const setKeyTable = props.setKeyTable

    const [selected, setSelected] = useState('') //used to control current item can for any
    
  

    const [choroColor, setColor] = useState("#ffffff");  //Used for choro map, hex format
    const [key, setKey] = useState('')
    const [label, setLabel] = useState('')

    // console.log(key)
    // console.log(label)

    const [symbColor, setSymbColor] = useState(hexToHlsa('#aabbcc'));  //Used for symbmap color, hlsa

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
                hexToHlsa: hexToHlsa,
                lowerBound: lowerBound,
                upperBound: upperBound,
                validHeatRange: validHeatRange,
                setValidHeatRange: setValidHeatRange,
                setBaseColor:setBaseColor,

            }
            return (
                <>
                    <HeatUi  {...props} />
                </>
            )
        }
        case MAP_TYPES['POINT']:
            {
            const props = {
                setType : setType,
                selected: selected,
                setSelected: setSelected,
                selectedColor: selectedColor,
                handleChangeColor: handleChangeColor,
                symbColor:symbColor,
                areaClicked:areaClicked,
                setAreaClicked: setAreaClicked,
                editsList: editsList,
                setEditsList: setEditsList,
                padded_NE : padded_NE,
                padded_SW : padded_SW
            }
            return (
                    <PointUI{...props}></PointUI>
            )
            }
        case MAP_TYPES['CHOROPLETH']:
            {
                const props = {
                    setType: setType,
                    choroColor: choroColor,
                    setColor: setColor,
                    key: key,
                    setKey: setKey,
                    label: label,
                    setLabel: setLabel,
                    keyTable: keyTable,
                    setKeyTable: setKeyTable,
                    areaClicked: areaClicked,
                    setAreaClicked: setAreaClicked,
                    editsList: editsList,
                    setEditsList: setEditsList
                }
                return (
                    <>
                        <ChoroUi {...props} />
                    </>
                )
            }
        case MAP_TYPES['SYMBOL']:
            {
                const props = {
                    setType: setType,
                    selected: selected,
                    setSelected: setSelected,
                    selectedColor: selectedColor,
                    handleChangeColor: handleChangeColor,
                    symbColor: symbColor,
                    areaClicked: areaClicked,
                    setAreaClicked: setAreaClicked,
                    editsList: editsList,
                    setEditsList: setEditsList
                }
                return (
                    <>
                        <SymbolUi {...props} />
                    </>
                )
            }
        case MAP_TYPES['FLOW']:
            return (
                <>
                    <div className='invisible'>gap space</div>
                    <div className='h-full w-96 bg-gray-50 rounded-3xl'>
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
    console.log(map)
    // const [map, setMap] = useState(null)
    const [title, setTitle] = useState('')
    const [validTitle, setValidTitle] = useState(true)
    const [description, setDescription] = useState('')
    // console.log(title)
    // const [map,] = useState(franceMap) //For testing
    const [typeSelected, setType] = useState(MAP_TYPES['NONE'])
    const [mapTypeClicked, isClicked] = useState(false)
    const [editsList, setEditsList] = useState([]) //Holds the data object(depends on type) of changes
    const [styleMapping, setStyleMapping] = useState({});

    const [areaClicked, setAreaClicked] = useState(null) //In heat/choro should be feature, coordinates for other
    const [lowerBound, setLower] = useState('0')
    const [upperBound, setUpper] = useState('1')
    const [validHeatRange, setValidHeatRange] = useState(true)
    const [heatColor, setHlsa] = useState(hexToHlsa('#000000')) //Used for heat map, in hlsa format
    const [baseColor,setBaseColor] = useState(hexToHlsa('#ffffff'))

    const [keyTable, setKeyTable] = useState([])//holds list of key labels mappings in form {color: hexColor, label:label}

    const [changingMapTypeIsClicked, setChangingMapTypeIsClicked] = useState(false)
    const [futureTypeSelected, setFutureTypeSelected] = useState(MAP_TYPES['NONE'])
    const [geoJsonKey, setgeojsonKey] = useState('')
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
    useEffect(() => {//if upload geojson, then render the edits as well
        if (map) {
            console.log("this is map", map)
            if (map.description)
                setDescription(map.description)
            if (map.edits) {

                const fileMapType = map.edits.header.type
                // console.log("has map edits", fileMapType)
                setType(MAP_TYPES[fileMapType])
                setEditsList([...(map.edits.editsList)])
                
                switch(MAP_TYPES[fileMapType]){
                    case MAP_TYPES['HEATMAP']:
                        // console.log("setting key table")
                        setHlsa(map.edits.header.basecolorHLSA)
                        break
                    case MAP_TYPES['CHOROPLETH']:
                        // console.log("setting key table")
                        setKeyTable(map.edits.header.keyTable)
                        break
                    default:
                        break
                }
            }
            if (map.title)
                setTitle(map.title)
        }
    }, [map])
    useEffect(() => {
        typeSelectedRef.current = typeSelected
    }, [typeSelected])
    const editsListRef = useRef(editsList)
    useEffect(() => {
        editsListRef.current = editsList
        const newMappings = {}
        editsListRef.current.forEach((edit) => {
            switch (typeSelectedRef.current) {
                case MAP_TYPES['HEATMAP']:
                    {
                        // console.log("Adding", edit.featureName)
                        newMappings[edit.featureName] = { fillColor: hlsaToRGBA(edit.colorHLSA), fillOpacity: 0.7 }
                        break
                    }
                case MAP_TYPES['CHOROPLETH']:
                    {
                        // console.log("Adding", edit.featureName)
                        newMappings[edit.featureName] = { fillColor: edit.colorHEX, fillOpacity: 0.7 }
                        break
                    }
                default:
                    break
            }
        }
        )
        setStyleMapping(newMappings)
        const curKey = JSON.stringify(editsListRef.current); // Create a key that changes when styleMapping changes
        setgeojsonKey(curKey)
    }, [editsList])


    // console.log("CUrrent Edits",editsListRef.current)

    console.log(geoJsonKey)
    const getFeatureStyle = (feature) => {
        if (feature) {
            return styleMapping[feature.key] || { fillColor: '#ffffff' }
        }
        return {}
    }
    const onFeatureClick = (feature) => {
        const clickedFeature = feature;
        // console.log(clickedFeature)
        // console.log(typeSelectedRef.current)
        switch (typeSelectedRef.current) {
            case MAP_TYPES['HEATMAP']:
                {
                    // console.log(feature)
                    if (feature.key) {//feature will be a feature from geojson
                        setAreaClicked(clickedFeature.key)
                    } else {
                        console.log('No known name property found in clicked feature', clickedFeature)
                    }
                    break
                }
            case MAP_TYPES['CHOROPLETH']://feature will be a feature from geojson
                {
                    if (feature.key) {
                        setAreaClicked(clickedFeature.key)
                    } else {
                        console.log('No known name property found in clicked feature', clickedFeature)
                    }
                    break
                }
            case MAP_TYPES['SYMBOL']: //feature will be a latlng obg
                {
                    if (feature) {
                        // console.log(feature)
                        setAreaClicked(feature)
                    }
                    break
                }

            case MAP_TYPES['POINT']: //feature will be a latlng obg
            {
                if(feature)
                {
                    // console.log(feature)
                    setAreaClicked(feature)
                }
                break
            }

            default:
                break
        }
    }
    const handleHeatMapClick = () => {
        if (typeSelected === MAP_TYPES['NONE'] || typeSelected === MAP_TYPES['HEATMAP']) {
            isClicked(false)
            setType(MAP_TYPES['HEATMAP'])
        }
        else {
            setChangingMapTypeIsClicked(true)
            setFutureTypeSelected(MAP_TYPES['HEATMAP'])
        }
    }
    const handlePointMapClick = () => {
        if (typeSelected === MAP_TYPES['NONE'] || typeSelected === MAP_TYPES['POINT']) {
            isClicked(false)
            setType(MAP_TYPES['POINT'])
        }
        else {
            setChangingMapTypeIsClicked(true)
            setFutureTypeSelected(MAP_TYPES['POINT'])
        }
    }
    const handleSymbolMapClick = () => {
        if (typeSelected === MAP_TYPES['NONE'] || typeSelected === MAP_TYPES['SYMBOL']) {
            isClicked(false)
            setType(MAP_TYPES['SYMBOL'])
        }
        else {
            setChangingMapTypeIsClicked(true)
            setFutureTypeSelected(MAP_TYPES['SYMBOL'])
        }
    }
    const handleChoroplethMapClick = () => {
        if (typeSelected === MAP_TYPES['NONE'] || typeSelected === MAP_TYPES['CHOROPLETH']) {
            isClicked(false)
            setType(MAP_TYPES['CHOROPLETH'])
            console.log("setting type choro")
        }
        else {
            setChangingMapTypeIsClicked(true)
            setFutureTypeSelected(MAP_TYPES['CHOROPLETH'])
        }
    }
    const handleFlowMapClick = () => {
        if (typeSelected === MAP_TYPES['NONE'] || typeSelected === MAP_TYPES['FLOW']) {
            isClicked(false)
            setType(MAP_TYPES['FLOW'])
        }
        else {
            setChangingMapTypeIsClicked(true)
            setFutureTypeSelected(MAP_TYPES['FLOW'])
        }
    }
    const handleYesClick = () => {
        console.log("Yes Click")
        isClicked(false)
        setType(futureTypeSelected)
        setChangingMapTypeIsClicked(false)
        setEditsList([])
        setKeyTable([])
    }
    const handleNoClick = () => {
        console.log("No Click")
        isClicked(false)
        setType(typeSelected)
        setChangingMapTypeIsClicked(false)
    }
    // console.log("current type",typeSelected)
    return (
        map && (<>
            <div className='flex space-around px-28 pt-5'>
                <div className='flex justify-center flex-col items-center'>
                    <div>
                        {!validTitle
                            ? <div className='text-red-300 text-center'>Need Title</div>
                            : null
                        }
                        <input type='text' name='title' className='bg-primary-GeoPurple text-white placeholder-white text-2xl w-[35rem]
                        text-center'
                            placeholder='Enter Title...' maxLength={48} onChange={(e) => setTitle(e.target.value)} >
                        </input>
                    </div>
                    <div className='pt-3'>
                        <MapContainer
                            center={center}
                            zoom={5}
                            // style={{ height: '750px', width: '900px' }}
                            className='mapContainer'
                            scrollWheelZoom={true}
                            maxBounds={[padded_NE, padded_SW]}
                            doubleClickZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <GeoJSON
                                key={`${typeSelected}_${geoJsonKey}`}
                                data={map.features}
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
                                    if (feature.geometry.type === 'Point' && feature.properties.iconUrl) {
                                        return;
                                    }
                                    layer.on('click', (e) => {
                                        typeSelected === MAP_TYPES['CHOROPLETH'] || typeSelected === MAP_TYPES['HEATMAP']
                                            ? onFeatureClick(feature)
                                            : onFeatureClick(e.latlng)
                                    })
                                    if (typeSelected === MAP_TYPES['CHOROPLETH'] || typeSelected === MAP_TYPES['HEATMAP']) {
                                        const featureStyle = getFeatureStyle(feature)
                                        if (featureStyle.fillColor !== '#ffffff')
                                            // console.log("isColored",featureStyle.fillColor)
                                            layer.setStyle(featureStyle)
                                    }
                                }}
                            />
                            {typeSelectedRef.current === MAP_TYPES['SYMBOL']
                                ? editsList.map((edit) =>
                                    <DraggableImageOverlay key={edit.id} id={edit.id} image={edit.symbol}
                                        initialBounds={edit.bounds}
                                        color={edit.colorHLSA}
                                        editsList={editsList}
                                        setEditsList={setEditsList}
                                        mapBounds = {[padded_NE, padded_SW]}
                                    />)
                                : null
                             }

                            {typeSelectedRef.current===MAP_TYPES['POINT']
                                ? editsList.map((edit) => 
                                <PointMarker key={edit.id} 
                                    id={edit.id} 
                                    edit ={edit} 
                                    editsList = {editsList}
                                    setEditsList = {setEditsList}
                                />)
                                : null
                             }
                             
                             
                        </MapContainer>
                    </div>

                    <input type='text' name='description' className='bg-primary-GeoPurple text-white placeholder-white text-2xl w-[50rem]
                        text-center'
                        placeholder='Enter Description...' maxLength={48} onChange={(e) => setDescription(e.target.value)} >
                    </input>
                </div>
                <div className='px-16'>
                    <div className='text-2xl font-NanumSquareNeoOTF-Lt flex flex-col items-center text-center'>

                        {!mapTypeClicked && !changingMapTypeIsClicked
                            ?
                            <>
                                {typeSelected == MAP_TYPES['NONE']
                                    ? <button className='w-96 bg-primary-GeoOrange' onClick={() => isClicked(!mapTypeClicked)}>Select Map Type ▼ </button>
                                    :
                                    <>
                                        <button className=' bg-primary-GeoOrange w-full' onClick={() => isClicked(!mapTypeClicked)}>{mapString}</button>
                                        <MapEditOptions mapType={typeSelected} setType={setType} areaClicked = {areaClicked} setAreaClicked={setAreaClicked}
                                            editsList = {editsList} setEditsList={setEditsList} setLower={setLower} setUpper = {setUpper} validHeatRange = {validHeatRange}
                                            setValidHeatRange={setValidHeatRange} setBaseColor= {setBaseColor} heatColor = {heatColor} setHlsa = {setHlsa}
                                            keyTable={keyTable} setKeyTable={setKeyTable} mapBounds={[padded_NE, padded_SW]}
                                        />
                                    </>
                                }
                            </>
                            :
                            <div className='w-96'>
                                <>
                                    <button className='w-full bg-primary-GeoOrange' onClick={() => isClicked(!mapTypeClicked)}>Select Map Type ▼ </button>
                                    <button className='w-full bg-primary-GeoOrange' onClick={() => { setChangingMapTypeIsClicked(false); handleHeatMapClick() }}>Heatmap</button>
                                    <button className='w-full bg-primary-GeoOrange' onClick={() => { setChangingMapTypeIsClicked(false); handlePointMapClick() }}>Point/Locator</button>
                                    <button className='w-full bg-primary-GeoOrange' onClick={() => { setChangingMapTypeIsClicked(false); handleSymbolMapClick() }}>Symbol</button>
                                    <button className='w-full bg-primary-GeoOrange' onClick={() => { setChangingMapTypeIsClicked(false); handleChoroplethMapClick() }}>Choropleth</button>
                                    <button className='w-full bg-primary-GeoOrange' onClick={() => { setChangingMapTypeIsClicked(false); handleFlowMapClick() }}>Flow</button>
                                </>
                            </div>
                        }

                        {typeSelected === MAP_TYPES['NONE'] &&
                            <div className='w-full text-xl pt-4 font-PyeongChangPeace-Light'>
                                <p>Please select a map type to get started.</p>
                            </div>
                        }

                        {changingMapTypeIsClicked &&
                            <div className='w-full text-xl pt-4 font-PyeongChangPeace-Light promptBox'>
                                <div className='testBox'> Are you sure you want to switch maps? </div>
                                <div className="button-container">
                                    <button data-test-id="yes-button" className='yesButton' onClick={() => { handleYesClick() }}>Yes</button>
                                    <button data-test-id="no-button" className='noButton' onClick={() => { handleNoClick() }}>No</button>
                                </div>
                            </div>
                        }

                    </div>

                </div>
            </div>
            <BottomRow title={title} mapType={typeSelected} description={description} editsList={editsList} setValidTitle={setValidTitle}
                lowerBound={lowerBound} upperBound={upperBound} setValidHeatRange={setValidHeatRange} baseColor={baseColor}
                keyTable={keyTable}
            ></BottomRow>
        </>)
    )
}



const EditingMap = () => {
    return (
        <>
            <div className="bg-primary-GeoPurple min-h-screen max-h-screen overflow-auto">
                <MapView />
            </div>

        </>
    );
}

export default EditingMap

// bg-primary-GeoPurple min-h-screen max-h-screen flex justify-between items-center flex-col overflow-auto