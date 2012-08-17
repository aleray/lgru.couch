exports.views = {
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
                emit(doc, null);
            };
        }
    }
};

exports.lists = {
    publications: function(head, req) {
        var _ = require('underscore')._;
        log(_);

        provides("html", function() {
            //var rows = [];

            //while (row = getRow()) {
                //rows.push(row.value);
            //}

            //var byYear = _.groupBy(rows.map(function(r) {return r.value;}), 'year');
            return 'ok';
        });
    },
};
