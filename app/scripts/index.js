import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

// Import Custom Component
import NoteApp from './NoteApp.js';
import TestComponent from './TestComponent.js';

import '../css/base.css';

ReactDOM.render((
        <Router history = {browserHistory}>
            <Route path="/" component={TestComponent}/>
        </Router>
    ), document.getElementById('content')
);