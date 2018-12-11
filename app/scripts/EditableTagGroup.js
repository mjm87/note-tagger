import React from 'react';
import $ from 'jquery';

import '../css/base.css';
import Tag from './Tag.js';
import TagCreator from './TagCreator.js';

module.exports = React.createClass({

  getInitialState: function () {
    return { data: [] };
  },

  componentDidMount: function () {
    $.ajax({
      url: "/notes/" + this.props.noteID + "/tags",
      type: 'GET'
    })
      .done(function (results) {
        this.setState({ data: results });
      }.bind(this))
      .fail(function (xhr, status, error) {
        console.log("Couldn't retrieve tags for Note #" + this.props.noteID);
      }.bind(this));
  },

  componentDidUpdate: function (oldProps, oldState) {
    if (this.props.noteID !== oldProps.noteID) {
      $.ajax({
        url: "/notes/" + this.props.noteID + "/tags",
        type: 'GET'
      })
        .done(function (results) {
          this.setState({ data: results });
        }.bind(this))
        .fail(function (xhr, status, error) {
          console.log("Couldn't retrieve tags for Note #" + this.props.noteID);
        }.bind(this));
    }
  },

  // adding the tag to the note
  addTag: function (tagName) {
    console.log("Adding " + tagName + " to Note #" + this.props.noteID);
    let oldData = this.state.data;
    let newData = oldData.concat({ name: tagName });
    $.ajax({
      url: "/notes/" + this.props.noteID + "/" + tagName,
      type: 'PUT'
    }).done(function (results) {
      console.log("Added " + tagName + " to Note #" + this.props.noteID);
      this.setState({ data: newData });
    }.bind(this))
      .fail(function (xhr, status, error) {
        console.log("Failed to add " + tagName + " to Note #" + this.props.noteID);
        this.setState({ data: oldData });
      }.bind(this));
  },

  // removing the tag from the note
  removeTag: function (tagName) {
    let oldData = this.state.data;
    let newData = oldData.filter((t) => t.name != tagName);
    $.ajax({
      url: "/notes/" + this.props.noteID + "/" + tagName,
      type: 'DELETE'
    }).done(function (results) {
      console.log("DONE: " + newData);
      this.setState({ data: newData });
    }.bind(this))
      .fail(function (xhr, error, msg) {
        console.log("FAIL: " + oldData);
        this.setState({ data: oldData });
      }.bind(this));
  },

  // render
  render: function () {

    var removeTag = this.removeTag;       // passing removeTag function into the mapping below (using closure???)
    var tagList = this.state.data.map(function (tag) {
      if (tag.name != "untagged") {
        return (
          <Tag handleClick={removeTag} tagName={tag.name} tagType="EditableTag" />
        );
      }
    });

    return (
      <div className="EditableTagGroup">
        {tagList}
        <TagCreator handleClick={this.addTag} />
      </div>
    );
  }
});
