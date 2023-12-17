import { useEffect, useRef, useState, useContext } from 'react'
import { a1, a2, a3, a4, a5, a6 } from '../../assets/EditMapAssets/arrowImages/index.js'
import { MAP_TYPES } from '../../constants/MapTypes.js'
import { HueSlider } from 'react-slider-color-picker'
import tinycolor from 'tinycolor2'
import { FlowEdit } from '../../editMapDataStructures/FlowMapData.js'
import Transaction from '../../transactions/Transaction.js'
import { MapContext } from '../../api/MapContext.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
const KeyRow = ({ row, keyTable, setKeyTable, editsList, setEditsList, handleFlowColor }) => {
    const [label, setLabel] = useState('')
    const [hlsaColor, setHlsaColor] = useState(null)
    const { transactions } = useContext(MapContext)
    useEffect(() => {
        const edit = editsList.find(e => e.colorRgba === row.color)
        if (edit) {
            setLabel(edit.label)
            setHlsaColor(edit.colorHlsa)
        }
    }, [])

    const updateLabel = (text) => {
        setLabel(text)
        const copyTable = [...keyTable]
        const edit = editsList.find(e => e.colorRgba === row.color) // find edit
        const found = copyTable.find(row => row.color === edit.colorRgba) // find row in table
        found.label = text
        setKeyTable(copyTable)
        if (edit) {
            edit.label = text
            setEditsList([...editsList])
        }
    }

    const removeTableEntry = (options) => {
        const { keyTable, editsList } = options
        setKeyTable(keyTable.filter(r => r.color !== row.color))
        setEditsList(editsList.filter(edit => edit.colorRgba !== row.color))
    }


    const addTableEntry = (options) => {
        const { keyTable, editsList } = options
        setKeyTable([...keyTable])
        setEditsList([...editsList])
    }

    const handleDelete = () => {
        const options = { keyTable, editsList }
        const transaction = new Transaction(options, removeTableEntry, addTableEntry)
        transactions.addTransaction(transaction)
    }

    return (
        <tr className='w-full h-full'>
            <button className='w-1/5' onClick={handleDelete}>
                <FontAwesomeIcon icon={faCircleXmark} className='h-6' />
            </button>
            <td className='w-2/5 h-full'>
                <div onClick={() => handleFlowColor(hlsaColor)} style={{ backgroundColor: row.color }} className='border-black border-2 w-1/4 h-full mx-auto hover:cursor-pointer'>

                </div>
            </td>
            <td className='w-2/5'>
                <input className='w-1/2 border-black border-2' type='text' value={label} onChange={(e) => { updateLabel(e.target.value) }} />
            </td>
        </tr>
    )
}

const ArrowInfo = (props) => {
    const arrow = props.arrow
    const latlngs = arrow.latlngs

    console.log(arrow)
    return (
        <>
            <div className='grid grid-cols-2 gap-2 pt-2 overflow-y-auto text-base'>
                <div>Arrow Color:</div>
                <div className='flex justify-center items-center'>
                    <div className='flex w-5 h-5 border-4 border-black' style={{ backgroundColor: arrow.colorRgba }}>
                    </div>
                </div>
                {
                    latlngs.map((latlng, index) => {
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
    const { transactions } = useContext(MapContext)
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
    const keyTable = props.keyTable
    const setKeyTable = props.setKeyTable
    const [arrow, setArrow] = useState(null)
    //Check if 2 polylines are equa;
    const equalPoly = (poly1, poly2) => {
        const p1 = poly1
        const p2 = poly2
        // console.log("p1", p1)
        // console.log("p2", p2)
        if (p1.length !== p2.length)
            return false
        const filtered = p1.filter((cord, index) => {
            return (cord.lat === p2[index].lat) && (cord.lng === p2[index].lng)
        })
        if (filtered.length > 0)
            return true
        return false
    }

    const addArrow = (options) => {
        const { newFlowArrow, areaClicked, keyTable, editsList } = options
        const copyEdits = [...editsList]
        const colorExists = copyEdits.some(edit => edit.colorRgba === newFlowArrow.colorRgba)
        if (!colorExists) {
            const newKeyLabel = {
                color: newFlowArrow.colorRgba,
                label: newFlowArrow.label
            }

            setKeyTable([...keyTable, newKeyLabel])
        }
        copyEdits.push(newFlowArrow)
        areaClicked.layer.remove()
        setEditsList(copyEdits)
        setAreaClicked(null) //reseting area clicked back
    }

    const removeArrow = (options) => {
        const { newFlowArrow, areaClicked, keyTable, editsList } = options
        setKeyTable([...keyTable])
        setEditsList([...editsList])
        setArrow(null)
    }

    useEffect(() => {
        if (areaClicked) {
            const currentColor = hlsaToRGBA(flowColor)
            const latlngs = areaClicked.layer.getLatLngs()
            const label = keyTable.find(row => row.colorRgba === currentColor)
            const newFlowArrow = new FlowEdit(areaClicked.layer._leaflet_id, latlngs, currentColor, {...flowColor}, label || '')
            const options = { newFlowArrow, areaClicked, keyTable, editsList }
            const transaction = new Transaction(options, addArrow, removeArrow)
            transactions.addTransaction(transaction)
        }
    }, [areaClicked])


    useEffect(() => {
        if (selectedFlowArrow) {
            const filtered = editsList.filter((polyline) => equalPoly(selectedFlowArrow, polyline.latlngs))
            const foundPolyLine = filtered.pop()
            setArrow(foundPolyLine)
        }
    }, [selectedFlowArrow])

    const deleteArrow = (options) => {
        const { selectedFlowArrow, keyTable, editsList } = options
        let copyEdits = [...editsList]
        const edit = copyEdits.find(poly => equalPoly(selectedFlowArrow, poly.latlngs))
        copyEdits = copyEdits.filter((polyline) => !equalPoly(selectedFlowArrow, polyline.latlngs))
        setEditsList(copyEdits)
        const colorExists = copyEdits.some(e => e.colorRgba === edit.colorRgba)
        if (!colorExists) {
            setKeyTable(keyTable.filter(row => row.color !== edit.colorRgba))
        }
        setArrow(null)
    }

    const undoDeleteArrow = (options) => {
        const { selectedFlowArrow, keyTable, editsList } = options
        // const polyine = copyEdits.find(poly => equalPoly(selectedFlowArrow, poly.latlngs))
        setEditsList([...editsList])
        setKeyTable([...keyTable])
    }

    const handleDelete = () => {
        if (selectedFlowArrow) {
            const options = { selectedFlowArrow, keyTable, editsList }
            const transaction = new Transaction(options, deleteArrow, undoDeleteArrow)
            transactions.addTransaction(transaction)
        }
    }

    const renderKeyTable = () => {
        return keyTable?.map(row => <KeyRow row={row} keyTable={keyTable} setKeyTable={setKeyTable} editsList={editsList} setEditsList={setEditsList} handleFlowColor={handleFlowColor} />)
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
                        ? <ArrowInfo arrow={arrow} />
                        : <div className='text-base'>None Clicked</div>
                    }
                </div>
            </div>
            <table className='w-96 mt-5 text-sm border-spacing-2 border-separate bg-white rounded-xl shadow-aesthetic'>
                {keyTable.length !== 0 && (
                    <>
                        <tr>
                            <th></th>
                            <th>Color</th>
                            <th>Label</th>
                        </tr>
                        {renderKeyTable()}
                    </>
                )}
            </table>
        </>
    )
}

export default FlowUi