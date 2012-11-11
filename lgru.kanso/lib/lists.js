var _          = require('underscore'),
    _s         = require('underscore-string'),
    showdown   = require('showdown'),
    Handlebars = require('handlebars');


Handlebars.registerHelper('join', function(items) {
    if (_.isString(items)) {
        return items;   
    } else if (_.isArray(items)) {
        return _s.toSentence(items);
    } else {
        return typeof(items);
    };
});

Handlebars.registerHelper('list', function(items, options) {
  var out = "<ul>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li><a href='/publications/" + items[i] + "'>" + items[i] + "</a></li>";
  }

  return out + "</ul>";
});


function publication_list (head, req) {
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
                output.push(Handlebars.templates['partials/publication-row.html'](publication));
            });
        });

        send(Handlebars.templates['base.html']({
            content: output.join("\n")
        }));
    });
}


function review_list (head, req) {
    provides("html", function() {
        var output = [],
            current = {};

        while (row = getRow()) {
            if (current['id'] && row.key[0] !== current['id']) {
                output.push(Handlebars.templates['partials/review-row.html'](current));
                current = {};
            };

            if (row.key[1] === 'about') {
                current.about = current.about ? current.about : [];
                //current['about'].push('<a href="/publications/' + row.doc._id + '">' + row.doc.bibtex.title + '</a>');
                current['about'].push(Handlebars.templates['partials/publication-row.html'](row.doc));
            } else {
                current['id'] = row.id;
                current['authors'] = row.doc.authors;
            };
        }
        output.push(Handlebars.templates['partials/review-row.html'](current));

        send(Handlebars.templates['base.html']({
            content: output.join("\n")
        }));
    });
}

function review_detail (head, req) {
    var sd = new showdown.converter();

    provides("html", function() {
        var output = [],
            current = {};

        while (row = getRow()) {
            if (row.key[1] === 'about') {
                current.documents = current.documents ? current.documents : [];
                current.documents.push(Handlebars.templates['partials/publication-row.html'](row.doc));
            } else {
                current.doc = row.doc;
                current.doc.body = sd.makeHtml(current.doc.body);
            };
        }

        current.documents = current.documents.join("\n");

        send(Handlebars.templates['base.html']({
            content: Handlebars.templates['partials/review-detail.html'](current)
        }));
    });
}


//function compilation_list (head, req) {
    //provides("html", function() {
        //var output = [];

        //while (row = getRow()) {
            //output.push(Handlebars.templates['partials/compilation-row.html'](row.value));
        //}

        //send(Handlebars.templates['base.html']({
            //content: output.join("\n")
        //}));
    //});
//}
function compilation_list (head, req) {
    provides("html", function() {
        var output = [],
            current = {};

        while (row = getRow()) {
            // Is the row related to a new compilation?
            if (current['id'] && row.key[0] !== current['id']) {
                // yes, pushes the row
                log(current);
                output.push(Handlebars.templates['partials/compilation-row.html'](current));
                current = {};
            };

            if (row.key[1] == "document") {
                current.documents = current.documents ? current.documents : [];
                ////current['about'].push('<a href="/publications/' + row.doc._id + '">' + row.doc.bibtex.title + '</a>');
                if (row.doc) {
                    current.documents.push(Handlebars.templates['partials/publication-row.html'](row.doc));
                };
            } else {
                current['id'] = row.id;
                //current['authors'] = row.doc.authors;
                current['title'] = row.doc.title;
                current['description'] = row.doc.description;
            };
        }
        output.push(Handlebars.templates['partials/compilation-row.html'](current));

        send(Handlebars.templates['base.html']({
            content: output.join("\n")
        }));
    });
}


module.exports = {
    publication_list : publication_list,
    review_list      : review_list,
    review_detail    : review_detail,
    compilation_list : compilation_list 
};
