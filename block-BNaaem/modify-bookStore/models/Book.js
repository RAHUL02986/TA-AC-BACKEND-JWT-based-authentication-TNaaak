var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
  title: String,
  description: String,
  categories: [String],
  tags: [String],
  CreatedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  comments: { type: mongoose.Types.ObjectId, ref: 'Comment' },
});

module.exports = mongoose.model('Book', BookSchema);