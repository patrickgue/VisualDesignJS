let VDAPI = {};

(function (api) {
    const $ = require("jquery");
    const remote = require('electron').remote;

    $(function() {

        /*
            General API implementation
        */
        api.loadDocument = function() {
            api.editDocument();
            api.renderTabs(api.documentCollection.getSelectedDocument().title);
        }

        api.hideMenus = function() {
            $("#pos-settings").hide();
            $("#text-settings").hide();
            $("#fill-stroke-settings").hide();
            $("#add-win").hide();
            $("#general-settings").hide();
            $("#type-settings").hide();
            $("#fill-settings").hide();
            $(".sheet").hide();
            $(".overlay").hide();
        }

        api.renderTabs = function (activeTitle) {
            let tabsHTML = "";
            for(let documentTitle of api.documentCollection.getDocumentTitles()) {
                tabsHTML += "<div data-document=\"" + documentTitle + "\" class=\"tab "+(documentTitle == activeTitle ? "active" : "")+"\"><span class=\"close\"></span> " + documentTitle + " </div>";
            }
            $(".tabs").html(tabsHTML + "<div class=\"add\"></div>");

            $(".tab").click(function () {
                api.documentCollection.selectDocument($(this).attr("data-document"));
                api.loadDocument();
            });

            $(".tabs .add").click(function() {
                api.documentCollection.createDocument("untitled " + api.documentCollection.size());
                api.loadDocument();
            });
        };


        /*
            General UI functionality
        */
        if (remote.process.platform !== "darwin") {
            $("body").addClass("no-darwin");
        }

        remote.getCurrentWindow().on("blur", function () {
            $("body").addClass("blurred");
        });

        remote.getCurrentWindow().on("focus", function () {
            $("body").removeClass("blurred");
        });

        $("#max-btn").click(function () {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
                window.maximize();
            } else {
                window.unmaximize();
            }
        })

        $("#min-btn").click(function () {
            const window = remote.getCurrentWindow();
            window.minimize();
        });

        $("#clo-btn").click(function () {
            const window = remote.getCurrentWindow();
            window.close();
        });

        $("#open-pref-btn").click(function () {
            $("#pref-win").toggle();
        });

        $("#close-pref-btn").click(function () {
            $("#pref-win").hide();
        });

        $("#theme-switch").on("change", function () {
            if ($(this).is(":checked")) {
                $("body").addClass("flat");
            }
            else {
                $("body").removeClass("flat");
            }
        });

        //init TODO: restructure to use proper initialisation
        api.documentCollection = new DocumentCollection();
        api.hideMenus();
        api.renderTabs();
        api.openHomeOverlay();

    });
})(VDAPI);
