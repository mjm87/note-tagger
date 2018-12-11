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

//Get a list of all tags or
app.get('/tags', function(req, res) {
  db.collection("tags").find(
    { },
    {name: true, _id:false}).toArray(function(err, tagNames) {
        if (err) throw (err);
        res.json(tagNames);
    });
});

//Get a specific note based on ID
app.get('/notes/:noteID', function(req, res) {
  db.collection("notes").findOne(
    {id: req.params.noteID},
    {name: true, _id: false, content: true}, function(err, nameNContent) {
      if (err) throw (err);
      res.json(nameNContent);
    });
});

//Endpoint that creates a note with a given name and content, and with a default tag
//if none are provided
app.put('/notes', function(req, res){
  var newOrOldID = String(Date.now());
  var tagNames = [{"name": "untagged"}]
  if (req.body.id) {
    newOrOldID = req.body.id;
    db.collection('notes').findOneAndUpdate({id: newOrOldID}, {$set: {name: req.body.name,
      content: req.body.content}}, function(err,result) {
        if (err) throw (err);
        res.json(result.value.id);
      });
  }
  else {
    db.collection('notes').findOneAndUpdate({id: newOrOldID}, {$set: {id: newOrOldID, name: req.body.name,
      content: req.body.content, tags: tagNames}}, {upsert: true}, function(err,result) {
        if (err) throw (err);
        res.json(result.value.id);
      });
  }
});

//This endpoint deletes a note with a given ID
app.delete('/notes/:toBeDeleted', function(req, res){
  db.collection("notes").findOneAndDelete(
    {id: req.params.toBeDeleted},
    function(err, result) {
      if (err) throw (err);
      for(tag in result) {
        db.collection("tags").findOne(
          {name: tag, notes: {id: {$eq: result.id}}},
          function (err, result2) {
            if (err) throw (err);
            if (result2.id.length > 1) {
              db.collection("tags").updateOne(
                {name: tag},
                {$pull: {notes: [{id: req.params.id}]}},
                function(err, result3) {
                  if (err) throw (err);
                  res.json(200);
                });
              }
              else {
                res.json(200);
              }
          });
      }
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

//Handling associating tags with notes and vice versa
app.put('/:collection/:noteID/:tagName', function(req, res) {
  var collectionToQuery = req.params.collection;
  var noteID = req.params.noteID;
  var tag = req.params.tagName;
  if(collectionToQuery === "notes") {
    db.collection("notes").findOne(
      {id: noteID, tags: {name: {$eq: tag}}},
      function (err, result) {
        if (err) throw (err);
        if (!result) {
          db.collection("notes").updateOne(
            {id: noteID},
            {$push: {tags: [{name: tag}]}},
            function(err, result) {
              if (err) throw (err);
              res.json(200);
          });
        }
        else {
          res.json(200);
        }
      });
  }
  else if(collectionToQuery === "tags") {
    db.collection("tags").findOne(
      {name: tag, notes: {id: {$eq: noteID}}},
      function (err, result) {
        if (err) throw (err);
        if (!result) {
          db.collection("tags").updateOne(
            {name: tag},
            {$push: {notes: [{id: noteID}]}},
            {upsert: true},
            function(err, result) {
              if (err) throw (err);
              res.json(200);
          });
        }
        else {
          res.json(200);
        }
      });
  }
});

//Deletes a tag from off a note, or a note from off a tag, depending on the
//:collection param's value (either "notes" or "tags")
app.delete('/:collection/:noteID/:tagName', function(req, res) {
  collectionToQuery = req.params.collection;
  var noteID = req.params.noteID;
  var tag = req.params.tagName;
  if(collectionToQuery === "notes") {
    //Even though this is a delete endpoint, we use the updateOne mongo function
    //to avoid deleting the whole note.
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

  //This actually performs the check and deletes the tag if it no longer would have
  //note associated with it
  db.collection("tags").findOne(
    {name: tag},
    {notes: true, _id: false}, function(err, notesOfTag) {
      if (err) throw (err);
      if(notesOfTag != null) {
        if (notesOfTag.notes.length === 1) {
          db.collection("tags").findOneAndDelete(
            {name: tag}
          )};
      }
  });
});

//This endpoint filters notes depending on a passed in tags array
app.get('/filteredNotes', function(req, res) {
  var noteSet = new Set([])
  var tags = urlParams.getAll("tags")
  if (tags.length > 0) {
    for(tag in tags) {
      db.collection("tags").findOne(
        {name: tag},
        {_id: false, notes: true},
        function(err, notesOfThisTag){
          if (err) throw (err);
          for(note in notesOfThisTag) {
            noteSet.add(note.id);
          }
        });
      }
  }
  else {
    db.collection("tags").findOne(
      {name: "untagged"},
      {_id: false, notes: true},
      function(err, notesOfThisTag){
        if (err) throw (err);
        for(note in notesOfThisTag) {
          noteSet.add(note.id);
        }
      });
  }
  var nameIDSet = new Set([]);
  for(note in noteSet){
    db.collection("notes").findOne(
      {id: note},
      {name: true, id: true, _id: false},
      function(err, nameIDPair) {
        if (err) throw (err)
        nameIDSet.add(nameIDPair);
    });
  }
  res.json(nameIDSet);
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
