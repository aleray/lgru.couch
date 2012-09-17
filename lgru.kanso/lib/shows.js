var showdown = require('showdown'),
    Handlebars = require('handlebars'),
    _ = require('underscore');




function index (doc, req) {
    var sd = new showdown.converter();

    provides("html", function() {
        send(Handlebars.templates['base.html']({
            content: sd.makeHtml(doc.body)
        }));
    });
}


function add (doc, req) {
    provides("html", function() {
        send("here comes the form to add publications");
    });
}


function reviews (doc, req) {
    provides("html", function() {
        send("here comes the review");
    });
}


function publications (doc, req) {
    var sd = new showdown.converter(),
        body;

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
}


function bibtex (doc, req) {
    var ctx = _.extend({"type": doc.bibtex_type}, doc.bibtex);

    registerType("bibtex", "application/x-bibtex", "application/x-bibtex");

    provides("bibtex", function() {
        send(Handlebars.templates['publication.bib'](ctx));
    });
}


module.exports = {
    index        : index,
    add          : add,
    reviews      : reviews,
    publications : publications,
    bibtex       : bibtex
};
