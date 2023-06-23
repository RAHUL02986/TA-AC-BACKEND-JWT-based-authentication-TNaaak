var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: Number, required: true, minlength: 5 },
  },
  { timestamps: true }
);
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password);
    return result;
  } catch (error) {
    next(error);
  }
};
module.exports = mongoose.model('User', userSchema);
