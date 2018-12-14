import React from 'react';
import $ from 'jquery';

import '../css/base.css';

module.exports = React.createClass({

  getInitialState: function() {
    return { renaming: false, text: "" };
  },
  componentDidMount: function(){
    this.setState({text: this.props.title});
  },
  handleTextChanged: function (e) {
    this.setState({ text: e.target.value });
  },
  onKeyPressed: function(e) {
    // save the title on a TAB or an ENTER
    if(e.keyCode === 9 || e.keyCode === 13) {
      this.saveTitle();
    }
  },
  renameTitle() {
    this.setState({ 
      text: "",
      renaming: true 
    });
  },
  saveTitle() {
    var title = this.state.text;
    if(title === "") title = "Untitled";
    this.setState({ 
      text: title,
      renaming: false 
    }, () => { 
      this.props.update(this.state.text); 
    });
  },
  render: function () {
    if (this.state.renaming) {
      return (
        <div className="EditableCommentHeader">
          <input value={this.state.text} onChange={this.handleTextChanged} onKeyDown={this.onKeyPressed} onBlur={this.saveTitle} autoFocus />
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