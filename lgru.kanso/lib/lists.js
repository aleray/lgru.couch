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

Handlebars.registerHelper("key_value", function(obj, fn) {
    var buffer = "",
        key;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            buffer += fn({key: key, value: obj[key]});
        }
    }

    return buffer;
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


function compilation_list (head, req) {
    log(req);
    provides("html", function() {
        var compilations = {},
            output = [];

        while (row = getRow()) { 
            var type = row["key"][1],
                id = row["key"][0];

            if (type == "compilation") {
                compilations[id] = _.pick(row.doc, "title", "description");
                compilations[id].documents = [];
            } else {
                compilations[id].documents.push(row.doc);
            };
        };

        output.push(Handlebars.templates['partials/compilation-list.html']({"compilations": compilations}));


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
