import React from 'react';
import $ from 'jquery';

import '../css/base.css';

import EditableNote from './EditableNote.js';
import NoteSelector from './NoteSelector.js';
import TagSelector from './TagSelector.js';

module.exports = React.createClass({
  getInitialState: function () {
    return ({ selectedNote: null, selectedTags: ["untagged"] });
  },
  componentDidMount: function () {
    // TODO: pull in a note?
  },
  selectNote: function (id) {
    this.setState({ selectedNote: id });
  },

  isTagSelected: function (tag) {
    return this.state.selectedTags.includes(tag);
  },
  isNoteSelected: function (id) {
    return this.state.selectedNote === id;
  },
  handleClick: function (tag) {
    var tags = this.state.selectedTags;
    if (tags.includes(tag)) {
      // it is already selected --> deselect
      tags = tags.filter((t) => t !== tag);
    } else {
      // it is not selected --> select
      tags.push(tag);
    }
    //update state
    this.setState({ selectedTags: tags }, () => console.log(this.state.selectedTags));
  },
  deselectNote: function () {
    this.setState({ selectedNote: null });
  },
  addNote: function () {
    var newNote = {
      name: "Untitled",
      content: "",
      tags: this.state.selectedTags.map(function (tag) {
        return { name: tag };
      })
    }
    $.ajax({
      url: "/notes",
      type: 'PUT',
      data: newNote,
      dataType: 'json'
    })
      .done(function (results) {
        console.log("added: " + results);
        this.setState({ selectedNote: results });
      }.bind(this))
      .fail(function (xhr, status, error) {
        console.log("failed to create new note");
      }.bind(this));
  },
  render: function () {
    var editableNote = function () {
      if (this.state.selectedNote != null)
        return (
          <EditableNote noteID={this.state.selectedNote} />
        );
    }.bind(this);
    return (
      <div className="NoteApp">
        <TagSelector handleClick={this.handleClick} isSelected={this.isTagSelected} />
        <div className="NoteArea">
          <NoteSelector onSelect={this.selectNote} tags={this.state.selectedTags} isSelected={this.isNoteSelected} deselect={this.deselectNote} />
          <button onClick={this.addNote} className="AddNote">Add new note</button>
          {editableNote()}
        </div>
      </div>
    );
  }
});