var testDoc = {
    "title" : "Document 1",
    "pageWidth" : 595,
    "pageHeight" : 842,
    "master" : [
        {
            "marginLeft" : 50,
            "marginTop" : 50,
            "marginRight" : 50,
            "marginBottom" : 50,
            "elements" : [
                {
                    "type" : E.type.text,
                    "pos" : E.position(50,802,70,30),
                    "text" : "#",
                    "font" : "paragraph"
                }
            ]
        }
    ],
    "fills" : {
        "default" : {
            "background" : "#111111"
        },
        "danger" : {
            "background" : "#ee0000"
        }
    },
    "strokes" : {
        "default" : {
            "color" : "#000000",
            "width" : 2,
            "style" : "solid",
            "linecap" : "butt"
        }
    },
    "fonts" : {
        "paragraph" : {
            "typeface" : "Helvetica",
            "size" : 12,
            "weight" : "normal"
        },
        "heading" : {
            "typeface" : "Helvetica",
            "size" : 24,
            "weight" : "bold"
        }
    },
    "pages" : [
        {
            "master" : 0,
            "elements" : [
                {
                    "type" : E.type.text,
                    "pos" : E.position(50,50,300,20),
                    "text" : "Hello World Page 1",
                    "font" : "paragraph"
                }
            ]
        },
        {
            "master" : 0,
            "elements" : [
                {
                    "type" : E.type.text,
                    "pos" : E.position(50,50,300,20),
                    "text" : "Hello World Page 2",
                    "font" : "paragraph"
                }
            ]
        },
        {
            "master" : 0,
            "elements" : [
                {
                    "type" : E.type.rect,
                    "pos" : E.position(50,50,300,40),
                    "fill" : "danger",
                    "stroke" : "default"
                },
                {
                    "type" : E.type.text,
                    "pos" : E.position(50,50,300,50),
                    "text" : "Hello World Page 3",
                    "font" : "heading"
                }/*,
                {
                    "type" : E.type.oval,
                    "pos" : E.position,
                    "stroke" : "default"
                }*/
            ]
        }
    ]
};