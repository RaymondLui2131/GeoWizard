import { a1, a2, a3, a4, a5, a6 } from '../../assets/EditMapAssets/arrowImages/index.js'
import { MAP_TYPES } from '../../constants/MapTypes.js'
import { HueSlider } from 'react-slider-color-picker'

const FlowUi = (props) => {

    const setType = props.setType
    const selected = props.selected
    const setSelected = props.setSelected
    const selectedColor = props.selectedColor
    const flowColor = props.flowColor
    const handleFlowColor = props.handleFlowColor
    const editsList = props.editsList
    const setEditsList = props.setEditsList

    const selectedFlowArrow = props.selectedFlowArrow

    const handleDelete = () =>{
        const equalPoly = (poly1, poly2) =>{
            const p1 = poly1
            const p2 = poly2
            console.log("p1", p1)
            console.log("p2", p2)
            if(p1.length !== p2.length)
                return false
            const filtered = p1.filter((cord,index) => {
                return (cord.lat === p2[index].lat) && (cord.lng === p2[index].lng)
            })
            if(filtered.length > 0)
                return true
            return false
        }
        if(selectedFlowArrow)
        {
            console.log(selectedFlowArrow)
            const latlngs = selectedFlowArrow
            console.log("simple equal check",editsList)
            const filtered = editsList.filter((polyline) => !equalPoly(latlngs,polyline.latlngs))
            console.log("filtered", filtered)
            setEditsList(filtered)
        }
    }
    return (
        <>
            <div className='invisible'>gap space</div>
            <div className='h-full w-96 bg-gray-50 rounded-3xl'>
                <div className='bg-primary-GeoOrange rounded-t-3xl font-NanumSquareNeoOTF-Lt' onClick={() => setType(MAP_TYPES['NONE'])}><div>Flow Options</div></div>
                    
                <div>Select Arrow Color</div>
                <div className='flex flex-col items-center w-full mx-auto'>
                        <HueSlider handleChangeColor={handleFlowColor} color={flowColor} />
                </div>
                <div >
                    <button onClick={handleDelete}>Delete</button>
                    </div>
            </div>
        </>
    )
    
}

export default FlowUi