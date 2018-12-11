import React from 'react';
import $ from 'jquery';

import '../css/base.css';

module.exports = React.createClass({

  getInitialState() {
    return ({ notes: [] });
  },
  componentDidMount() {
    $.ajax({
      url: "/filteredNotes",
      type: 'GET',
      dataType: 'json'
    })
      .done(function (results) {
        console.log("saved: " + JSON.stringify(results));
        this.setState({ notes: results });
      }.bind(this))
      .fail(function (xhr, status, error) {
        console.log("failed to save");
      }.bind(this));
  },
  render: function () {
    var Select = this.props.onSelect;
    var notesList = this.state.notes.map(function(note) {
      var selectThisNote = function(){
        Select(note.id);
      }
      return (
        <li key={note.id}>
        <button onClick={selectThisNote}>{note.name}</button>
        </li>
      );
    });
    return (
      <div className="Note Selector">
        {notesList}
      </div>
    );
  }
});