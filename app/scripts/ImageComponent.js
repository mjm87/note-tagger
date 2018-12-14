import React from 'react';
import $ from 'jquery';

module.exports = React.createClass({

    getInitialState: function () {
        return ({ image: null });
    },
    componentDidMount: function () {
        this.StartListeningForPasteEvents();
    },
    render: function () {
        if (this.state.image !== null) return <img src={this.state.image} />
        else return <div />
    },

    /**
     * This handler retrieves the images from the clipboard as a blob and returns it in a callback.
     * NOTE: beyond some basic tweaks to make retrieveImageFromClipboardAsBase64() and StartListeningForPasteEvents() work in
     *       a React component, the majority of the actual image retrieval is heavily based off of the article referenced below
     * @see http://ourcodeworld.com/articles/read/491/how-to-retrieve-images-from-the-clipboard-with-javascript-in-the-browser
     */
    retrieveImageFromClipboardAsBase64: function (pasteEvent, callback, imageFormat) {
        if (pasteEvent.clipboardData == false) {
            if (typeof (callback) == "function") {
                callback(undefined);
            }
        };

        var items = pasteEvent.clipboardData.items;

        if (items == undefined) {
            if (typeof (callback) == "function") {
                callback(undefined);
            }
        };

        for (var i = 0; i < items.length; i++) {
            // Skip content if not image
            if (items[i].type.indexOf("image") == -1) continue;
            // Retrieve image on clipboard as blob
            var blob = items[i].getAsFile();

            // Create an abstract canvas and get context
            var mycanvas = document.createElement("canvas");
            var ctx = mycanvas.getContext('2d');

            // Create an image
            var img = new Image();

            // Once the image loads, render the img on the canvas
            img.onload = function () {
                // Update dimensions of the canvas with the dimensions of the image
                mycanvas.width = this.width;
                mycanvas.height = this.height;

                // Draw the image
                ctx.drawImage(img, 0, 0);

                // Execute callback with the base64 URI of the image
                if (typeof (callback) == "function") {
                    callback(mycanvas.toDataURL(
                        (imageFormat || "image/png")
                    ));
                }
            };

            // Crossbrowser support for URL
            var URLObj = window.URL || window.webkitURL;

            // Creates a DOMString containing a URL representing the object given in the parameter
            // namely the original Blob
            img.src = URLObj.createObjectURL(blob);
        }
    },

    StartListeningForPasteEvents: function () {
        window.addEventListener("paste", function (e) {

            // Handle the event
            this.retrieveImageFromClipboardAsBase64(e, function (imageDataBase64) {
                // If there's an image, open it in the browser as a new window :)
                if (imageDataBase64) {
                    console.log("we got the image! " + JSON.stringify(imageDataBase64));
                    // data:image/png;base64,iVBORw0KGgoAAAAN......
                    this.setState({ image: imageDataBase64 });

                }
            }.bind(this));
        }.bind(this), false);
    }
});