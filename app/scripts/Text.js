import React from 'react';
import $ from 'jquery';

let LEFT = 37;
let UP = 38;
let RIGHT = 39;
let DOWN = 40;

module.exports = React.createClass({
  getInitialState: function () {
    return { text: "" };
  },
  componentDidMount: function () {
    this.setState({ text: this.props.text });
  },
  componentDidUpdate: function (oldProps, oldState) {
    if (this.props.content !== oldProps.content) {
      this.setState({ text: this.props.content });
    }
    if (this.props.index === this.props.currentIndex) {
      // focus on this elemetn
      this.refs.textInput.focus();

    /*
      // properly position the cursor at the beginning
      // if we're going "down" the chain
      if (this.oldProps.currentIndex < this.props.index) {
        this.refs.textInput.selectionStart = 0;
        this.refs.textInput.selectionEnd = 0;
      }
      // otherwise position it at the bottom of the new textbox
      // if we're going up the chain
      else {
        let endPt = this.state.text.length;
        this.refs.textInput.selectionStart = endPt;
        this.refs.textInput.selectionEnd = endPt;
      }
    */
    }
  },
  startEditing: function () {
    this.props.select()
  },
  finishEditing: function () {
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
        this.props.enableNextSection(this.props.index);
        this.finishEditing();
        this.saveAnyChanges();
      }

      // jump to the preceding section
      else if (cursor === 0 && movingBackwards) {
        this.props.enablePrevSection(this.props.index);
        this.finishEditing();
        this.saveAnyChanges();
      }

      // making sure the ContentList component knows which text item is being edited
      else {
        this.props.select(this.props.index);
      }
    }
  },
  render: function () {
    return (
      <textarea
        type="input"
        ref="textInput"
        value={this.state.text}
        onChange={this.onChanged}
        onBlur={this.finishEditing}
        onMouseLeave={this.finishEditing}
        onKeyDown={this.onKeyPressed}
        className="EditedTextField" />
    );
  }
});