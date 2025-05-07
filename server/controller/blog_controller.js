import userSchema from "../models/user_model.js";
import BlogSchema from "../models/blog_model.js";

export const write = async (req, res) => {
  try {
    const { title, description, id } = req.body;
    if (!req.file || !title || !description || !id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userSchema.findById(id).select("profile_pic username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await BlogSchema.create({
      profile_pic: user.profile_pic,
      title,
      blog: req.file.path,
      description,
      username: user.username,
      userid: id,
    });

    res.status(201).json({ message: "Post uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};

export const loadBlogs = async (req, res) => {
  try {
    const blogs = await BlogSchema.find();
    res.status(200).json({ message: "Success", blogs });
  } catch (err) {
    res.status(500).json({ message: "Failed to load blogs", error: err.message });
  }
};