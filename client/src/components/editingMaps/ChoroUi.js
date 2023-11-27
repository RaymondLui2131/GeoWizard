import { MAP_TYPES } from "../../constants/MapTypes"
import { HexColorPicker } from "react-colorful"
import { useState, useEffect } from "react"
import { ChoroEdit } from "../../editMapDataStructures/ChoroplethMapData"

const KeyRow = (props) =>{
    const color = props.color
    const setColor = props.setColor
    const keyTable = props.keyTable
    const setKeyTable = props.setKeyTable
    const editsList = props.editsList
    const setEditsList = props.setEditsList
    const [label, setLabel] = useState(props.label)
    
    // console.log(props)

    const handleRemove = (color) =>{
        const filtered  = keyTable.filter((row)=> row.color !== color)
        const filterEdits = editsList.filter((edit) => edit.colorHEX !== color) //remove coloring of features after removing key
        // console.log("filtered list",filtered)
        setKeyTable(filtered)
        setEditsList(filterEdits)

    }
    const handleUpdateLabel = (text) => {
        const currKeyTable = [...keyTable]
        const found = currKeyTable.find((row) => row.color === color)
        found.label = text
        setKeyTable(currKeyTable)
        setLabel(text)
    }
    return(
        <>
        <div className="flex flex-row">
            <div className="w-1/3">
                <button className='text-red-600' onClick={()=>handleRemove(color)}>X</button>
            </div>
            <div  className='pl-7'>
            <div onClick={()=>setColor(color)} className='flex w-5 h-5 border-2 border-black' 
                style={{ backgroundColor:color }}>
            </div>
        </div>
        </div>
        
        <div className='flex justify-center items-end'>
            <input className='w-4/12 border-2 border-black' type='text' value={label} onChange={(e) => {handleUpdateLabel(e.target.value)}}/>
        </div>
        </>
    )

}

export const ChoroUi = (props) =>{
    const setType = props.setType
    const choroColor = props.choroColor
    const setColor = props.setColor
    const key = props.key
    const setKey = props.setKey
    const label = props.label
    const setLabel = props.setLabel
    const keyTable = props.keyTable
    const setKeyTable = props.setKeyTable
    const areaClicked = props.areaClicked
    const setAreaClicked = props.setAreaClicked
    const editsList = props.editsList
    const setEditsList = props.setEditsList

    useEffect(() => {
        if (areaClicked) {
            console.log('something clicked', areaClicked)

            let newColor = [...editsList]
            newColor = newColor.filter((edit) => edit.colorHEX === choroColor)
            // console.log("newColor",newColor)
            if (newColor.length === 0) {  //New Color
                const newKeyLabel = {
                    color: choroColor,
                    label: '',
                }
                const newTable = [...keyTable]
                newTable.push(newKeyLabel) 
                setKeyTable(newTable)   
            }
            const newEdit = new ChoroEdit(areaClicked, choroColor)
            let copyEdits = [...editsList]
            copyEdits = copyEdits.filter((edit) => edit.featureName !== areaClicked)
            copyEdits.push(newEdit)

            setEditsList(copyEdits)  
            // console.log("edits",copyEdits)
      
        
            setAreaClicked(null)
        }
      }, [areaClicked])
    

    const choroColorFormat = choroColor.toUpperCase()
    const renderKeyTable = keyTable.map((row) => <KeyRow key={row.color} {...row} 
        setColor={setColor} setKeyTable={setKeyTable} keyTable={keyTable}
        editsList={editsList} setEditsList={setEditsList}
        />)
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
                <div className='grid grid-cols-2 gap-2 pt-2 text-sm overflow-y-auto'> 
                    <div>Key</div>
                    <div>Label</div>
                    {renderKeyTable}
                </div>

               
            </div>
        </>
    )
}

export default ChoroUi