var fs = require('fs');
var path = require('path')
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var app = express();

var APP_PATH = path.join(__dirname, 'dist');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(APP_PATH));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/:noteID/tags', function(req, res) {
  var noteID = req.params.noteID;
  db.collection("notes").findOne(
    {id: noteID},
    function(err, result) {
      if (err) throw (err);
      res.json(result.tags);
    })
});

app.get('/:tagName/notes', function(req, res) {
  var tagName = req.params.tagName;
  db.collection("tags").findOne(
    {name: tagName},
    function(err, result) {
      if (err) throw (err);
      res.json(result.notes);
    })
});



//TODO ROUTING GOES HERE, HOORAY!




//Don't put anything after this that isn't already here; these two need to be the end of the file
var mongoConnectionString = 'mongodb://notetaggerdb:' + process.env.MONGO_PASSWORD + '@ds157742.mlab.com:57742/note-tagger';
MongoClient.connect(mongoConnectionString, function (err, client) {
  if (err) throw err;
  db = client;
  app.listen(app.get('port'), function() {
      console.log('Server started: http://localhost:' + app.get('port') + '/');
  });
})
