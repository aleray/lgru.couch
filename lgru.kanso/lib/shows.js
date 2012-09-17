module.exports = {
    index: function(doc, req) {
        var showdown = require('showdown'),
            sd = new showdown.converter(),
            Handlebars = require('handlebars');

        provides("html", function() {
            send(Handlebars.templates['base.html']({
                content: sd.makeHtml(doc.body)
            }));
        });
    },
    add: function(doc, req) {
        provides("html", function() {
            send("here comes the form to add publications");
        });
    },
    reviews: function(doc, req) {
        provides("html", function() {
            send("here comes the review");
        });
    },
    publications: function(doc, req) {
        var showdown = require('showdown'),
            sd = new showdown.converter(),
            Handlebars = require('handlebars'),
            _ = require('underscore'),
            body;

        //require('handlebars-helpers');

        body = doc.body ? doc.body : "This text isn't available yet";

        if (doc._attachments) {
            var keys = _.keys(doc._attachments);

            for (var k in keys) {
                body += '<a href="/publications/' + doc._id + '/' + keys[k] + '">' + keys[k] + '</a>'; 
            }
        };

        provides("html", function() {
            send(Handlebars.templates['base.html']({
                content: sd.makeHtml(body)
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
