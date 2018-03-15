const mongoose = require('mongoose');
const config = require('../../config/env');

module.exports.connect = () => {
  mongoose.connect(`${config.MongoDB.url}${config.MongoDB.database}`);
  return mongoose.connection
}
