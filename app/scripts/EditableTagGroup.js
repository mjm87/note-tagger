import React from 'react';
import $ from 'jquery';

import '../css/base.css';
import Tag from './Tag.js';

module.exports = React.createClass({
  OnAdded : function(tagName) {
    $.ajax({
      url: "/" + this.props.noteID + "/" + tagName,
      type : 'PUT'
    }).done(function(results) {
      console.log("Added " + tagName + " to Note #" + this.props.noteID);
    }).fail(function(xhr,error,msg) {
      console.log("Failed to add " + tagName + " to Note #" + this.props.noteID);
    })

  },
  OnRemove: function (tagName){
    $.ajax({
      url: "/" + tagName + "/" + this.props.noteID,
      type : 'DELETE'
    }).done(function(results) {
        console.log("Removed " + tagName + " from Note #" + this.props.noteID);
    }).fail(function(xhr,error,msg) {
        console.log("Faled to remove " + tagName + " from Note #" + this.props.noteID);
    })
  },
  render: function() {

    var OnRemove = this.OnRemove;       // TODO: figure out what React-y nonsense is going on?
    var tagList = this.props.data.map(function(tag){
      return (
        <Tag handleClick={OnRemove} tagName={tag.name} tagType="editableTag" />
      );
    });

    return (
      <div className="EditableTagGroup">
        {tagList}
        <Tag handleClick={this.OnAdded} tagName="+" tagType="TagCreator" />
      </div>
    );
  }
});