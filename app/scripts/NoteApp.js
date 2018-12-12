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

  isTagSelected: function(tag) {
    return this.state.selectedTags.includes(tag); 
  },
  isNoteSelected: function(id){
    return this.state.selectedNote === id;
  },
  handleClick : function(tag) {
    var tags = this.state.selectedTags;
    if(tags.includes(tag)) {
      // it is already selected --> deselect
      tags = tags.filter((t)=> t !== tag);
    } else {
      // it is not selected --> select
      tags.push(tag);
    }
    //update state
    this.setState({selectedTags: tags}, () => console.log(this.state.selectedTags));
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
        <TagSelector handleClick={this.handleClick} isSelected={this.isTagSelected}/>
        <div className="NoteArea">
          <NoteSelector onSelect={this.selectNote} tags={this.state.selectedTags} isSelected={this.isNoteSelected} />
          {editableNote()}
        </div>
      </div>
    );
  }
});