exports.validate_doc_update = function (newDoc, oldDoc, userCtx) {
    var now = new Date();
    newDoc.updated_at = JSON.stringify(now)
  //throw({forbidden : 'no way'});
};

exports.rewrites = require("./rewrites");
exports.views = require("./views");
exports.lists = require("./lists");
exports.shows = require("./shows");
