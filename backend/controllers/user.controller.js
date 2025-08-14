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
  const { name, email, password,PhoneNumber } = req.body;

  if (!name || !email || !password || !PhoneNumber) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  let picUrl = "";
  if (req.file) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path);
    if (cloudinaryResult) {
      picUrl = cloudinaryResult.secure_url;
    } else {
      res.status(500);
      throw new Error("Image upload failed");
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    PhoneNumber,
    pic: picUrl || undefined,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      PhoneNumber: user.PhoneNumber,
      pic: user.pic
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
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
      name: user.name,
      email: user.email,
      PhoneNumber: user.PhoneNumber,
      pic: user.pic,
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
