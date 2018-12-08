import React from 'react';

module.exports = React.createClass({
  OnClick : function() {
    return this.props.handleClick(this.props.tagName);
  },
  render: function() {
    return (
      <button type="button" onClick={this.OnClick} className="editableTag" >  
          {this.props.tagName}
      </button>
    );
  }
});