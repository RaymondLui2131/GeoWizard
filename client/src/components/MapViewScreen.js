import { useState, useContext,useEffect } from 'react'
import { MapContainer, TileLayer,GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import {ReactComponent as ThumbsIcon} from '../assets/MapViewAssets/thumpsUp.svg'
import {ReactComponent as ThumbsGreen} from '../assets/MapViewAssets/thumpsUpGreen.svg'
import {ReactComponent as ThumbsRed} from '../assets/MapViewAssets/thumpsUpRed.svg'
import {MAP_TYPES} from '../constants/MapTypes'
import {AlphaSlider} from 'react-slider-color-picker'
import franceMap from '../assets/EditMapAssets/france-r.geo.json'  //To be removed
import { UserContext } from "../api/UserContext.js"
import { getMap,changeLikesMap } from '../api/map_request_api';  //for now requesting, will change to context later

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
    const { user } = useContext(UserContext)
    const currentCounter = props.likes
    const setCounter = props.setLikes
    const map_id = props.map_id
    const title = props.title
    const author = props.author
    const userLikes = props.userLikes
    const userDislikes = props.userDislikes
    const handleLike = async (likeClicked) =>{

        if(!user) //not signed in handle not sign in todo
                return
        else
        {
            const foundLike = userLikes.filter((id) => id === user._id)
            if(foundLike.length > 1)
                setLike('green')
            else
            {
                const foundDislike = userDislikes.filter((id) => id === user._id)
                if(foundDislike.length > 1)
                    setLike('red')
            }
        }
        if(currentLike === likeClicked)
        {
            setLike(null)
            if(currentLike === 'green')
            {
                setCounter(currentCounter - 1)
                const response = await changeLikesMap(user._id, map_id,-1)
                console.log(response)
            }
            else
            {
                setCounter(currentCounter + 1)
                const response = await changeLikesMap(user._id, map_id,1)
                console.log(response)
            }
            return
        }
        setLike(likeClicked)
        if(currentLike === null)
            if(likeClicked === 'green')
            {
                setCounter(currentCounter + 1)
                const response = await changeLikesMap(user._id, map_id,1)
                console.log(response)
            }
            else
            {
                setCounter(currentCounter - 1)
                const response = await changeLikesMap(user._id, map_id,-1)
                console.log(response)
            }
        else
            if(likeClicked === 'green')
            {
                setCounter(currentCounter + 2)
                const response = await changeLikesMap(user._id, map_id,2)
                console.log(response)
            }
            else
            {
                setCounter(currentCounter - 2)
                const response = await changeLikesMap(user._id, map_id,-2)
                console.log(response)
            }
    }
    return(
        <>
        <div className='flex flex-row justify-between'>
            <div className='flex flex-col items-center'>
                {currentLike === 'green'
                    ?<ThumbsGreen className='fill-green-950 h-10 w-10' onClick={()=>handleLike('green')}/>
                    :<ThumbsIcon className='fill-green-950  h-10 w-10'  onClick={()=>handleLike('green')}/>
                }
                <div className='font-NanumSquareNeoOTF-Lt'>{currentCounter
                                                            ?currentCounter
                                                            :0}
                </div>
                {currentLike === 'red'
                    ?<ThumbsRed className='tansform -scale-y-100 fill-red-950  h-10 w-10' onClick={()=>handleLike('red')}/>
                    :<ThumbsIcon className='tansform -scale-y-100 fill-red-950  h-10 w-10' onClick={()=>handleLike('red')}/>
                }
            </div>

            <div className='flex flex-col w-2/3 items-center text-primary-GeoBlue'>
                <div className='font-PyeongChangPeace-Bold text-5xl '>
                    {title
                        ?title
                        :""}
                </div>
                <div className='font-PyeongChangPeace-Light text-3xl'>
                    {author
                        ?'by ' + author
                        :'by'}
                </div>
            </div>

            <div>
                <button className='font-NanumSquareNeoOTF-Lt bg-primary-GeoOrange px-14 rounded-full py-2'>Fork Map</button>
            </div>
        </div>

        </>
    )

}


const MapDisplay = (props) =>{
    const mapData = props.MapData

    var center = [0,0]
    var padded_NE = [0,0]
    var padded_SW = [0,0]
    if(mapData)
    {
        const geoJsonLayer = L.geoJSON(mapData.original_map)
        const bounds = geoJsonLayer.getBounds()
        center = bounds.getCenter()
        //Padding for bounds
        const currNe= bounds.getNorthEast()
        const currSw = bounds.getSouthWest()
        currNe.lat = currNe.lat + 5
        currSw.lat = currSw.lat - 5
        currNe.lng = currNe.lng + 5
        currSw.lng = currSw.lng - 5
        padded_NE = currNe
        padded_SW = currSw
    }

    if(!mapData)
    {
        return (<div>placeholder</div>)
    }
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
                {Object.keys(mapData).length    
                    ?<GeoJSON data={mapData.original_map.features}/>
                    :null
                }
                
            </MapContainer>
        </>
    )
}

const Key = (props) =>{//Note this key layout only works for color
    const mapType = props.type
    const hlsaColor = {h:0, s:.73, l:.51, a:1}  //TESTING
    console.log("Map type",mapType)
    if(mapType === MAP_TYPES['CHOROPLETH'])
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
    if(mapType === MAP_TYPES['HEATMAP'])
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

    const currTime = new Date()
    const commentTime = new Date(comment.createdAt)
    const time_diff = currTime.getSeconds() - commentTime.getSeconds() //replace with better time diff

    const handleLike = () =>{
        if(currentLike)
            setVotes(votes - 1)
        else
            setVotes(votes + 1)
        setLike(!currentLike)
    }
    if(!comment)
        return null
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
                <div className='font-NanumSquareNeoOTF-Lt underline'>{comment.user_id.username}</div>
                <div className='font-NanumSquareNeoOTF-Lt'>{comment.text}</div>
            </div>
            <div className='w-1/12 h-24 flex flex-col justify-center items-center text-2x1'>
                <div className='font-NanumSquareNeoOTF-Lt'>{'-'+ time_diff + " seconds"}</div> {/*Replace with better time*/}
            </div>
        </div>
        </>
    )
}

const AllComments = (props) =>{
    const comments = props.comments
    return null
    // if(!comments)
    //     return(<></>)
    // const comProps = comments.map((c,i) =><Comment {...{key:c._id, comment:c}}/> )
    // return(
    //     <>
    //         {comProps}
    //     </>
    // )
}


const MapView = () => {
    const [map,setMap] = useState({}); //REPLACE WITH MAP CONTEXT
    const [likeCount, setLikes] = useState(map.likes)
    const [map_id,setMapID] = useState(map._id)
    const [title,setTitle] = useState(map.title)
    const [author,setAuthor] = useState(map.author)
    const [userLikes,setUserLikes] = useState(map.userLikes)
    const [userDislikes,setUserDislikes] = useState(map.userDislikes)
    const [mapType, setMapType] = useState(map.mapType)
    const [newComment,setNewComment] = useState('')
    const [sortSelected, setSort] = useState('time')

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("In view")
                const responseMap = await getMap('655805f27a6bfb3741afc2a9')
                setMap(responseMap)
                setMapID(responseMap._id)
                setTitle(responseMap.title)
                setAuthor(responseMap.user_id.username)
                setLikes(responseMap.likes)
                setMapType(responseMap.mapType)
                setUserLikes(responseMap.userLikes)
                setUserDislikes(responseMap.userDislikes)
            } catch (error) {
                console.error('Error fetching map data:', error);
            }
        };

        fetchData();
    }, [])

    const selectedColor = '#3b82f6' 

    console.log(newComment)    
    // const { map } = useContext(MapContext)
    console.log("Map Type",mapType)
    return(
        <>
        <div className='bg-primary-GeoPurple min-h-screen max-h-screen flex justify-between items-center flex-col overflow-auto'>
            <div className='w-4/5 pt-5'>
                <TitleDisplay {...{likes:likeCount, setLikes:setLikes, map_id: map_id, title:title, author:author, userLikes:userLikes, userDislikes:userDislikes}}></TitleDisplay>
                <div className='flex flex-row justify-between h-[650px]'>
                    {Object.keys(map).length
                            ?<MapDisplay {...{MapData: map.MapData}}/>
                        :null
                    }
                    
                    <Key {...{type: mapType}}/>  
  
                </div>
                
                <div className='flex flex-row justify-between'>
                    <div className='text-3xl text-gray-50 mt-3 font-NanumSquareNeoOTF-Lt w-4/12'>Comments</div>
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
                <AllComments {...{comments:map.comments}} />
            </div>
        </div>
        </>
    )

}



export default MapView