// Test (while set up)

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: false, trim: true },
  lastName: { type: String, required: false, trim: true },
  preferredName: { type: String, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'] // Regex to validate email format
  },
  password: {
    type: String,
    required: true,
    minlength: 8 // Minimum length for the password
  },
  jobRole: { type: String, trim: true },
  phoneNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /\d{8}/.test(v); // Validates a simple 8-digit phone number
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  profilePicture: { type: String, default: 'default.jpg' } // Default profile picture if none is provided
});

// Pre-save hook to hash password before saving it to the database
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Generate a salt and hash on separate function calls
  const salt = await bcrypt.genSalt(10); // The cost factor controlling how much time is needed to calculate a single BCrypt hash. The higher the cost factor, the more hashing rounds are done.
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare given password with the database hash
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
