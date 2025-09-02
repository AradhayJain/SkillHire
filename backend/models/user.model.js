import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionType: { type: String, default: "Free Tier" },
  dateJoined: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  pic: {
    type: String,
    default: "https://skillsnap.co.in/public/default.png",
  },
  PhoneNumber:{
    type: Number,
    // FIX: Changed from 'required: true' to 'required: false'
    // This makes the phone number optional, allowing Google Sign-In to work.
    required: false, 
    unique: true,
    sparse: true // Important: Allows multiple documents to have a null value for a unique field
  },
  verificationOtp: String,
  verificationOtpExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// --- Method to compare entered password with the hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- Middleware to hash password before saving ---
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// --- Method to generate and hash password reset token ---
userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};


export const User = mongoose.model('User', userSchema);
