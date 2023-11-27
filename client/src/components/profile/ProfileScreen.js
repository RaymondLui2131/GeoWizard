import React, { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faCakeCandles, faCircleArrowLeft, faCircleExclamation, faFire } from '@fortawesome/free-solid-svg-icons'
import ProfileMapCard from './ProfileMapCard'
import ProfileCommentCard from './ProfileCommentCard'
import { useNavigate, useParams } from 'react-router-dom'
import { authgetUserById, updateUserInfo } from "../../api/auth_request_api"
import { getUserMaps } from '../../api/map_request_api'
import { getUserComments } from '../../api/comment_request_api'
import { getMapById } from '../../api/map_request_api'
import { EditText, EditTextarea } from 'react-edit-text'
import { UserContext, UserActionType } from '../../api/UserContext'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
const ProfileScreen = () => {
    const { user, dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null) // user for current profile
    const [userMaps, setUserMaps] = useState([]) // list of maps owned by the user
    const [userComments, setUserComments] = useState([]) // list of comments owned by the user
    const [display, setDisplay] = useState("posts")
    const [commentMap, setCommentMap] = useState({}) // maps referenced by the comments
    const [sortType, setSortType] = useState("new")
    const { id } = useParams()

    const [userInfo, setUserInfo] = useState({
        about: "",
        birthday: "",
        location: ""
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUserInfo({ ...userInfo, [name]: value })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await authgetUserById(id);
                if (userResponse) {
                    setUserData(userResponse);
                    console.log(userResponse)
                    setUserInfo({ about: userResponse.about, birthday: userResponse.birthday, location: userResponse.location })
                    // Check if userData is available before fetching maps
                    if (userResponse && userResponse.maps && userResponse.maps.length) {
                        const mapsResponse = await getUserMaps(userResponse);
                        if (mapsResponse) {
                            setUserMaps(mapsResponse.filter(map => { return map.isPublic }));
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            const data = {}
            try {
                const comments = await getUserComments(id) // get user's comments
                if (comments) {
                    setUserComments(comments)
                    for (const comment of comments) {
                        const res = await getMapById(comment.map_id)
                        if (res) {
                            data[comment._id] = res
                        }
                    }

                    setCommentMap(data)
                }
            }
            catch (err) {
                console.log(err)
            }
        }

        fetchComments()
    }, [])


    const generateMapCards = (sortType) => {
        if (!userMaps.length) {
            return <p className='text-center text-3xl font-PyeongChangPeace-Light'>No Posts</p>
        }
        let sortedMaps
        if (sortType === 'top') {
            sortedMaps = userMaps?.slice().sort((a, b) => b.likes - a.likes)
        } else {
            sortedMaps = userMaps?.slice().sort((a, b) => {
                const dateA = new Date(a.createdAt)
                const dateB = new Date(b.createdAt)
                return dateB - dateA
            })
        }
        return sortedMaps?.map((map_data) => <ProfileMapCard key={map_data._id} map_data={map_data} />)
    }

    const generateCommentCards = () => {
        if (!userComments.length) {
            return <p className='text-center text-3xl font-PyeongChangPeace-Light'>No Comments</p>
        }
        let sortedComments
        if (sortType === 'top') {
            sortedComments = userComments?.slice().sort((a, b) => b.votes - a.votes)
        } else {
            sortedComments = userComments?.slice().sort((a, b) => {
                const dateA = new Date(a.createdAt)
                const dateB = new Date(b.createdAt)
                return dateB - dateA
            })
        }
        return sortedComments?.map((comment) => <ProfileCommentCard key={comment._id} comment_data={comment} mapData={commentMap[comment._id]} />)
    }

    const handleBackButton = () => {
        navigate("/")
    }

    const getDaysActive = () => {
        if (userData) {
            const createdDate = new Date(userData.createdAt);
            const updatedDate = new Date(userData.updatedAt);

            // Calculate the difference in milliseconds
            const differenceInMs = updatedDate - createdDate;

            // Convert milliseconds to days
            const daysActive = differenceInMs / (1000 * 60 * 60 * 24);

            return Math.floor(daysActive); // Return the number of whole days
        }
    }

    const getHighestUpvotes = () => {
        if (userMaps && userMaps.length > 0) {
            return userMaps.reduce((prev, current) => {
                return prev.likes > current.likes ? prev.likes : current.likes;
            });
        }
        return 0; // Return a default value or handle the case when userMaps is null or empty
    }

    const handleSaveInfo = async (e) => {
        const { name } = e;
        if (user) {
            let value = userInfo[name];
            if (value === 'birthday' && typeof value !== Date) {
                value = new Date(value)
            }
            const response = await updateUserInfo(user.token, name, value);
            if (response) {
                console.log(response.data);
            }
        }
    };

    return (
        <>
            <div className='min-h-screen  bg-primary-GeoPurple flex pb-6 m-5 rounded-2xl shadow-nimble'>
                <div className='relative grow w-1/2 h-screen bg-white overflow-hidden flex flex-col justify-between rounded-tl-2xl'>
                    <div className='w-full h-1/4 absolute bg-primary-GeoPurple rounded-2xl'>
                        <button onClick={handleBackButton}><FontAwesomeIcon icon={faCircleArrowLeft} className='h-10 w-10 mt-5 ml-8 hover:opacity-70' /></button>
                    </div>
                    <div className='h-2/5   bg-primary-GeoPurple transform skew-y-[-18.7deg] '>
                    </div>
                    <div className='shadow-aesthetic absolute w-4/5 h-1/2 top-20 left-1/2 transform -translate-x-1/2 rounded-2xl bg-white flex flex-col justify-between'>
                        <div className='shadow-aesthetic absolute left-1/2 transform -translate-x-1/2 -top-16 rounded-full w-32 h-32  bg-primary-GeoBlue z-10 flex items-center justify-center'>
                            <span className='text-black text-7xl font-PyeongChangPeace-Light'>{userData && userData.username[0]}</span>
                        </div>

                        <div className='flex flex-col justify-evenly mt-20 text-center items-center gap-2.5'>
                            <p className='text-black text-4xl font-PyeongChangPeace-Light'>@{userData && userData.username}</p>
                            <div className='flex items-center gap-1 justify-start'>
                                <FontAwesomeIcon icon={faLocationDot} />
                                {/* <p className='text-black text-base font-PyeongChangPeace-Light'>Stony Brook, NY</p> */}
                                <EditText
                                    className={`text-black text-base font-PyeongChangPeace-Light ${user?._id !== id ? 'hover:bg-none' : 'hover:bg-gray-100 hover:cursor-pointer'}`}
                                    name='location'
                                    value={userInfo?.location}
                                    placeholder="No Location."
                                    onSave={(e) => handleSaveInfo(e)}
                                    onChange={handleInputChange}
                                    readonly={user?._id !== id}
                                />
                            </div>
                            <div className='flex items-center  gap-1 justify-start  text-black text-base font-PyeongChangPeace-Light'>
                                <FontAwesomeIcon icon={faCakeCandles} />
                                <DatePicker className={`w-24 ${user?._id !== id ? 'hover:bg-none' : 'hover:bg-gray-100 hover:cursor-pointer'}`}
                                    selected={userInfo?.birthday ? new Date(userInfo.birthday) : null}
                                    onChange={(date) => handleInputChange({ target: { name: 'birthday', value: new Date(date) } })}
                                    dateFormat='MM/dd/yyyy'
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    disabled={user?._id !== id}
                                    placeholderText='None'
                                    onBlur={() => handleSaveInfo({ name: 'birthday' })}
                                />
                            </div>
                        </div>

                        <div className='bg-gray-50 h-1/3 flex justify-evenly items-center rounded-b-2xl'>
                            <p className='text-center'>
                                <span className='block font-PyeongChangPeace-Bold text-lg '>{userMaps && (userMaps.filter(map => map.isPublic)).length}</span>
                                <span className='block font-PyeongChangPeace-Light'>Posts</span>
                            </p>
                            <p className='text-center'>
                                <span className='block font-PyeongChangPeace-Bold text-lg'>{userMaps && getHighestUpvotes()}</span>
                                <span className='block font-PyeongChangPeace-Light'>Highest Upvotes</span>
                            </p>
                            <p className='text-center'>
                                <span className='block font-PyeongChangPeace-Bold text-lg'>{userData && getDaysActive()}</span>
                                <span className='block font-PyeongChangPeace-Light'>Days Active</span>
                            </p>
                        </div>
                    </div>
                    <div className='h-1/2 flex flex-col justify-end px-12'>
                        <div className='h-[65%] text-sm rounded-2xl px-5 py-3 mb-4 overflow-scroll bg-gray-50 shadow-warm font-PyeongChangPeace-Light'>
                            <EditTextarea
                                className={`${user?._id !== id ? 'hover:none' : 'hover:bg-gray-100 hover:cursor-pointer'}`}
                                name='about'
                                value={userInfo?.about}
                                placeholder="No Description."
                                onSave={(e) => handleSaveInfo(e)}
                                onChange={handleInputChange}
                                readonly={user?._id !== id}
                                style={{ height: '100%', width: '100%' }}
                            />
                        </div>
                    </div>
                </div>

                <div className='grow w-3/5 h-screen'>
                    <div className='grow h-1/4 flex flex-col justify-evenly items-baseine align-middle'>
                        <div className='flex justify-center gap-10 align-middle'>
                            <button className={`hover:text-primary-GeoBackGround text-2xl font-PyeongChangPeace-Light ${display === "posts" && 'border-b-2  border-primary-GeoBlue'}`} onClick={() => setDisplay("posts")}>Posts</button>
                            <button className={`hover:text-primary-GeoBackGround text-2xl font-PyeongChangPeace-Light ${display === "comments" && 'border-b-2  border-primary-GeoBlue'}`} onClick={() => setDisplay("comments")}>Comments</button>
                        </div>
                        <div className={`flex justify-center gap-10 align-middle ${(display === 'posts' && !userMaps.length) || (display === 'comments' && !userComments.length) ? 'opacity-0' : 'opacity-100'}`}>
                            <button className={`flex items-center text-2xl px-5 bg-primary-GeoBackGround rounded-2xl ${sortType === 'new' ? 'bg-opacity-70 hover:bg-opacity-80' : 'bg-opacity-20 hover:bg-opacity-30'}`} onClick={() => setSortType('new')}><FontAwesomeIcon icon={faCircleExclamation} className='mr-1' />New</button>
                            <button className={`flex items-center text-2xl px-5 bg-primary-GeoBackGround rounded-2xl ${sortType === 'top' ? 'bg-opacity-70 hover:bg-opacity-80' : 'bg-opacity-20 hover:bg-opacity-30'}`} onClick={() => setSortType('top')}><FontAwesomeIcon icon={faFire} className='mr-1' />Top</button>
                        </div>
                    </div>
                    <ul className='grow h-3/4 flex flex-col justify-start overflow-scroll gap-5'>
                        {display === "posts" && userMaps && generateMapCards(sortType)}
                        {display === "comments" && userMaps && generateCommentCards(sortType)}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default ProfileScreen