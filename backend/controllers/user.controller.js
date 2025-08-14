import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

/**
 * @desc Register a new user
 * @route POST /api/user/register
 * @access Public
 */

export const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const { username, name, email, password,PhoneNumber } = req.body; // removed 'type'

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // Upload pic to Cloudinary
  const picUpload = await uploadOnCloudinary(req.file?.path);
  if (!picUpload) {
    res.status(400);
    throw new Error("Profile picture is required");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({
    username,
    name,
    email,
    password,
    PhoneNumber,
    pic: picUpload,
    subscriptionType: "Free Tier", // default subscriptionType
    lastLogin: new Date() // current date
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      pic: user.pic,
      subscriptionType: user.subscriptionType,
      PhoneNumber: user.PhoneNumber,
      lastLogin: user.lastLogin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});


/**
 * @desc Authenticate user & get token
 * @route POST /api/user/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      PhoneNumber: user.PhoneNumber,
      pic: user.pic,
      subscriptionType: user.subscriptionType,
      lastLogin: user.lastLogin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

/**
 * @desc Get all users (search)
 * @route GET /api/user
 * @access Private
 */
export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // exclude the current logged-in user
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password")

  res.json(users);
});
