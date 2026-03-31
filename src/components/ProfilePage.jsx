import React, { useEffect, useState, useRef } from "react";
import "./profile.css";
import { useSelector } from "react-redux";
import Navbar from "./navbar";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastProvider, useToast } from './toast';

export default function ProfilePage() {
  const user = useSelector((state) => state.user.user);
  const userdts = user ? user.user : "";
  const user_name = userdts.first_name;
  const user_id = userdts.id;
  const [avatar, setAvatar] = useState('')
  const [friends, setFriends] = useState([]);
  const [viewpro, setViewPro] = useState(false);
  const [btn, setbtn] = useState(true);
  const [form, setForm] = useState({
      first_name: "",
      last_name: "",
      email: "",
      dob: "",
      phone:"",
      gender:"",
      name:"",
      bio:""
    });
    const { push } = useToast();
    const [userbio, setBio] = useState();
  useEffect(() => {
    

    fetchFriends();
  }, [userdts.id]);
  const fetchFriends = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/${userdts.id}`);
        const data = await res.json();
        setFriends(data.friends);
        setBio(data.bio)
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
  const editProfile = async () => {
    setViewPro(true);
    setbtn(false);
      try {
        const res = await fetch(`http://localhost:5000/api/auth/getdata/${userdts.id}`);
        const data = await res.json();
        setForm(data.user)
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
  };
  const handleChange = (e) => {
   if (e.target.name === 'first_name' || e.target.name === 'last_name') {
  setForm(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
    name:
      e.target.name === 'first_name'
        ? e.target.value + ' ' + prev.last_name
        : prev.first_name + ' ' + e.target.value
  }));
} else {
  setForm(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
}
  };

  const profileupdate = async (id) =>{
    try {
      const response = await fetch(`http://localhost:5000/api/auth/profileupdate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if(result.status == "success"){
        setViewPro(false);
        setbtn(true);
        push({ type: 'success', title: 'Saved', message: result.message })
        fetchFriends();
      }
    } catch (err) {
      console.log(err);
      console.log(err.response?.data?.error || "Signup failed");
    }
  }
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleClick = () => {
    fileInputRef.current.click();
     
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }

      uploadprofileimg(file);
     
  };

  const uploadprofileimg = async (file) =>{
    try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch(`http://localhost:5000/api/auth/upload-avatar/${user_id}`, {
        method: "POST",
        body: formData,
      });
      if (!response) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result)
      
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <ToastProvider>
      <Navbar />
      <div className="profile-page">
        {/* Cover Photo */}
        <div className="cover-photo">
          <img
            src="https://images.unsplash.com/photo-1503264116251-35a269479413"
            alt="cover"
          />
          <div className="profile-photo-wrapper">
            <img
              className="profile-photo"
              src="https://i.pravatar.cc/150"
              alt="profile"
            />
          </div>
          <div className="profile-photo-wrappers" onClick={handleClick}>
            <img
              className="profile-photos"
              src={avatar || "../src/assets/images/avatar-men-1.jpg"}
              alt="profile"
            />
            <div className="profileimgedit"><FontAwesomeIcon icon={faEdit} /></div>
            <input type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleProfileChange}
              style={{ display: "none" }} />
            
          </div>
        </div>

        {/* Basic Info */}
       
        {viewpro ? (
          <>
          <div className="text-center fs-3 profile-info">Profile</div>
          <div className="card p-3 align-center">
              <div className="row py-3 " >
                <div className="col-6 py-1">
                  <label>First Name</label>
                  <input type="text" value={form.first_name} name="first_name" className="form-control" onChange={handleChange}/>
                </div>
                <div className="col-6 py-1">
                  <label>Last Name</label>
                  <input type="text" value={form.last_name} name="last_name" className="form-control"  onChange={handleChange}/>
                </div>
                <div className="col-6 py-1">
                  <label>Email</label>
                  <input type="text" value={form.email} name="email" className="form-control"  onChange={handleChange}/>
                </div>
                <div className="col-6 py-1">
                  <label>Phone</label>
                  <input type="text" value={form.phone} name="phone" className="form-control" onChange={handleChange}/>
                </div>
                <div className="col-6 py-1">
                  <label>Gender</label>
                  <select
                    name="gender"
                    className="form-control"
                    onChange={handleChange}
                    value={form.gender}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
              </div>
                <div className="col-6 py-1">
                  <label>Date Of Birth</label>
                  <input type="text" value={form.dob} name="dob" className="form-control"  onChange={handleChange}/>
                </div>
                <div className="col-6 py-1">
                  <label>About</label>
                  <textarea value={form.bio} name="bio" className="form-control"  onChange={handleChange}/>
                </div>
                <div className="col-6 py-1">
                  <div className="text-left">
                    <button className="btn btn-primary w-25" onClick={() => profileupdate(user_id)}>Update</button> 
                  </div>
                </div>
              </div>
               
            </div>
          </>
        ) : (
          <>
           <div className="profile-info">
              <h2>{user_name.toUpperCase()}</h2>
              <p className="bio">
                {userbio}
              </p>
              {btn ? <button className="edit-btn" onClick={editProfile}>
                Edit Profile
              </button> : ''}
            </div>
            <div className="tabs">
              <button className="active">Posts</button>
              <button>About</button>
              <button>Friends</button>
              <button>Photos</button>
            </div>

            {/* Friends Preview */}
            <div className="friends-section">
              <h3>Friends</h3>
              <div className="friends-grid">
                {friends.length === 0 && <div>No Friend List</div>}
                {friends.map((i) => (
                  <div className="friend-cards" key={i}>
                    <img
                      src={`https://i.pravatar.cc/150?img=${i.first_name}`}
                      alt="friend"
                    />
                    <div className="d-flex flex-column justify-content-between"> 
                      <div className="text-start text-capitalize">{i.first_name}</div>
                    <div className="text-start"><button className="btn-sm btn-primary w-75">View Profile</button></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts Section */}
            <div className="posts-section">
              <h3>Posts</h3>

              <div className="post-card">
                <h4>John Doe</h4>
                <p>Hello! This is my first profile post 🎉</p>
              </div>

              <div className="post-card">
                <h4>John Doe</h4>
                <p>Loving this new platform 😍</p>
              </div>
            </div>
          </>
        )}
      </div>
    </ToastProvider>
  );
}
