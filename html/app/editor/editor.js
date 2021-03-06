function E(elm, doc) {
    let self = this

    self.render = function(forceUndo) {
        forceUndo = (forceUndo == undefined ? true : forceUndo);
        if (forceUndo) {
            self.undoStack.push(clone(self.document));
        }
        self.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        self.svg.setAttribute("width", self.document.pageWidth + 100);
        self.svg.setAttribute("height", ((self.document.pageHeight + 50) * self.document.pages.length) + 50);
        self.svg.style.width = ((self.document.pageWidth + 100) * self.zoom) + "px";
        self.svg.style.height = (((self.document.pageHeight + 50) * self.document.pages.length) + 50) + "px";
        let pageOffset = 50;
        let pageNr = 0;

        for (let page of self.document.pages) {
            self.svg.appendChild(self.createPageSVG(pageOffset));
            for (let masterElm of self.document.master[page.master].elements) {
                self.svg.appendChild(self.createElement(pageOffset, masterElm, pageNr))
            }
            for (let elm of page.elements) {
                self.svg.appendChild(self.createElement(pageOffset, elm, pageNr))
            }
            pageOffset += self.document.pageHeight + 50;
            pageNr++;
        }
        while (self.domelement.firstChild) {
            self.domelement.removeChild(self.domelement.firstChild);
        }
        self.domelement.appendChild(self.svg);
    };

    self.createPageSVG = function(pageOffset) {
        let pageBackground = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        pageBackground.setAttribute("x", 50);
        pageBackground.setAttribute("y", pageOffset);
        pageBackground.setAttribute("width", self.document.pageWidth);
        pageBackground.setAttribute("height", self.document.pageHeight);
        pageBackground.setAttribute("fill", "#ffffff");
        return pageBackground;
    };

    self.createElement = function(pageOffset, elmData, pageNr) {
        let elm;
        switch (elmData.type) {
            case E.type.text:
                elm = self.createTextElement(pageOffset, elmData, pageNr);
                break;
            case E.type.rect:
                elm = self.createRectElement(pageOffset, elmData);
                break;
            case E.type.line:
                elm = self.createLineElement(pageOffset, elmData);
                break;
            case E.type.circle:
                elm = self.createCircleElement(pageOffset, elmData);
                break;
            default:
                throw new Error("Not implemented");
        }
        elm.addEventListener("click", function() {
            self.select(elmData, pageOffset);
        });
        return elm;

    };

    self.returnDocument = () => self.document;

    self.createTextElement = function(pageOffset, elm, pageNr) {
        let textElm = document.createElementNS("http://www.w3.org/2000/svg", "text");
        let font = elm.font == "default" ? self.document.fonts[0] : self.document.fonts[elm.font];
        let fill = self.document.fills[elm.fill];
        textElm.setAttribute("x", elm.pos.x + 50);
        textElm.setAttribute("y", elm.pos.y + pageOffset + (font.size * 1.333));
        textElm.setAttribute("width", elm.pos.width);
        textElm.setAttribute("height", elm.pos.height);
        textElm.style.fontFamily = font.typeface;
        textElm.style.fontSize = font.size + "pt";
        textElm.style.fontWeight = font.weight;
        textElm.style.fontStyle = font.type;
        textElm.style.fill = fill.background;
        textElm.innerHTML = elm.text.replace(/#/g, (pageNr + 1));
        return textElm;
    };

    self.createRectElement = function(pageOffset, elm) {
        let rectElm = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        let fill = self.document.fills[elm.fill];
        rectElm.setAttribute("x", elm.pos.x + 50);
        rectElm.setAttribute("y", elm.pos.y + pageOffset);
        rectElm.setAttribute("width", elm.pos.width);
        rectElm.setAttribute("height", elm.pos.height);
        rectElm.style.fill = fill.background;

        if (elm.stroke != undefined || elm.stroke != "none") {
            let stroke = self.document.strokes[elm.stroke];
            rectElm.style.stroke = stroke.color;
            rectElm.style.strokeWidth = stroke.width + "px";
        }

        return rectElm;
    };

    self.createLineElement = function(pageOffset, elm) {
        let lineElm = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineElm.setAttribute("x1", elm.pos.x + 50);
        lineElm.setAttribute("y1", elm.pos.y + pageOffset);
        lineElm.setAttribute("x2", elm.pos.width + elm.pos.x + 50);
        lineElm.setAttribute("y2", elm.pos.height + elm.pos.y + pageOffset);
        
        if (elm.stroke != undefined || elm.stroke != "none") {
            let stroke = self.document.strokes[elm.stroke];
            lineElm.style.stroke = stroke.color;
            lineElm.style.strokeWidth = stroke.width + "px";
        }

        return lineElm;
    };

    self.createCircleElement = function(pageOffset, elm) {
        let circleElm = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        let fill = self.document.fills[elm.fill];
        circleElm.setAttribute("cx", elm.pos.x + (elm.pos.width / 2) + 50);
        circleElm.setAttribute("cy", elm.pos.y + (elm.pos.height / 2) + pageOffset);
        circleElm.setAttribute("rx", elm.pos.width / 2);
        circleElm.setAttribute("ry", elm.pos.height / 2);
        circleElm.style.fill = fill.background;

        if (elm.stroke != undefined || elm.stroke != "none") {
            let stroke = self.document.strokes[elm.stroke];
            circleElm.style.stroke = stroke.color;
            circleElm.style.strokeWidth = stroke.width + "px";
        }

        return circleElm;
    };

    self.select = function(elm, pageOffset) {
        self.selectElm = elm;
        self.triggerSelectionEvent(elm)
        for (let selector of self.domelement.getElementsByClassName("selector")) {
            self.svg.removeChild(selector);
        }
        let selectElmRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        selectElmRect.classList.add("selector");
        selectElmRect.setAttribute("x", elm.pos.x + 50);
        selectElmRect.setAttribute("y", elm.pos.y + pageOffset);
        selectElmRect.setAttribute("width", elm.pos.width);
        selectElmRect.setAttribute("height", elm.pos.height);
        selectElmRect.style.fill = "rgba(127,127,255,0.5)";
        selectElmRect.style.stroke = "#88f";
        selectElmRect.style.strokeWidth = "2px";

        for(let page in self.document.pages) {
            if(self.document.pages[page].elements.indexOf(elm) != -1) {
                self.triggerPageScrollEvent(parseInt(page));
            }
        }

        selectElmRect.addEventListener("mousedown", function(event) {
            elm.move = true;
        });

        selectElmRect.addEventListener("mouseup", function(event) {
            elm.move = false;
            elm.pos.x = event.offsetX - 50 - (elm.pos.width / 2);
            elm.pos.y = event.offsetY - pageOffset - (elm.pos.height / 2);
            self.render();
            self.select(elm, pageOffset);
        })

        selectElmRect.addEventListener("mousemove", function(event) {
            if (elm.move) {
                selectElmRect.setAttribute("x", event.offsetX - (elm.pos.width / 2));
                selectElmRect.setAttribute("y", event.offsetY - (elm.pos.height / 2));
            }

        });

        self.svg.appendChild(selectElmRect);
    };

    self.selectElmMoveDown = function() {
        let currentIndex = self.selectedPage.elements.indexOf(self.selectElm);
        console.log(currentIndex, self.selectedPage.elements, self.selectElm);
        if(currentIndex > 0) {
            self.selectedPage.elements[currentIndex] = self.selectedPage.elements[currentIndex - 1];
            self.selectedPage.elements[currentIndex - 1] = self.selectElm;
        }
        self.render();
    };

    self.selectElmMoveUp = function() {
        let currentIndex = self.selectedPage.elements.indexOf(self.selectElm);
        console.log(currentIndex, self.selectedPage.elements, self.selectElm);
        if(currentIndex < self.selectedPage.elements.length -1) {
            self.selectedPage.elements[currentIndex] = self.selectedPage.elements[currentIndex + 1];
            self.selectedPage.elements[currentIndex + 1] = self.selectElm;
        }
        self.render();
    };

    self.undo = function() {
        if (self.undoStack.length > 1) {
            self.undoStack.pop();
            self.document = self.undoStack.pop();

            self.render(false);
        }
    };

    self.addSelectionEvent = function(func) {
        self.selectedEvents.push(func);
    };

    self.addUnselectEvent = function(func) {
        self.unselectEvents.push(func);
    };

    self.addPageScrollEvent = function(func) {
        self.pageScrollEvents.push(func);
    };

    self.triggerSelectionEvent = function(elm) {
        for (let func of self.selectedEvents) {
            func(elm);
        }
    };

    self.addElement = function(type) {
        if(type == E.type.text) {
            self.selectedPage.elements.push({
                "type" : E.type.text,
                "pos" : E.position(
                    self.document.pageWidth / 2,
                    self.document.pageHeight / 2,
                    100,
                    20),
                "font" : "paragraph",
                "fill" : "default",
                "text" : "insert text"
            });
        }
        else if(type == E.type.rect) {
            self.selectedPage.elements.push({
                "type" : E.type.rect,
                "pos" : E.position(
                    self.document.pageWidth / 2,
                    self.document.pageHeight / 2,
                    100,
                    100
                ),
                "fill" : "default",
                "stroke" : "default"
            });
        }
        else if(type == E.type.circle) {
            self.selectedPage.elements.push({
                "type" : E.type.circle,
                "pos" : E.position(
                    self.document.pageWidth / 2,
                    self.document.pageHeight / 2,
                    100,
                    100
                ),
                "fill" : "default",
                "stroke" : "default"
            });
        }
        else if(type == E.type.line) {
            self.selectedPage.elements.push({
                "type" : E.type.line,
                "pos" : E.position(
                    self.document.pageWidth / 2,
                    self.document.pageHeight / 2,
                    100,
                    100
                ),
                "stroke" : "default"
            });
        }
    };

    self.triggerUnselectEvent = function() {
        for (let func of self.unselectEvents) {
            func();
        }
    };

    self.triggerPageScrollEvent = function(nr) {
        for (let func of self.pageScrollEvents) {
            func(nr, self.document.pages.length);
        }
        self.selectedPage = self.document.pages[nr];
    };

    self.deleteSelected = function() {
        for(let page of self.document.pages) {
            for(let element in page.elements) {
                if(page.elements[element] == self.selectElm) {
                    page.elements.splice(element,1);
                }
            }
        }
    }

    self.zoom = 1;
    self.undoStack = [];
    self.document = doc;
    self.domelement = elm;
    self.selectedEvents = [];
    self.unselectEvents = [];
    self.pageScrollEvents = [];
    self.render();
    self.triggerPageScrollEvent(0);

    self.domelement.addEventListener("click", function(event) {
        if (event.target == self.domelement || event.target == self.svg) {
            for (let selector of self.domelement.getElementsByClassName("selector")) {
                self.svg.removeChild(selector);
            }
            self.triggerUnselectEvent();
        }
    });

    self.domelement.addEventListener("scroll", function(event) {
        self.triggerPageScrollEvent(Math.floor(self.domelement.scrollTop / (self.document.pageHeight + 50)));
    });
}

E.position = function(x, y, width, height) {
    return {
        x,
        y,
        width,
        height
    }
}

E.type = {
    "text": 0,
    "rect": 1,
    "poly": 2,
    "line": 3,
    "oval": 4
};

// https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
