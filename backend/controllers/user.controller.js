import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import crypto from "crypto";
// You would need a mailer utility like nodemailer
import sendEmail from "../utils/sendEmail.js"; 
// For Google Auth, you'd use a library to verify the token
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


/**
 * @desc Register a new user
 * @route POST /api/user/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { username, name, email, password, PhoneNumber } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Upload pic to Cloudinary if it exists
  let picUrl = null;
  if (req.file && req.file.path) {
      const picUpload = await uploadOnCloudinary(req.file.path);
      if (!picUpload) {
        res.status(400);
        throw new Error("Profile picture upload failed");
      }
      picUrl = picUpload.url;
  }

  // Create user
  const user = await User.create({
    username,
    name,
    email,
    password,
    PhoneNumber,
    pic: picUrl,
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
    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

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
 * @desc Handle Google OAuth
 * @route POST /api/user/google-auth
 * @access Public
 */
export const googleAuth = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
        // User exists, log them in
        user.lastLogin = new Date();
        await user.save();
    } else {
        // User doesn't exist, create a new account
        const username = email.split('@')[0] + Math.floor(Math.random() * 1000); // Generate a random username
        const password = crypto.randomBytes(16).toString('hex'); // Generate a secure random password
        
        user = await User.create({
            name,
            email,
            username,
            password, // This will be hashed by the model pre-save hook
            pic: picture,
            subscriptionType: "Free Tier",
            lastLogin: new Date(),
        });
    }

    if (user) {
        res.status(user.isNew ? 201 : 200).json({
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
        res.status(400);
        throw new Error("Invalid user data from Google");
    }
});


/**
 * @desc Forgot password
 * @route POST /api/user/forgot-password
 * @access Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    console.log(email)
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Get reset tokenlocalhost
    const resetToken = user.getResetPasswordToken();
    console.log("Reset Token:", resetToken); // For development
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the following link to reset your password: \n\n ${resetUrl}`;

    try {
        // Here you would use a service like Nodemailer to send the email
        
        await sendEmail({
            email: email,
            subject: 'Password Reset Token',
            message
        });
      
       console.log("Password Reset URL (for testing):", resetUrl); // For development
       console.log(user)

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        throw new Error('Email could not be sent');
    }
});


/**
 * @desc Reset password
 * @route PUT /api/user/reset-password/:resettoken
 * @access Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
      .createHash('sha256') // <-- FIX: Corrected from 'sha2sha256'
      .update(req.params.resettoken)
      .digest('hex');

  const user = await User.findOne({
      resetPasswordToken,
  });

  if (!user) {
      res.status(400);
      throw new Error("Invalid or expired token");
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  
  res.status(200).json({
      success: true,
      data: "Password updated successfully",
      token: generateToken(user._id)
  });
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

// --- OTP LOGIN STEP 1: Request OTP ---
export const registerRequestOtp = asyncHandler(async (req, res) => {
  const { username, name, email, password, PhoneNumber } = req.body;

  // Basic validation
  if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill all required fields");
  }


  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

 
      const user = new User({
          username, name, email, password, PhoneNumber,
          verificationOtp: otp, // In production, you should HASH this OTP before saving
          verificationOtpExpire: Date.now() + 10 * 60 * 1000,
      });
  
  if (req.file && req.file.path) {
      const picUpload = await uploadOnCloudinary(req.file.path);
      if (picUpload && picUpload.url) {
          user.pic = picUpload.url;
      }
  }
  
  await user.save();
  console.log(user)

  // Send OTP email
  try {
      await sendEmail({
          email: user.email,
          subject: 'Verify Your Email for SkillSnap',
          message: `Your verification code is: ${otp}\nIt will expire in 10 minutes.`
      });
      res.status(200).json({ success: true, message: 'Verification OTP sent to your email.' });
  } catch (error) {
      // Clean up user if email fails to send, so they can try again
      await User.deleteOne({ _id: user._id });
      throw new Error('Email could not be sent. Please try again.');
  }
});

// --- REGISTRATION STEP 2: Verify OTP and finalize registration ---
export const registerVerifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
      email,
      verificationOtp: otp,
      verificationOtpExpire: { $gt: Date.now() }
  });

  if (!user) {
      res.status(400);
      throw new Error("Invalid or expired OTP. Please try registering again.");
  }

  user.verificationOtp = undefined;
  user.verificationOtpExpire = undefined;
  await user.save();

  res.status(201).json({
      success: true,
      message: "Account verified successfully! Please log in."
  });
});

