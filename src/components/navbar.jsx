import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logoutUser } from "../userSlice";
import { useDispatch } from "react-redux";
import { faBell, faMessage , faHome, faUserFriends, faFilm } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastProvider, useToast } from "./toast";
import Popup from "./userpopup";
import { faClose } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const user = useSelector((state) => state.user.user);
  const userdts = user ? user.user : "";
  const token = user.token;
  const user_name = userdts.first_name;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {push} = useToast();

  const Logout = () => {
    dispatch(logoutUser()); // clears Redux
    localStorage.removeItem("user"); // clears token
    navigate("/");
  };

  const ProfilePage = () => {
    navigate("/profile");
  };
  const [requests, setRequest] = useState([])
  const [openNotf, setOpenNot] = useState(false)
  useEffect(() =>{
    collectNotification()
  }, [])

  const collectNotification = async () =>{
    try {
      const response =  await fetch("http://localhost:5000/api/auth/friend-requests", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userdts.id}),
      });
      const results = await response.json();      
      if(results.status == "success"){
        setRequest(results.result)
      }else{
        setRequest([])
      }
    } catch (error) {
    }
  }

  const acceptFriend = async (id) =>{
    try {
      const response =  await fetch("http://localhost:5000/api/auth/accept-friend-request", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId:id, senderId: userdts.id}),
      });
      const result = await response.json();
      if(result.status == "success"){
        push({ type: 'success', title: 'Sent', message: result.message })
        collectNotification();
        setOpenNot(false);
      }else if(result.status == "warning"){
        push({ type: 'warn', title: 'Warning', message: result.message })
      }else {
        push({ type: 'error', title: 'Failed', message: result.message })
      }
    } catch (error) {
      push({ type: 'error', title: 'Failed', message: "Please try again!" })
    }
  }
  return (
    <>
      <nav className="fb-navbar">
        <div className="nav-left">
          <h2 className="logohome">VibeB</h2>
          <input
            type="text"
            className="search-box"
            placeholder="Search VibeB..."
          />
        </div>

        <div className="nav-center">
          <div>
            <Link to="/home" className="nav-icon" title="Home">
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </div>
          <div>
            <Link to="/friends" className="nav-icon" title="Firends">
              <FontAwesomeIcon icon={faUserFriends} />
            </Link>
          </div>
          <div>
            <Link to="/videos" className="nav-icon" title="videos">
              <FontAwesomeIcon icon={faFilm} />
            </Link>
          </div>
          {/* <div>
            <Link to="/message" className="nav-icon" title="messages">
              <FontAwesomeIcon icon={faMessage} />
            </Link>
          </div> */}
          <div>
            <Link className="nav-icon position-relative" title="Notification" onClick={() => setOpenNot(true)}>
            <FontAwesomeIcon icon={faBell} />
            {requests.length > 0 && (
              <span className="badge text-danger position-absolute ps-4 start-0 translate-middle-x">{requests.length}</span>
            )}
            </Link>
          </div>
        </div>

        <div className="nav-right">
          <div className="profile-circle" title="Profile" onClick={ProfilePage}>
            {user_name[0].toUpperCase()}
          </div>
          <button className="logout-btn" onClick={Logout}>
            Logout
          </button>

          <Popup open={openNotf} onClose={() => setOpenNot(false)}>
              <div className="text-end"> <FontAwesomeIcon icon={faClose}/></div>
              <div className="text-center pb-2"><h5>Friends List</h5></div>
              {requests.map(friend => (
              <div className="friend-card my-2 w-100" key={friend._id}>
              <img src={friend.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=random`} alt="avatar" className="friend-avatar" />


              <div className="friend-info d-flex flex-column">
                  <h4 className='text-start'>{friend.name.charAt(0).toUpperCase() + friend.name.slice(1)}</h4>
                  <p>{friend.bio}</p>
                  <div className="friend-actions">
                  <button className="view text-dark" >Cancel</button>
                  <button className="remove btn-primary" onClick={() => acceptFriend(friend._id)}>Accept Request</button>
                  </div>
              </div>
              </div>
              ))}
        </Popup>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
