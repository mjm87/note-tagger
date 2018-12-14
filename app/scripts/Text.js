import React from 'react';
import $ from 'jquery';

let LEFT = 37;
let UP = 38;
let RIGHT = 39;
let DOWN = 40;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      isBeingEdited: false,
      text: ""
    };
  },
  componentDidMount: function () {
    this.setState({
      text: this.props.text,
      isBeingEdited: false
    });
  },
  componentDidUpdate: function (oldProps, oldState) {
    if (this.props.content !== oldProps.content) {
      this.setState({ text: this.props.content });
    }
  },
  startEditing: function () {
    this.setState({ isBeingEdited: true });
    this.props.select()
  },
  finishEditing: function () {
    this.setState({ isBeingEdited: false });
  },
  saveAnyChanges: function () {
    //TODO: save changes by uploading to the database?
    // or perhaps just call a function on the aggregate content viewer to manage that for us
  },
  onChanged: function (e) {
    this.setState({ text: e.target.value });
  },
  onKeyPressed: function (e) {
    let pressedKey = e.keyCode;
    let arrowKeys = [LEFT, RIGHT, UP, DOWN];
    if (arrowKeys.includes(pressedKey)) {

      var cursor;
      let endOfText = this.state.text.length;
      let movingBackwards = [LEFT, UP].includes(pressedKey);
      let movingForwards = [RIGHT, DOWN].includes(pressedKey);
      let somethingSelected = e.target.selectionStart < e.target.selectionEnd;

      // use the beginning of the selected scope if we're moving backwards
      if (somethingSelected && movingBackwards) {
        cursor = e.target.selectionStart;
      }
      // or the end if we're moving downwards or rightwards
      else if (somethingSelected && movingForwards) {
        cursor = e.target.selectionEnd;
      } else {
        // otherwise they're both the same, and the cursor position can be set to either
        cursor = e.target.selectionStart;
      }

      // jump to the next text section
      if (cursor === endOfText && movingForwards) {
        this.props.gotoNextSection();
        this.finishEditing();
        this.saveAnyChanges();
      }

      // jump to the preceding section
      else if (cursor === 0 && movingBackwards) {
        this.props.gotoLastSection();
        this.finishEditing();
        this.saveAnyChanges();
      }

    }
  },
  render: function () {
    if (!this.state.isBeingEdited)
      return <div onMouseEnter={this.startEditing}>{this.props.text}</div>;
    else {
      return (
        <textarea
          type="input"
          value={this.state.text}
          autoFocus
          onChange={this.onChanged}
          onBlur={this.finishEditing}
          onMouseLeave={this.finishEditing}
          onKeyDown={this.onKeyPressed}
          className="EditedTextField" />
      );
    }
  }
});