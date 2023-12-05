import { useState, useEffect } from 'react'
import { circle, triangle, square, star, hexagon, pentagon } from '../../assets/EditMapAssets/symbolImages/index.js'
import { MAP_TYPES } from '../../constants/MapTypes.js'
import { HueSlider } from 'react-slider-color-picker'
import {SymbolEdit} from '../../editMapDataStructures/SymbolsMapData.js'
export const SymbolUi = (props) =>
{
    const setType = props.setType
    const selected = props.selected
    const setSelected = props.setSelected
    const handleChangeColor = props.handleChangeColor
    const symbColor = props.symbColor
    const editsList = props.editsList
    const setEditsList = props.setEditsList
    
    const selectedColor = props.selectedColor
    const areaClicked = props.areaClicked
    const setAreaClicked = props.setAreaClicked
    

    const [counter, setCounter] = useState(0)
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
        if(setSelected !== '' && areaClicked != null)
            setCounter(counter + 1)
        if(areaClicked)
        {
            if(setSelected !== '')
            {
                const newEdit = new SymbolEdit(counter,selected,symbColor,calculateBounds(areaClicked,1,100))
                let copyEdits = [...editsList]
                copyEdits.push(newEdit)
                console.log(copyEdits)
                setEditsList(copyEdits)
                setAreaClicked(null)//resetting clicked
            }
            
        }
    }, [areaClicked]
    )

    

    return (
        <>
            <div className='invisible'>gap space</div>
                <div className='h-full w-96 bg-gray-50 rounded-3xl'>
                    <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt' onClick={() => setType(MAP_TYPES['NONE'])}><div>Symbol Options</div></div>
                    <div className='grid grid-cols-2 gap-2  h-4/5  mx-auto symbolOptions'>
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
}

export default SymbolUi