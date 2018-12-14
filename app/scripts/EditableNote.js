import React from 'react';
import $ from 'jquery';

import '../css/base.css';

import EditableTagGroup from './EditableTagGroup.js';
import NoteHeader from './NoteHeader.js';
import NoteContent from './NoteContent.js';

module.exports = React.createClass({

  getInitialState() {
    return {
      title: "Untitled",
      content: "",
      mounted: false
    };
  },
  componentDidMount: function () {
    $.ajax({
      url: "/notes/" + this.props.noteID,
      type: 'GET',
      dataType: 'json'
    })
      .done(function (results) {
        this.setState({ title: results.name });
        this.setState({ content: results.content });
        this.setState({ mounted: true });
      }.bind(this))
      .fail(function (xhr, status, error) {
        console.log("failed");
      }.bind(this));
  },
  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.noteID !== prevProps.noteID) {
      $.ajax({
        url: "/notes/" + this.props.noteID,
        type: 'GET',
        dataType: 'json'
      })
        .done(function (results) {
          this.setState({ title: results.name });
          this.setState({ content: results.content });
        }.bind(this))
        .fail(function (xhr, status, error) {
          console.log("failed");
        }.bind(this));
    }
  },
  updateTitle: function (title) {
    this.setState({ title: title });
  },
  updateContent: function (content) {
    this.setState({ content: content });
  },
  save: function () {
    var note = {
      id: this.props.noteID,
      name: this.state.title,
      content: this.state.content
    }
    $.ajax({
      url: "/notes",
      type: 'PUT',
      data: note,
      dataType: 'json'
    })
      .done(function (results) {
      }.bind(this))
      .fail(function (xhr, status, error) {
        console.log("failed to save");
      }.bind(this));
  },
  render: function () {
    if (this.state.mounted) {
      return (
        <div className="EditableNote">
          <NoteHeader noteID={this.props.noteID} title={this.state.title} update={this.updateTitle} />
          <NoteContent noteID={this.props.noteID} content={this.state.content} update={this.updateContent} />
          <EditableTagGroup noteID={this.props.noteID} updateTags={this.props.updateTags}/>
          <button type="button" onClick={this.save}>Save</button>
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
});