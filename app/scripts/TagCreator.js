import React from 'react';

module.exports = React.createClass({

    getInitialState: function () {
        return { expanded: false, text: "" };
    },
    expand: function () {
        this.setState({ expanded: true });
    },
    handleTextChanged: function (e) {
        this.setState({ text: e.target.value });
    },
    submitText: function (e) {
        if (e.key === 'Enter') {
            this.addTag();
        }
    },
    addTag: function () {
        this.props.handleClick(this.state.text);
        this.setState({ expanded: false });
        this.setState({ text: "" });
    },
    render: function () {
        if (this.state.expanded) {
            return (
                <span>
                    <input type="input" autoFocus onChange={this.handleTextChanged} onKeyPress={this.submitText} className="TagCreatorTextField" />
                    <button type="button" onClick={this.addTag} className="TagCreator" > + </button>
                </span>
            );
        } else {
            return (
                <button type="button" onClick={this.expand} className="TagCreator" > + </button>
            );
        };

        //TODO: use ESC to close out tag-entry
        // or an auto-disappear
    }
});