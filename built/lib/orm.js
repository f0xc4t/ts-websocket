/// <reference path="../../typings/node/node.d.ts" />
'use strict';
const fs = require('fs');
class File {
    constructor(path) {
        try {
            let stat = fs.lstatSync(path);
            if (stat && stat.isDirectory()) {
                this.path = path;
            }
            else {
                throw 'orm (File) error';
            }
        }
        catch (e) {
            throw e;
        }
    }
    get(token) {
        let filename = this.path + token + ".json";
        try {
            fs.accessSync(filename, fs.R_OK);
            return JSON.parse(fs.readFileSync(filename, "utf8"));
        }
        catch (e) {
            throw e;
        }
    }
    set(token, data) {
        let filename = this.path + token + ".json";
        let tmp = JSON.stringify(data);
        try {
            if (!fs.existsSync(filename)) {
                fs.closeSync(fs.openSync(filename, 'w'));
            }
            fs.accessSync(filename, fs.W_OK);
            fs.writeFileSync(filename, tmp, 'utf8');
        }
        catch (e) {
            throw e;
        }
    }
}
exports.File = File;
