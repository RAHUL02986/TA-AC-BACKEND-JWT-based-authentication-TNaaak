var mongoose = require('mongoose');
var bcrpyt = require('bcrpyt');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');
var userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: Number, require: true },
    books: { type: mongoose.Types.ObjectId, ref: 'Book' },
    comments: { type: mongoose.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }
);
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrpyt.hash(this.password, 12);
  }
  next();
});
userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrpyt.compare(this.password, password);
    return result;
  } catch (error) {
    next(error);
  }
};
userSchema.methods.signToken = async function () {
  var payload = {
    name: this.name,
    email: this.email,
  };
  try {
    var token = await jwt.sign(payload, 'thisisasecret');
    return token;
  } catch (error) {
    next(error);
  }
};
userSchema.methods.userJSON = async (token) => {
  return {
    name: this.name,
    email: this.email,
    token: token,
  };
};
module.exports = mongoose.model('User', userSchema);
