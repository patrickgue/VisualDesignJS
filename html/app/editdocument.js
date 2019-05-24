(function (api) {
    api.editDocument = function () {
        const $ = require("jquery");

        $(function () {

            // get list with "cat html/app/editdocument.js | cut -d "\"" -f 2 | tr "," "\n" | tr -d " " | grep "#" | sort | uniq | xargs echo | tr " " ",""
            $("#add-circle-btn,#add-color-style-btn,#add-color-style-label,#add-font-btn,#add-line-btn,"+
                "#add-line-style-btn,#add-line-style-label,#add-rect-btn,#add-text-btn,#add-win,#close-add-btn,"+
                "#color-list,#color-sel,#create-pdf,#delete-btn,#edit-dwn-btn,#edit-fill-sel,"+
                "#edit-font-inp,#edit-h-inp,#edit-size,#edit-stroke-sel,#edit-text-inp,#edit-title,#edit-type,"+
                "#edit-typeface,#edit-up-btn,#edit-w-inp,#edit-weight,#edit-x-inp,#edit-y-inp,#fill-stroke-settings,"+
                "#font-list,#general-settings,#line-list,#open-add-btn,#open-color-btn,"+
                "#open-typeface-btn,#page-nr,#pos-settings,#pref-win,#save-typeface-btn,#text-settings,"+
                "#typeface-sel,#typeface-sel-edit,#undo-btn").off("change").off("click");
            let docu = new E(document.getElementById("document"), api.documentCollection.getSelectedDocument());
            let selFont;
            api.hideMenus();
            loadFontList();
            docu.render();



            $("#undo-btn").click(docu.undo);

            docu.addSelectionEvent(function (elm) {
                api.hideMenus();

                $("#pos-settings").show();
                $("#general-settings").show();
                $("#edit-x-inp").val(elm.pos.x);
                $("#edit-y-inp").val(elm.pos.y);
                $("#edit-w-inp").val(elm.pos.width);
                $("#edit-h-inp").val(elm.pos.height);
                $("#fill-stroke-settings").show();
                loadFillStrokeList();
                $("#edit-stroke-sel").show();
                $("#edit-fill-sel").val(elm.fill);
                
                if (elm.type == E.type.text) {
                    $("#text-settings").show();
                    let font = docu.document.fonts[elm.font];
                    $("#edit-text-inp").val(elm.text);
                    $("#edit-font-inp").val(elm.font);
                    $("#edit-stroke-sel").hide();
                    $("#edit-stroke-sel, [for=\"#edit-stroke-sel\"]").hide()
                }
            });

            docu.addPageScrollEvent(function (nr, allNr) {
                $("#page-nr").html("Page " + (nr + 1) + " of " + allNr);
            });

            docu.addUnselectEvent(function () {
                $("#text-settings").hide();
                $("#pos-settings").hide();
                $("#general-settings").hide();
            });

            $("#edit-x-inp, #edit-y-inp, #edit-w-inp, #edit-h-inp").on("change", function () {
                docu.selectElm.pos.x = parseInt($("#edit-x-inp").val());
                docu.selectElm.pos.y = parseInt($("#edit-y-inp").val());
                docu.selectElm.pos.width = parseInt($("#edit-w-inp").val());
                docu.selectElm.pos.height = parseInt($("#edit-h-inp").val());

                docu.render();
            });

            $("#edit-text-inp, #edit-font-inp").on("change", function () {
                docu.selectElm.text = $("#edit-text-inp").val();
                docu.selectElm.font = $("#edit-font-inp").val();
                docu.render();
            });

            $("#edit-fill-sel").on("change", function () {
                docu.selectElm.fill = $(this).val();
                docu.render();
            });

            $("#edit-stroke-sel").on("change", function () {
                docu.selectElm.stroke = $(this).val();
                docu.render();
            });

            $("#edit-up-btn").click(function () {
                docu.selectElmMoveUp();
            });

            $("#edit-dwn-btn").click(function () {
                docu.selectElmMoveDown();
            });

            $("#create-pdf").click(function () {
                C(docu.document);
            });

            $("#open-add-btn").click(function () {
                $("#add-win").toggle();
            });

            $("#close-add-btn, #add-text-btn, #add-rect-btn, #add-line-btn").click(function () {
                $("#add-win").hide();
            });

            $("#open-typeface-btn").click(function () {
                $("#typeface-sel").show();
                $("#typeface-sel-edit").hide();
                loadFontList();
            });

            $("#open-color-btn").click(function () {
                $("#color-sel").show();
                loadFillStrokeList();
            });

            $(".close-sheet-btn").click(function () {
                $(".sheet").hide();
            });

            $("#add-font-btn").click(function () {
                newFont();
                $("#typeface-sel-edit").show();
            });

            $("#save-typeface-btn").click(function () {
                saveLoadFont();
                loadFontList();
                $("#typeface-sel-edit").hide();
                docu.render();
            });

            $("#add-text-btn").click(function () {
                docu.addElement(E.type.text);
                docu.render();
            });

            $("#add-rect-btn").click(function () {
                docu.addElement(E.type.rect);
                docu.render();
            });

            $("#add-circle-btn").click(function () {
                docu.addElement(E.type.circle);
                docu.render();
            });

            $("#add-line-btn").click(function () {
                docu.addElement(E.type.line);
                docu.render();
            });

            $("#delete-btn").click(function () {
                docu.deleteSelected();
                docu.render();
            });

            $("#add-color-style-btn").click(function () {
                let label = $("#add-color-style-label").val();
                if (label != "") {
                    docu.document.fills[label] = {
                        "background": "#000000"
                    };
                    loadFillStrokeList();
                }
                else {
                    //TODO: implement error
                }
            });

            $("#add-line-style-btn").click(function () {
                let label = $("#add-line-style-label").val();
                if (label != "") {
                    docu.document.strokes[label] = {
                        "width": 1,
                        "linecap": "butt",
                        "style": "solid",
                        "color": "#000000"
                    };
                    loadFillStrokeList();
                }
                else {
                    //TODO: implement error
                }
            });

            function loadFontList() {
                $("#font-list").html("");
                let listHTML = "";
                let menuHTML = "";
                for (let font in docu.document.fonts) {
                    listHTML += "<div>" +
                        "<button class=\"delete-font borderless btn cancel\" data-id=\"" + font + "\"></button>" +
                        "<button class=\"load-font borderless btn cog\" data-id=\"" + font + "\"></button> " + font +
                        "</div>";
                    menuHTML += "<option value=\"" + font + "\">" + font + "</option>";
                }
                $("#font-list").html(listHTML);
                $("#edit-font-inp").html(menuHTML);
                $(".load-font").click(function () {
                    loadFont($(this).attr("data-id"));
                    $("#typeface-sel-edit").show();
                });
                $(".delete-font").click(function () {
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

                for (let master of docu.document.master) {
                    for (let element of master.elements) {
                        if (element.type == E.type.text && element.font == id) {
                            element.font = newFont;
                        }
                    }
                }

                for (let page of docu.document.pages) {
                    for (let element of page.elements) {
                        if (element.type == E.type.text && element.font == id) {
                            element.font = newFont;
                        }
                    }
                }
            }

            function deleteFill(id) {
                delete docu.document.fills[id];
                let newFill = Object.keys(docu.document.fills)[0];

                for (let master of docu.document.master) {
                    for (let element of master.elements) {
                        if (element.type != E.type.text && element.fill == id) {
                            element.fill = newFill;
                        }
                    }
                }

                for (let page of docu.document.pages) {
                    for (let element of page.elements) {
                        if (element.type != E.type.text && element.fill == id) {
                            element.fill = newFill;
                        }
                    }
                }
            }

            function deleteStroke(id) {
                delete docu.document.strokes[id];
                let newStroke = Object.keys(docu.document.strokes)[0];

                for (let master of docu.document.master) {
                    for (let element of master.elements) {
                        if (element.type != E.type.text && element.stroke == id) {
                            element.stroke = newStroke;
                        }
                    }
                }

                for (let page of docu.document.pages) {
                    for (let element of page.elements) {
                        if (element.type != E.type.text && element.stroke == id) {
                            element.stroke = newStroke;
                        }
                    }
                }
            }

            function loadFillStrokeList() {
                let fillHTML = "", strokeHTML = "";
                let fillSelectHTML = "", strokeSelectHTML = "";
                for (let fillId in docu.document.fills) {
                    let fill = docu.document.fills[fillId];
                    fillHTML += "<div>" +
                        "<button class=\"delete-fill borderless btn cancel\" data-fill=\"" + fillId + "\"></button>" +
                        "<input class=\"fill-item\" data-fill=\"" + fillId + "\" type=\"color\" value=\"" + fill.background + "\" /> " + fillId +
                        "</div>";
                    fillSelectHTML += "<option value=\"" + fillId + "\">" + fillId + "</option>"

                }
                for (let strokeId in docu.document.strokes) {
                    let stroke = docu.document.strokes[strokeId];
                    strokeHTML += "<div>" +
                        "<button class=\"delete-stroke borderless btn cancel\" data-stroke=\"" + strokeId + "\"></button>" +
                        "<input class=\"stroke-width input short\" data-stroke=\"" + strokeId + "\" type=\"number\" value=\"" + stroke.width + "\" />" +
                        "<select class=\"stroke-linecap input short\" data-stroke=\"" + strokeId + "\" value=\"" + stroke.linecap + "\">" +
                        "<option value=\"butt\">butt</option>" +
                        "</select>" +
                        "<input class=\"stroke-color input short\" data-stroke=\"" + strokeId + "\" type=\"color\" value=\"" + stroke.color + "\" /> " +
                        strokeId +
                        "</div>";
                    strokeSelectHTML += "<option value=\"" + strokeId + "\">" + strokeId + "</option>"
                }
                $("#color-list").html(fillHTML);
                $("#line-list").html(strokeHTML);
                $("#edit-fill-sel").html(fillSelectHTML);
                $("#edit-stroke-sel").html(strokeSelectHTML);
                $(".fill-item").on("change", function () {
                    let fill = docu.document.fills[$(this).attr("data-fill")];
                    fill.background = $(this).val();
                    docu.render();
                });

                $(".delete-fill").click(function () {
                    deleteFill($(this).attr("data-fill"));
                    loadFillStrokeList();
                    docu.render();
                });

                $(".delete-stroke").click(function () {
                    deleteStroke($(this).attr("data-stroke"));
                    loadFillStrokeList();
                    docu.render();
                });

                $(".stroke-width").on("change", function () {
                    let stroke = docu.document.strokes[$(this).attr("data-stroke")];
                    stroke.width = $(this).val();
                    console.log(stroke.width);
                    docu.render();
                });

                $(".stroke-linecap").on("change", function () {
                    let stroke = docu.document.strokes[$(this).attr("data-stroke")];
                    stroke.linecap = $(this).val();
                    docu.render();
                });

                $(".stroke-color").on("change", function () {
                    let stroke = docu.document.strokes[$(this).attr("data-stroke")];
                    stroke.color = $(this).val();
                    docu.render();
                });
            }
        });
    }
})(VDAPI);
