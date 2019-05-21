const jsPDF = require("jspdf");


function C(baseDoc) {
    var doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [baseDoc.pageWidth, baseDoc.pageHeight]
    });

    for(let i in baseDoc.pages) {
        let page = baseDoc.pages[i];
        for(let elm of baseDoc.master[page.master].elements) {
            addElm(elm, i);
        }
        for(let elm of page.elements) {
            addElm(elm, i);
        }
        if(i != baseDoc.pages.length -1)
            doc.addPage([doc.pageWidth, doc.pageHeight], "portrait");
    }
    doc.save('test.pdf')

    function addElm(elm, nr) {
        switch(elm.type) {
            case E.type.text:
                let font = baseDoc.fonts[elm.font];
                doc.setFont(font.typeface,font.weight)
                doc.setFontSize(font.size * 1.3333);
                doc.text(elm.text.replace(/#/g, parseInt(nr) + 1), elm.pos.x, elm.pos.y + (font.size * 1.3333));
                break;
            case E.type.rect:
                fill = baseDoc.fills[elm.fill];
                stroke = baseDoc.strokes[elm.stroke];
                doc.setFillColor(fill.background);
                doc.setDrawColor(stroke.color);
                doc.setLineWidth(stroke.width);
                doc.setLineCap(stroke.linecap);
                doc.rect(elm.pos.x, elm.pos.y, elm.pos.width, elm.pos.height, "DF");
                break;
            case E.type.circle: 
                fill = baseDoc.fills[elm.fill];
                stroke = baseDoc.strokes[elm.stroke];
                doc.setFillColor(fill.background);
                doc.setDrawColor(stroke.color);
                doc.setLineWidth(stroke.width);
                doc.setLineCap(stroke.linecap);
                doc.ellipse(
                    elm.pos.x - (elm.pos.width / 2), elm.pos.y - (elm.pos.height / 2), 
                    elm.pos.width / 2, elm.pos.height / 2, 
                    "FD");
                break;
        }
    }

}