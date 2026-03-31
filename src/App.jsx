import "./App.css";
import LoginSignup from "./components/login-signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import ProfilePage from "./components/ProfilePage";
import { ToastProvider, useToast } from './components/toast';
import Friendslist from "./components/friendslist";
function App() {
  return (
    <>
     <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={ < ProfilePage /> } />
          <Route path="/friends" element={ < Friendslist /> } />
        </Routes>
      </Router>
      </ToastProvider>
    </>
  );
}

export default App;
