import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const userId = localStorage.getItem("id");
  const [profilename,setprofilename] = useState();
  const [profile,setprofile] = useState();

  useEffect(() => {
    const loadBlogs = async () => {
      if (!userId) {
        setBlogs([]);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/api/loadblogs");
        const response2 = await axios.get(`http://localhost:3000/api/getuser/${userId}`);
        setprofile(`http://localhost:3000/${response2.data.profile_pic}`);
        setprofilename(response2.data.username);
        
        const filteredBlogs = response.data.blogs
          .reverse()
          .filter((blog) => blog.userid === userId)
          .map((blog) => ({
            username: blog.username || "Unknown",
            title: blog.title || "Untitled",
            imageUrl: blog.blog ? `http://localhost:3000/${blog.blog}` : "https://via.placeholder.com/150x100?text=Image+Not+Found",
            description: blog.description || "",
          }));
        setBlogs(filteredBlogs);
      } catch (err) {
        setBlogs([]);
      }
    };

    loadBlogs();
  }, [userId]);

  const handleSignOut = () => {
    localStorage.removeItem("id");
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/editprofile");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <img
            src={profile}
            alt="Profile"
            className="profile-pic-large"
          />
          <h1 className="profile-name">{profilename || "User"}</h1>
          <p className="profile-bio">I'm a professional blog writer.</p>
          <div className="profile-actions">
            <button className="action-button edit-button" onClick={handleEditProfile}>
              Edit Profile
            </button>
            <button className="action-button signout-button" onClick={handleSignOut}>
              Sign Out
            </button>
            <button className="action-button home-button" onClick={handleGoHome}>
              Home
            </button>
          </div>
        </div>
      </div>
      <div className="blogs-section">
        <h2 className="section-title">Your Blogs</h2>
        <div className="blogs-container">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <div key={index} className="blog-card">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="blog-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150x100?text=Image+Not+Found";
                  }}
                />
                <div className="blog-content">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-username">By {blog.username}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-blogs">No blogs yet. Start writing!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;