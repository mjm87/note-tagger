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
    if (this.props.tags.length !== oldProps.tags.length) {
      this.niceAjaxCall(this.props.tags);
    }
    if(this.props.selectedNote !== oldProps.selectedNote) {
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
  deleteThisNote: function () {
    // var notes = this.state.notes;
    // notes.filter((note) => note.id !== )
    $.ajax({
      url: "/notes/" + this.state.selectedNote,
      type: 'DELETE',
      dataType: 'json'
    })
      .done(function (results) {
        this.props.deselect("deleted");
        this.setState({selectedNote: null});
        this.niceAjaxCall(this.props.tags);
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
          Select(note.id);
        }
        if (this.props.selectedNote === note.id) {
          return (
            <li key={note.id}>
              <button onClick={selectThisNote} className="SelectedNote"> {note.name} </button>
              <button onClick={this.deleteThisNote} className="DeleteNote">X</button>
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