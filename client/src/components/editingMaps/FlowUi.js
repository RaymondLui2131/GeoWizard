import { useEffect, useRef, useState } from 'react'
import { a1, a2, a3, a4, a5, a6 } from '../../assets/EditMapAssets/arrowImages/index.js'
import { MAP_TYPES } from '../../constants/MapTypes.js'
import { HueSlider } from 'react-slider-color-picker'
import tinycolor from 'tinycolor2'
import { FlowEdit } from '../../editMapDataStructures/FlowMapData.js'


const ArrowInfo = (props) =>{
    const arrow = props.arrow
    const latlngs = arrow.latlngs

    console.log(arrow)
    return(
        <>
        <div className='grid grid-cols-2 gap-2 pt-2 overflow-y-auto text-base'>
            <div>Arrow Color:</div>
            <div className='flex justify-center items-center'>
                <div className='flex w-5 h-5 border-4 border-black' style={{ backgroundColor: arrow.colorRgba }}>
                </div>
            </div>
            {
                latlngs.map((latlng,index) =>{
                    return (
                    <>
                        <div>Arrow Subline: {index + 1}</div>
                        <div>{'(' + latlng.lat.toFixed(2) + ', ' + latlng.lng.toFixed(2) + ')'}</div>
                    </>
                    )
                })
            }
        </div>
        </>
    )

}

const hlsaToRGBA = (hlsa) => {
    const color = tinycolor(hlsa)
    const rgba = color.toRgb()
    const rgbaString = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

    return rgbaString
}
const FlowUi = (props) => {

    const arrowSelectedInListRef = useRef(null)
    const setType = props.setType
    const areaClicked = props.areaClicked
    const setAreaClicked = props.setAreaClicked
    const flowColor = props.flowColor
    const handleFlowColor = props.handleFlowColor
    const editsList = props.editsList
    const setEditsList = props.setEditsList
    const selectedFlowArrow = props.selectedFlowArrow
    const setFlowArrow = props.setFlowArrow
    const [arrow, setArrow] = useState(null)
    //Check if 2 polylines are equa;
    const equalPoly = (poly1, poly2) =>{
        const p1 = poly1
        const p2 = poly2
        // console.log("p1", p1)
        // console.log("p2", p2)
        if(p1.length !== p2.length)
            return false
        const filtered = p1.filter((cord,index) => {
            return (cord.lat === p2[index].lat) && (cord.lng === p2[index].lng)
        })
        if(filtered.length > 0)
            return true
        return false
    }
    useEffect(() => {
        if(areaClicked)
        {
            const currentColor = hlsaToRGBA(flowColor)
            const latlngs = areaClicked.layer.getLatLngs()
            const newFlowArrow =  new FlowEdit(areaClicked.layer._leaflet_id,latlngs,currentColor)
  
            const copyEdits = [...editsList]
            copyEdits.push(newFlowArrow)
            areaClicked.layer.remove()
            setEditsList(copyEdits)
            setAreaClicked(null)//reseting area clicked back
        }
    }, [areaClicked])


    useEffect(() => {
        if(selectedFlowArrow)
        {
            const filtered = editsList.filter((polyline) => equalPoly(selectedFlowArrow,polyline.latlngs))
            const foundPolyLine = filtered.pop()
            setArrow(foundPolyLine)
        }
    }, [selectedFlowArrow])

    const handleDelete = () =>{
        if(selectedFlowArrow)
        {
            console.log(selectedFlowArrow)
            // console.log("simple equal check",editsList)
            const filtered = editsList.filter((polyline) => !equalPoly(selectedFlowArrow,polyline.latlngs))
            // console.log("filtered", filtered)
            setEditsList(filtered)
            setArrow(null)
        }
    }
    return (
        <>
            <div className='invisible'>gap space</div>
            <div className='h-full w-96 bg-gray-50 rounded-3xl'>
                <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt' onClick={() => setType(MAP_TYPES['NONE'])}><div>Flow Options</div></div>
                    
                <div className='text-sm pb-7'>Click on the top right of the map to draw arrows</div>
                <div>Select Arrow Color</div>

                <div className='flex flex-col items-center w-full mx-auto'>
                        <HueSlider handleChangeColor={handleFlowColor} color={flowColor} />
                </div>
                <div className='font-NanumSquareNeoOTF-Lt pt-5'>
                    <div>Select an Arrow to Delete</div>
                    <button onClick={handleDelete} className='bg-primary-GeoOrange text-white px-4 py-2 rounded-md'>Delete</button>
                    <div className='font-semibold underline pt-3'>Current Arrow</div>
                    {arrow
                        ?<ArrowInfo arrow = {arrow}/>
                        :<div className='text-base'>None Clicked</div>
                    }
                </div>
            </div>
        </>
    )
    
}

export default FlowUi