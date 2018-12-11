import React from 'react';
import $ from 'jquery';

import '../css/base.css';

import EditableNote from './EditableNote.js';
import NoteSelector from './NoteSelector.js';
import TagSelector from './TagSelector.js';

module.exports = React.createClass({
  getInitialState: function () {
    return ({ selectedNote: null , selectedTags: ["untagged"]});
  },
  componentDidMount: function () {
    // TODO: pull in a note?
  },
  selectNote: function (id) {
    this.setState({ selectedNote: id });
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
        <TagSelector/>
        <div className="NoteArea">
          <NoteSelector onSelect={this.selectNote} tags={this.state.selectedTags} />
          {editableNote()}
        </div>
      </div>
    );
  }
});