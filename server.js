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

//Get a list of all tags
app.get('/tags', function(req, res) {
  db.collection("tags").find(
    { },
    {name: true, _id:false}).toArray(function(err, tagNames) {
        if (err) throw err;
        res.json(tagNames);
    });
});

//TODO: Endpoint to create/delete a note
app.post('/notes', function(req, res){
  var tagNames = req.body.tags;
  if (tagNames.length === 0) {
    tagNames.append({name: default})
  }
  db.collection('notes').insertOne({id: Date.now(), name: req.body.name,
  content: req.body.content, tags: req.body.tags}, function(err,result) {
    if (err) throw (err);
    res.json(200);
  });
});

//Get the tags on a note
app.get('/notes/:noteID/tags', function(req, res) {
  var noteID = req.params.noteID;
  db.collection("notes").findOne(
    {id: noteID},
    function(err, result) {
      if (err) throw (err);
      res.json(result.tags);
    });
});

//Getting the notes associated with a tag
app.get('/tags/:tagName/notes', function(req, res) {
  var tagName = req.params.tagName;
  db.collection("tags").findOne(
    {name: tagName},
    function(err, result) {
      if (err) throw (err);
      res.json(result.notes);
    })
});

//TODO: add logic to ensure that if a tag doesn't exist yet, add it to the tag collection with the note
//Handling associating tags with notes and vice versa
app.put('/:collection/:noteID/:tagName', function(req, res) {
  collectionToQuery = req.params.collection;
  var noteID = req.params.noteID;
  var tag = req.params.tagName;
  if(collectionToQuery === "notes") {
    //TODO: do a query to make sure tagToAdd doesn't already exist on the note, then proceed with the push
    db.collection("notes").updateOne(
      {id: noteID},
      {$push: {tags: {name: tag}}},
      function(err, result) {
        if (err) throw (err);
        res.json(200);
      })
  }
  else if(collectionToQuery === "tags") {
    //TODO: do a query to make sure tagToAdd doesn't already exist on the note, then proceed with the push
    db.collection("tags").updateOne(
      {name: tag},
      {$push: {notes: {id: noteID}}},
      function(err, result) {
        if (err) throw (err);
        res.json(200);
      })
  }
});

//TODO: if a tag is deleted from a note, and that was its only note, delete the tag
app.delete('/:collection/:noteID/:tagName', function(req, res) {
  collectionToQuery = req.params.collection;
  var noteID = req.params.noteID;
  var tag = req.params.tagName;
  if(collectionToQuery === "notes") {
    //Even though this is a delete endpoint, we use the updateOne mongo function to avoid deleting the whole note.
    db.collection("notes").updateOne(
      {id: noteID},
      {$pull: {tags: {name: tag}}},
      function(err, result) {
        if (err) throw (err);
        res.json(200);
      })
  }
  else if(collectionToQuery === "tags") {
    db.collection("tags").updateOne(
      {name: tag},
      {$pull: {notes: {id: noteID}}},
      function(err, result) {
        if (err) throw (err);
        res.json(200);
      })
  }
});

//TODO: Endpoint to create/delete a tag
//TODO: PUT on note w/ name and contents by id
//TODO: Take a list of notes as input (JSON) and get the name/id of each
//TODO: Get/Put the contents/name of selected note (noteID)
//TODO: Take a list of tags and return a list of note names/ids



//TODO ROUTING GOES HERE, HOORAY!

// temporary routes: feel free to actually implement
/*
app.put('/:tagName/:noteID', function(req, res) {
    console.log("PUT: " + req.params.tagName + " on note #" + req.params.noteID);
    res.json(200);
});
*/

app.delete('/:tagName/:noteID', function(req, res) {
    console.log("DELETE: " + req.params.tagName + " from note #" + req.params.tagName);
    res.json(200);
});

//Don't put anything after this that isn't already here; these two need to be the end of the file
var mongoConnectionString = 'mongodb://notetaggerdb:' + process.env.MONGO_PASSWORD + '@ds157742.mlab.com:57742/note-tagger';
MongoClient.connect(mongoConnectionString, function (err, client) {
  if (err) throw err;
  db = client;
  app.listen(app.get('port'), function() {
      console.log('Server started: http://localhost:' + app.get('port') + '/');
  });
})
