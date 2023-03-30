const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must enter a name"]
  },
  email: {
    type: String,
    required: [true, "You must enter an email"],
    unique: true,
    validate: [isEmail, "Enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "You must enter a password"],
    minLength: [8, "Your password must be at least 8 characters long"],
    maxLength: [32, "Your password cannot be more than 32 characters"]
  },
  // imageUrl: {
  //   type: String
  // }
})

// use pre hooks
personSchema.pre('save', function (next) {
  // generate salt and password hash
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(this.password, salt);

  // replace plain password with the password hash
  this.password = hashedPassword;

  next();
})

const personModel = mongoose.model('person', personSchema);

module.exports = personModel;