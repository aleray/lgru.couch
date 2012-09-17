module.exports = [
    {from: "/", to: "/_show/index/intro"},
    {from: "/static/*", to: "static/*"},

    {from: "/reviews/", to: "_list/reviews/reviews/", query: { "include_docs": "true" }},
    {from: "/reviews/*", to: "_show/reviews/*"},

    {from: "/publications/", to: "_list/publications/publications/"},
    {from: "/publications/*", to: "_show/publications/*"},

    {from: "/compilations/", to: "_list/compilations/compilations/"},
    {from: "/compilations/*", to: "_show/compilations/*"}
];