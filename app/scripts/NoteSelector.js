import React from 'react';
import $ from 'jquery';

import '../css/base.css';

module.exports = React.createClass({

  getInitialState() {
    return ({ notes: [], selectedNote: null });
  },
  componentDidMount() {
    if (this.props.tags) {
      //this.performNastyAjaxCalls(this.props.tags[0]);
      this.niceAjaxCall(this.props.tags);
    }
  },
  componentDidUpdate: function (oldProps, oldState) {
    //NOTE: for some reason comparing this.props.tags and oldProps.tags
    // never seems to work (regardless of comparison method) perhaps
    // because arrays are stored as a pointer or something so that the old
    // and the new reference the same thing???
    if (this.props.numOfTags !== oldProps.numOfTags) {
      console.log("tags changed");
      this.niceAjaxCall(this.props.tags);
    }
    if (this.props.selectedNote !== oldProps.selectedNote) {
      this.niceAjaxCall(this.props.tags);
    }
  },
  niceAjaxCall: function (tags) {
    $.ajax({
      url: "/filteredNotes",
      type: 'POST',
      data: { "tags": tags },
      dataType: 'json'
    })
      .done(function (results) {
        this.setState({ notes: results }, function () {
          if (this.state.selectedNote === null && results && results.length > 0) {
            this.setState({ selectedNote: results[0].id });
          }
        }.bind(this));
      }.bind(this))
      .fail(function (results) {
        console.log("failed");
      })
  },
  Delete: function (noteID) {
    // remove note from state so that it disappears quickly
    var notesList = this.state.notes;
    notesList.filter((n) => n.id !== noteID);
    this.setState({ notes: notesList });

    // clear out the selected not status
    this.setState({ selectedNote: null });

    // remove note from the database so that it doesn't get rerendered
    $.ajax({
      url: "/notes/" + noteID,
      type: 'DELETE',
      dataType: 'json'
    })
      .done(function (results) {
        // get an updated list of notes?
        this.niceAjaxCall(this.props.tags);
        // let NoteApp know that the note has been deleted (and allow it to take care of updating tags)
        this.props.deselect("deleted");
        console.log("deleted note");
      }.bind(this))
      .fail(function (xhr, status, error) {
        console.log("failed to delete note");
      }.bind(this));

  },

  render: function () {
    if (this.state.notes.length > 0) {
      var Select = this.props.onSelect;
      var notesList = this.state.notes.map(function (note) {
        var selectThisNote = function () {
          this.setState({ selectedNote: note.id })
          Select(note.id);
        }.bind(this);
        var deleteThisNote = function () {
          this.Delete(note.id);
          this.props.deselect("deleted");
        }.bind(this);
        if (this.state.selectedNote === note.id) {
          return (
            <li key={note.id}>
              <button onClick={selectThisNote} className="SelectedNote"> {note.name} </button>
              <button onClick={deleteThisNote} className="DeleteNote">X</button>
            </li>
          );
        } else {
          return (
            <li key={note.id}>
              <button onClick={selectThisNote} className="UnselectedNote"> {note.name} </button>
            </li>
          );
        }
      }.bind(this));
      return (
        <div className="NoteSelector">
          {notesList}
        </div>
      );
    } else {
      return <div />
    }
  }











  /*
  //checking if we added a tag
  if (this.props.tags.length > oldProps.tags.length) {
    //finding the tag that was added
    for (let t in this.props.tags) {
      let tag = this.props.tags[t];
      if (!oldProps.tags.includes(tag)) {
        //this.performNastyAjaxCalls(tag);
      }
    }
  }
  // checking if we removed a tag
  if (this.props.tags.length < oldProps.tags.length) {
    //finding the tag that was removed
    for (let t in oldProps.tags) {
      let tag = oldProps.tags[t];
      if (!this.props.tags.includes(tag)) {
        this.performNastyAjaxCalls(tag);
      }
    }
  }
  */











  // performNastyAjaxCalls: function (tagName) {
  //   // clear notes list
  //   this.setState({ notes: [] }, function () {
  //     // GET all the notes
  //     $.ajax({
  //       url: "/tags/" + tagName + "/notes",
  //       type: 'GET',
  //       dataType: 'json'
  //     })
  //       .done(function (results) {

  //         for (let r in results) {
  //           let note = results[r];

  //           $.ajax({
  //             url: "/notes/" + note.id,    //todo: maybe note.id
  //             type: 'GET',
  //             dataType: 'json'
  //           })
  //             .done(function (noteContent) {
  //               var included = false;
  //               for (let t in this.props.tags) {
  //                 let tag = this.props.tags[t];
  //                 for (let nt in noteContent.tags) {
  //                   if(noteContent.tags[nt].name === tag){
  //                     included = true;
  //                   }
  //                 }
  //               }

  //               console.log(noteContent.name + " is included: " + included);

  //               if (included) {
  //                 var currentNotes = this.state.notes;
  //                 currentNotes.push({ id: note.id, name: noteContent.name });
  //                 this.setState({ notes: currentNotes });
  //                 console.log("Added note #" + note.id + " for ");
  //               }
  //             }.bind(this))
  //             .fail(function (xhr, status, error) {
  //               console.log("failed");
  //             }.bind(this))
  //         }

  //       }.bind(this))
  //       .fail(function (xhr, status, error) {
  //         console.log("failed to retrieve notes from selected tag");
  //       }.bind(this));

  //   });
  // },
});