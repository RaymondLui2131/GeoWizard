import tinycolor from "tinycolor2"
import { HeatMapEdit } from '../../editMapDataStructures/HeatMapData.js';
import { MAP_TYPES } from "../../constants/MapTypes.js";
import { SaturationSlider } from "react-slider-color-picker";
import { useEffect } from "react";
const ColorSliderComponent = (props) => {
    const hlsaColor = props.hlsaColor
    const changeHlsa = props.changeHlsa

    const handleChangeColor = (newcolor) => {
        changeHlsa(newcolor)
    }
    const adjusted = {...hlsaColor}
    adjusted['s'] = 100
    return (
        <>
            <SaturationSlider  handleChangeColor={handleChangeColor} color={hlsaColor} />
        </>
    )
}
export const HeatUi = (props) => {
    const setType = props.setType
    const selected = props.selected
    const setSelected = props.setSelected
    const selectedColor = props.selectedColor
    const areaClicked = props.areaClicked
    const setAreaClicked = props.setAreaClicked
    const heatColor = props.heatColor
    const setHlsa = props.setHlsa
    const editsList = props.editsList
    const setEditsList = props.setEditsList
    const setLower = props.setLower
    const setUpper = props.setUpper
    const lowerBound = props.lowerBound
    const upperBound = props.upperBound
    const hexToHlsa = props.hexToHlsa
    const validHeatRange = props.validHeatRange
    const setBaseColor = props.setBaseColor
    // console.log("sele",selected)
    const lower = parseInt(lowerBound)
    const upper = parseInt(upperBound)

    
    useEffect(() => {
        if(selected === '')
        {
            setHlsa(hexToHlsa('#ff0000'))
            setSelected('red')
        }
    },[])
    useEffect(() => {
        if(upper>lower)
        validHeatRange(true)
    },[upper,lower])

    useEffect(() => {
        if(areaClicked)
        {
            if(setSelected !== '')
            {
                const newEdit = new HeatMapEdit(areaClicked,heatColor)
                let copyEdits = [...editsList]
                copyEdits= copyEdits.filter((edit) => {return edit.featureName !== areaClicked})//removing edit entry for new one
                copyEdits.push(newEdit)
                setEditsList(copyEdits)
                setAreaClicked(null)//resetting clicked
            }
        }
    }, [areaClicked,editsList]
    )
    const colorSwap = (hexString) =>
    {
        const hslaForm = hexToHlsa(hexString)
        const hue = hslaForm.h
        //updating hues
        const changedEdits = [...editsList]
        changedEdits.forEach((edit) => edit.colorHLSA.h = hue)
        setEditsList(changedEdits)
        setHlsa(hslaForm)
        setBaseColor(hslaForm)
    }

    const handleLower = (value) =>{
        if(value === '')
            setLower('0')
        else    
            setLower(value)
    }
    const handleUpper = (value) =>{
        if(value === '')
            setUpper('1')
        else
            setUpper(value)
    }
    return(
        <>
         <div className='invisible'>gap space</div>
            <div className='h-full w-96 bg-gray-50 rounded-3xl'>
                <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt' onClick={() => setType(MAP_TYPES['NONE'])}>Colors</div>
                <div className='grid grid-cols-3 gap-3 h-2/3 pt-12 heatcolors'>
                    <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { colorSwap('#ff0000'); setSelected('red') }}
                        style={{ borderColor: selected === 'red' ? selectedColor : '#000000', backgroundColor: '#ff0000' }}></div>

                    <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { colorSwap('#00ff00'); setSelected('green') }}
                        style={{ borderColor: selected === 'green' ? selectedColor : '#000000', backgroundColor: '#00ff00' }}></div>

                    <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { colorSwap('#0019ff'); setSelected('blue') }}
                        style={{ borderColor: selected === 'blue' ? selectedColor : '#000000', backgroundColor: '#0019ff' }}></div>

                    <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { colorSwap('#00fffd'); setSelected('cyan') }}
                        style={{ borderColor: selected === 'cyan' ? selectedColor : '#000000', backgroundColor: '#00fffd' }}></div>

                    <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => {colorSwap('#9900ff'); setSelected('purple') }}
                        style={{ borderColor: selected === 'purple' ? selectedColor : '#000000', backgroundColor: '#5b00ff' }}></div>

                    <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { colorSwap('#ffb400'); setSelected('orange') }}
                        style={{ borderColor: selected === 'orange' ? selectedColor : '#000000', backgroundColor: '#ffb400' }}></div>

                    <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => {colorSwap('#ff6e00'); setSelected('darkOrange') }}
                        style={{ borderColor: selected === 'darkOrange' ? selectedColor : '#000000', backgroundColor: '#ff6e00 ' }}></div>

                    <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => {colorSwap('#ff00d9'); setSelected('pink') }}
                        style={{ borderColor: selected === 'pink' ? selectedColor : '#000000', backgroundColor: '#ff00d9' }}></div>

                    <div className='w-12 h-12 rounded-full border-4 mx-auto' onClick={() => { colorSwap('#fffe00'); setSelected('yellow') }}
                        style={{ borderColor: selected === 'yellow' ? selectedColor : '#000000', backgroundColor: '#fffe00' }}></div>
                </div>
                {
                    selected != ''
                        ?
                        <>
                            <div><ColorSliderComponent {...{ hlsaColor: heatColor, changeHlsa: setHlsa }} /></div>
                            <div className='flex justify-between flex-col'>
                                <div className='flex flex-row justify-between text-1xl'>
                                    <div>Lower Bound</div>
                                    <div>Upper Bound</div>
                                </div>
                                <div className='flex flex-row justify-between w-full items-center'>
                                    <div className='w-1/2 '>
                                        <input className='w-4/12 border-2 border-black text-sm'
                                        type='number' placeholder="0" value={lowerBound} onChange={(e) => { handleLower(e.target.value) }} />
                                    </div>
                                    <div className='w-1/2'>
                                        <input className='w-4/12 border-2 border-black text-sm' 
                                        type='number' placeholder='1' value={upperBound} onChange={(e) => { handleUpper(e.target.value) }} />
                                    </div>
                                </div>
                            </div>
                            {validHeatRange
                                ? null
                                :<div className="text-red-300">Invalid Ranges</div>
                            }

                        </>
                        :
                        null
                }
            </div>
        </>
    )
}




export default HeatUi