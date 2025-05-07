import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './signup.css'
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    file: null,
  });

  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
     
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("confirmPassword", formData.confirmPassword);
      if (formData.file) {
        data.append("file", formData.file);
      }

      console.log("Form Data:", Object.fromEntries(data));

      const response = await axios.post("http://localhost:3000/api/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Signup successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem('id',response.data.id)

      console.log("Triggering success toast");
      toast.success("Signup successful! Redirecting to home...", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      setTimeout(() => {
        console.log("Navigating to /");
        navigate("/login");
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Signup error:", errorMessage);
      console.log("Triggering error toast");
      toast.error(`Signup failed: ${errorMessage}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="signup-page">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="form-wrapper">
        <h2 className="title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="profile-pic-container">
            <label htmlFor="profile_pic" className="label">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  className="profile-pic-preview"
                />
              ) : (
                <div className="profile-pic-placeholder">
                  Upload Profile Picture
                </div>
              )}
            </label>
            <input
              type="file"
              id="profile_pic"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          <div className="input-group">
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="button">
            Sign Up
          </button>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;