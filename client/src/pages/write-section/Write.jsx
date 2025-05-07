import { useState } from "react";
import "./write.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WriteBlog = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

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
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.trim() === "") {
      console.log("Triggering no title toast");
      toast.error("Please fill the Title", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    if (formData.description.trim() === "") {
      console.log("Triggering no description toast");
      toast.error("Please fill the Description", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    if (!formData.file) {
      console.log("Triggering no image toast");
      toast.error("Please upload an image", {
        position: "top-right",
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
      const id = localStorage.getItem("id");
      if (!id) {
        console.log("Triggering no user ID toast");
        toast.error("Your Account was not Registered. Please log in.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("id", id);
      data.append("file", formData.file);

      console.log("Form Data:", Object.fromEntries(data));

      const response = await axios.post("http://localhost:3000/api/write", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Triggering success toast");
      toast.success("Blog uploaded successfully...", {
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
        navigate("/");
      }, 3000);

      console.log("Blog post successful:", response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Blog post error:", errorMessage);
      console.log("Triggering error toast");
      toast.error(`Blog post failed: ${errorMessage}`, {
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
    <div className="write-page">
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
        <h2 className="title">Write Your Blog</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label className="label">Post Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter your blog title"
            />
          </div>

          <div className="input-group">
            <label className="label">Tell Your Story</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea"
              placeholder="Start writing your story..."
            />
          </div>

          <div className="image-upload-container">
            <label htmlFor="blog_image" className="label">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="image-preview"
                />
              ) : (
                <div className="image-placeholder">
                  Upload Blog Image
                </div>
              )}
            </label>
            <input
              type="file"
              id="blog_image"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          <button type="submit" className="button">
            Publish
          </button>
        </form>
      </div>
    </div>
  );
};

export default WriteBlog;