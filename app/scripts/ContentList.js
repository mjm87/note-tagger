import React from 'react';
import $ from 'jquery';

import Image from "./Image.js";
import Text from "./Text.js";

module.exports = React.createClass({
  // react-y functions
  getInitialState: function () {
    return ({ index: 0, content: [], status: 0 });
  },
  componentDidMount: function () {
    this.setState({
      content: this.props.content,
      status: this.props.status
    });
  },
  componentDidUpdate: function (oldProps, oldState) {
    if (this.props.status !== oldProps.status) {
      this.setState({
        content: this.props.content,
        status: this.props.status
      });
    }
  },

  enablePrevSection: function (idx) {
    if (idx - 1 >= 0) {
      if (this.state.content[idx - 1].type === "text") {
        this.setState({ index: idx - 1 });
      } else {
        this.enablePrevSection(idx - 1);
      }
    }
  },
  enableNextSection: function (idx) {
    if (idx + 1 < this.state.content.length) {
      if (this.state.content[idx + 1].type === "text") {
        this.setState({ index: idx + 1 });
      } else {
        this.enableNextSection(idx + 1);
      }
    }
  },
  select: function (idx) {
    this.setState({ index: idx });
  },

  // render helper functions
  renderList: function (content) {
    var idx = -1;
    return content.map(function (item) {
      idx++;
      if (item.type === "text") return this.renderTextItem(item, idx);
      else if (item.type === "image") return this.renderImageItem(item, idx);
      else return <div />
    }, this);
  },
  renderTextItem: function (item, idx) {
    return (
      <Text text={item.data}
        index={idx}
        id={"content_" + this.props.noteID + "_" + idx}
        currentIndex={this.state.index}
        select={this.select}
        enablePrevSection={this.enablePrevSection}
        enableNextSection={this.enableNextSection}
      />
    );
  },
  renderImageItem: function (item, idx) {
    return (
      <Image image={item.data} />
    );
  },

  render: function () {
    return (
      <div className="ContentList">
        {this.renderList(this.props.content)}
      </div>
    );
  }
});