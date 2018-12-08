import React from 'react';

module.exports = React.createClass({
  OnClick : function() {
    return this.props.handleClick(this.props.tagName);
  },
  render: function() {
    return (
      <button type="button" onClick={this.OnClick} className={this.props.tagType} >  
          {this.props.tagName}
      </button>
    );
  }
});