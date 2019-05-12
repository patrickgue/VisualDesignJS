const remote = require('electron').remote;
const $ = require("jquery");

$(function() {
    let docu = new E(document.getElementById("document"), testDoc);

    $("#pos-settings").hide();
    $("#text-settings").hide();

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

    $("#undo-btn").click(docu.undo);

    docu.addSelectionEvent(function(elm) {
        $("#text-settings").hide();
        $("#pos-settings").hide();

        $("#pos-settings").show();
        $("#edit-x-inp").val(elm.pos.x);
        $("#edit-y-inp").val(elm.pos.y);
        $("#edit-w-inp").val(elm.pos.width);
        $("#edit-h-inp").val(elm.pos.height);
        if (elm.type == E.type.text) {
            $("#text-settings").show();
            $("#edit-text-inp").val(elm.text);
        }
    });

    docu.addPageScrollEvent(function(nr, allNr) {
        $("#page-nr").html("Page " + (nr + 1) + " of " + allNr);
    });

    docu.addUnselectEvent(function() {
        $("#text-settings").hide();
        $("#pos-settings").hide();
    });

    $("#edit-x-inp, #edit-y-inp, #edit-w-inp, #edit-h-inp").on("change", function() {
        docu.selectElm.pos.x = parseInt($("#edit-x-inp").val());
        docu.selectElm.pos.y = parseInt($("#edit-y-inp").val());
        docu.selectElm.pos.width = parseInt($("#edit-w-inp").val());
        docu.selectElm.pos.height = parseInt($("#edit-h-inp").val());
        docu.render();
    });

    $("#edit-text-inp").on("change", function() {
        docu.selectElm.text = $("#edit-text-inp").val();
        docu.render();
    });



});