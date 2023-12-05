import { useState, useContext, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { ReactComponent as ThumbsIcon } from '../assets/MapViewAssets/thumpsUp.svg'
import { ReactComponent as ThumbsGreen } from '../assets/MapViewAssets/thumpsUpGreen.svg'
import { ReactComponent as ThumbsRed } from '../assets/MapViewAssets/thumpsUpRed.svg'
import { MAP_TYPES } from '../constants/MapTypes'
import { SaturationSlider } from 'react-slider-color-picker'
import franceMap from '../assets/EditMapAssets/france-r.geo.json'  //To be removed
import { UserContext } from "../api/UserContext.js"
import { MapContext, MapActionType } from "../api/MapContext"
import { changeLikesMap } from '../api/map_request_api';  //for now requesting, will change to context later
import { changeLikesComment, postComment } from '../api/comment_request_api.js';
import tinycolor from 'tinycolor2';
import { useNavigate } from "react-router-dom";
import NotDraggableImageOverlay from './editingMaps/ImageNotDraggable.js';
import PointMarkerNotEditable from './editingMaps/PointMarkerNotEditable.js';

const fakeView = {
    title: 'The Title of the Map',
    author: 'anon123',
    numLikes: 300
}
const possibleNames = ['name', 'nom', 'nombre', 'title', 'label', 'id']

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
    text: "Testing",
    date: new Date(),

}
const fakeComment2 = {
    username: 'bob1',
    votes: 10,
    text: "Testing ",
    date: new Date(),

}
const fakeComment3 = {
    username: 'bob1',
    votes: 10,
    text: "Testing ",
    date: new Date(),

}

const fakeComments = [fakeComment1, fakeComment2, fakeComment3]
const fakeKeyAll = [fakeKeyData1, fakeKeyData2, fakeKeyData3]
const hlsaToRGBA = (hlsa) => {
    const color = tinycolor(hlsa)
    const rgba = color.toRgb()
    const rgbaString = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    // console.log("Input", hlsa)
    // console.log("COnversion",rgbaString)
    return rgbaString
}
const TitleDisplay = (props) => {
    const navigate = useNavigate()
    const [currentLike, setLike] = useState(null)
    const { user } = useContext(UserContext)
    const { map, dispatch } = useContext(MapContext)
    const currentCounter = props.likes
    const setCounter = props.setLikes
    const map_id = props.map_id
    const title = props.title
    const author = props.author
    const userLikes = props.userLikes
    const userDislikes = props.userDislikes

    useEffect(() => {
        if (user) {
            const foundLike = userLikes.filter((id) => id === user._id)
            console.log("All Likes", userLikes)
            console.log("found like", foundLike)
            if (foundLike.length > 0) {
                setLike('green')
                console.log("Setting Greenn")
            }
            else {
                const foundDislike = userDislikes.filter((id) => id === user._id)
                if (foundDislike.length > 0)
                    setLike('red')
            }
        }
    }, [])

    const handleLike = async (likeClicked) => {

        if (!user) //not signed in handle not sign in todo
            return
        if (currentLike === likeClicked) {
            setLike(null)
            if (currentLike === 'green') {
                setCounter(currentCounter - 1)
                const response = await changeLikesMap(user._id, map_id, -1, true)
                console.log(response)
            }
            else {
                setCounter(currentCounter + 1)
                const response = await changeLikesMap(user._id, map_id, 1, true)
                console.log(response)
            }
            return
        }
        setLike(likeClicked)
        if (currentLike === null)
            if (likeClicked === 'green') {
                setCounter(currentCounter + 1)
                const response = await changeLikesMap(user._id, map_id, 1, false)
                console.log(response)
            }
            else {
                setCounter(currentCounter - 1)
                const response = await changeLikesMap(user._id, map_id, -1, false)
                console.log(response)
            }
        else
            if (likeClicked === 'green') {
                setCounter(currentCounter + 2)
                const response = await changeLikesMap(user._id, map_id, 2, false)
                console.log(response)
            }
            else {
                setCounter(currentCounter - 2)
                const response = await changeLikesMap(user._id, map_id, -2, false)
                console.log(response)
            }
    }

    const handleProfile = () => {
        navigate(`/profile/${map?.user_id?._id}`)
    }

    const handleFork = () => {
        // console.log(map.MapData)
        dispatch({ type: MapActionType.FORK, payload: { map: map.MapData.original_map, mapObj: map} })
        navigate(`/editingMap`)
    }

    return (
        <>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-col items-center'>
                    {currentLike === 'green'
                        ? <ThumbsGreen className='fill-green-950 h-10 w-10' onClick={() => handleLike('green')} />
                        : <ThumbsIcon className='fill-green-950  h-10 w-10' onClick={() => handleLike('green')} />
                    }
                    <div className='font-NanumSquareNeoOTF-Lt'>{currentCounter
                        ? currentCounter
                        : 0}
                    </div>
                    {currentLike === 'red'
                        ? <ThumbsRed className='tansform -scale-y-100 fill-red-950  h-10 w-10' onClick={() => handleLike('red')} />
                        : <ThumbsIcon className='tansform -scale-y-100 fill-red-950  h-10 w-10' onClick={() => handleLike('red')} />
                    }
                </div>

                <div className='flex flex-col w-2/3 items-center text-primary-GeoBlue'>
                    <div className='font-PyeongChangPeace-Bold text-5xl '>
                        {title
                            ? title
                            : ""}
                    </div>
                    <div className='font-PyeongChangPeace-Light text-3xl hover:underline hover:underline-offset-4 hover:cursor-pointer' onClick={handleProfile}>
                        {author
                            ? 'by ' + author
                            : 'by'}
                    </div>
                </div>

                <div className='group flex relative'>
                    <button disabled={!user} onClick={handleFork} className={`h-1/2 font-NanumSquareNeoOTF-Lt bg-primary-GeoOrange px-14 rounded-full py-2 ${!user && "opacity-30"}`}>Fork Map</button>
                    {!user && <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 whitespace-nowrap rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">You must be logged in to fork a map</span>}
                </div>
            </div>

        </>
    )

}


const MapDisplay = (props) => {
    const mapData = props.MapData
    const edits = mapData.edits
    const mapType = props.mapType
    var center = [0, 0]
    var padded_NE = [0, 0]
    var padded_SW = [0, 0]
    if (mapData) {
        const geoJsonLayer = L.geoJSON(mapData.original_map)
        const bounds = geoJsonLayer.getBounds()
        center = bounds.getCenter()
        //Padding for bounds
        const currNe = bounds.getNorthEast()
        const currSw = bounds.getSouthWest()
        currNe.lat = currNe.lat + 5
        currSw.lat = currSw.lat - 5
        currNe.lng = currNe.lng + 5
        currSw.lng = currSw.lng - 5
        padded_NE = currNe
        padded_SW = currSw
    }

    if (!mapData) {
        return (<div>Loading</div>)
    }
    const styleMapping = {}
    edits.editsList.forEach((edit) => {
        switch (MAP_TYPES[mapType]) {

            case MAP_TYPES['HEATMAP']: {
                console.log("Adding", edit.featureName)
                styleMapping[edit.featureName] = { fillColor: hlsaToRGBA(edit.colorHLSA), fillOpacity: 0.7 };
                break;
            }
            case MAP_TYPES['CHOROPLETH']:
                {
                    // console.log("Adding", edit.featureName)
                    styleMapping[edit.featureName] = { fillColor: edit.colorHEX, fillOpacity: 0.7 }
                    break
                }
            default:
                break;
        }
    })
    console.log(styleMapping)
    const getFeatureStyleView = (feature) => {
        const foundName = possibleNames.find(propertyName => propertyName in feature.properties)
        if (feature) {
            return styleMapping[feature.key] || { fillColor: '#ffffff' }
        }
        return {}
    }
    return (
        <>
            <MapContainer
                center={center}
                zoom={6}
                style={{ height: '650px' }}
                className='h-full w-10/12'
                scrollWheelZoom={true}
                maxBounds={[padded_NE, padded_SW]}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {Object.keys(mapData).length
                    ?
                    <>
                        <GeoJSON
                            data={mapData.original_map.features}
                            pointToLayer={(feature, latlng) => {
                                if (feature.properties && feature.properties.iconUrl) {
                                    const icon = L.icon({
                                        iconUrl: feature.properties.iconUrl,
                                        iconSize: [32, 32],
                                    });
                                    const marker = L.marker(latlng, { icon });
                                    return marker;
                                }
                                return L.circleMarker(latlng);
                            }}
                            onEachFeature={(feature, layer) => {
                                if (feature.geometry.type === 'Point') {
                                    return;
                                }
                                if (MAP_TYPES[mapType] === MAP_TYPES['CHOROPLETH'] || MAP_TYPES[mapType] === MAP_TYPES['HEATMAP']) {
                                    const featureStyle = getFeatureStyleView(feature)
                                    layer.setStyle(featureStyle)
                                }

                            }} />
                        {
                            MAP_TYPES[mapType] === MAP_TYPES['SYMBOL']
                                ? edits.editsList.map((edit) =>
                                    <NotDraggableImageOverlay key={edit.id} id={edit.id} image={edit.symbol}
                                        initialBounds={edit.bounds}
                                        color={edit.colorHLSA}
                                    />)
                                : null
                        }
                        {
                            MAP_TYPES[mapType] === MAP_TYPES['POINT']
                                ? edits.editsList.map((edit) =>
                                    <PointMarkerNotEditable
                                        key={edit.id}
                                        id={edit.id}
                                        edit={edit}
                                    />)
                                : null
                        }
                    </>
                    : null
                }

            </MapContainer>
        </>
    )
}

const Key = (props) => {//Note this key layout only works for color

    const mapType = props.type
    const header = props.header

    const [heatColor, setHeatColor] = useState({})
    useEffect(() => {
        if (header)
            setHeatColor(header.basecolorHLSA)
    }, [])

    console.log("Map type", mapType)
    if (MAP_TYPES[mapType] === MAP_TYPES['CHOROPLETH'])
        return (
            <>
                <table className='w-1/12 border-4 border-black bg-gray-50'>
                    <caption className='font-PyeongChangPeace-Bold'>
                        Key
                    </caption>
                    <tbody className='font-NanumSquareNeoOTF-Lt border-4 border-black overflow-y-auto'>
                        {
                            header.keyTable.map((dataRow) => (
                                <tr key={dataRow.color} className='border-4 border-black'>
                                    <td className='border-4 border-black w-1/3 '>
                                        <div className='flex justify-center'>
                                            <div className='flex w-5 h-5 border-4 border-black' style={{ backgroundColor: dataRow.color }}>
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
    if (MAP_TYPES[mapType] === MAP_TYPES['HEATMAP'])
        return (
            <>
                <div className='w-1/12 border-4 border-black bg-gray-50 flex flex-col justify-around font-NanumSquareNeoOTF-Lt items-center'>
                    <div className='flex flex-col justify-between h-4/6 items-center'>
                        <div className='pb-2'>
                            {header.upper}
                        </div>
                        <div className='rotate-[-90deg] w-96 pt-2'>
                            <SaturationSlider color={heatColor} handleChangeColor={(newcolor) => setHeatColor(newcolor)} />
                        </div>
                        <div className='pt-2'>
                            {header.lower}
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <div className='flex w-10 h-10 border-4 border-black' style={{ backgroundColor: hlsaToRGBA(heatColor) }}></div>
                    </div>
                </div>
            </>
        )
    else
        return null
}

const Comment = (props) => {
    const comment = props.comment
    console.log("This is comment", comment)
    const navigate = useNavigate()
    const [currentLike, setLike] = useState(false)
    const [votes, setVotes] = useState(comment.votes)
    const { user } = useContext(UserContext)
    const currTime = new Date()
    const commentTime = new Date(comment.createdAt)
    const time_diff = currTime - commentTime //replace with better time diff

    const secondsDiff = Math.floor(time_diff / 1000);
    const minutesDiff = Math.floor(secondsDiff / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);
    let formattedTimeDiff;
    if (daysDiff > 0) {
        formattedTimeDiff = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-daysDiff, 'day');
    } else if (hoursDiff > 0) {
        formattedTimeDiff = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-hoursDiff, 'hour');
    } else if (minutesDiff > 0) {
        formattedTimeDiff = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-minutesDiff, 'minute');
    } else {
        formattedTimeDiff = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-secondsDiff, 'second');
    }
    useEffect(() => {
        if (user) {
            const foundLikedUser = (comment.usersVoted).filter((id) => id === user._id)
            if (foundLikedUser.length > 0)
                setLike(true)
        }
    }, [])

    const handleLike = async () => {
        if (!user)//handle user not signed in later
            return
        if (currentLike) {
            const response = changeLikesComment(user._id, comment._id, -1)
            setVotes(votes - 1)
            console.log(response)
        }
        else {
            const response = changeLikesComment(user._id, comment._id, 1)
            setVotes(votes + 1)
            console.log(response)
        }
        setLike(!currentLike)
    }
    if (!comment)
        return null

    const handleProfile = () => {
        navigate(`/profile/${comment?.user_id?._id}`)
    }

    return (
        <>
            <div className='flex flex-row justify-between border-2 rounded-full bg-gray-50 mb-1 mt-2'>
                <div className='w-1/12 h-24 flex flex-col justify-center items-center'>
                    {currentLike
                        ? <ThumbsGreen className='fill-green-950 h-5 w-5' onClick={() => handleLike()} />
                        : <ThumbsIcon className='fill-green-950  h-5 w-5' onClick={() => handleLike()} />
                    }
                    <div className='font-NanumSquareNeoOTF-Lt'>{votes}</div>
                </div>

                <div className='w-10/12 h-24 flex flex-col pt-2 overflow-auto whitespace-normal'>
                    <div className='font-NanumSquareNeoOTF-Lt hover:cursor-pointer hover:underline' onClick={handleProfile}>{comment.user_id.username}</div>
                    <div className='font-NanumSquareNeoOTF-Lt'>{comment.text}</div>
                </div>
                <div className='w-1/12 h-24 flex flex-col justify-center items-center text-2x1'>
                    <div className='font-NanumSquareNeoOTF-Lt'>{'-' + formattedTimeDiff}</div> {/*Replace with better time*/}
                </div>
            </div>
        </>
    )
}

const AllComments = (props) => {
    const comments = props.comments
    // console.log("THis is comments",comments)
    // return null
    if (!comments)
        return (null)
    const comProps = comments.map((c) => <Comment {...{ key: c._id, comment: c }} />)
    return (
        <>
            {comProps}
        </>
    )
}


const MapView = () => {

    const { map } = useContext(MapContext)
    const { user } = useContext(UserContext)
    //console.log(map)
    const [mapView,] = useState(map || null); //REPLACE WITH MAP CONTEXT
    const [likeCount, setLikes] = useState(mapView?.likes || 0)
    const [map_id,] = useState(mapView?._id || '')
    const [title,] = useState(mapView?.title || '')
    const [author,] = useState(mapView?.user_id?.username || '')
    const [userLikes,] = useState(mapView?.userLikes || [])
    const [userDislikes,] = useState(mapView?.userDislikes || [])
    const [mapType,] = useState(mapView?.mapType || '')
    const [comments, setComments] = useState(mapView?.comments || [])

    const [sortSelected, setSort] = useState('time')
    const [newComment, setNewComment] = useState('')

    const selectedColor = '#3b82f6'

    console.log(newComment)
    console.log("Map Type", mapType)
    const postNewComment = async () => {
        if (!user)       //case where user not signed in
            return
        const response = await postComment(newComment, user._id, map_id)
        // console.log(response)
        if (response.status === 200) {
            const commentList = comments.slice()
            commentList.push(response.data.newComment)
            setComments(commentList)
            setNewComment('')
        }
    }
    return (
        <>
            <div className='bg-primary-GeoPurple min-h-screen max-h-screen flex justify-between items-center flex-col overflow-auto'>
                <div className='w-4/5 pt-5'>
                    {mapView
                        ? <TitleDisplay {...{ likes: likeCount, setLikes: setLikes, map_id: map_id, title: title, author: author, userLikes: userLikes, userDislikes: userDislikes }}></TitleDisplay>
                        : null
                    }
                    <div className='flex flex-row justify-between h-[650px]'>
                        {mapView
                            ? <><MapDisplay {...{ MapData: map.MapData, mapType: mapType }} />
                                <Key {...{ type: mapType, header: map.MapData.edits.header }} />
                            </>
                            : null
                        }
                    </div>

                    <div className='flex flex-row justify-between'>
                        <div className='text-3xl text-gray-50 mt-3 font-NanumSquareNeoOTF-Lt w-4/12'>Comments</div>
                        <div className='flex flex-row justify-between font-NanumSquareNeoOTF-Lt items-end w-4/12'>
                            <div className='text-gray-50 font-NanumSquareNeoOTF-Lt text-2xl'>Sort By:</div>
                            <button className='bg-green-200 px-4 rounded-full py-2 border-2' onClick={() => setSort('likes')}
                                style={{ borderColor: sortSelected === 'likes' ? selectedColor : '#000000' }}
                            >Likes</button>
                            <button className='bg-yellow-200 px-4 rounded-full py-2 border-2' onClick={() => setSort('time')}
                                style={{ borderColor: sortSelected === 'time' ? selectedColor : '#000000' }}
                            >Time</button>
                        </div>
                    </div>

                    <div className='flex border-2 justify-between rounded-full bg-gray-50 mb-1 mt-2 h-12'>
                        <div className='w-1/12 h-12 flex flex-col justify-center items-center FORSPACING'>
                        </div>
                        <div className='flex items-center w-9/12'>
                            <input type="text" name="newComment" placeholder='Enter new comment...' value={newComment} onChange={(e) => setNewComment(e.target.value)}
                                className='w-full bg-gray-50 font-NanumSquareNeoOTF-Lt' />
                        </div>
                        <div className='w-1/12 h-11 flex flex-col  justify-center items-center '>
                            <button className='bg-primary-GeoBlue text-2x1 font-NanumSquareNeoOTF-Lt w-full h-full rounded-full' onClick={() => postNewComment()}
                            >Post</button>
                        </div>
                    </div>
                    {mapView
                        ? <AllComments {...{ comments: comments }} />
                        : null
                    }

                </div>
            </div>
        </>
    )

}



export default MapView