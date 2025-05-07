import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./editprofile.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    file: null,
  });

  const [profilePicPreview, setProfilePicPreview] = useState(null);

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/getuser/${id}`);
        const userData = response.data;
        setFormData({
          username: userData.username || "",
          email: userData.email || "",
          file: null,
        });
        if (userData.profile_pic) {
          setProfilePicPreview(`http://localhost:3000/${userData.profile_pic}`);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data.", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
        });
      }
    };

    if (id) {
      loadExistingData();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      if (formData.file) {
        data.append("file", formData.file);
      }

      const response = await axios.post(`http://localhost:3000/api/editprofile/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully! Redirecting to profile...", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="profile edit-page">
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
        <h2 className="title">Edit Profile</h2>
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

          <button type="submit" className="button">
            Edit Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;