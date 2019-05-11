const pdfjs = require("pdfjs");
const remote = require('electron').remote; 
const $ = require("jquery");

$(function () {
    $("#max-btn").click(function() {
        const window = remote.getCurrentWindow();
        if (!window.isMaximized()) {
            window.maximize();
        } else {
            window.unmaximize();
        }
    })

    $("#min-btn").click(function() {
        const window = remote.getCurrentWindow();
        window.minimize();
    });

    $("#clo-btn").click(function() {
        const window = remote.getCurrentWindow();
        window.close();
    });
});
