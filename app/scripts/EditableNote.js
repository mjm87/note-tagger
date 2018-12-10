import React from 'react';
import $ from 'jquery';

import '../css/base.css';

import EditableTagGroup from './EditableTagGroup.js';
import NoteHeader from './NoteHeader.js';
import NoteContent from './NoteContent.js';

module.exports = React.createClass({

  getInitialState() {
    return {
      id:null, 
      title:"Untitled", 
      content:""
    };
  },
  onMountedComponent: function() {
    $.ajax({
      url: "/notes/" + this.props.noteID,
      type: 'GET',
      dataType:'json'
    })
    .done(function(results){ 
      console.log("worked: " + results.name + results.contents);
    }.bind(this))
    .fail(function(xhr, status, error){
      console.log("failed");
    }.bind(this));
  },
  updateTitle: function(title) {
    this.setState({title:title});
  },
  updateContent: function(content) {
    this.setState({content:content});
  },
  save: function() {

  },
  render: function() {
    return (
        <div>
            <NoteHeader noteID="5" title="Untitled" update={this.updateTitle}/>
            <NoteContent noteID="5" content="Salut monde" update={this.updateContent}/>
            <EditableTagGroup noteID="5"/>
        </div>
    );
  }
});