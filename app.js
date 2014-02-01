var express        = require("express");
var Q              = require("q");
var __             = require("underscore");
var async          = require("async");
var ejs            = require("ejs");

var http           = require('http');
var util           = require('util');
var Occurrence = require('./models/occurrence').model;

var app = module.exports = express();

app.configure(function () {
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");
  app.engine("html", ejs.renderFile);
  app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/static/uploads" }));
  app.use(express.cookieParser("This is the answer you are looking for %&$!$%$"));
  app.use(express.methodOverride());
  app.use(express.static(__dirname + "/public"));
  app.use(app.router);
});


app.get('/', function(req, res) {
  res.render('index');
});

app.get('/api/occurrences', function(req, res) {
  Occurrence.find({}).exec(function(err, occurrences) {
    if (err) res.send(500);
    res.json(occurrences);
  })
})

app.post('/api/occurrences', function(req, res) {
  console.log("/api/occurrences");
  var occurrence = new Occurrence({time: req.body.time, kind: req.body.kind, path: req.body.path});
  occurrence.save(function(err) {
    if (err) res.send(500);
    res.json({status: "OK"});
  })
})

var port = process.env.PORT || 1200;
var server = http.createServer(app).listen(port, function () {
	console.log("Hacklist server escucha sobre ", server.address().port, app.settings.env);
});
