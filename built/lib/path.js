'use strict';
var path;
path = {};
function set(key, p, rewrite) {
    if (!path[key] || rewrite === true) {
        path[key] = p;
    }
}
exports.set = set;
function get(key) {
    return (path[key]) ? path[key] : null;
}
exports.get = get;
