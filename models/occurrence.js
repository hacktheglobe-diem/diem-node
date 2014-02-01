var db = require('../classes/mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  time: {type:Date, default: Date.now()},
  kind: String,
  path: String
});

mongoose.model("Occurrence", schema);

module.exports = {
  model: db.model("Occurrence")
};