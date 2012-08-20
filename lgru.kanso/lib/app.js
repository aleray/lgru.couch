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
        var _ = require('underscore')._,
            Handlebars = require('handlebars');

        Handlebars.registerHelper('join', function(items) {
            return items.join(', ');
        });

        provides("html", function() {
            var rows = [];

            while (row = getRow()) {
                rows.push(row.value);
            }

            var byYear = _.groupBy(rows, function (row) { return row.bibtex.year });

            _.each(byYear, function(publications, year) { 
                send('<h1>' + year + '</h1>');
                _.each(publications, function(publication) { 
                    var bib = publication.bibtex;
                    send(Handlebars.templates['partials/publication-row.html'](publication));
                });
            });
        });
    },
};

exports.shows = {
    index: function(doc, req) {
        var showdown = require('showdown'),
            sd = new showdown.converter();

        provides("html", function() {
            send(sd.makeHtml(doc.body));
        });
    },
    add: function(doc, req) {
        provides("html", function() {
            send("here comes the form to add publications");
        });
    },
    reviews: function(doc, req) {
        provides("html", function() {
            send("here comes the form the review");
        });
    },
    publications: function(doc, req) {
        var showdown = require('showdown'),
            sd = new showdown.converter(),
            Handlebars = require('handlebars');

        provides("html", function() {
            send(Handlebars.templates['base.html']({
                content: sd.makeHtml(doc.body)
            }));
        });
    },
    bibtex: function(doc, req) {
        var _ = require('underscore')._,
            Handlebars = require('handlebars');

        var ctx = {"type": doc.bibtex_type};
        ctx = _.extend(ctx, doc.bibtex);

        return {
           "headers" : {"Content-Type" : "text/plain"},
           "body" : Handlebars.templates['publication.bib'](ctx)
        }
    }
};
