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
      console.log("works: " + results);
    }).fail(function(xhr,error,msg) {
      console.log(xhr);
      console.log(error);
      console.log(msg);
    })

  },
  OnRemove: function (tagName){
    $.ajax({
      url: "/" + tagName + "/" + this.props.noteID,
      type : 'DELETE'
    }).done(function(results) {
      console.log("works: " + results);
    }).fail(function(xhr,error,msg) {
      console.log("failed");
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