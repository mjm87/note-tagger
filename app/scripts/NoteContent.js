import React from 'react';
import $ from 'jquery';

import '../css/base.css';

module.exports = React.createClass({

  getInitialState: function () {
    return { text: "" };
  },
  componentDidMount: function () {
    this.setState({ text: this.props.content });
  },
  componentDidUpdate: function (oldProps, oldState) {
    if (this.props.content !== oldProps.content) {
      this.setState({ text: this.props.content });
    }
  },
  saveContent: function () {
    this.props.update(this.state.text);
  },
  handleTextChanged: function (e) {
    this.setState({ text: e.target.value });
  },
  render: function () {
    return (
      <div className="CommentContent">
        <textarea
          type="input"
          value={this.state.text}
          autoFocus
          onChange={this.handleTextChanged}
          onBlur={this.saveContent}
          className="CommentContentTextField" />
      </div>
    );
  }
});