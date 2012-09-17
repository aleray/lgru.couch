module.exports = {
    publications: {
        map: function (doc) {
            if (doc.type === "publication") {
                var bib = doc.bibtex;
                emit([bib.year, bib.authors], doc);
            };
        }
    },
    reviews: {
        map: function (doc) {
            if (doc.type === "review") {
                emit(doc.authors, doc);
                for (var i in doc.about) {
                    emit('review', {"_id": doc.about[i]})
                }
            };
        }
    },
    compilations: {
        map: function (doc) {
            if (doc.type === "compilation") {
                emit(doc.title, doc);
            };
        }
    }
};