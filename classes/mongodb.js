var mongoose = require('mongoose');
module.exports = exports = mongoose.connect(process.env.MONGOHQ_URL || "mongodb://localhost/diem");
