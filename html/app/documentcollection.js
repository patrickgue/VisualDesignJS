function DocumentCollection() {
    let self = this;

    self.documents = [];

    self.createDocument = function (title) {
        self.documents.push({
            "title" : title,
            "document": {
                "title": title,
                "pageWidth": 595,
                "pageHeight": 842,
                "master": [
                    {
                        "marginLeft": 50,
                        "marginTop": 50,
                        "marginRight": 50,
                        "marginBottom": 50,
                        "elements": []
                    }
                ],
                "fills": {
                    "default": {
                        "background": "#111111"
                    }
                },
                "strokes": {
                    "none" : {
                        "color" : "#000000",
                        "width" : 0,
                        "style" : "solid",
                        "linecap" : "butt"
                    },
                    "default": {
                        "color": "#000000",
                        "width": 2,
                        "style": "solid",
                        "linecap": "butt"
                    }
                },
                "fonts": {
                    "paragraph": {
                        "typeface": "Helvetica",
                        "size": 12,
                        "weight": "normal",
                        "type": "normal",
                        "fill" : "default"
                    }
                },
                "pages": [
                    {
                        "master": 0,
                        "elements": [
                            {
                                "type": E.type.text,
                                "pos": E.position(50, 50, 300, 20),
                                "text": "Hello World Page 1",
                                "font": "paragraph",
                                "fill" : "default",
                                "stroke" : "none"
                            }
                        ]
                    }
                ]
            }
        });
        self.selectDocument(title);
    };

    self.selectDocument = function (title) {
        for(let document of self.documents) {
            if(document.title === title) {
                self.selected = document.document;
            }
        }
    };

    self.getDocumentTitles = function() {
        let titles = [];
        for(let document of self.documents) {
            titles.push(document.title);
        }
        return titles;
    };

    self.size = function () {
        return self.documents.length;
    };

    self.getSelectedDocument = function() {
        return self.selected;
    }
} 