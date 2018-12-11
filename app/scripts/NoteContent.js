import React from 'react';
import $ from 'jquery';

// TODO: add other imports here
import '../css/base.css';

module.exports = React.createClass({

  getInitialState: function() {
    return {text: ""};
  },
  componentDidMount: function() {
    this.setState({text: this.props.content});
  },
  saveContent: function() {
    this.props.update(this.state.text);  
    console.log("on blur ");
  },
  handleTextChanged: function(e) {
    this.setState({text: e.target.value});
  },
  render: function() {
    console.log(this.props.content);
    return (
      <div className="CommentContent">
        <textarea
          type="input" 
          defaultValue={this.props.content} 
          autoFocus 
          onChange={this.handleTextChanged} 
          onBlur={this.saveContent}
          className="CommentContentTextField"/>
      </div>
    );
  }
});


//TODO: consider not autofocusing in some cases