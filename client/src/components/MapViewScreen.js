import { useState } from 'react'
import { MapContainer, TileLayer,GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import {ReactComponent as ThumbsIcon} from '../assets/MapViewAssets/thumpsUp.svg'
import {ReactComponent as ThumbsGreen} from '../assets/MapViewAssets/thumpsUpGreen.svg'
import {ReactComponent as ThumbsRed} from '../assets/MapViewAssets/thumpsUpRed.svg'
import {MAP_TYPES} from '../constants/MapTypes'
import {AlphaSlider} from 'react-slider-color-picker'
import franceMap from '../assets/EditMapAssets/france-r.geo.json'  //To be removed

const fakeView = {
    title:'The Title of the Map',
    author: 'anon123',
    numLikes: 300
}

const fakeKeyData1 = {
    key: 'red',
    label: 'Hot'
}
const fakeKeyData2 = {
    key: 'green',
    label: 'Medium'
}
const fakeKeyData3 = {
    key: 'blue',
    label: 'Cold'
}

const fakeComment1 = {
    username: 'bob1',
    votes: 10,
    text:"Testing",
    date: new Date(),

}
const fakeComment2 = {
    username: 'bob1',
    votes: 10,
    text:"Testing ",
    date: new Date(),

}
const fakeComment3 = {
    username: 'bob1',
    votes: 10,
    text:"Testing ",
    date: new Date(),

}

const fakeComments = [fakeComment1,fakeComment2,fakeComment3]
const fakeKeyAll = [fakeKeyData1,fakeKeyData2,fakeKeyData3]

const TitleDisplay = (props) =>{
    const [currentLike, setLike] = useState(null)

    const currentCounter = props.likes
    const setCounter = props.setLikes
    const handleLike = (likeClicked) =>{

        if(currentLike === likeClicked)
        {
            setLike(null)
            if(currentLike === 'green')
                setCounter(currentCounter - 1)
            else
            setCounter(currentCounter + 1)
            return
        }
        setLike(likeClicked)
        if(currentLike === null)
            if(likeClicked === 'green')
                setCounter(currentCounter + 1)
            else
                setCounter(currentCounter - 1)
        else
            if(likeClicked === 'green')
                setCounter(currentCounter + 2)
            else
                setCounter(currentCounter - 2)

    }

    return(
        <>
        <div className='flex flex-row justify-between'>
            <div className='flex flex-col items-center'>
                {currentLike === 'green'
                    ?<ThumbsGreen className='fill-green-950 h-10 w-10' onClick={()=>handleLike('green')}/>
                    :<ThumbsIcon className='fill-green-950  h-10 w-10'  onClick={()=>handleLike('green')}/>
                }
                <div className='font-NanumSquareNeoOTF-Lt'>{currentCounter}</div>
                {currentLike === 'red'
                    ?<ThumbsRed className='tansform -scale-y-100 fill-red-950  h-10 w-10' onClick={()=>handleLike('red')}/>
                    :<ThumbsIcon className='tansform -scale-y-100 fill-red-950  h-10 w-10' onClick={()=>handleLike('red')}/>
                }
            </div>

            <div className='flex flex-col w-2/3 items-center text-primary-GeoBlue'>
                <div className='font-PyeongChangPeace-Bold text-5xl '>
                    {fakeView.title}
                </div>
                <div className='font-PyeongChangPeace-Light text-3xl'>
                    {'by ' + fakeView.author}
                </div>
            </div>

            <div>
                <button className='font-NanumSquareNeoOTF-Lt bg-primary-GeoOrange px-14 rounded-full py-2'>Fork Map</button>
            </div>
        </div>

        </>
    )

}

TitleDisplay.propTypes = {
    likes: PropTypes.number.isRequired,
    setLikes: PropTypes.func.isRequired
};

const MapDisplay = () =>{
    const [map,] = useState(franceMap)


    const geoJsonLayer = L.geoJSON(map);
    const bounds = geoJsonLayer.getBounds();
    const center = bounds.getCenter();
    //Padding for bounds
    const padded_NE = bounds.getNorthEast()
    const padded_SW = bounds.getSouthWest()
    padded_NE.lat = padded_NE.lat + 5
    padded_SW.lat = padded_SW.lat - 5
    padded_NE.lng = padded_NE.lng + 5
    padded_SW.lng = padded_SW.lng - 5
    return(
        <>
            <MapContainer 
                center={center} 
                zoom={6} 
                style={{ height: '650px' }} 
                className='h-full w-10/12'
                scrollWheelZoom={true}
                maxBounds={[padded_NE,padded_SW]}>
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles © Esri &mdash; Esri, DeLorme, NAVTEQ'
                />
                <GeoJSON data={map.features}/>
            </MapContainer>
        </>
    )
}

const Key = (props) =>{//Note this key layout only works for color
    const mapType = props.type
    const hlsaColor = {h:0, s:.73, l:.51, a:1}  //TESTING

    if(mapType === MAP_TYPES.CHOROPLETH_MAP)
        return(
            <>
            <table className='w-1/12 border-4 border-black bg-gray-50'>
                <caption className='font-PyeongChangPeace-Bold'>
                    Key
                </caption>
                <tbody className='font-NanumSquareNeoOTF-Lt border-4 border-black'>
                    {
                        fakeKeyAll.map((dataRow) => (
                                <tr key={dataRow.key} className='border-4 border-black'>
                                    <td className='border-4 border-black w-1/3 '>
                                        <div  className='flex justify-center'>
                                            <div className='flex w-10 h-10 border-4 border-black' style={{ backgroundColor:dataRow.key }}>
                                            </div>
                                        </div>
                                        </td>
                                    <td className='border-4 border-black w-2/3'>{dataRow.label}</td>
                                </tr>
                            )
                        )
                    }
                </tbody>
            </table>
            </>
        )
    if(mapType === MAP_TYPES.HEAT_MAP)
        return(
            <>
            <div className='w-1/12 border-4 border-black bg-gray-50 flex flex-col justify-around font-NanumSquareNeoOTF-Lt items-center '>
                <div className = 'flex justify-center'>
                    9999                {/*Should get from map data/prop */}
                </div>
                <div className='rotate-[-90deg] w-96 pointer-events-none'> <AlphaSlider color={hlsaColor} /></div>
                <div className = 'flex justify-center'>
                    50
                </div>
            </div>
            </>
        )
    else
        return null
}

const Comment = (props) => {
    const comment = props.comment

    const [currentLike,setLike] = useState(false)
    const [votes,setVotes] = useState(comment.votes)
   
    console.log(comment)

    const currTime = new Date()
    const time_diff = currTime.getSeconds() - comment.date.getSeconds() //replace with better time diff

    const handleLike = () =>{
        if(currentLike)
            setVotes(votes - 1)
        else
            setVotes(votes + 1)
        setLike(!currentLike)
    }
    return(
        <>
        <div className='flex flex-row justify-between border-2 rounded-full bg-gray-50 mb-1 mt-2'>
            <div className='w-1/12 h-24 flex flex-col justify-center items-center'>
                {currentLike
                    ?<ThumbsGreen className='fill-green-950 h-5 w-5' onClick={()=>handleLike()}/>
                    :<ThumbsIcon className='fill-green-950  h-5 w-5'  onClick={()=>handleLike()}/>
                }
                <div className='font-NanumSquareNeoOTF-Lt'>{votes}</div>
            </div>

            <div className='w-10/12 h-24 flex flex-col pt-2 overflow-auto whitespace-normal'>
                <div className='font-NanumSquareNeoOTF-Lt underline'>{comment.username}</div>
                <div className='font-NanumSquareNeoOTF-Lt'>{comment.text}</div>
            </div>
            <div className='w-1/12 h-24 flex flex-col justify-center items-center text-2x1'>
                <div className='font-NanumSquareNeoOTF-Lt'>{'-'+ time_diff + " seconds"}</div> {/*Replace with better time*/}
            </div>
        </div>
        </>
    )
}
Comment.propTypes = {
    comment: PropTypes.object.isRequired,
};

const AllComments = (props) =>{
    const comments = props.comments
    const comProps = comments.map((c,i) =><Comment {...{key:i, comment:c}}/> )//using index for now should be swapped with id later
    return(
        <>
            {comProps}
        </>
    )
}
AllComments.propTypes = {
    comments: PropTypes.array.isRequired
};

const MapView = () => {

    const [likeCount, setLikes] = useState(fakeView.numLikes)
    const [newComment,setNewComment] = useState('')

    const [sortSelected, setSort] = useState('time')
    const selectedColor = '#3b82f6' 

    const mapType = MAP_TYPES.HEAT_MAP///CURREMNTLY FOR TESTING
    console.log(newComment)

    return(
        <>
        <div className='bg-primary-GeoPurple min-h-screen max-h-screen flex justify-between items-center flex-col overflow-auto'>
            <div className='w-4/5 pt-5'>
                <TitleDisplay {...{likes:likeCount, setLikes:setLikes}}></TitleDisplay>
                <div className='flex flex-row justify-between h-[650px]'>
                    <MapDisplay/>
                    <Key {...{type: mapType}}/>  
  
                </div>
                
                <div className='flex flex-row justify-between'>
                    <div className='text-3xl text-gray-50 mt-3 font-NanumSquareNeoOTF-Lt w-4/12'>Comments b</div>
                    <div className='flex flex-row justify-between font-NanumSquareNeoOTF-Lt items-end w-4/12'>
                        <div className='text-gray-50 font-NanumSquareNeoOTF-Lt text-2xl'>Sort By:</div>
                        <button className='bg-green-200 px-4 rounded-full py-2 border-2' onClick={()=>setSort('likes')}
                        style={{ borderColor: sortSelected === 'likes' ? selectedColor : '#000000'}}
                        >Likes</button>
                        <button className='bg-yellow-200 px-4 rounded-full py-2 border-2' onClick={()=>setSort('time')}
                        style={{ borderColor: sortSelected === 'time' ? selectedColor : '#000000'}}
                        >Time</button>
                    </div>                   
                </div>
                
                <div className='flex border-2 justify-between rounded-full bg-gray-50 mb-1 mt-2 h-12'>
                    <div className='w-1/12 h-12 flex flex-col justify-center items-center FORSPACING'>
                    </div> 
                    <div className='flex items-center w-9/12'>
                        <input type="text" name="newComment" placeholder='Enter new comment...' onChange={(e) => setNewComment(e.target.value)}
                            className='w-full bg-gray-50 font-NanumSquareNeoOTF-Lt'/>
                    </div>
                    <div className='w-1/12 h-11 flex flex-col  justify-center items-center '>
                        <button className='bg-primary-GeoBlue text-2x1 font-NanumSquareNeoOTF-Lt w-full h-full rounded-full '
                        >Post</button>
                    </div>
                </div>

                <AllComments {...{comments:fakeComments}} />
            </div>
        </div>
        </>
    )

}









export default MapView