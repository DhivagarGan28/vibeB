import React, { useState } from "react";
import "./LoginSignup.css";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser } from "../userSlice";
import { ToastProvider, useToast } from "./toast";
import logo from '../assets/images/vibeb-logo.jpg'
const LoginSignup = () => {
  const token = localStorage.getItem("user");
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {push } = useToast();
  const [form, setForm] = useState({
    first_name: "",
    last_name:"",
    email: "",
    password: "",
  });
  const [loginform, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginform, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginform),
      });
      if (!response) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      if (result.status == "success") {
        localStorage.setItem("user", result);
        dispatch(setUser(result));
        push({ type: 'success', title: 'LoggedIn', message: result.message })
        navigate("/home");
      } else {
        push({ type: 'error', title: 'Failed', message: "Login Failed! Please try again" })
      }
    } catch (err) {
      console.log(err);
      push({ type: 'error', title: 'Failed', message: "Login Failed! Please try again" })
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
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
        push({ type: 'success', title: 'Signup', message: result.message })
        setActiveTab("login")
      }else if(result.status == "warning"){
        push({ type: 'warn', title: 'Warning', message: result.message })
      }else{
        push({ type: 'error', title: 'Failed', message: result.message })
      }
      
    } catch (err) {
      console.log(err);
      push({ type: 'error', title: 'Failed', message: "Please try again!" })
    }
  };
if (token) return <Navigate to="/home" />;
  return (
    <div className="app">
      <div className="container">
        <div className="logo">
          <img
            className="logoimg"
            src={logo}
            alt="Logo"
          />
        </div>
        <div className="box">
          <h1 className="title">VibeB</h1>
          <p className="subtitle">Connect. Share. Vibe.</p>

          {/* Tabs */}
          <div className="tablogin">
            {activeTab === "login" && <div className="head">Login</div>}
            {activeTab === "signup" && <div className="head">Signup</div>}
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form className="form">
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="User Email"
                required
                onChange={handleLoginChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                onChange={handleLoginChange}
              />
              <button className="btn" onClick={handleLoginSubmit}>
                Login
              </button>
              <div className="acc">
                Don't have an account?
                <span
                  className="signtxt"
                  onClick={() => setActiveTab("signup")}
                >
                  Signup
                </span>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form className="form">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                autoComplete="User First Name"
                required
                onChange={handleChange}
              />
               <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                autoComplete="User Last Name"
                required
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="User Email"
                required
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                onChange={handleChange}
              />
              <button className="btn" onClick={handleSubmit}>
                Signup
              </button>
              <div className="acc">
                Already have an account?
                <span className="signtxt" onClick={() => setActiveTab("login")}>
                  Log In
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
