import React from 'react';
import $ from 'jquery';

import Tag from './Tag.js';
import '../css/base.css';

module.exports = React.createClass({

  getInitialState: function() {
    return ({tags:[]});
  },
  componentDidMount: function() {
    $.ajax({
      url: "/tags",
      type: 'GET',
      dataType: 'json'
    })
      .done(function (results) {
        this.setState({ tags: results });
      }.bind(this))
      .fail(function (xhr, status, error) {
        console.log("Couldn't find any tags");
      }.bind(this));
  },
  Select: function(tag) {
    console.log('selected ' + tag);
  },
  render: function() {
    var selectableTags = this.state.tags.map(function(tag) {
      return (
        <Tag handleClick={this.Select} tagName={tag.name} tagType="SelectableTag" />
      )
    }.bind(this));
    return (
      <div className="TODO:">
        {selectableTags}
      </div>
    );
  }
});