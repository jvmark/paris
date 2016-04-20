var mongoose = require('./db').mongoose;

var Settings = mongoose.model('Settings', {
  name: String,
  value: {}
});

module.exports = Settings;