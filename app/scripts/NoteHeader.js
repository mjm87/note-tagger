import React from 'react';
import $ from 'jquery';

import '../css/base.css';

module.exports = React.createClass({

  getInitialState() {
    return {renaming:false};
  },
  handleTextChanged: function() {

  },
  renameTitle() {
    this.setState({renaming:true});
  },
  saveTitle() {
    this.setState({renaming: false});
  },
  render: function() {

    if(this.state.renaming) {
        return(
            <div className="EditableCommentHeader">
                <input placeholder={this.props.title} onChange={this.handleTextChanged} autoFocus />
            </div>
        );
    }
    else {
        return (
        <div className="CommentHeader">
            <h3 onClick={this.renameTitle}>{this.props.title}</h3>
        </div>
        );
    } 
  }
});