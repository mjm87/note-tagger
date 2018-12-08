import React from 'react';

module.exports = React.createClass({

    getInitialState: function() {
        return {expanded: false, text: ""};        
    },
    expand: function() {
        this.setState({expanded: true});
    },
    handleTextChanged: function(e) {
        this.setState({text: e.target.value});
        console.log("Changed to " + this.state.text);
    },
    addTag: function() {
        console.log("Trying to add " + this.state.text + " to the note");
        this.props.handleClick(this.state.text);
        this.setState({expanded: false});
        this.setState({text: ""});
    },
    render: function() {
        if(this.state.expanded){
            return (
                <span>
                    <input type="input" onChange={this.handleTextChanged} className="TagCreatorTextField"/>
                    <button type="button" onClick={this.addTag} className="TagCreator" > + </button>
                </span>
            );
        } else {
            return (
                <button type="button" onClick={this.expand} className="TagCreator" > + </button>
            );
        };
    }
});