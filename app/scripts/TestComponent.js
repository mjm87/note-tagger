import React from 'react';
import $ from 'jquery';

import '../css/base.css';

import EditableTag from './EditableTag.js';
import EditableTagGroup from './EditableTagGroup.js';

module.exports = React.createClass({

    handleClick : function () {
        Console.log("Hello");
    },

  render: function() {

    var list = [{name:"tag1"}, {name:"tag3"}];

    return (
        <EditableTagGroup data={list} noteID="5"/>
    );
      }
});