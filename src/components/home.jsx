import { useState } from "react";
import { Navigate } from "react-router-dom";
import "./Navbar.css";
import { useSelector } from "react-redux";

import Navbar from "./navbar";

function Home() {
  const token = localStorage.getItem("user");
  const user = useSelector((state) => state.user.user);
  const userdts = user ? user.user : "";


  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://i.pravatar.cc/40",
      time: "2 hrs ago",
      text: "This is my first post!",
      image: "https://picsum.photos/500/300",
    },
    {
      id: 2,
      name: "Emily Rose",
      avatar: "https://i.pravatar.cc/41",
      time: "5 hrs ago",
      text: "Beautiful weather today 😊",
      image: null,
    },
  ]);
  if (!token) return <Navigate to="/" />;
  return (
    <>
      
      <Navbar />
      <div className="feed-container aniback">
        {/* Post Composer */}
        <div className="create-post">
          <div className="create-top">
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="avatar"
            />
            <input type="text" placeholder="What's on your mind?" />
          </div>
          <div className="create-bottom">
            <button>📸 Photo</button>
            <button>😊 Feeling</button>
            <button>📍 Check in</button>
          </div>
        </div>

        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-header">
              <img src={post.avatar} alt="avatar" className="avatar" />
              <div>
                <h4>{post.name}</h4>
                <span className="time">{post.time}</span>
              </div>
            </div>

            <p className="post-text">{post.text}</p>

            {post.image && (
              <img src={post.image} alt="post-img" className="post-img" />
            )}

            <div className="post-actions">
              <button>👍 Like</button>
              <button>💬 Comment</button>
              <button>↗️ Share</button>
            </div>
          </div>
        ))}
      </div>

    </>
  );
}

export default Home;
