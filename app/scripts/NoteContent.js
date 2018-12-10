import React from 'react';
import $ from 'jquery';

// TODO: add other imports here
import '../css/base.css';

module.exports = React.createClass({

  handleTextChanged: function() {

  },
  render: function() {
    return (
      <div className="CommentContent">
        <textarea
          type="input" 
          defaultValue={this.props.content} 
          autoFocus 
          onChange={this.handleTextChanged} 
          className="CommentContentTextField"/>
      </div>
    );
  }
});


// TODO: add state and AJAX pulls?
//TODO: consider not autofocusing in some cases