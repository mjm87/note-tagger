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
app.use(bodyParser.urlencoded({ extended: true }));

// Additional middleware which will set headers that we need on each request.
app.use(function (req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//Get a list of all tags
app.get('/tags', function (req, res) {
  db.collection("tags").find(
    {},
    { name: true, _id: false }).toArray(function (err, tagNames) {
      if (err) throw (err);
      res.json(tagNames);
    });
});

//Get the name, content, and tags of a specific note based on that note's ID
app.get('/notes/:noteID', function (req, res) {
  db.collection("notes").findOne(
    { id: req.params.noteID },
    { name: true, _id: false, content: true, tags: true }, function (err, nameNContentNTags) {
      if (err) throw (err);
      res.json(nameNContentNTags);
    });
});

//Endpoint that creates a note with a given name and content, and with a default tag
//if none are provided
app.put('/notes', function (req, res) {
  // We wanted to support having multiple notes with the same name, so we have to
  // give each on a unique id, which we do using the current time.
  var newOrOldID = String(Date.now());
  //If an ID was passed in, this is an update request, not a create request
  if (req.body.id) {
    newOrOldID = req.body.id;
    db.collection('notes').findOneAndUpdate({ id: newOrOldID }, {
      $set: {
        name: req.body.name,
        content: req.body.content
      }
    }, function (err, result) {
      if (err) throw (err);
      res.json(newOrOldID);
    });
  }
  //Otherwise it is a create request, so we use the random ID we generated earlier
  else {
    var tagNames = req.body.tags;
    //If no tags were sent in the request we need to give it the default "untagged"
    //tag (which is hidden in the UI).
    if (!tagNames) {
      tagNames = [{ "name": "untagged" }];
    }
    //This mongo request creates the note in the notes collection, and then goes
    //in and creates any necessary tags in the tag collection as well, making
    //sure that the new note is associated with all the tags it should be, and that
    //the tags are associated with the new note's id.
    db.collection('notes').findOneAndUpdate({ id: newOrOldID }, {
      $set: {
        id: newOrOldID, name: req.body.name,
        content: req.body.content, tags: tagNames
      }
      //Note: Upsert in a mongo request means if you don't find it what you are
      //looking for, create it.
    }, { upsert: true }, function (err, result) {
      if (err) throw (err);
      for (let tag in tagNames) {
        //This should be refactored to a findOneAndUpdate()
        db.collection("tags").findOne(
          { name: tagNames[tag].name },
          function (err, result2) {
            if (err) throw (err);
            db.collection("tags").updateOne(
              { name: tagNames[tag].name },
              { $push: { notes: { id: newOrOldID } } },
              { upsert: true },
              function (err, result) {
                if (err) throw (err);
              });
          });
      }
    });
    //We return the ID of the note to the caller of this endpoint
    res.json(newOrOldID);
  }
});

//This endpoint deletes a note with a given ID
app.delete('/notes/:toBeDeleted', function (req, res) {
  //Find and delete the specified note. This mongo call returns the deleted object
  //which allows us to . . .
  db.collection("notes").findOneAndDelete(
    { id: req.params.toBeDeleted },
    function (err, result) {
      if (err) throw (err);
      let tags = result.value.tags;
      // . . . go into the tags collection and delete the note ID from all the tags
      // that were asssociated with that note . . .
      for (let tag in tags) {
        db.collection("tags").findOne(
          { name: tags[tag].name },
          function (err, result2) {
            if (err) throw (err);
            // . . . however, if that note was the only note a given tag was on
            // that tag needs to be deleted too (which is handled in the else, below)
            if (result2.notes.length > 1) {
              db.collection("tags").updateOne(
                { name: tags[tag].name },
                { $pull: { notes: { id: req.params.toBeDeleted } } },
                function (err, res3) {
                  if (err) throw (err);
                  db.collection("tags").findOneAndDelete(
                    { name: tags[tag].name, notes: [] },
                    function (err, res4) {
                      if (err) throw (err);
                    }
                  );
                });
            }
            else {
              db.collection("tags").findOneAndDelete(
                { name: tags[tag].name },
                function (err, deletedTag) {
                  if (err) throw (err);
                }
              )
            }
          });
      }
      res.json(200);
    });
});

//Get the tags associated with a note
app.get('/notes/:noteID/tags', function (req, res) {
  var noteID = req.params.noteID;
  db.collection("notes").findOne(
    { id: noteID },
    function (err, result) {
      if (err) throw (err);
      res.json(result.tags);
    });
});

//Getting the notes associated with a tag
app.get('/tags/:tagName/notes', function (req, res) {
  var tagName = req.params.tagName;
  db.collection("tags").findOne(
    { name: tagName },
    { _id: false, notes: true },
    function (err, result) {
      if (err) throw (err);
      if (result) {
        res.json(result.notes);
      }
      else {
        res.json(401);
      }
    });
});

//Handling associating tags with notes and vice versa
app.put('/:collection/:noteID/:tagName', function (req, res) {
  var collectionToQuery = req.params.collection;
  var noteID = req.params.noteID;
  var tag = req.params.tagName;
  if (collectionToQuery === "notes") {
    //TODO: refactor to a findOneAndUpdate with upsert: true
    db.collection("notes").findOne(
      { id: noteID, tags: { name: { $eq: tag } } },
      function (err, result) {
        if (err) throw (err);
        if (!result) {
          db.collection("notes").updateOne(
            { id: noteID },
            { $push: { tags: { name: tag } } },
            function (err, result) {
              if (err) throw (err);
            });
        }
        else {
          res.json(200);
        }
      });
  }
  //Hacks
  //EDIT: we realized that to this endpoint never needed to get explicitly into the
  //tags collection instead of the notes collection, so we made it always do that.
  //This whole endpoint, while functional, should probably be refactored.
  if (collectionToQuery === "notes") {
    db.collection("tags").findOneAndUpdate(
      { name: tag },
      { $push: { notes: { id: noteID } } },
      { upsert: true },
      function (err, result) {
        if (err) throw (err);
        res.json(200)
      });
  };
});

//Deletes a tag from off a note, or a note from off a tag, depending on the
//:collection param's value (either "notes" or "tags")
app.delete('/:collection/:noteID/:tagName', function (req, res) {
  collectionToQuery = req.params.collection;
  var noteID = req.params.noteID;
  var tag = req.params.tagName;
  if (collectionToQuery === "notes") {
    //Even though this is a delete endpoint, we use the updateOne mongo function
    //to avoid deleting the whole note.
    db.collection("notes").updateOne(
      { id: noteID },
      { $pull: { tags: { name: tag } } },
      function (err, result) {
        if (err) throw (err);
        res.json(200);
      })
  }
  else if (collectionToQuery === "tags") {
    db.collection("tags").updateOne(
      { name: tag },
      { $pull: { notes: { id: noteID } } },
      function (err, result) {
        if (err) throw (err);
        res.json(200);
      })
  }

  //This actually performs the check and deletes the tag if it no longer would have
  //note associated with it
  db.collection("tags").findOne(
    { name: tag },
    { notes: true, _id: false }, function (err, notesOfTag) {
      if (err) throw (err);
      if (notesOfTag != null) {
        if (notesOfTag.notes.length === 1) {
          db.collection("tags").findOneAndDelete(
            { name: tag }
          )
        };
      }
    });
});

//This endpoint filters out notes based on an array of tags passed into the API
//call. We documented this algorithm fairly heavily because we were having trouble
//with it for quite a while.
app.post('/filteredNotes', function (req, res) {
  var noteSet = []
  //This mongo call finds all the notes in our collection, and returns their names
  //and IDs
  db.collection("notes").find(
    {},
    { _id: false, content: false }).toArray(function (err, notes) {

      // foreach of our note documents
      for (let note in notes) {
        isNoteIncluded = true;
        // foreach of our JSON inputted tags
        for (let tag in req.body.tags) {
          let thisParticularTag = req.body.tags[tag];
          noteHasTag = false;
          // check if this note has this particular tag
          for (let tagOnNote in notes[note].tags) {
            let thisTag = notes[note].tags[tagOnNote].name;
            if (thisTag === thisParticularTag) {
              // hey we at least have this one
              noteHasTag = true;
            }
          }
          // if we still don't have it by now, we're never going to
          // thus this note doesn't have one of the required tags
          // and thus shouldn't be included
          if (!noteHasTag) {
            isNoteIncluded = false;
          }
        }
        if (isNoteIncluded) {
          noteSet.push({ "id": notes[note].id, "name": notes[note].name });
        }
      }
      //noteSet should end up as an array of IDs and names, so that our note list
      //can display those names and search for more info based on their ids when
      //a given note is selected.
      res.json(noteSet);
    })
});

//Don't put anything after this that isn't already here; these two need to be the end of the file
//This sets up our mongo connection that we use throughout the rest of the server
var mongoConnectionString = 'mongodb://notetaggerdb:' + process.env.MONGO_PASSWORD + '@ds157742.mlab.com:57742/note-tagger';
MongoClient.connect(mongoConnectionString, function (err, client) {
  if (err) throw err;
  db = client;
  app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
  });
})
