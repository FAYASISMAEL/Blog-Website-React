import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import axios from "axios";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleWriteClick = () => {
    navigate('/write');
  };

  const logout = ()=>{
    localStorage.clear()
    navigate("/login")
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const [username, setUsername] = useState("");

  const [profile,setprofile] = useState();

    useEffect(() => {
      async function getuser() {
        const id = localStorage.getItem('id');
        try {
          const response = await axios.get(`http://localhost:3000/api/getuser/${id}`);
          setUsername(response.data.username); 
          setprofile(`http://localhost:3000/${response.data.profile_pic}`);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }

      getuser();
    }, []); 

    localStorage.setItem('username',username)


  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="logo">News-Blogs</h1>   
      </div>
      <div className="nav-right">
        <button className="icon-button write-button" onClick={handleWriteClick}>
          <svg
            className="icon write-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
          <span className="write-text">New Blog</span>
        </button>
         
        <div className="profile-container" ref={dropdownRef}>
          <img
            src={profile}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfileClick}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => {
                  navigate('/profile')
                  setDropdownOpen(false)}}>Profile</button>
              <button onClick={logout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;