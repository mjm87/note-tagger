import React from 'react';
import $ from 'jquery';

import '../css/base.css';

import EditableNote from './EditableNote.js';

module.exports = React.createClass({

  render: function() {
    return (
        <EditableNote noteID="5"/>
    );
  }
});

// <EditableTagGroup noteID="5"/>