import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import NoteApp from './NoteApp.js';
import AboutPage from './AboutPage.js';
import '../css/base.css';

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={NoteApp} />
        <Route path="/About" component={AboutPage} />
        <Route path='/repo' component={() => window.open('https://github.com/mjm87/note-tagger')}/>
    </Router>
), document.getElementById('content'));
