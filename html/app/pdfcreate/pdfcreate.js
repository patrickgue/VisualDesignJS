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
                doc.setFontSize(font.size);
                doc.text(elm.text.replace(/#/g, parseInt(nr) + 1), elm.pos.x, elm.pos.y + font.size);
                break;
            case E.type.rect:
                let fill = baseDoc.fills[elm.fill];
                let stroke = baseDoc.strokes[elm.stroke];
                doc.setFillColor(fill.background);
                doc.setDrawColor(stroke.color);
                doc.setLineWidth(stroke.width);
                doc.setLineCap(stroke.linecap);
                doc.rect(elm.pos.x, elm.pos.y, elm.pos.width, elm.pos.height, "DF");
                break;
        }
    }

}