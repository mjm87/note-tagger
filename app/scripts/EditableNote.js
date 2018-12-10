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
            <NoteHeader noteID="5" title="Untitled" update={updateTitle}/>
            <NoteContent noteID="5" content="Salut monde" update={updateContent}/>
            <EditableTagGroup noteID="5"/>
        </div>
    );
  }
});