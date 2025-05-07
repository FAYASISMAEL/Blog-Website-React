import userSchema from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "c02c2fd894074a",
    pass: "e21d18254c39d7",
  },
});

const generateToken=(id) => jwt.sign({id},process.env.JWT_KEY,{expiresIn:"12h"});

export const signUp = async (req,res) => {
  try {
    const {username,email,password} = req.body;
    if (!req.file || !username || !email || !password) {
      return res.status(400).json({message:"All fields must be filled"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      profile_pic: req.file.path,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());
    res.status(201).json({message:"User created Successfully",token,id:user._id.toString()});
  } catch (err) {
    res.status(400).json({message:"Failed to create user",error:err.message});
  }
};

export const logIn = async (req, res) => {
  try {
    const {email,password} = req.body.formData || req.body;
    if (!email || !password) {
      return res.status(400).json({message:"Email and password required"});
    }

    const user = await userSchema.findOne({ email });
    if (!user || !(await bcrypt.compare(password,user.password))) {
      return res.status(401).json({message:"Invalid Password"});
    }

    const token = generateToken(user._id.toString());
    res.status(200).json({message:"Logged in Successfully",token,id: user._id.toString()});
  } catch (err) {
    res.status(400).json({message:"Login failed",error:err.message});
  }
};

export const getUser = async (req,res) => {
  try {
    const user = await userSchema.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({message:"User not found"});
    }
    res.status(200).json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      profile_pic: user.profile_pic,
    });
  } catch (err) {
    res.status(400).json({message:"Failed to fetch user",error: err.message});
  }
};

export const editProfile = async (req,res) => {
  try {
    const {id} = req.params;
    const {username,email} = req.body;
    if (!username || !email) {
      return res.status(400).json({message:"Username and email required"});
    }

    const updateData = {username,email};
    if (req.file) {
      updateData.profile_pic = req.file.path;
    }

    const user = await userSchema.findByIdAndUpdate(id,{$set:updateData}, {new:true,runValidators:true }).select("-password");
    if (!user) {
      return res.status(404).json({message:"User not found"});
    }

    res.status(200).json({message:"Profile updated Successfully"});
  } catch (err) {
    res.status(400).json({message:"Failed to update profile",error: err.message});
  }
};













































// import userSchema from "../models/user_model.js"
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
// import nodemailer from "nodemailer"

// const transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   secure: false,
//   auth: {
//     user: "c02c2fd894074a",
//     pass: "e21d18254c39d7",
//   },
// });

// export const signUp = async function signUp(req,res) {
//     try { 
//       if (!req.file) {
//         return res.status(400).json({message:"Upload a profile picture"});
//       }
//       const profile_pic = req.file.path;
//       const {username,email,password} = req.body;
//       if (!(profile_pic && username && email && password)) {
//         return res.status(400).json({message:"Please fill all the details",profile_pic});
//       }
//       const hashed_pwd = await bcrypt.hash(password,10);
//       const data = await userSchema.create({
//         profile_pic,
//         username,
//         email,
//         password: hashed_pwd,
//       });

//       const id = data._id.toString()
//       const token = await jwt.sign({id:id}, process.env.JWT_KEY, {
//         expiresIn: "12h",
//       });
//       res.status(201).json({message:"Successfully created the user",token,id});
//     } 
//     catch (err) {
//       res.status(400).json({message:"Error to create new user",error:err.message});
//     }
//   };

//   export const logIn = async function logIn(req, res) {
//     try {
//       const { email, password } = req.body.formData;
//       const userExist = await userSchema.findOne({ email });
//       if(!userExist) {
//         return res.status(400).json({message:"User not found"})
//       }
//       const id = userExist._id
//       const ispassMatch = await bcrypt.compare(password,userExist.password);
//       if (!ispassMatch) {
//         return res.status(400).json({message:"Incorrect password"});
//       }
//       const token = await jwt.sign({id:userExist._id },process.env.JWT_KEY, {
//         expiresIn: "12h",
//       });
//       res.status(200).json({ message:"Successfully loged in",token,id});
//     } 
//     catch (err) {
//       res.status(400).json({ error:err });
//     }
//   };
  
// export const getuser = async function getuser(req,res) {
//   const id = req.params.id
//   const data = await userSchema.findById(id)
//   if(!data)
//     return res.status(404).json({message:"Not Found"})
//   res.status(200).json(data)
// }

// export const editprofile = async function editprofile(req, res) {
//   try {
//     const { id } = req.params;
//     const { username, email } = req.body;

//     if (!username || !email) {
//       return res.status(400).json({ message: "Username and email are required" });
//     }
//     const updateData = {
//       username,
//       email,
//     };
//     if (req.file) {
//       updateData.profile_pic = req.file.path;
//     }
//     const updatedUser = await userSchema.findByIdAndUpdate(
//       id,
//       {$set:updateData},
//       {new:true,runValidators:true}
//     );
//     if (!updatedUser) {
//       return res.status(404).json({message:"User not found"});
//     }
//     res.status(200).json({message:"Successfully updated the profile"});
//   } 
//   catch (err) {
//     console.error("Error in profile updating",err);
//     res.status(400).json({message:"Error in updating profile",error:err.message});
//   }
// };
