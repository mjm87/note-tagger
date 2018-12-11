import React from 'react';
import $ from 'jquery';

import '../css/base.css';

module.exports = React.createClass({

  getInitialState() {
    return ({ notes: [] , mounted: false});
  },
  componentDidMount() {
    var tags = {tags: [{name:"tag1"}, {name:"tag3"}]};
    $.ajax({
      url: "/filteredNotes",
      type: 'POST',
      data: tags,
      //contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    })
      .done(function (results) {
        console.log("saved: " + JSON.stringify(results));
        this.setState({ notes: results });
        this.setState({ mounted: true})
      }.bind(this))
      .fail(function (xhr, status, error) {
        console.log("failed to save");
      }.bind(this));
  },
  render: function () {
    if(this.state.mounted) {
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
    } else {
      return <div/>
    }
  }
});