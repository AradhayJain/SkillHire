import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Import the crypto library for token generation

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
    default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
  },
  PhoneNumber:{
    type: Number,
    required: true,
    unique: true
  },
  // --- Fields for Password Reset ---
  resetPasswordToken: String,
  resetPasswordExpire: Date,

}, { timestamps: true });

// --- Method to compare entered password with the hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- Middleware to hash password before saving ---
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// --- Method to generate and hash password reset token ---
userSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire time (e.g., 10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    // Return the unhashed token (to be sent via email)
    return resetToken;
};


export const User = mongoose.model('User', userSchema);
