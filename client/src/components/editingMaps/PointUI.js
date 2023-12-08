import { p1, p2, p3, p4, p5, p6, p7, p8, p9 } from '../../assets/EditMapAssets/pointerImages/index.js'
import { MAP_TYPES} from '../../constants/MapTypes.js'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import React, { useState, useEffect, useRef } from 'react'
import { PointEdit } from '../../editMapDataStructures/PointMapData.js'

export const PointUI = (props) => {
    const setType = props.setType
    const selected = props.selected
    const setSelected = props.setSelected
    const padded_NE = props.padded_NE
    const padded_SW = props.padded_SW
    const editsList = props.editsList
    const setEditsList = props.setEditsList
    const selectedColor = props.selectedColor 
    const areaClicked = props.areaClicked
    const setAreaClicked = props.setAreaClicked
    


    const provider = new OpenStreetMapProvider()
    
    const [address, setAddress] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [description, setDescription] = useState('')
    const [longitude, setLongitude] = useState(null)
    const [latitude, setLatitude] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [debounceTimer, setDebounceTimer] = useState(null);
    let ref = useRef(0);

    function calculateBounds(center, aspectRatio, distance) {
        const lat = center.lat
        const lon = center.lng
      
        const latDiff = distance / 2 / 111.32; 
        const lonDiff = (distance / 2) / (111.32 * Math.cos((lat * Math.PI) / 180));
      
        const bounds = [
          [lat - latDiff, lon - lonDiff],
          [lat + latDiff, lon + lonDiff / aspectRatio],
        ]
        return bounds;
    }




    useEffect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, []);

    useEffect(() => {
        if (address.length > 2) {
            if (debounceTimer) {
                clearTimeout(debounceTimer); // Clear the existing timer if it exists
            }

            const newTimer = setTimeout(async () => {
                try {
                    const results = await provider.search({ query: address });
                    setSuggestions(results);
                } catch (error) {
                    setErrorMessage('Please click on a suggestion');
                    // console.error('Error:', error);
                }
            }, 500); // Set a new timer with a 500ms delay

            setDebounceTimer(newTimer);
        } else {
            setSuggestions([]);
        }
    }, [address]);


    useEffect(() => {
        if(areaClicked)
        {
            //console.log(areaClicked.lat)
            //console.log(areaClicked.lng)
            setLatitude(areaClicked.lat)
            setLongitude(areaClicked.lng)
            setAddress('')
        }
    }, [areaClicked]
    )
    


    const handleSelectSuggestion = (suggestion) => {
        setAddress(suggestion.label); // Update the input field with the selected suggestion
        setLatitude(suggestion.y)
        setLongitude(suggestion.x)
        setSuggestions([]); // Clear suggestions
    };


    function handleSubmitReset(){
        setAreaClicked(null)//resetting clicked
        setLatitude(null)
        setLongitude(null)
        setAddress('')
        setDescription('')
        ref.current = ref.current + 1;
    }

    const handleSubmit = async (event) => { //x: longitude y: latitude
        event.preventDefault()
        try {
            if(!selected){
                setErrorMessage('Please choose a point locator')
                return
            }
            if(!latitude || !longitude || !selected){
                setErrorMessage('Please select a valid location or click the map')
                return
            }
            if(description.length > 20){
                setErrorMessage('Please limit description to 20 characters or less')
                return
            }  

        
            if(latitude > padded_NE.lat || longitude > padded_NE.lng || latitude < padded_SW.lat || longitude < padded_SW.lng ){
                setErrorMessage('Please choose a location within the map bounds')
                return
            }

            setErrorMessage('')
            
            if(address == '' && latitude && longitude){
                const newEdit = new PointEdit(ref.current , description, selected, calculateBounds(areaClicked,1,100), latitude, longitude, '')
                console.log(newEdit)
                let copyEdits = [...editsList]
                copyEdits.push(newEdit)
                console.log(copyEdits)
                setEditsList(copyEdits)
                
                handleSubmitReset()
            } 
            else{
                try {
                    const results = (await provider.search({ query: address }))[0]
                    console.log(results); // Process the results as needed
                    if(results)
                    {
                        const newEdit = new PointEdit(ref.current , description, selected, results.bounds, results.y, results.x, results.label)
                        console.log(newEdit)
                        let copyEdits = [...editsList]
                        copyEdits.push(newEdit)
                        console.log(copyEdits)
                        setEditsList(copyEdits)
                        
                        handleSubmitReset()
                    }
                }
                catch (error) {
                    setErrorMessage('Please click on a suggestion');
                    //console.error('Error:', error)
                }
            }
        } catch (error) {
            console.error('Error:', error)
        }
    };

    return (
        <>
            <div className='invisible'>gap space</div>
            <div className='h-full bg-gray-50 rounded-3xl w-full'>
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
                {/* Search input field */}


                <div className='m-4'> 

                    <input
                        className='font-NanumSquareNeoOTF-Lt flex justify-start mb-4 w-full'
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                    />

                    <div className="flex justify-between font-NanumSquareNeoOTF-Lt">
                    <div className=' mr-2'>Longitude: {longitude ? longitude.toFixed(3) : ''} </div>
                    <div>Latitude: {latitude ? latitude.toFixed(3) : ''} </div>
                    </div>

                    <div className='font-NanumSquareNeoOTF-Bd text-red-500 mb-4'> {errorMessage ? `Error: ${errorMessage}` : ''}</div>
                </div>
                

                <form onSubmit={handleSubmit} className="flex justify-between mb-2 font-NanumSquareNeoOTF-Lt">
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Search address or click on map"
                            className="w-full p-2 rounded-md border-2 border-gray-300" // Added padding, rounded borders, and border classes
                        />
                    <button type="submit" className=" text-l font-NanumSquareNeoOTF-Bd rounded-md px-6 bg-primary-GeoPurple border-solid border-2 border-gray-300 hover:bg-gray-300 text-white">
                        Add
                    </button>
                </form>


                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                    <div className="text-sm">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="font-NanumSquareNeoOTF-Lt cursor-pointer hover:bg-gray-100 mb-2 "
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                {suggestion.label}
                            </div>
                        ))}
                    </div>
                )}


            </div>
        </>
    )
}

export default PointUI