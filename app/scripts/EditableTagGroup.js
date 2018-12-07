import React from 'react';
import $ from 'jquery';

// TODO: add other imports here
import '../css/base.css';
import EditableTag from './EditableTag.js';

module.exports = React.createClass({

  removeTag : function (){
    Console.Log("TODO:");
  },
  render: function() {

    var handleRemoval = this.removeTag;
    var tagList = this.props.data.map(function(tag){
      return (
       <EditableTag tagName={tag.name} handleClick={handleRemoval}/> 
      );
    });

    return (
      <div className="EditableTagGroup">
        {tagList}
      </div>
    );
  }
});