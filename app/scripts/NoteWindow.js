import React from 'react';
import $ from 'jquery';

import '../css/base.css';

module.exports = React.createClass({

    //TODO: lot and lots of stuff...
    getInitialState() {
        return { noteID: -1 };
    },
    addNewNote: function () {
        var newNote = {
            name: this.state.title,
            content: this.state.content
        }
        $.ajax({
            url: "/notes",
            type: 'PUT',
            data: newNote,
            dataType: 'json'
        })
            .done(function (results) {
                console.log("saved: " + results);
                this.setState({ noteID: results })
            }.bind(this))
            .fail(function (xhr, status, error) {
                console.log("failed to create new note");
            }.bind(this));
    },
    deleteNote: function () {
        $.ajax({
            url: "/notes",
            type: 'DELETE',
            data: { id: this.props.noteID },
            dataType: 'json'
        })
            .done(function (results) {
                console.log("deleted note");
            }.bind(this))
            .fail(function (xhr, status, error) {
                console.log("failed to delete note");
            }.bind(this));
    },
    render: function () {
        return (
            <div className="NotesTab">
                <button type="button" onClick={this.addNewNote}>Add New Note</button>
                <button type="button" onClick={this.deleteNote}>Delete Note</button>
            </div>
        );
    }
});

