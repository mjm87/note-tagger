import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

import '../css/base.css';


module.exports = React.createClass({
    render: function () {
        return (
            <div className="AboutPage">

                <h3>About</h3>

                <div>
                    <p>
                        This is a small web application that strips away much of the functionality of bloated and complicated note-taking applications like Notepad++ or OneNote.
                        Just like any note-taking application you can create as many notes as you'd like. (Or at least as many will fit on mlab...)
                        And like most note-taking apps, you can also tag your notes for later reference.
                        And that's pretty much it. But that's also the point. The goal is to force the user to actually tag their notes and by only providing one method to organize your notes,
                        it's to be hoped that it will work.
                    </p>
                </div>

                <div>
                    <h3>Contributors</h3>

                    <li>Michel Momeyer</li>
                    <li>Alastair Van Maren</li>
                </div>


                <div>
                    <p> If you're interested in seeing how we did it, check out our github repo <Link to={'/repo'}> here </Link>. </p>
                </div>

                <Link to={'/'}>back</Link>
            </div>
        );
    }
});