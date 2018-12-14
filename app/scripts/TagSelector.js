import React from 'react';
import $ from 'jquery';

import Tag from './Tag.js';
import '../css/base.css';

module.exports = React.createClass({

  render: function () {

    var selectableTags = this.props.tags.map(function (tag) {
      if (tag.name !== "untagged") {
        if (this.props.isSelected(tag.name)) {
          return (
            <Tag handleClick={this.props.handleClick} tagName={tag.name} tagType="SelectedTag" />
          );
        } else {
          return (
            <Tag handleClick={this.props.handleClick} tagName={tag.name} tagType="SelectableTag" />
          );
        }
      }
    }.bind(this));
    return (
      <div className="TagSelector">
        {selectableTags}
      </div>
    );
  }
});