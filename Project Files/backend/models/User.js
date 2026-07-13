const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      match: [/^\+?[0-9]{10,15}$/, 'Please add a valid phone number (10-15 digits)'],
    },
    role: {
      type: String,
      enum: ['admin', 'owner', 'renter'],
      default: 'renter',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(`[matchPassword debug] Entering compare. Plaintext length: ${enteredPassword ? enteredPassword.length : 0}, Stored Hash: "${this.password}"`);
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log(`[matchPassword debug] Compare outcome: ${isMatch}`);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
