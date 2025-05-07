import express from "express"
import { signUp ,getUser,logIn,editProfile} from "../controller/user_controller.js"
import { write ,loadBlogs} from "../controller/blog_controller.js"
import auth from "../middlewares/auth.js"
import upload from "../multer/multer.config.js"

const blog_routes = express.Router()
blog_routes.post("/signup",upload.single('file'),signUp)
blog_routes.get("/getuser/:id",getUser)
blog_routes.post("/login",logIn)
blog_routes.post("/write",upload.single('file'),write)
blog_routes.get("/loadblogs",loadBlogs)
blog_routes.post('/editprofile/:id',upload.single('file'),editProfile)  

export default blog_routes