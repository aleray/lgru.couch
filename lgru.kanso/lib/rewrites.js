module.exports = [
    {from: "/", to: "/_show/index/intro"},
    {from: "/static/*", to: "static/*"},

    {from: "/reviews/", to: "_list/review_list/reviews/", query: {"include_docs": "true"}},
    {from: "/reviews/:id", to: "_list/review_detail/reviews/", query: {"include_docs": "true", "startkey": [":id"], "endkey": [":id", {}]}},

    {from: "/publications/", to: "_list/publication_list/publications/"},
    {from: "/publications/*", to: "_show/publications/*"},

    {from: "/compilations/", to: "_list/compilation_list/compilations/", query: {"include_docs": "true"}},
    {from: "/compilations/*", to: "_show/compilations/*"},
];
