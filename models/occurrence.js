var db = require('../classes/mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  time: {type:Date},
  kind: String,
  path: String,
  eventId: {type:Number, unique: true}
});

mongoose.model("Occurrence", schema);

module.exports = {
  model: db.model("Occurrence")
};