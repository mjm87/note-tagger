import React from 'react';
import $ from 'jquery';

import '../css/base.css';

import EditableNote from './EditableNote.js';
import NoteSelector from './NoteSelector.js';

module.exports = React.createClass({
  selectNote: function (id) {
    console.log("You selected note #" + id);
  },
  render: function() {
    return (
      <div className="NoteApp">
        <NoteSelector onSelect={this.selectNote} />
        <EditableNote noteID="5" />
      </div>
    );
  }
});