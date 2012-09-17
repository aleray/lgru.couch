module.exports = {
    publications: function(head, req) {
        var _ = require('underscore'),
            _s = require('underscore-string'),
            Handlebars = require('handlebars');

        Handlebars.registerHelper('join', function(items) {
            if (typeof(items) === "string") {
                return items;   
            } else {
                return _s.toSentence(items)
            };
        });

        provides("html", function() {
            var rows = [],
                byYear,
                output = [];

            while (row = getRow()) {
                rows.push(row.value);
            }

            byYear = _.groupBy(rows, function (row) { return row.bibtex.year });

            _.each(byYear, function(publications, year) { 
                output.push('<h1 class="key">' + year + '</h1>');
                _.each(publications, function(publication) { 
                    var bib = publication.bibtex;
                    output.push(Handlebars.templates['partials/publication-row.html'](publication));
                });
            });

            send(Handlebars.templates['base.html']({
                content: output.join("\n")
            }));
        });
    },
    reviews: function(head, req) {
        var _ = require('underscore'),
            _s = require('underscore-string'),
            Handlebars = require('handlebars');

        Handlebars.registerHelper('join', function(items) {
            if (typeof(items) === "string") {
                return items;   
            } else {
                return _s.toSentence(items)
            };
        });

        Handlebars.registerHelper('list', function(items, options) {
          var out = "<ul>";

          for(var i=0, l=items.length; i<l; i++) {
            out = out + "<li>" + items[i] + "</li>";
          }

          return out + "</ul>";
        });

        provides("html", function() {
            var output = [];

            while (row = getRow()) {
                if (row.key === 'review') {
                    output.push(row.doc.bibtex.url);
                } else {
                    output.push(Handlebars.templates['partials/review-row.html'](row.value));
                };
            }

            send(Handlebars.templates['base.html']({
                content: output.join("\n")
            }));
        });
    },
    compilations: function(head, req) {
        var _ = require('underscore'),
            _s = require('underscore-string'),
            Handlebars = require('handlebars');

        Handlebars.registerHelper('list', function(items, options) {
          var out = "<ul>";

          for(var i=0, l=items.length; i<l; i++) {
            out = out + "<li>" + items[i] + "</li>";
          }

          return out + "</ul>";
        });

        provides("html", function() {
            var output = [];

            while (row = getRow()) {
                output.push(Handlebars.templates['partials/compilation-row.html'](row.value));
            }

            send(Handlebars.templates['base.html']({
                content: output.join("\n")
            }));
        });
    },
};

