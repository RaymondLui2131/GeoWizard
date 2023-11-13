import React from "react";
import Banner from "./Banner";
import PropTypes from 'prop-types';
import {useState} from "react";
import { useRef } from "react";
import { useNavigate } from 'react-router-dom'

import france from "../assets/EditMapAssets/france.png"
import ireland from "../assets/EditMapAssets/ireland.png"
import finland from "../assets/EditMapAssets/finland.png"
import poland from "../assets/EditMapAssets/poland.png"

const DisplayMap = (props) => {
    const navigate = useNavigate();
    const index = props.index
    const mapArr = props.arr
    const countryNames = ["France","Ireland", "Finland", "Poland"]//To be changed
    const editClassName = countryNames[index]
    const handleEditClick = () => {
        navigate('/editingmap')   //For now brings you back to / change later
    }
    return (
    <>
     <div className="h-full">
        <div className="bg-primary-GeoOrange text-center rounded-lg ">
        <img src={mapArr[index] } className="h-64 w-[28rem] rounded-lg" />  
            <div className= {editClassName} onClick={() => handleEditClick()}>Edit {" " + countryNames[index]}</div>
        </div>
     </div>
    </>
)
}

DisplayMap.propTypes = {
    index: PropTypes.number.isRequired,
    arr: PropTypes.array.isRequired
};

const EditUpload = () => {
    const inputRef = useRef(null);
    const [mapIndex,setIndex ] = useState(0); // index of mapArr
    const [mapArrayObj, ] = useState([france,ireland,finland,poland]); // index of mapArr For now will just be array of imagepaths
    
    const navigate = useNavigate();
    const arrowOnclick = (direction) =>{
        if(direction === 0)  //0 is left
        {
            if(mapIndex === 0)//from begining
                setIndex(mapArrayObj.length - 2)
            else
            setIndex(mapIndex - 2)
        } 
        else  //moving right
        {
            if((mapIndex + 2) === mapArrayObj.length)//from end
                setIndex(0)
            else
            setIndex(mapIndex + 2)
        }
    }
    const uploadHandle = () => {
        inputRef.current.click();
    }
    const handleFileChange = (event) => {         //TODO parse file uploaded and move on to edit map setContext
        const selected_file = event.target.files[0]
        const file_type = selected_file.name.split('.').pop().toLowerCase()
        console.log(file_type) 
        navigate('/')   //For now brings you back to / change later
    }
    return (
        <>
        <Banner></Banner>
        <div className="bg-primary-GeoPurple min-h-screen max-h-screen overflow-auto">
            <div className="flex justify-center pl-8 md:pl-10 lg:pl-20 xl:pl-40 pr-8 md:pr-10 lg:pr-20 xl:pr-40">
                <div className="flex flex-col">
                    <div className="flex justify-between pt-10 ">
                        <div className=" text-primary-GeoBlue font-NanumSquareNeoOTF-Bd">
                            <h3 className="text-3xl pb-5">Start Editing Maps by uploading our supported map formats :</h3>
                            <ul className ="list-disc pl-5 ">
                                <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">GeoJson</li>
                                <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">KML</li>
                                <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">SHP and DBFS upload as zip</li>
                                <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">GeoWizJson</li>
                            </ul>       
                        </div>
                        <div className=" pt-20 ">
                            <input className="hidden" type="file" accept=".zip, .json, .kml, .shp" ref={inputRef} onChange={handleFileChange}/>
                            <button className="bg-primary-GeoOrange px-16 rounded-full py-2 " onClick={() => uploadHandle()}>
                                Upload
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col pt-16">
                        <div className="text-3xl font-NanumSquareNeoOTF-Bd">
                            OR
                        </div>
                        
                        <div className= " text-xl pt-10 font-NanumSquareNeoOTF-Lt  text-primary-GeoBlue">
                            Start From a Selection of Existing Maps
                        </div>
                        <div className="flex flex-row justify-around pt-10 items-center" >
                        <div className="w-20 h-20 rounded-full border border-opacity-100 border-black bg-primary-GeoBlue
                                text-center text-3xl flex justify-center items-center mt-12 font-extrabold"
                                onClick={() => arrowOnclick(0)}>
                                ←
                            </div>
                            <DisplayMap {...{index:mapIndex, arr:mapArrayObj}}/>
                            <DisplayMap {...{index:mapIndex + 1, arr:mapArrayObj}}/>
                            <div className="w-20 h-20 rounded-full border border-opacity-100 border-black bg-primary-GeoBlue
                                text-center text-3xl flex justify-center items-center mt-12 font-extrabold"
                                onClick={() => arrowOnclick(1)}>
                                →
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}


export default EditUpload
