/// <reference path="../../typings/node/node.d.ts" />
import crypto = require('crypto');
import orm = require('./orm');
import path = require('./path');

export class Token {
    private encode:string;
    
    constructor(encode?:string) {
        if (!encode) {
            encode = 'md5';
        }
        
        this.encode = encode;
    }
    
    create(data:string) {
        let obj = crypto.createHash(this.encode);
        return obj.update(data).digest('hex');
    }
}

export class User {
    private file:orm.File;
    private path:string;
    private token:Token;
    private users:{[key:string]:any};
    
    constructor() {
        this.path = path.get('origin') + 'user/';
        this.file = new orm.File(this.path);
        this.token = new Token();
        this.users = {};
    }
    
    get(token:string) {
        if (!this.users[token]) {
            try {
                this.users[token] = this.file.get(token);
            } catch (e) {
                throw 'user not exists'
            }
        }
        
        return this.users[token];
    }
    
    create(name:string, data:{[key:string]:any}) {
        let time = new Date().getTime()/1000 | 0;
        let token = this.token.create(name+'-'+time);
        if (data['name']) {
            try {
                this.file.set(token, data);
                data["token"] = token;
                this.users[token] = data;
            } catch (e) {
                throw e;
            }
            
            return token;
        }
        
        throw 'user data error';
    }
}
