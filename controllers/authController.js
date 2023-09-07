import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { userName, email, password, password2 } = req.body;

    // Basic input validations
    if (!userName || !email || !password || !password2) {
      return res.status(400).send({ message: "All fields are required" });
    }
    
    if (password !== password2) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    // Check if a user with the same email exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        success:false,
        message: "User already registered. Please login.",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Save the user to the database
    const user = await new userModel({
      userName,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success:true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).send({ message: "Error in registration" });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// test controller
export const testController = (req,res)=>{
  try{
    res.send("Protected Routes are here");
  } catch (error) {
    // console.log(error);
    res.send({error});
  }
};
