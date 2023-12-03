import { p1, p2, p3, p4, p5, p6, p7, p8, p9 } from '../../assets/EditMapAssets/pointerImages/index.js'
import { MAP_TYPES, STRING_MAPPING } from '../../constants/MapTypes.js'
export const PointUI = (props) => {
    const setType = props.setType
    const selected = props.selected
    const setSelected = props.setSelected

    const editsList = props.editsList
    const setEditsList = props.setEditsList
    
    const selectedColor = props.selectedColor // for highlighting which point is selected
    const areaClicked = props.areaClicked
    const setAreaClicked = props.setAreaClicked

    return (
        <>
            <div className='invisible'>gap space</div>
            <div className='h-full w-96 bg-gray-50 rounded-3xl'>
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
            </div>
        </>
    )
}

export default PointUI