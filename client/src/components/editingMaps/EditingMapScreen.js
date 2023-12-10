import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import { useState, useContext, useRef, useEffect } from "react";
import L from 'leaflet';
import { SaturationSlider, HueSlider } from 'react-slider-color-picker'
import tinycolor from "tinycolor2";
import { HexColorPicker } from 'react-colorful';
import undo from '../../assets/EditMapAssets/undoSmall.png'
import redo from '../../assets/EditMapAssets/redoSmall.png'
// import franceMap from '../assets/EditMapAssets/france-r.geo.json'  //To be removed
import { MAP_TYPES, STRING_MAPPING } from '../../constants/MapTypes.js'
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
import FlowArrow from './FlowArrow.js';
import { FlowEdit, FlowHead, FlowHeader } from '../../editMapDataStructures/FlowMapData.js';
import FlowUi from './FlowUi.js';
import html2canvas from 'html2canvas';
import { MapActionType } from '../../api/MapContext.js';
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
    baseColor, setValidTitle, keyTable, mapContainerRef }) => {
    const { user } = useContext(UserContext)
    const { map, mapObj, transactions, createOrSave, idToUpdate } = useContext(MapContext)
    const [publicStatus, setPublic] = useState(mapObj?.isPublic)
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'completed' , 'error'
    const { dispatch } = useContext(MapContext)
    //dropdown for exporting
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const exportButtons = [
        'PNG',
        'JPG',
        'Geowizjson'
    ]

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
                        const newPointHeader = new PointHeader(editsList.length)
                        mapInfo.edits.header = newPointHeader
                        mapInfo.edits.editsList = editsList
                        break
                    }
                case MAP_TYPES['FLOW']:
                    {
                        const newPointHeader = new FlowHeader(editsList.length, keyTable)
                        mapInfo.edits.header = newPointHeader
                        mapInfo.edits.editsList = editsList
                        break
                    }

                default:
                {
                    const noneMap= new NoneMapHeader()
                    mapInfo.edits.header = noneMap
                    mapInfo.edits.editsList = editsList
                }
                    break
            }
            mapInfo.original_map = { ...map }
            const response = await saveUserMap(user.token, title, publicStatus, map_type, description, mapInfo, createOrSave, idToUpdate) // testing
            try {

                if (response.status === 200) {
                    // Assuming 'response.ok' is true when the request is successful
                    console.log("Save successful:", response);
                    setSaveStatus('completed');
                    const responseMapId = response.data.map_id
                    if(idToUpdate === '')//no id in context aka new map
                    {
                        // console.log("Setting as map context",mapInfo.original_map)
                        dispatch({ type: MapActionType.UPDATE, payload: { map: {...map}, mapObj: 
                            { title: title, description: description, MapData: mapInfo, isPublic: publicStatus }, 
                            idToUpdate: responseMapId } })
                    }
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

    const exportMapAsImage = async (fileType = 'png', fileName) => {
        if (!mapContainerRef) {
            console.error("Map container is not available for export.");
            return;
        }

        setTimeout(async () => {
            try {
                const canvas = await html2canvas(mapContainerRef._container, {
                    allowTaint: false,
                    useCORS: true, // Important for external images like map tiles
                    //logging: true, // Useful for debugging
                    scale: window.devicePixelRatio || 1, // Adjust for high resolution screens
                    width: mapContainerRef._container.offsetWidth,
                    height: mapContainerRef._container.offsetHeight,
                    onrendered: function (canvas) {
                        document.body.appendChild(canvas);
                    }
                });

                const image = canvas.toDataURL(`image/${fileType}`);
                const link = document.createElement('a');
                link.href = image;
                link.download = `${fileName}.${fileType}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Error exporting image:", error);
            }
        }, 1000); // Adjust delay if needed
    };

    const handleExport = async (key) => {
        //console.log(key)

        if (key === 'PNG' || key === 'JPG') {
            //console.log(mapContainerRef._container)
            let fileName = "geowizardMap"
            if (title !== '')
                fileName = title
            exportMapAsImage(key.toLowerCase(), fileName)
            return
        }
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
            case MAP_TYPES['FLOW']:
                {
                    editHeader = new FlowHeader(editsList.length, keyTable)
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
        <div className='flex justify-between items-center w-full px-5'>
            <div className='flex'>
                <button className={`${transactions?.hasTransactionToUndo() && 'hover:opacity-30'}`} disabled={!transactions?.hasTransactionToUndo()} onClick={() => transactions?.undoTransaction()}><img src={undo} className={`object-contain ${!transactions?.hasTransactionToUndo() && "opacity-30"}`} alt='Undo action' /></button>
                <button className={`${transactions?.hasTransactionToRedo() && 'hover:opacity-30'}`} disabled={!transactions?.hasTransactionToRedo()} onClick={() => transactions?.doTransaction()}><img src={redo} className={`object-contain ${!transactions?.hasTransactionToRedo() && "opacity-30"}`} alt='Redo action' /></button>
            </div>
            <div className='flex items-center gap-5'>
                <div className='flex flex-col items-center'>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`w-36 hover:opacity-70 px-4 py-2  font-NanumSquareNeoOTF-Lt text-2xl
                            ${dropdownOpen ? 'rounded-b-none rounded-t-md' : 'rounded-md'
                            } flex items-center justify-between bg-primary-GeoOrange text-left text-white`}
                    >
                        Export
                        <span className='ml-2'>
                            {dropdownOpen ? (
                                <svg
                                    className='h-4 w-4'
                                    fill='none'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path d='M19 9l-7 7-7-7'></path>
                                </svg>
                            ) : (
                                <svg
                                    className='h-4 w-4'
                                    fill='none'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path d='M5 15l7-7 7 7'></path>
                                </svg>
                            )}
                        </span>
                    </button>
                    {dropdownOpen && (
                        <div className='w-36 texshadow-lg'>
                            {exportButtons.map((key, index) => (
                                <button
                                    key={key}
                                    className={`hover:opacity-70 block w-full py-2  bg-primary-GeoOrange text-xl font-NanumSquareNeoOTF-Lt text-white text-center
                                    ${index == exportButtons.length - 1
                                            ? ' rounded-b-md'
                                            : 'rounded-b-none'
                                        }`}
                                    onClick={() => handleExport(key)}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    )}

                    {/*                         
                        <button className='bg-primary-GeoOrange text-3xl font-NanumSquareNeoOTF-Lt px-14 rounded-full py-2' onClick={() => handleExport()}>
                        Export</button> */}
                </div>

                <div className=''>
                    <button className='bg-primary-GeoOrange hover:opacity-70 text-2xl font-NanumSquareNeoOTF-Lt px-6 rounded-md py-2 disabled:opacity-30 text-white'
                        onClick={handleSaveMap}
                        disabled={!(map && user)}>
                        {saveStatus === 'idle' ? (createOrSave === 'create' ? 'Create' : 'Save') : saveStatus === 'error' ? 'Error' : saveStatus === 'creating' ? (createOrSave ? 'Saving Map...' : 'Creating Map...') : 'Completed'}
                    </button>
                </div>
            </div>

            <label className=" justify-between items-center text-3xl font-NanumSquareNeoOTF-Lt inline-block">
                <div className='flex flex-row hover:opacity-80 hover:cursor-pointer'>
                    <span className='w-24 text-left'>
                        {publicStatus ? "Public " : "Private"}
                    </span>
                    <input onChange={handleCheckboxChange}
                        checked={publicStatus} type="checkbox" className="absolute left-1/2 -translate-x-1/2 peer appearance-none rounded-md pl-12 pr-16" />
                    <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
                </div>
            </label>
        </div>
    )
}

const MapEditOptions = (props) => {
    const padded_NE = props.mapBounds[0]
    const padded_SW = props.mapBounds[1]
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

    const flowColor = props.flowColor
    const handleFlowColor = props.handleFlowColor
    const selectedFlowArrow = props.selectedFlowArrow
    const setFlowArrow = props.setFlowArrow

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
                    setType: setType,
                    selected: selected,
                    setSelected: setSelected,
                    selectedColor: selectedColor,
                    areaClicked: areaClicked,
                    setAreaClicked: setAreaClicked,
                    heatColor: heatColor,
                    setHlsa: setHlsa,
                    editsList: editsList,
                    setEditsList: setEditsList,
                    setUpper: setUpper,
                    setLower: setLower,
                    hexToHlsa: hexToHlsa,
                    lowerBound: lowerBound,
                    upperBound: upperBound,
                    validHeatRange: validHeatRange,
                    setValidHeatRange: setValidHeatRange,
                    setBaseColor: setBaseColor,

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
                    setType: setType,
                    selected: selected,
                    setSelected: setSelected,
                    selectedColor: selectedColor,
                    handleChangeColor: handleChangeColor,
                    symbColor: symbColor,
                    areaClicked: areaClicked,
                    setAreaClicked: setAreaClicked,
                    editsList: editsList,
                    setEditsList: setEditsList,
                    padded_NE: padded_NE,
                    padded_SW: padded_SW
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
            {
                const props = {
                    setType: setType,
                    selected: selected,
                    setSelected: setSelected,
                    selectedColor: selectedColor,
                    handleFlowColor: handleFlowColor,
                    flowColor: flowColor,
                    areaClicked: areaClicked,//note not actually area but the arrow object itself
                    setAreaClicked: setAreaClicked,
                    editsList: editsList,
                    setEditsList: setEditsList,
                    selectedFlowArrow: selectedFlowArrow,
                    setFlowArrow: setFlowArrow,
                    keyTable: keyTable,
                    setKeyTable: setKeyTable
                }
                return (
                    <FlowUi {...props} />
                )
            }
        default:
            break
    }
}

const MapView = () => {
    const { map, mapObj, transactions } = useContext(MapContext)
    // const [map, setMap] = useState(null)
    const [title, setTitle] = useState('')
    const [validTitle, setValidTitle] = useState(true)
    const [description, setDescription] = useState('')
    console.log(title)
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
    const [baseColor, setBaseColor] = useState(hexToHlsa('#ffffff'))

    const [keyTable, setKeyTable] = useState([])//holds list of key labels mappings in form {color: hexColor, label:label}


    const [flowColor, setFlowColor] = useState(hexToHlsa('#aabbcc'))
    const [selectedFlowArrow, setFlowArrow] = useState(null)

    const [changingMapTypeIsClicked, setChangingMapTypeIsClicked] = useState(false)
    const [futureTypeSelected, setFutureTypeSelected] = useState(MAP_TYPES['NONE'])
    const [geoJsonKey, setgeojsonKey] = useState('')
    const [mapContainerRef, setmapContainerRef] = useState(null);
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
        if (mapObj) {
            map.description = mapObj.description
            map.edits = mapObj.MapData.edits
            map.title = mapObj.title
        }
        if (map) {
            console.log("this is map", map)
            if (map.description)
                setDescription(map.description)
            if (map.title)
                setTitle(map.title)
            if (map.edits) {

                const fileMapType = map.edits.header.type
                // console.log("has map edits", fileMapType)
                setType(MAP_TYPES[fileMapType])
                setEditsList([...(map.edits.editsList)])

                switch (MAP_TYPES[fileMapType]) {
                    case MAP_TYPES['HEATMAP']:
                        // console.log("setting key table")
                        setHlsa(map.edits.header.basecolorHLSA)
                        break
                    case MAP_TYPES['CHOROPLETH']:
                        // console.log("setting key table")
                        setKeyTable(map.edits.header.keyTable)
                        break

                    case MAP_TYPES['FLOW']:
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

    // console.log(geoJsonKey)
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
                    // console.log("decided Heat",feature)
                    if (feature) {//feature will be a feature from geojson
                        setAreaClicked(clickedFeature.key)
                    } else {
                        console.log('No known name property found in clicked feature', clickedFeature)
                    }
                    break
                }
            case MAP_TYPES['CHOROPLETH']://feature will be a feature from geojson
                {
                    if (feature) {
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
                    if (feature) {
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
            setType(MAP_TYPES['FLOW'])
            isClicked(false)
        }
        else {
            setChangingMapTypeIsClicked(true)
            setFutureTypeSelected(MAP_TYPES['FLOW'])
        }
    }
    const handleYesClick = () => {
        console.log("Yes Click")
        setKeyTable([])
        setEditsList([])
        setAreaClicked(null)
        isClicked(false)
        setType(futureTypeSelected)
        setChangingMapTypeIsClicked(false)
        transactions.clearAllTransactions()
    }
    const handleNoClick = () => {
        console.log("No Click")
        isClicked(false)
        setType(typeSelected)
        setChangingMapTypeIsClicked(false)
    }
    // console.log("current edit list",editsList)

    //Flow Map Editing

    // const flowColorRef = useRef(flowColor)
    // useEffect(() => {
    //     flowColorRef.current = flowColor
    // }, [flowColor])

    const handleFlowColor = (newColor) => {
        setFlowColor(newColor)
    }
    const handleOnCreateFlow = (e) => {
        setAreaClicked(e)
    }
    //End of Flow Map Editing
    // console.log("currentEdits",editsList)
    return (
        map && (<div className='mx-5 mt-5'>
            <div className='relative'>
                {!validTitle
                    ? <div className='text-red-300 text-center'>Need Title</div>
                    : null
                }
                <input type='text' name='title' className='font-PyeongChangPeace-Light bg-white rounded-t-3xl px-4 py-2 text-center'
                    placeholder='Enter Title...' value={title} maxLength={48} onChange={(e) => setTitle(e.target.value)} >
                </input>
            </div>
            <div className='flex justify-between w-full gap-5'>
                <div className='flex justify-between flex-col w-3/5 h-full  bg-white shadow-nimble rounded-b-2xl'>
                    <div className='flex'>
                        <MapContainer
                            preferCanvas={true}
                            center={center}
                            zoom={5}
                            ref={setmapContainerRef}
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
                                        mapBounds={[padded_NE, padded_SW]}
                                    />)
                                : null
                            }

                            {typeSelectedRef.current === MAP_TYPES['POINT']
                                ? editsList.map((edit) =>
                                    <PointMarker key={edit.id}
                                        id={edit.id}
                                        edit={edit}
                                        editsList={editsList}
                                        setEditsList={setEditsList}
                                    />)
                                : null
                            }
                            {typeSelected === MAP_TYPES['FLOW']
                                ?
                                <>
                                    <FeatureGroup>
                                        <EditControl
                                            position="topright"
                                            onCreated={handleOnCreateFlow}

                                            draw={
                                                {
                                                    polyline: {
                                                        shapeOptions: {
                                                            weight: 4          // Set the line width (optional)
                                                        }
                                                    },
                                                    polygon: false,
                                                    rectangle: false,
                                                    circle: false,
                                                    marker: false,
                                                    circlemarker: false
                                                }}
                                            edit={{
                                                edit: false,
                                                remove: false
                                            }}
                                        />
                                        {editsList.map((edit) => (
                                            <FlowArrow key={edit.id} id={edit.id} latlngs={edit.latlngs} colorRgba={edit.colorRgba} setFlowArrow={setFlowArrow} />
                                        ))}
                                    </FeatureGroup>
                                </>
                                : null
                            }


                        </MapContainer>
                    </div>

                    <div className='flex flex-col h-full bg-white rounded-b-2xl'>
                        <input type='text' name='description' className='mt-4 mx-5 shadow-md font-PyeongChangPeace-Light  rounded px-4 py-2 text-left'
                            placeholder='Enter Description...' value={description} maxLength={100} onChange={(e) => setDescription(e.target.value)} >
                        </input>
                        <BottomRow title={title} mapType={typeSelected} description={description} editsList={editsList} setValidTitle={setValidTitle}
                            lowerBound={lowerBound} upperBound={upperBound} setValidHeatRange={setValidHeatRange} baseColor={baseColor}
                            keyTable={keyTable} mapContainerRef={mapContainerRef}
                        ></BottomRow>
                    </div>
                </div>
                <div className='text-2xl font-NanumSquareNeoOTF-Lt flex flex-col items-center text-center w-2/5 h-full max-h-full max-w-full overflow-auto'>

                    {!mapTypeClicked && !changingMapTypeIsClicked
                        ?
                        <>
                            {typeSelected == MAP_TYPES['NONE']
                                ? <button className='w-full bg-primary-GeoOrange' onClick={() => isClicked(!mapTypeClicked)}>Select Map Type ▼ </button>
                                :
                                <>
                                    <button className=' bg-primary-GeoOrange w-full' onClick={() => isClicked(!mapTypeClicked)}>{mapString}</button>
                                    <MapEditOptions mapType={typeSelected} setType={setType} areaClicked={areaClicked} setAreaClicked={setAreaClicked}
                                        editsList={editsList} setEditsList={setEditsList} setLower={setLower} setUpper={setUpper} validHeatRange={validHeatRange}
                                        setValidHeatRange={setValidHeatRange} setBaseColor={setBaseColor} baseColor={baseColor} heatColor={heatColor} setHlsa={setHlsa}
                                        keyTable={keyTable} setKeyTable={setKeyTable} mapBounds={[padded_NE, padded_SW]} flowColor={flowColor} handleFlowColor={handleFlowColor}
                                        selectedFlowArrow={selectedFlowArrow} setFlowArrow={setFlowArrow}
                                    />
                                </>
                            }
                        </>
                        :
                        <div className='full'>
                            <>
                                <button className='w-full bg-primary-GeoOrange' onClick={() => isClicked(!mapTypeClicked)}>Select Map Type ▼ </button>
                                <button className='w-full bg-primary-GeoOrange hover:opacity-80' onClick={() => { setChangingMapTypeIsClicked(false); handleHeatMapClick() }}>Heatmap</button>
                                <button className='w-full bg-primary-GeoOrange hover:opacity-80' onClick={() => { setChangingMapTypeIsClicked(false); handlePointMapClick() }}>Point/Locator</button>
                                <button className='w-full bg-primary-GeoOrange hover:opacity-80' onClick={() => { setChangingMapTypeIsClicked(false); handleSymbolMapClick() }}>Symbol</button>
                                <button className='w-full bg-primary-GeoOrange hover:opacity-80' onClick={() => { setChangingMapTypeIsClicked(false); handleChoroplethMapClick() }}>Choropleth</button>
                                <button className='w-full bg-primary-GeoOrange hover:opacity-80' onClick={() => { setChangingMapTypeIsClicked(false); handleFlowMapClick() }}>Flow</button>
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
        </div>)
    )
}



const EditingMap = () => {
    return (
        <>
            <div className="max-h-[100%] min-h-screen bg-primary-GeoPurple pb-8 w-full overflow-auto">
                <MapView />
            </div>

        </>
    );
}

export default EditingMap

// bg-primary-GeoPurple min-h-screen max-h-screen flex justify-between items-center flex-col overflow-auto