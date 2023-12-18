import React from "react";
import PropTypes from 'prop-types';
import { useState, useContext, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import { MapContext, MapActionType } from "../api/MapContext"
import { simplify } from '@turf/turf'
import { UserContext } from "../api/UserContext";
import france from "../assets/EditMapAssets/france.png"
import ireland from "../assets/EditMapAssets/ireland.png"
import finland from "../assets/EditMapAssets/finland.png"
import poland from "../assets/EditMapAssets/poland.png"
import franceGeoJson from '../assets/EditMapAssets/france-compress.geo.json';
import irelandGeoJson from '../assets/EditMapAssets/ireland-compress.geo.json';
import polandGeoJson from '../assets/EditMapAssets/poland-compress.geo.json';
import finlandGeoJson from '../assets/EditMapAssets/finland-compress.geo.json';
import toGeoJSON from '@mapbox/togeojson';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
/* global shp */

const DisplayMap = (props) => {
    const { dispatch } = useContext(MapContext)
    const {user} = useContext(UserContext)
    const navigate = useNavigate();
    const index = props.index
    const mapArr = props.arr
    const countryNames = ["France", "Ireland", "Finland", "Poland"]//To be changed
    const editClassName = countryNames[index]

    // const handleEditClick = () => {
    //     navigate('/editingmap')   //For now brings you back to / change later
    // }
    const handleExistingMapsClick = (countryName) => {
        dispatch({ type: MapActionType.RESET })
        let selected_file = null
        switch (countryName) {
            case 'France':
                selected_file = franceGeoJson
                break;
            case 'Ireland':
                selected_file = irelandGeoJson
                break;
            case 'Finland':
                selected_file = finlandGeoJson
                break;
            case 'Poland':
                selected_file = polandGeoJson
                break;
            default:
                console.log("No map found")
                break;
        }
        const edited = {
            type: selected_file.type,
            features: selected_file.features.map((feature, index) => ({
                ...feature,
                key: index,
            })),
        }
        dispatch({ type: MapActionType.VIEW, payload: edited })
        navigate('/editingMap')   //For now brings you back to / change later
    }
    return (
        <>
            <div className="h-full hover:opacity-70 hover:cursor-pointer shadow-aesthetic relative group">
                <button disabled={!user} className={`${editClassName}`} onClick={() => handleExistingMapsClick(countryNames[index])}>
                    <img  src={mapArr[index]} className={`h-64 w-[28rem] rounded-lg relative `} />
                </button>
                {/* <div className={editClassName}>Edit {" " + countryNames[index]}</div> */}
                <span className={`${editClassName +'Label'} absolute top-2 w-fit bg-primary-GeoOrange px-2 font-PyeongChangPeace-Light rounded-lg left-0 right-0 mx-auto opacity-70`}>
                    {`Edit ${countryNames[index]}`}
                </span>
                {!user && (
                    <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 whitespace-nowrap py-1 rounded-md absolute left-1/2 -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">
                        You must be logged in to edit a map
                    </span>
                )}
            </div>
        </>
    )
}


DisplayMap.propTypes = {
    index: PropTypes.number.isRequired,
    arr: PropTypes.array.isRequired
};

const EditUpload = () => {
    const { user } = useContext(UserContext)
    const inputRef = useRef(null);
    const { dispatch } = useContext(MapContext)
    const [mapIndex, setIndex] = useState(0); // index of mapArr
    const [mapArrayObj,] = useState([france, ireland, finland, poland]); // index of mapArr For now will just be array of imagepaths
    const [mapErrorMessage, setMapErrorMessage] = useState(false)
    const [drag, setDrag] = useState(false)
    const navigate = useNavigate();
    const arrowOnclick = (direction) => {
        if (direction === 0)  //0 is left
        {
            if (mapIndex === 0)//from begining
                setIndex(mapArrayObj.length - 2)
            else
                setIndex(mapIndex - 2)
        }
        else  //moving right
        {
            if ((mapIndex + 2) === mapArrayObj.length)//from end
                setIndex(0)
            else
                setIndex(mapIndex + 2)
        }
    }
    const uploadHandle = () => {
        inputRef.current.click();
    }
    const handleFileChange = (event) => {
        event.preventDefault()
        let selected_file
        if (event.dataTransfer?.files[0] instanceof File) {
            selected_file = event.dataTransfer.files[0]
        } else {
            selected_file = event.target.files[0]
        }
        const file_type = selected_file.name.split('.').pop().toLowerCase()
        console.log(file_type)
        const options = { tolerance: 0.0001, highQuality: true }
        const reader = new FileReader()
        const parser = new DOMParser();
        const JSZip = require('jszip');

        switch (file_type) {
            case 'zip':
                reader.onload = async (e) => {
                    try {
                        const zipBuffer = e.target.result;
                        const zip = await JSZip.loadAsync(zipBuffer);
                        const files = Object.keys(zip.files);
                        const hasShp = files.some(f => f.endsWith('.shp'));
                        const hasShx = files.some(f => f.endsWith('.shx'));
                        const hasDbf = files.some(f => f.endsWith('.dbf'));

                        if (!hasShp || !hasShx || !hasDbf) {
                            console.error("Invalid zip file: required shapefile components (.shp, .shx, .dbf) not found");
                            setMapErrorMessage(true);
                            return;
                        }

                        let geojsonArray = await shp(zipBuffer);
                        if(!Array.isArray(geojsonArray))
                            geojsonArray = [geojsonArray]
                        console.log(geojsonArray)
                        const compressedArray = geojsonArray.map(geojson => {
                            if (geojson.type === 'FeatureCollection') {
                                return {
                                    ...geojson,
                                    features: geojson.features.map(feature => simplify(feature, options))
                                };
                            }
                            return geojson;
                        });

                        const compressed = compressedArray[0];
                        const edited = {
                            type: compressed.type,
                            features: compressed.features.map((feature, index) => ({
                                ...feature,
                                key: index,
                            })),
                        };
                        // console.log("Upload",edited)
                        dispatch({ type: MapActionType.UPLOAD, payload: edited });
                        navigate('/editingMap');
                    } catch (error) {
                        console.error("Error processing zip file:", error);
                        // Handle error here
                    }
                };
                reader.readAsArrayBuffer(selected_file);
                break;
            case 'json':
                reader.onload = (e) => {
                    try{
                        const geojson = JSON.parse(e.target.result)//REMEMBER TO COMPRESS AFTER HANDLING OTHER FILE FORMATS
                        const compressed = simplify(geojson, options);
                        const edited = {
                            type: compressed.type,
                            features: compressed.features.map((feature, index) => ({
                                ...feature,
                                key: index,
                            })),
                        }
                        if(!edited || !edited.features ||(edited.features.length === 0))
                        {
                            setMapErrorMessage(true);
                            return;
                        }
                        else
                        {
                            dispatch({ type: MapActionType.UPLOAD, payload: edited })
                            navigate('/editingMap');
                        }
                    }
                    catch (error){
                        setMapErrorMessage(true);
                            return;
                    }        
                }
                dispatch({ type: MapActionType.RESET })
                reader.readAsText(selected_file)
                break
            case 'kml':
                reader.onload = (e) => {
                    try{
                        const kmlDocument = parser.parseFromString(e.target.result, "text/xml");
                        const geojson = toGeoJSON.kml(kmlDocument);
                        const compressed = simplify(geojson, options);
                        const edited = {
                            type: compressed.type,
                            features: compressed.features.map((feature, index) => ({
                                ...feature,
                                properties: {
                                    ...feature.properties,
                                    iconUrl: feature.properties.icon, // Store the icon URL
                                },
                                key: index,
                            })),
                        };
                        console.log("Upload",edited)
                        if(!edited || !edited.features ||(edited.features.length === 0))
                        {
                            setMapErrorMessage(true);
                            return;
                        }
                        else
                        {
                            dispatch({ type: MapActionType.UPLOAD, payload: edited })
                            navigate('/editingMap');
                        }
                    }
                    catch(error){
                        setMapErrorMessage(true);
                    }
                };
                dispatch({ type: MapActionType.RESET });
                reader.readAsText(selected_file);
                break;
            case 'geowizjson': //custum format similar to geojson
                reader.onload = (e) => {
                    try{
                        const wizjson = JSON.parse(e.target.result)
                        const edited = {
                            features: [...wizjson.features],
                            description: wizjson.description,
                            edits: { ...wizjson.edits },
                            title: wizjson.title
                        }
                        // console.log("this is wat got dispactached", edited)
                        if(!edited || !edited.features ||(edited.features.length === 0))
                        {
                            setMapErrorMessage(true);
                            return;
                        }
                        else
                        {
                            dispatch({ type: MapActionType.UPLOAD, payload: edited })
                            navigate('/editingMap');
                        }
                    }
                    catch(error){
                        setMapErrorMessage(true);
                    }
                }
                reader.readAsText(selected_file)
                break
            default:
                setMapErrorMessage(true)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDrag(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setDrag(false)
    }

    return (
        <>
            <div className="bg-primary-GeoPurple max-h-[100%] min-h-screen overflow-auto">
                <div className="flex h-full mt-10 min-w-full flex-col justify-center md:pl-10 lg:pl-20 xl:pl-40 md:pr-10 lg:pr-20 xl:pr-40">
                    <div className="flex flex-col h-full justify-evenly">
                        <div className="flex flex-col items-center">
                            <div className="flex flex-col justify-evenly h-1/2">
                                <div className=" text-primary-GeoBlue font-NanumSquareNeoOTF-Bd">
                                    <h3 className="text-3xl pb-5 text-center whitespace-nowrap">Start Editing Maps by uploading our supported map formats :</h3>
                                    <ul className="flex justify-evenly list-disc pl-5 ">
                                        <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">GeoJson</li>
                                        <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">KML</li>
                                        <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">SHP and DBFS upload as zip</li>
                                        <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">GeoWizJson</li>
                                    </ul>
                                </div>
                            </div>

                            <div className={`relative group flex justify-center w-4/5 h-64 shadow-sleek rounded-md ${user && 'hover:border hover:border-primary-GeoBlue'} ${drag && user && "border border-primary-GeoBlue"}`}>
                                <button className="h-full w-full disabled:opacity-30 hover:opacity-80" data-test-id="upload-button" onDragOver={handleDragOver} onDrop={handleFileChange} onDragLeave={handleDragLeave} onClick={() => uploadHandle()} disabled={!user}>
                                    <div className="h-full flex flex-col justify-center items-center gap-5">
                                        <input className="hidden" type="file" accept=".zip, .json, .kml, .shp, .geowizjson" ref={inputRef} onChange={handleFileChange} />
                                        <FontAwesomeIcon className='h-1/4' icon={faFileArrowUp} />
                                        <div className="font-PyeongChangPeace-Light group flex w-full justify-center">
                                            <p
                                                className=" shadow-aesthetic bg-primary-GeoOrange w-1/2 px-16 rounded-md text-3xl py-2"
                                            >
                                                Select a File
                                            </p>
                                        </div>
                                        {mapErrorMessage ? (
                                            <div style={{ color: '#8B0000', textAlign: 'center' }}> Please upload a supported format </div>
                                        ) : null}
                                    </div>
                                </button>
                                {!user && (
                                    <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 whitespace-nowrap py-1 rounded-md absolute left-1/2 -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">
                                        You must be logged in to upload a map
                                    </span>
                                )}
                            </div>

                        </div>

                        <div className="font-NanumSquareNeoOTF-Bd flex flex-col text-center mt-10 pb-10">
                            <div className="text-3xl">
                                OR
                            </div>

                            <div className=" text-3xl pt-6   text-primary-GeoBlue">
                                Start From a Selection of Existing Maps:
                            </div>
                            <div className="flex flex-row justify-around pt-10 items-center gap-8" >
                                <button className="hover:opacity-70 px-5" onClick={() => arrowOnclick(0)}>
                                    <FontAwesomeIcon className="h-10" icon={faChevronLeft} />
                                </button>
                                
                                <DisplayMap {...{ index: mapIndex, arr: mapArrayObj }} />
                                <DisplayMap {...{ index: mapIndex + 1, arr: mapArrayObj }} />
                                <button className="next hover:opacity-70 px-5" onClick={() => arrowOnclick(1)}>
                                    <FontAwesomeIcon className="h-10" icon={faChevronRight} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}


export default EditUpload
