import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/loadblogs");
        console.log(response.data.blogs[0].blog)
        const newBlogs = response.data.blogs.reverse() || [];

        setBlogs((prevBlogs) => {
          const sameLength = prevBlogs.length === newBlogs.length;
          const isSame = sameLength && prevBlogs.every((b, i) => b._id === newBlogs[i]._id);
          return isSame ? prevBlogs : newBlogs;
        });
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Failed to load blogs:", errorMessage);
      }
    };
    loadBlogs();
  }, []);

  useEffect(()=>{
    const id = localStorage.getItem("id")

    if(!id){
      navigate("/login")
    }
  })

  return (
    <div className="home-page">
      <h1 className="home-title">Latest Blogs</h1>
      <div className="blog-list">
        {blogs.length === 0 ? (
          <p className="no-blogs">Currently no available blogs...</p>
        ) : (
          blogs.map((blog, index) => (
            <div key={blog._id || index} className="blog-card">
              <div className="blog-content">
                <div className="blog-meta">
                  <img
                    src={`http://localhost:3000/${blog.profile_pic}`}
                    alt={blog.username || "Author"}
                    className="profile-pic"
                  />
                  <span className="blog-author">{blog.username || "Unknown"}</span>
                </div>
                <h2 className="blog-title1">{blog.title}</h2>
                <p className="blog-description1">{blog.description}</p>
                <div className="blog-actions">
                  <span className="blog-date">20/04/2025</span>
                </div>
              </div>
              <img
                src={`http://localhost:3000/${blog.blog[0]}`}
                alt={blog.title}
                className="blog-image"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
