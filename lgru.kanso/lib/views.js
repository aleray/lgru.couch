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
                emit([doc._id, 'review'], doc);
                for (var i in doc.about) {
                    emit([doc._id, 'about'], {"_id": doc.about[i]})
                }
            };
        }
    },
    compilations: {
        map: function (doc) {
            if (doc.type === "compilation") {
                emit([doc._id, 'compilation'], null);
                for (var i in doc.documents) {
                    emit([doc._id, 'document'], {"_id": doc.documents[i]})
                }
            };
        }
    }
};
