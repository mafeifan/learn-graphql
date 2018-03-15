const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
  id: Number,
  content: String,
  author: String
}));
