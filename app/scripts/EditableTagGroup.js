import React from 'react';
import $ from 'jquery';

import '../css/base.css';
import EditableTag from './EditableTag.js';
import TagCreator from './TagCreator.js';

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
        <EditableTag tagName={tag.name} handleClick={OnRemove}/> 
      );
    });

    return (
      <div className="EditableTagGroup">
        {tagList}
        <TagCreator handleClick={this.OnAdded}/>
      </div>
    );
  }
});