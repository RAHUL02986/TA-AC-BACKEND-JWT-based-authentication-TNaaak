var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema(
  {
    title: String,
    likes: { type: Number, default: 0 },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    book: { type: mongoose.Types.ObjectId, ref: 'Book' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
