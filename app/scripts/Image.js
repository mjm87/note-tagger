import React from 'react';
import $ from 'jquery';

module.exports = React.createClass({
    render: function () {
        if(this.props.image) return ( <img src={this.props.image} />);
        else return <div/>
    }
});