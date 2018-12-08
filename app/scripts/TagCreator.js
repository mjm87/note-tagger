import React from 'react';
import '../css/base.css';

module.exports = React.createClass({

    AddTag: function() {
        return this.props.handleClick("Fake");
    },
    render: function() {
        return (
            <button className="TagCreator" onClick={this.AddTag}>
                +
            </button>
        );
    }
});