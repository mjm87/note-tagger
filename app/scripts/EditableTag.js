import React from 'react';

var editableTagStyle = {
  background: 'aliceblue',
  display: 'inline-block',
  border: '1px solid black',
  padding: '3px'  
}

module.exports = React.createClass({
  render: function() {
    return (
      <button type="button" onClick={this.props.handleClick} className="editableTag" style={editableTagStyle} >  
          {this.props.tagName}
      </button>
    );
  }
});