import React from 'react';
import $ from 'jquery';

import '../css/base.css';

import EditableTagGroup from './EditableTagGroup.js';

module.exports = React.createClass({

    handleClick : function () {
        Console.log("Hello");
    },

  render: function() {

    return (
        <EditableTagGroup noteID="5"/>
    );
      }
});