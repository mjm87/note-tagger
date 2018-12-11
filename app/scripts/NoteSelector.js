import React from 'react';
import $ from 'jquery';

import '../css/base.css';

module.exports = React.createClass({

  getInitialState() {
    return ({ notes: [] ,  mounted: false});
  },
  componentDidMount() {
    for(let t in this.props.tags) {
      let tag = this.props.tags[t];
      this.performNastyAjaxCalls(tag);
    }
    this.setState({ mounted: true})
  },
  componentDidUpdate: function(oldProps, oldState) {
    //checking if we added a tag
    if(this.props.tags.length > oldProps.tags.length) {
      //finding the tag that was added
      for(let t in this.props.tags) {
        let tag = this.props.tags[t];
        if(!oldProps.tags.includes(tag)) {
          performNastyAjaxCalls(tag);
        }
      }
    }
    // checking if we removed a tag
    if(this.props.tags.length < oldProps.tags.length) {
      //finding the tag that was removed
      for(let t in oldProps.tags) {
        let tag = oldProps.tags[t];
        if(!this.props.tags.includes(tag)){
          performNastyAjaxCalls(tag);
        }
      }
    }
  },
  performNastyAjaxCalls: function(tagName) {
    $.ajax({
      url: "/tags/" + tagName + "/notes",
      type: 'GET',
      dataType: 'json'
    })
      .done(function (results) {

        for(let r in results) {
            let note = results[r];

            $.ajax({
              url: "/notes/" + note.id,    //todo: maybe note.id
              type: 'GET',
              dataType: 'json'              
            })
              .done(function(note){
                  //todo: filter based off of note.tags
                  var currentNotes = this.state.notes;
                  currentNotes.push({id:note.id, name:note.name});
                  this.setState({notes: currentNotes});
                  console.log("Added note #" + note.id + " for ");
              }.bind(this))
              .fail(function(xhr, status, error){
                  console.log("failed");
              }.bind(this))
        }

      }.bind(this))
      .fail(function (xhr, status, error) {
        console.log("failed to retrieve notes from selected tag");
      }.bind(this));
  },

  render: function () {
    if(this.state.mounted) {
      var Select = this.props.onSelect;
      var notesList = this.state.notes.map(function(note) {
        var selectThisNote = function(){
          Select(note.id);
        }
        return (
          <li key={note.id}>
          <button onClick={selectThisNote}>{note.name}</button>
          </li>
        );
      });
      return (
        <div className="Note Selector">
          {notesList}
        </div>
      );
    } else {
      return <div/>
    }
  }
});