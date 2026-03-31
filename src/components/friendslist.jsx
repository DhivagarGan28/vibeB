import React, { useEffect, useState } from 'react'
import Navbar from './navbar';
import "./Navbar.css";
import { useSelector } from "react-redux";
import Popup from './userpopup';
import { setUser } from '../userSlice';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastProvider, useToast } from './toast';

const Friendslist = () => {
const [allList, setAllList] = useState([])
const user = useSelector((state) => state.user.user);
const token = user.token
const {push} = useToast();
const userdts = user ? user.user : "";
const [selectedUser, setSelectedUser] = useState(null);
     useEffect( () =>{
          loadAllfriends()
     }, [])

     const loadAllfriends = async () =>{
          try {
               const result = await fetch(`http://localhost:5000/api/auth/getallUserdata/${userdts.id}`)
               const data = await result.json();
               setAllList(data.users)
          } catch (error) {
               push({ type: 'error', title: 'Failed', message: "Please try again!" })
          } 
     }

     const [search, setSearch] = useState("");
     const [userPop, setUserPop] = useState(false)
     const [open, setOpen] = useState(false);
     const sendRequest = async (receiverId) => {
          try {
               const response =  await fetch("http://localhost:5000/api/auth/send-friend-request", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({ receiverId:receiverId, senderId: userdts.id}),
               });
               const result = await response.json();
               if(result.status == "success"){
                    push({ type: 'success', title: 'Sent', message: result.message })
               }else if(result.status == "warning"){
                    push({ type: 'warn', title: 'Warning', message: result.message })
               }else {
                    push({ type: 'error', title: 'Failed', message: result.message })
               }
          } catch (error) {
               push({ type: 'error', title: 'Failed', message: "Please try again!" })
          } 
     };

     return (
     <>
     <Navbar />
     {/* <div className='container'>
          <div className="friend-page">
               <div className="friend-header">
               <h2>Add Friends</h2>
                    <input className='bg-white search-box'
                    type="text"
                    placeholder="Search friends"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />
               </div>

               <div className="friend-grid">
                    {allList.map(friend => (
                         <div className="friend-card my-2" key={friend._id}>
                              <img src={friend.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.first_name)}&background=random`} alt="avatar" className="friend-avatar" />
                              <div className="friend-info d-flex flex-column">
                                   <h4 className='text-start'>{friend.first_name.charAt(0).toUpperCase() + friend.first_name.slice(1)}</h4>
                                   <p className='text-'>{friend.bio}</p>
                                   <div className="friend-actions">
                                   <button className="view text-dark" onClick={()=>setOpen(true)}>View Profile</button>
                                   <button className="remove btn-primary" onClick={() => sendRequest(friend._id)}>Send Request</button>
                                   </div>
                              </div>
                         </div>  
                    ))}
               </div>
          </div>
     </div> */}



     <div className={` container  ${selectedUser ? "active" : ""}`}>
     {/* LEFT SIDE (Friend List) */}
     <div className="friend-page">
          <div className="friend-grid">
               <h2 className='pt-3'>Add Friends</h2>
               <input
               className="bg-white search-box"
               type="text"
               placeholder="Search friends"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               />
               {allList.map(friend => (
               <div className="friend-card my-2" key={friend._id}>
                    <img
                    src={
                    friend.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.first_name)}&background=random`
                    }
                    alt="avatar"
                    className="friend-avatar"
                    />
                    <div className="friend-info d-flex flex-column">
                    <h4 className="text-start">
                    {friend.first_name.charAt(0).toUpperCase() + friend.first_name.slice(1)}
                    </h4>
                    <p>{friend.bio}</p>
                    <div className="friend-actions">
                    <button
                         className="view text-dark"
                         onClick={() => setSelectedUser(friend)}
                    >
                         View Profile
                    </button>
                    <button
                         className="remove btn-primary"
                         onClick={() => sendRequest(friend._id)}
                    >
                         Send Request
                    </button>
                    </div>
                    </div>
               </div>
               ))}
          </div>
     </div>

     {/* RIGHT SIDE (Profile View) */}
     {selectedUser && (
     <div className="profile-panel col-6">
          <button className="close-btn" onClick={() => setSelectedUser(null)}>✖</button>
          <img
          src={selectedUser.avatar}
          className="profile-avatar"
          alt=""
          />
          <h2>{selectedUser.first_name+' '+selectedUser.last_name}</h2>
          <p>{selectedUser.bio}</p>
     </div>
     )}

     </div>
     </>
     )
}

export default Friendslist;