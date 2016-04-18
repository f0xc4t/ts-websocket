/// <reference path="../../typings/node/node.d.ts" />
"use strict";

import fs = require('fs');
var obj:Config;

const CODE_CONFIG_NOT_EXIST = 404;
const CODE_INPUT_FORMAT_ERROR = 405;
const CODE_CONFIG_DIRPATH_ERROR = 406;

class Config {
    private dirpath:string;
    private configs:{[key:string]:Container};
    
    constructor(dirpath:string) {
        try {
            let stat = fs.lstatSync(dirpath);
            if (!stat || !stat.isDirectory()) {
                throw new ConfigException(
                    dirpath + " not exists",
                    CODE_CONFIG_DIRPATH_ERROR
                );
            }
        } catch (e) {
            throw new ConfigException(
                dirpath + " not exists",
                CODE_CONFIG_DIRPATH_ERROR
            );
        }
        
        
        this.dirpath = dirpath;
        this.configs = {};
    }
    
    load(name:string, rewrite?:boolean) {
        let tmp = name.split('.');
        
        if (tmp.length != 2) {
            throw new ConfigException(
                'input the format of "' + name + '" error',
                CODE_INPUT_FORMAT_ERROR
            );    
        }
        
        if (!this.configs[name] || rewrite === true) {
            let path = this.dirpath + name;
            this.configs[tmp[0]] = new Container(path);   
        }
        
    }
    
    get(name:string, defaults?:any) {
        if (!defaults) {
            defaults = [];
        }
        
        return (this.configs[name]) ? this.configs[name].config : defaults;
    }
}

class Container {
    private cfg:{[key:string]:string};
    
    constructor(filename:string) {
        try {
            fs.accessSync(filename, fs.R_OK);
            this.cfg = JSON.parse(fs.readFileSync(filename, "utf8"));
        } catch (e) {
            throw new ConfigException(
                '"' + filename + '" not exists',
                CODE_CONFIG_NOT_EXIST
            );
        }
    }
    
    get config() {
        return this.cfg;
    }
}

class ConfigException {
    
    private message:string;
    private code:number;
    
    constructor(message?:string, code?:number) {
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

export function getConfig(dirpath?:string) {
    if (!obj && dirpath) {
        obj = new Config(dirpath);
    }
    
    return obj;
}
