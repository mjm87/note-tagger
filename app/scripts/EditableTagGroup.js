import React from 'react';
import $ from 'jquery';

// TODO: add other imports here
import '../css/base.css';
import EditableTag from './EditableTag.js';
import TagCreator from './TagCreator.js';

module.exports = React.createClass({

  addTag : function() {

  },
  removeTag : function (){

  },
  render: function() {

    var handleRemoval = this.removeTag;       // TODO: figure out what React-y nonsense is going on?
    var tagList = this.props.data.map(function(tag){
      return (
        <EditableTag tagName={tag.name} handleClick={handleRemoval}/> 
      );
    });

    return (
      <div className="EditableTagGroup">
        {tagList}
        <TagCreator/>
      </div>
    );
  }
});