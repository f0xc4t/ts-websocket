/// <reference path="../../typings/node/node.d.ts" />
"use strict";
const fs = require('fs');
var obj;
const CODE_CONFIG_NOT_EXIST = 404;
const CODE_INPUT_FORMAT_ERROR = 405;
const CODE_CONFIG_DIRPATH_ERROR = 406;
class Config {
    constructor(dirpath) {
        try {
            let stat = fs.lstatSync(dirpath);
            if (!stat || !stat.isDirectory()) {
                throw new ConfigException(dirpath + " not exists", CODE_CONFIG_DIRPATH_ERROR);
            }
        }
        catch (e) {
            throw new ConfigException(dirpath + " not exists", CODE_CONFIG_DIRPATH_ERROR);
        }
        this.dirpath = dirpath;
        this.configs = {};
    }
    load(name, rewrite) {
        let tmp = name.split('.');
        if (tmp.length != 2) {
            throw new ConfigException('input the format of "' + name + '" error', CODE_INPUT_FORMAT_ERROR);
        }
        if (!this.configs[name] || rewrite === true) {
            let path = this.dirpath + name;
            this.configs[tmp[0]] = new Container(path);
        }
    }
    get(name, defaults) {
        if (!defaults) {
            defaults = [];
        }
        return (this.configs[name]) ? this.configs[name].config : defaults;
    }
}
class Container {
    constructor(filename) {
        try {
            fs.accessSync(filename, fs.R_OK);
            this.cfg = JSON.parse(fs.readFileSync(filename, "utf8"));
        }
        catch (e) {
            throw new ConfigException('"' + filename + '" not exists', CODE_CONFIG_NOT_EXIST);
        }
    }
    get config() {
        return this.cfg;
    }
}
class ConfigException {
    constructor(message, code) {
        if (message) {
            this.message = message;
        }
        if (code) {
            this.code = code;
        }
    }
    getMessage() {
        return this.message;
    }
    getCode() {
        return this.code;
    }
    getExceptionName() {
        return 'ConfigException';
    }
}
function getConfig(dirpath) {
    if (!obj && dirpath) {
        obj = new Config(dirpath);
    }
    return obj;
}
exports.getConfig = getConfig;
