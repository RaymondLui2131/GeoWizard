import React, { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCakeCandles,
  faCircleArrowLeft,
  faCircleExclamation,
  faFire,
  faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";
import ProfileMapCard from "./ProfileMapCard";
import ProfileCommentCard from "./ProfileCommentCard";
import { useNavigate, useParams } from "react-router-dom";
import {
  authgetUserById,
  updateUserInfo,
  checkUser,
} from "../../api/auth_request_api";
import { getUserMaps, getMap } from "../../api/map_request_api";
import { getUserComments } from "../../api/comment_request_api";
import { getMapById } from "../../api/map_request_api";
import { EditText, EditTextarea } from "react-edit-text";
import { UserContext, UserActionType } from "../../api/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from "react-paginate";
const ProfileScreen = () => {
  const { user, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // user for current profile
  const [userMaps, setUserMaps] = useState([]); // list of maps owned by the user
  const [resData, setResData] = useState({});
  const [userComments, setUserComments] = useState([]); // list of comments owned by the user
  const [display, setDisplay] = useState("posts");
  const [commentMap, setCommentMap] = useState({}); // maps referenced by the comments
  const [sortType, setSortType] = useState("new");
  const { id } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPublic, setIsPublic] = useState(false);
  const [done, setDone] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const dropdownRef = useRef(null);
  const [userInDb, setUserInDb] = useState(false); // check if user is unqiue
  const [userInfo, setUserInfo] = useState({
    about: "",
    birthday: "",
    location: "",
    username: "",
  });

  const itemsPerPage = 4;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = async (selectedPage) => {
    // setDone(false);
    setCurrentPage(selectedPage.selected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authgetUserById(id);
        if (userResponse) {
          setUserData(userResponse);
          setCurrentPage(0);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      setDone(false);
      if (userData) {
        setUserInfo({
          about: userData.about,
          birthday: userData.birthday,
          location: userData.location,
          username: userData.username,
        });

        // Check if userData is available before fetching maps
        if (userData.maps && userData.maps.length) {
          const mapsResponse = await getUserMaps(
            userData,
            currentPage,
            itemsPerPage,
            user?._id === id,
            sortType
          );
          if (mapsResponse) {
            setUserMaps(mapsResponse.maps);
            setResData(mapsResponse.resData);
            setTotalPages(Math.ceil(mapsResponse.maps.length / itemsPerPage));
          }
        } else {
          setUserMaps([]);
        }
      }
      setDone(true);
    };
    fetchAdditionalData();
  }, [userData]);

  useEffect(() => {
    const fetchComments = async () => {
      const data = {};
      try {
        const comments = await getUserComments(id); // get user's comments
        if (comments) {
          setUserComments(comments);
          for (const comment of comments) {
            const res = await getMapById(comment.map_id);
            if (res) {
              data[comment._id] = res;
            }
          }

          setCommentMap(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchComments();
  }, [userData]);

  const generateMapCards = (sortType) => {
    if (!userMaps?.length) {
      return (
        <p className="text-center text-3xl font-PyeongChangPeace-Light">
          No Posts
        </p>
      );
    }

    let sortedMaps;
    if (sortType === "top") {
      sortedMaps = userMaps?.slice().sort((a, b) => b.likes - a.likes);
    } else {
      sortedMaps = userMaps?.slice().sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
    }

    console.log(startIndex, endIndex);
    const subset = sortedMaps?.slice(startIndex, endIndex);
    console.log(subset);

    return subset?.map((map_data) => (
      <ProfileMapCard
        key={map_data._id}
        map_data={map_data}
        res={resData[map_data._id]}
      />
    ));
  };

  const generateCommentCards = () => {
    if (!userComments.length) {
      return (
        <p className="text-center text-3xl font-PyeongChangPeace-Light">
          No Comments
        </p>
      );
    }
    let sortedComments;
    if (sortType === "top") {
      sortedComments = userComments?.slice().sort((a, b) => b.votes - a.votes);
    } else {
      sortedComments = userComments?.slice().sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
    }
    return sortedComments?.map((comment) => (
      <ProfileCommentCard
        key={comment._id}
        comment_data={comment}
        mapData={commentMap[comment._id]}
      />
    ));
  };

  const handleBackButton = () => {
    navigate("/");
  };

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
  };

  const getHighestUpvotes = () => {
    if (!userMaps || userMaps.length === 0) {
      return 0;
    }

    let max_like = 0;
    userMaps.map((map) => {
      const like = map.likes;
      max_like = Math.max(max_like, like);
    });
    return max_like;
  };


  const handleSaveUsername = async (e) => {
    const { name } = e;
    setUserInDb(false);
    const checkUniqueUser = async () => {
      try {
        const uniqueUserresponse = await checkUser(userInfo.username);
        if (name === "username" && uniqueUserresponse.status === 409) {
          setUserInDb(true);
          return;
        } else if (uniqueUserresponse.status === 200) {
          if (user) {
            let value = userInfo[name];
            const response = await updateUserInfo(user.token, name, value);
            if (response && name === "username") {
              // update username in context
              dispatch({
                type: UserActionType.UPDATE,
                payload: { ...user, username: userInfo?.username },
              });
            }
          }
        }
      } catch (error) {
        console.error("Error finding an username:", error);
      }
    };

    checkUniqueUser()
  }

  const handleSaveInfo = async (e) => {
    const { name } = e;
    if (user) {
      let value = userInfo[name];
      if (value === 'birthday' && typeof value !== Date) {
        value = new Date(value)
      }
      await updateUserInfo(user.token, name, value);
    }
  };

  return (
    <>
      <div className="min-h-screen  bg-primary-GeoPurple flex pb-6 m-5 rounded-2xl shadow-nimble">
        <div className="relative grow w-1/2 h-screen bg-white overflow-hidden flex flex-col justify-between rounded-tl-2xl">
          <div className="w-full h-1/4 absolute bg-primary-GeoPurple rounded-2xl">
            <button onClick={handleBackButton}>
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="h-10 w-10 mt-5 ml-8 hover:opacity-70"
              />
            </button>
          </div>
          <div className="h-2/5   bg-primary-GeoPurple transform skew-y-[-18.7deg] "></div>
          <div className="shadow-aesthetic absolute w-4/5 h-1/2 top-20 left-1/2 transform -translate-x-1/2 rounded-2xl bg-white flex flex-col justify-between">
            <div className="shadow-aesthetic absolute left-1/2 transform -translate-x-1/2 -top-16 rounded-full w-32 h-32  bg-primary-GeoBlue z-10 flex items-center justify-center">
              <span className="text-black text-7xl font-PyeongChangPeace-Light">
                {userInfo?.username[0]}
              </span>
            </div>

            <div className="flex flex-col justify-evenly mt-20 text-center items-center gap-2.5">
              <div className="flex items-center ">
                <span className="text-black text-4xl font-PyeongChangPeace-Light">
                  @
                </span>
                <EditText
                  className={`text-black text-4xl font-PyeongChangPeace-Light ${user?._id !== id
                    ? "hover:bg-none"
                    : "hover:bg-gray-100 hover:cursor-pointer"
                    }`}
                  name="username"
                  value={userInfo?.username}
                  onSave={(e) => handleSaveUsername(e)}
                  onChange={handleInputChange}
                  readonly={user?._id !== id}
                />
              </div>
              <div className="flex items-center gap-1 justify-start">
                <FontAwesomeIcon icon={faLocationDot} />
                <EditText
                  className={`text-black text-base font-PyeongChangPeace-Light ${user?._id !== id
                    ? "hover:bg-none"
                    : "hover:bg-gray-100 hover:cursor-pointer"
                    }`}
                  name="location"
                  value={userInfo?.location}
                  placeholder="No Location."
                  onSave={(e) => handleSaveInfo(e)}
                  onChange={handleInputChange}
                  readonly={user?._id !== id}
                />
              </div>
              <div className="flex items-center  gap-1 justify-start  text-black text-base font-PyeongChangPeace-Light">
                <FontAwesomeIcon icon={faCakeCandles} />
                <DatePicker
                  className={`w-24 ${user?._id !== id
                    ? "hover:bg-none"
                    : "hover:bg-gray-100 hover:cursor-pointer"
                    }`}
                  selected={
                    userInfo?.birthday ? new Date(userInfo.birthday) : null
                  }
                  onChange={(date) =>
                    handleInputChange({
                      target: { name: "birthday", value: new Date(date) },
                    })
                  }
                  dateFormat="MM/dd/yyyy"
                  showYearDropdown
                  scrollableMonthYearDropdown
                  disabled={user?._id !== id}
                  placeholderText="None"
                  onBlur={() => handleSaveInfo({ name: "birthday" })}
                />
              </div>

              {userInDb ? (
                <div style={{ color: "#8B0000", textAlign: "center" }}>
                  Username is already used! Please pick another username
                </div>
              ) : null}
            </div>

            <div className="bg-gray-50 h-1/3 flex justify-evenly items-center rounded-b-2xl">
              <p className="text-center">
                <span className="block font-PyeongChangPeace-Bold text-lg ">
                  {userMaps?.length}
                </span>
                <span className="block font-PyeongChangPeace-Light">Posts</span>
              </p>
              <p className="text-center">
                <span className="block font-PyeongChangPeace-Bold text-lg">
                  {getHighestUpvotes()}
                </span>
                <span className="block font-PyeongChangPeace-Light">
                  Highest Upvotes
                </span>
              </p>
              <p className="text-center">
                <span className="block font-PyeongChangPeace-Bold text-lg">
                  {getDaysActive()}
                </span>
                <span className="block font-PyeongChangPeace-Light">
                  Days Active
                </span>
              </p>
            </div>
          </div>
          <div className="h-1/2 flex flex-col justify-end px-12">
            <div className="h-[65%] text-sm rounded-2xl px-5 py-3 mb-4 overflow-scroll bg-gray-50 shadow-warm font-PyeongChangPeace-Light">
              <EditTextarea
                className={`${user?._id !== id
                  ? "hover:none"
                  : "hover:bg-gray-100 hover:cursor-pointer"
                  }`}
                name="about"
                value={userInfo?.about}
                placeholder="No Description."
                onSave={(e) => handleSaveInfo(e)}
                onChange={handleInputChange}
                readonly={user?._id !== id}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="grow w-3/5 h-screen">
          <div className="grow h-1/4 flex flex-col justify-evenly items-baseine align-middle">
            <div className="flex justify-center gap-10 items-center">
              <button
                className={`hover:text-primary-GeoBackGround text-2xl font-PyeongChangPeace-Light ${display === "posts" && "border-b-2  border-primary-GeoBlue"
                  }`}
                onClick={() => setDisplay("posts")}
              >
                Posts
              </button>
              <button
                className={`hover:text-primary-GeoBackGround text-2xl font-PyeongChangPeace-Light ${display === "comments" && "border-b-2  border-primary-GeoBlue"
                  }`}
                onClick={() => setDisplay("comments")}
              >
                Comments
              </button>
              <div className="absolute inline-block right-16" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="dropdown-button"
                  className="hover:text-primary-GeoBackGround inline-flex justify-center items-center text-xl font-PyeongChangPeace-Light"
                >
                  <span className="mr-2">
                    {sortType === "new" ? "New" : "Top"}
                  </span>
                  <FontAwesomeIcon icon={faArrowDownWideShort} />
                </button>
                <div
                  id="dropdown-menu"
                  className={`${!dropdownOpen && "invisible"
                    } origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
                >
                  <div
                    className="flex flex-col justify-start py-2 p-2 text-base font-PyeongChangPeace-Light"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="dropdown-button"
                  >
                    <div
                      className="flex rounded-md px-4 py-2   hover:bg-gray-100 active:bg-blue-100 cursor-pointer items-center"
                      onClick={() => setSortType("new")}
                      role="menuitem"
                    >
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="mr-3"
                      />
                      <span>New</span>
                    </div>
                    <div
                      onClick={() => setSortType("top")}
                      className="flex rounded-md px-4 py-2   hover:bg-gray-100 active:bg-blue-100 cursor-pointer items-center"
                      role="menuitem"
                    >
                      <FontAwesomeIcon icon={faFire} className="mr-3" />
                      <span>Top</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ul className="grow h-3/4 w-full flex flex-col overflow-scroll gap-5">
            {!done ? (
              <p className="text-center text-3xl font-PyeongChangPeace-Light">
                Loading maps...
              </p>
            ) : (
              <>
                {display === "posts" && (
                  <>
                    {generateMapCards(sortType)}
                    <ReactPaginate
                      pageCount={totalPages}
                      onPageChange={handlePageChange}
                      forcePage={currentPage}
                      breakLabel={"..."}
                      className="flex text-lg gap-5 items-center justify-center"
                      activeLinkClassName="bg-primary-GeoBackGround rounded-md px-1"
                    />
                  </>
                )}
                {display === "comments" &&
                  userComments &&
                  generateCommentCards(sortType)}
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfileScreen;
