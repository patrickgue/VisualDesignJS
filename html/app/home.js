(function (api) {
    
    const $ = require("jquery");

    $(function () {
        $("#home-overlay-btn").click(api.openHomeOverlay);

        $("#close-home-overlay-btn").click(api.closeHomeOverlay);

        $("#create-document").click(function () { 
            api.documentCollection.createDocument("untitled " + api.documentCollection.size());
            api.loadDocument();
            api.closeHomeOverlay();
        });
    });

    api.openHomeOverlay = function () {
        $("#home-overlay").show();
        $("#home-overlay-btn, #undo-btn, #open-add-btn, #open-color-btn, #open-typeface-btn, #create-pdf").hide();
    
        for(let card of $(".cards").get()) {
            $(card).css("width", (card.children.length * 225) + "px");
        }
    }

    api.closeHomeOverlay = function () {
        $("#home-overlay").hide();
        $("#home-overlay-btn, #undo-btn, #open-add-btn, #open-color-btn, #open-typeface-btn, #create-pdf").show();
    }
})(VDAPI);
