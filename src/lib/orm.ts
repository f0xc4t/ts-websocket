/// <reference path="../../typings/node/node.d.ts" />

'use strict';
import fs = require('fs');

export class File {
    private path:string;
    
    constructor(path:string) {
        try {
            let stat = fs.lstatSync(path);
            if (stat && stat.isDirectory()) {
                this.path = path;
            } else {
                throw 'orm (File) error';
            }
        } catch (e) {
            throw e;
        }
    }
    
    get(token:string) {
        let filename = this.path + token + ".json";
        
        try {
            fs.accessSync(filename, fs.R_OK);
            return JSON.parse(fs.readFileSync(filename, "utf8"));
        } catch (e) {
            throw e;
        }
    }
    
    set(token:string, data) {
        let filename = this.path + token + ".json";
        let tmp = JSON.stringify(data);
        
        try {
            if (!fs.existsSync(filename)) {
                fs.closeSync(fs.openSync(filename, 'w'));
            }
            
            fs.accessSync(filename, fs.W_OK);
            fs.writeFileSync(filename, tmp, 'utf8');
        } catch (e) {
            throw e;
        }
    }
}
