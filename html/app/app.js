const remote = require('electron').remote;
const $ = require("jquery");

$(function() {
    let docu = new E(document.getElementById("document"), testDoc);
    let selFont;
    hideMenus();
    loadFontList();

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
        hideMenus();

        $("#pos-settings").show();
        $("#general-settings").show();
        $("#edit-x-inp").val(elm.pos.x);
        $("#edit-y-inp").val(elm.pos.y);
        $("#edit-w-inp").val(elm.pos.width);
        $("#edit-h-inp").val(elm.pos.height);
        if (elm.type == E.type.text) {
            $("#text-settings").show();
            let font = docu.document.fonts[elm.font];
            $("#edit-text-inp").val(elm.text);
            $("#edit-font-inp").val(elm.font);
        }
    });

    docu.addPageScrollEvent(function(nr, allNr) {
        $("#page-nr").html("Page " + (nr + 1) + " of " + allNr);
    });

    docu.addUnselectEvent(function() {
        $("#text-settings").hide();
        $("#pos-settings").hide();
        $("#general-settings").hide();
    });

    $("#edit-x-inp, #edit-y-inp, #edit-w-inp, #edit-h-inp").on("change", function() {
        docu.selectElm.pos.x = parseInt($("#edit-x-inp").val());
        docu.selectElm.pos.y = parseInt($("#edit-y-inp").val());
        docu.selectElm.pos.width = parseInt($("#edit-w-inp").val());
        docu.selectElm.pos.height = parseInt($("#edit-h-inp").val());
        
        docu.render();
    });

    $("#edit-text-inp, #edit-font-inp").on("change", function() {
        docu.selectElm.text = $("#edit-text-inp").val();
        docu.selectElm.font = $("#edit-font-inp").val();
        docu.render();
    });

    $("#edit-up-btn").click(function() {
        docu.selectElmMoveUp();
    });

    $("#edit-dwn-btn").click(function() {
        docu.selectElmMoveDown();
    });

    $("#create-pdf").click(function() {
        C(docu.document);
    });

    $("#open-add-btn").click(function() {
        $("#add-win").toggle();
    });

    $("#close-add-btn, #add-text-btn, #add-rect-btn").click(function() {
        $("#add-win").hide();
    });

    $("#open-pref-btn").click(function() {
        $("#pref-win").show();
    });

    $("#close-pref-btn").click(function() {
        $("#pref-win").hide();
    });

    $("#open-typeface-btn").click(function() {
        $("#typeface-sel").show();
        $("#typeface-sel-edit").hide();
        loadFontList();
    });

    $("#close-typeface-btn").click(function() {
        $("#typeface-sel").hide();
    });

    $("#add-font-btn").click(function() {
        newFont();
        $("#typeface-sel-edit").show();
    });

    $("#save-typeface-btn").click(function() {
        saveLoadFont();
        loadFontList();
        $("#typeface-sel-edit").hide();
        docu.render();
    });

    $("#add-text-btn").click(function() {
        docu.addElement(E.type.text);
        docu.render();
    });

    $("#add-rect-btn").click(function() {
        docu.addElement(E.type.rect);
        docu.render();
    });

    function hideMenus() {
        $("#pos-settings").hide();
        $("#text-settings").hide();
        $("#add-win").hide();
        $("#pref-win").hide();
        $("#general-settings").hide();
        $("#type-settings").hide();
        $("#fill-settings").hide();
        $("#typeface-sel").hide();
    }

    function loadFontList() {
        $("#font-list").html("");
        let listHTML = "";
        let menuHTML = "";
        for(let font in docu.document.fonts) {
            listHTML += "<div>" + 
            "<button class=\"delete-font btn cancel\" data-id=\""+font+"\"></button>"+
            "<button class=\"load-font btn cog\" data-id=\""+font+"\"></button> "+font+
            "</div>";
            menuHTML += "<option value=\""+font+"\">"+font+"</option>";
        }
        $("#font-list").html(listHTML);
        $("#edit-font-inp").html(menuHTML);
        $(".load-font").click(function() {
            loadFont($(this).attr("data-id"));
            $("#typeface-sel-edit").show();
        });
        $(".delete-font").click(function() {
            deleteFont($(this).attr("data-id"));
            $("#typeface-sel-edit").hide();
            loadFontList();
            docu.render();
        });
    }

    function loadFont(id) {
        selFont = docu.document.fonts[id];
        $("#edit-title").val(id);
        $("#edit-typeface").val(selFont.typeface);
        $("#edit-size").val(selFont.size);
        $("#edit-weight").val(selFont.weight);
        $("#edit-type").val(selFont.type);
    }

    function saveLoadFont() {
        selFont = docu.document.fonts[$("#edit-title").val()] = {};
        selFont.typeface = $("#edit-typeface").val();
        selFont.size = $("#edit-size").val();
        selFont.weight = $("#edit-weight").val();
        selFont.type = $("#edit-type").val();
    }

    function newFont() {
        $("#edit-title").val("untitled");
        $("#edit-typeface").val("Helvetica");
        $("#edit-size").val(12);
        $("#edit-weight").val("normal");
        $("#edit-type").val("normal");
    }

    function deleteFont(id) {
        delete docu.document.fonts[id];
        let newFont = Object.keys(docu.document.fonts)[0];

        for(let master of docu.document.master) {
            for(let element of master.elements) {
                if(element.type == E.type.text && element.font == id) {
                    element.font = newFont;
                }
            }
        }

        for(let page of docu.document.pages) {
            for(let element of page.elements) {
                if(element.type == E.type.text && element.font == id) {                
                    element.font = newFont;
                }
            }
        }
    }
});