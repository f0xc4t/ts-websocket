/// <reference path="../../typings/node/node.d.ts" />
"use strict";
class Mux {
    constructor() {
        this.cb = {};
    }
    register(key, callback) {
        if (typeof callback === 'function') {
            this.cb[key] = callback;
        }
        return this;
    }
    do(key, data, view) {
        if (key in this.cb) {
            return this.cb[key].call(this, data, view);
        }
    }
}
exports.Mux = Mux;
