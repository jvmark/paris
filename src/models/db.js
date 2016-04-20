var mongoose = require('mongoose');

mongoose.connect('mongodb://10.1.2.201:13309/parisdb_online');

exports.mongoose = mongoose;