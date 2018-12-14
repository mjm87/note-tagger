import React from 'react';
import $ from 'jquery';

import '../css/base.css';

var PlusSignImage = "data:image/png;base64,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"; 

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
      this.niceAjaxCall(this.props.tags);
    }
    if (this.props.selectedNote !== oldProps.selectedNote) {
      this.niceAjaxCall(this.props.tags);
      this.setState({selectedNote: this.props.selectedNote});
    }
    if (this.props.status !== oldProps.status){
      this.niceAjaxCall();
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
          // if (this.state.selectedNote === null && results && results.length > 0) {
          //   this.setState({ selectedNote: results[0].id });
          // }
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
          <img onClick={this.props.addNote} className="AddNote" src={PlusSignImage} />
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