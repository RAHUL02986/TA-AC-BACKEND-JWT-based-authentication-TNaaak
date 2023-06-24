var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');
var userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(this.password, password);
    return result;
  } catch (error) {
    next(error);
  }
  bcrypt.compare();
};

userSchema.methods.signToken = async function () {
  var payload = {
    userId: this.id,
    email: this.email,
  };
  try {
    var token = await jwt.sign(payload, 'thisisasecret');
    return token;
  } catch (error) {
    next(error);
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    name: this.name,
    email: this.email,
    token: token,
  };
};
module.exports = mongoose.model('User', userSchema);
