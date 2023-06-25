var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: String,
    image: String,
    following: Boolean,
    followingList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followersList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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
    let result = await bcrypt.compare(password, this.password);
    return result;
    console.log(result);
  } catch (error) {
    return result;
  }
};

//token

userSchema.methods.signToken = async function () {
  let payload = { userId: this.id, email: this.email };
  try {
    let token = await jwt.sign(payload, 'thisisscerte');
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    token: token,
  };
};

userSchema.methods.displayUser = function (id = null) {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    following: id ? this.followersList.includes(id) : false,
  };
};

module.exports = mongoose.model('User', userSchema);
