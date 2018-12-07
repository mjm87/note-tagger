import React from 'react';
import '../css/base.css';

// styling
var tagCreatorStyle = {
  background: 'aliceblue',
  display: 'inline-block',
  border: '1px solid black',
  padding: '3px'  
};

module.exports = React.createClass({

    AddTag: function() {
        return this.props.handleClick("Fake");
    },
    render: function() {
        return (
            <button className="TagCreator" onClick={this.AddTag} style={tagCreatorStyle}>
                +
            </button>
        );
    }
});